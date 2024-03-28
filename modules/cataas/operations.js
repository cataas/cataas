const fs = require('fs')
const store = require('../../src/shared/store/datastore')
const imageEditor = require('./service/image-editor')
const sharp = require('sharp')
const { randomUUID } = require('node:crypto')

function random(min, max) {
  return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min)
}

module.exports = {
  async findCat ({ id, tag, text }) {
    const params = { validated: true }
    id = id ? id.split('.')[0] : undefined
    text = text ? text.split('.')[0] : undefined

    let cat = null
    if (id && id.match(/\w{16}/)) {
      cat = await store.findOne('cats', { _id: id, ...params })
    } else if (id) {
      tag = id

      const query = tag.split(',').reduce((query, tags) => {
        query.push({ tags })

        return query
      }, [])

      const search = { $and: query, ...params }
      const count = await store.count('cats', search)
      cat = await store.find('cats', search, 1, random(0, count - 1))
      cat = cat[0]
    } else {
      const search = { mimetype: { $ne: 'image/gif' }, ...params }
      const count = await store.count('cats', search)
      cat = await store.find('cats', search, 1, random(0, count - 1))
      cat = cat[0]
    }

    return cat
  },

  async cats ({ tags = [], limit, skip }) {
    const params = { validated: true }

    if (tags.length) {
      params.$and = tags.split(',').reduce((query, tags) => {
        query.push({ tags })

        return query
      }, [])
    }

    return await store.find('cats', params, limit, skip)
  },

  async tags () {
    const cats = await store.find('cats', { validated: true })
    const result = []

    cats.forEach(({ tags }) => {
      tags.forEach(tag => {
        if (!result.includes(tag)) {
          result.push(tag)
        }
      })
    })

    return result.sort()
  },

  async count () {
    return { count: await store.count('cats', { validated: true }) }
  },

  async editImage (req, buffer, mimetype) {
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

    return imageEditor.edit(
      buffer,
      mimetype,
      { text, ...req.query, size, width, height }
    )
  },

  getUrl (tag = null, text = null, queries = {}, id = null) {
    let url = `${process.env.HOST}/cat`
    const q = []

    if (id) {
      url += `/${id}`
    } else {
      url += tag ? `/${tag}` : ''
    }

    url += text ? `/says/${text}` : ''

    if (queries.color) {
      q.push(`color=${queries.color}`)
    }

    if (queries.size) {
      q.push(`size=${queries.size}`)
    }

    if (queries.type) {
      q.push(`type=${queries.type}`)
    }

    if (queries.filter) {
      q.push(`filter=${queries.filter}`)
    }

    if (queries.width) {
      q.push(`width=${queries.width}`)
    }

    if (queries.height) {
      q.push(`height=${queries.height}`)
    }

    if (queries.gravity) {
      q.push(`gravity=${queries.gravity}`)
    }

    if (q.length > 0) {
      url += `?${q.join('&')}`
    }

    return url
  },

  async createCat ({ file, tags }) {
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

    await image.toFile(`${__dirname}/../../data/images/${filename}`)

    return await store.insert('cats', {
      tags,
      validated: false,
      mimetype: file.mimeType,
      size: file.length,
      file: filename
    })
  }
}
