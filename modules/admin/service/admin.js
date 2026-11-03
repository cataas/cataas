import { timingSafeEqual, createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

import sharp from 'sharp'

const digest = (value) => createHash('sha256').update(String(value)).digest()

const safeEqual = (a, b) => timingSafeEqual(digest(a), digest(b))

/**
 * Protège les routes d'administration (Basic Auth + contrôle de l'origine).
 * Renvoie `true` si la requête peut continuer, sinon la réponse est déjà envoyée.
 */
export const guard = ({ req, res }) => {
  const { ADMIN_USER, ADMIN_PASSWORD } = process.env

  // Fermé par défaut : sans identifiants configurés, l'administration n'existe pas
  if (!ADMIN_USER || !ADMIN_PASSWORD) {
    res.status(404).send('Not found')

    return false
  }

  const [scheme, token] = (req.headers.authorization || '').split(' ')
  const [user = '', ...rest] = scheme === 'Basic' && token
    ? Buffer.from(token, 'base64').toString().split(':')
    : []

  // Les identifiants Basic sont renvoyés automatiquement par le navigateur :
  // on refuse donc les POST venant d'un autre site (CSRF)
  if (req.method !== 'GET') {
    const site = req.headers['sec-fetch-site']
    const origin = req.headers.origin
    const crossSite = (site && site !== 'same-origin') ||
      (!site && origin && new URL(origin).host !== req.headers.host)

    if (crossSite) {
      res.status(403).send('Forbidden')

      return false
    }
  }

  if (!safeEqual(user, ADMIN_USER) || !safeEqual(rest.join(':'), ADMIN_PASSWORD)) {
    res.set('WWW-Authenticate', 'Basic realm="CATAAS admin", charset="UTF-8"')
    res.status(401).send('Unauthorized')

    return false
  }

  return true
}

export const PAGE_SIZE = 24

export const listCats = (store) => async ({ status = 'pending', page = 1 }) => {
  const where = status === 'validated'
    ? { validated: true }
    : status === 'all' ? {} : { validated: false }
  const total = await store.cat.count({ where })
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const current = Math.min(pages, Math.max(1, parseInt(page) || 1))

  const cats = await store.cat.findMany({
    where,
    orderBy: { createdAt: status === 'pending' ? 'asc' : 'desc' },
    take: PAGE_SIZE,
    skip: (current - 1) * PAGE_SIZE
  })

  return { cats, total, page: current, pages }
}

export const getCat = (store) => (id) => store.cat.findUnique({ where: { id } })

export const validateCat = (store) => (id) => store.cat.update({
  where: { id },
  data: { validated: true }
})

export const updateTags = (store) => (id, tags) => store.cat.update({
  where: { id },
  data: {
    tags: [...new Set(String(tags || '').split(',').map(tag => tag.trim()).filter(Boolean))]
  }
})

const imagesDir = () => path.resolve(process.cwd(), 'data', 'images')

// Supprime tous les rendus en cache d'un chat (`id-<uuid>...`)
const purgeCache = (id) => {
  const cache = path.resolve(process.cwd(), 'data', 'cache', 'images')

  if (fs.existsSync(cache)) {
    fs.readdirSync(cache)
      .filter(file => file.startsWith(`id-${id}`))
      .forEach(file => fs.rmSync(path.join(cache, file), { force: true }))
  }
}

// Supprime la ligne, l'original et tous les rendus en cache
export const deleteCat = (store) => async (id) => {
  const cat = await store.cat.delete({ where: { id } })

  fs.rmSync(path.join(imagesDir(), path.basename(cat.file)), { force: true })
  purgeCache(cat.id)

  return cat
}

// Pivote l'original de 90° (`left` = sens antihoraire) et invalide les rendus
const rotateCat = (angle) => (store) => async (id) => {
  const cat = await store.cat.findUniqueOrThrow({ where: { id } })
  const file = path.join(imagesDir(), path.basename(cat.file))

  const buffer = await sharp(file, { animated: cat.mimetype === 'image/gif' })
    .rotate(angle)
    .toBuffer()

  fs.writeFileSync(file, buffer)
  purgeCache(cat.id)

  return store.cat.update({ where: { id }, data: { size: buffer.length } })
}

export const rotateCatLeft = rotateCat(-90)
export const rotateCatRight = rotateCat(90)
