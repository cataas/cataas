import assert from 'node:assert/strict'
import fsp from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { test } from 'node:test'

import { sweepCache } from './cacheSweeper.js'

const DAY = 86400 * 1000
const now = Date.now()

const make = async (root, rel, { size = 10, ageMs = 0 } = {}) => {
  const file = path.join(root, rel)
  await fsp.mkdir(path.dirname(file), { recursive: true })
  await fsp.writeFile(file, Buffer.alloc(size))
  const date = new Date(now - ageMs)
  await fsp.utimes(file, date, date)
}

const exists = (file) => fsp.access(file).then(() => true, () => false)
const tmpRoot = () => fsp.mkdtemp(path.join(os.tmpdir(), 'cataas-cache-'))

test('supprime les rendus plus vieux que le TTL', async () => {
  const root = await tmpRoot()
  await make(root, 'a/old', { ageMs: 40 * DAY })
  await make(root, 'a/new', { ageMs: DAY })

  await sweepCache({ ttlDays: 30, maxBytes: 1e9, root, now })

  assert.equal(await exists(path.join(root, 'a/old')), false)
  assert.equal(await exists(path.join(root, 'a/new')), true)
})

test('respecte le plafond en supprimant les plus anciens d\'abord', async () => {
  const root = await tmpRoot()
  await make(root, 'a/1', { size: 100, ageMs: 3 * DAY })
  await make(root, 'a/2', { size: 100, ageMs: 2 * DAY })
  await make(root, 'a/3', { size: 100, ageMs: DAY })

  await sweepCache({ ttlDays: 30, maxBytes: 150, root, now })

  assert.equal(await exists(path.join(root, 'a/1')), false)
  assert.equal(await exists(path.join(root, 'a/2')), false)
  assert.equal(await exists(path.join(root, 'a/3')), true)
})

test('gère les .tmp, les dossiers vides et les anciens fichiers plats', async () => {
  const root = await tmpRoot()
  await make(root, 'a/x.tmp', { ageMs: 2 * 3600 * 1000 })
  await make(root, 'b/y.tmp', { ageMs: 60 * 1000 })
  await make(root, 'id-legacy-file')

  await sweepCache({ ttlDays: 30, maxBytes: 1e9, root, now })

  assert.equal(await exists(path.join(root, 'a')), false)
  assert.equal(await exists(path.join(root, 'b/y.tmp')), true)
  assert.equal(await exists(path.join(root, 'id-legacy-file')), false)
})

test('ne plante pas si le cache n\'existe pas', async () => {
  const result = await sweepCache({ ttlDays: 30, maxBytes: 1, root: path.join(os.tmpdir(), 'cataas-missing') })

  assert.equal(result.removed, 0)
})
