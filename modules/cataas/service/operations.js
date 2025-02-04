import { randomUUID } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

import ImageEditor from './imageEditor.js';

function random(min, max) {
  return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min)
}

export const findCat = (store) => async (id) => {
  const params = { validated: true }
  id = id ? id.split('.')[0] : undefined

  let cat = null
  // If the id is a valid UUID, we can use it to find a specific cat
  if (id && (id.match(/\w{16}/) || id.match(/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/))) {
    cat = await store.cat.findUnique({
      where: { id, ...params }
    })
  } else if (id) {
    const query = decodeURIComponent(id).split(',').reduce((query, tag) => {
      query.push({ tags: { has: tag } })

      return query
    }, [])

    const search = { AND: query, ...params }
    const count = await store.cat.count({
      where: search
    })

    cat = await store.cat.findMany({
      where: search,
      take: 1,
      skip: random(0, count - 1)
    })
    cat = cat[0]
  } else {
    const search = { mimetype: { not: 'image/gif' }, ...params }
    const count = await store.cat.count({
      where: search
    })

    cat = await store.cat.findMany({
      where: search,
      take: 1,
      skip: random(0, count - 1)
    })
    cat = cat[0]
  }

  return cat
}

export const editImage = async (req, buffer, mimetype) => {
  const text = req.params.text ? decodeURIComponent(req.params.text) : null

  let size = req.query.size
  let width = req.query.width
  let height = req.query.height

  if (width) {
    width = parseInt(width)
    width = width <= 1000 ? width : 1000
  }

  if (height) {
    height = parseInt(height)
    height = height <= 1000 ? height : 1000
  }

  if (size) {
    size = parseInt(size)
    size = size <= 100 ? size : 100
  }

  return ImageEditor.edit(
    buffer,
    mimetype,
    { text, ...req.query, size, width, height }
  )
}

export const getUrl = (
  tag = null,
  text = null,
  queries = {},
  id = null
) => {
  let url = `${process.env.HOST}/cat`
  const q = []

  if (id) {
    url += `/${id}`
  } else {
    url += tag ? `/${tag}` : ''
  }

  url += text ? `/says/${text}` : ''

  for (const key in queries) {
    if (queries[key] && key !== 'html' && key !== 'json') {
      q.push(`${key}=${encodeURIComponent(queries[key])}`)
    }
  }

  if (q.length > 0) {
    url += `?${q.join('&')}`
  }

  return url
}

export const getId = (
  id,
  text = null,
  queries = {},
) => {
  let result = `id-${id}`

  if (text) {
    result += `-says-${encodeURIComponent(text)}`
  }

  const q = []
  for (const key in queries) {
    if (queries[key] && key !== 'html') {
      q.push(`${key}-${encodeURIComponent(queries[key])}`)
    }
  }

  if (q.length > 0) {
    result += `-${q.join('-')}`
  }

  return result
}

export const cats = (store) => ({ tags = [], limit, skip }) => {
  const params = { validated: true }

  if (tags.length) {
    params.AND = tags.split(',').reduce((query, tag) => {
      query.push({ tags: { has: tag } })

      return query
    }, [])
  }

  return store.cat.findMany({
    where: params,
    take: limit,
    skip
  })
}

export const tags = (store) => async () => {
  const cats = await store.cat.findMany({
    where: { validated: true }
  })

  const result = []
  cats.forEach(({ tags }) => {
    tags.forEach(tag => {
      if (!result.includes(tag)) {
        result.push(tag)
      }
    })
  })

  return result.sort()
}

export const count = (store) => async () => {
  return { count: await store.cat.count({
    where: { validated: true }
    })
  }
}

export const createCat = (store) => async ({ file, tags }) => {
  tags = tags.split(',').map(tag => tag.trim())

  const isGif = file.mimeType === 'image/gif'
  const buffer = fs.readFileSync(file.filepath)
  const image = sharp(buffer, { animated: isGif })
  const { width, height } = await image.metadata()

  let resizeWidthTo = null
  let resizeHeightTo = null
  if (width > height && width > 1280) {
    resizeWidthTo = 1280
  } else if (height > width && height > 1280) {
    resizeHeightTo = 1280
  }

  if (!isGif && (resizeWidthTo || resizeHeightTo)) {
    await image.resize({ width: resizeWidthTo, height: resizeHeightTo })
  }

  const ext = file.filename.split('.').pop()
  const filename = `${randomUUID()}.${ext}`
  const filePath = path.resolve(process.cwd(), 'data', 'images', filename)

  await image.toFile(filePath)

  return store.cat.create({
    data: {
      tags,
      validated: false,
      mimetype: file.mimeType,
      size: file.length,
      file: filename
    }
  })
}
