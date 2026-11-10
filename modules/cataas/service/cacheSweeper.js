import fsp from 'node:fs/promises'
import path from 'node:path'
import * as Sentry from '@sentry/node'

import { cacheRoot } from './operations.js'

const DAY = 86400 * 1000
const TMP_MAX_AGE = 3600 * 1000

const safeRm = (file) => fsp.rm(file, { force: true })

/**
 * Nettoie le cache des rendus (`<root>/<catId>/<clé>`), sans bloquer l'event loop :
 * 1. supprime les rendus plus vieux que `ttlDays` (et les `.tmp` abandonnés),
 * 2. si le total dépasse `maxBytes`, supprime les plus anciens jusqu'à 90 % du plafond,
 * 3. supprime les dossiers vides et les anciens fichiers plats `id-*`.
 */
export const sweepCache = async ({ ttlDays, maxBytes, root = cacheRoot, now = Date.now() }) => {
  let dir
  try {
    dir = await fsp.opendir(root)
  } catch (e) {
    if (e.code === 'ENOENT') return { removed: 0, kept: 0 }
    throw e
  }

  const files = []
  const dirs = []
  let removed = 0

  for await (const entry of dir) {
    const full = path.join(root, entry.name)

    if (entry.isDirectory()) {
      dirs.push(full)
    } else if (entry.name.startsWith('id-')) {
      // Ancien format de cache (fichiers plats)
      await safeRm(full)
      removed++
    }
  }

  for (const catDir of dirs) {
    for await (const entry of await fsp.opendir(catDir)) {
      const file = path.join(catDir, entry.name)
      let stat
      try {
        stat = await fsp.stat(file)
      } catch (e) {
        if (e.code === 'ENOENT') continue
        throw e
      }

      const age = now - stat.mtimeMs
      const expired = entry.name.endsWith('.tmp') ? age > TMP_MAX_AGE : age > ttlDays * DAY

      if (expired) {
        await safeRm(file)
        removed++
      } else if (!entry.name.endsWith('.tmp')) {
        files.push({ file, size: stat.size, mtime: stat.mtimeMs })
      }
    }
  }

  let total = files.reduce((sum, f) => sum + f.size, 0)

  if (total > maxBytes) {
    files.sort((a, b) => a.mtime - b.mtime)

    while (total > maxBytes * 0.9 && files.length) {
      const oldest = files.shift()
      await safeRm(oldest.file)
      total -= oldest.size
      removed++
    }
  }

  for (const catDir of dirs) {
    try {
      await fsp.rmdir(catDir)
    } catch (e) {
      if (e.code !== 'ENOTEMPTY' && e.code !== 'ENOENT') throw e
    }
  }

  return { removed, kept: files.length }
}

export const startCacheSweeper = () => {
  const ttlDays = Number(process.env.CACHE_TTL_DAYS ?? 30)
  const maxBytes = Number(process.env.CACHE_MAX_MB ?? 2048) * 1024 * 1024
  const intervalMs = Number(process.env.CACHE_SWEEP_MINUTES ?? 360) * 60 * 1000
  let running = false

  const run = async () => {
    if (running) return
    running = true

    try {
      await sweepCache({ ttlDays, maxBytes })
    } catch (e) {
      Sentry.captureException(e)
      console.error(e)
    } finally {
      running = false
    }
  }

  setTimeout(run, 60 * 1000).unref()
  setInterval(run, intervalMs).unref()
}
