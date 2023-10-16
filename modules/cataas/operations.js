const { createHash } = require('crypto')
const store = require('../../src/shared/store/datastore')
const imageEditor = require('cataas-image-editor')

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

      const result = await store.find('cats', { $and: query, ...params })
      cat = result[Math.floor(Math.random() * result.length)]
    } else {
      const result = await store.find('cats', params)
      const notGif = result.filter(({ mimetype }) => mimetype !== 'image/gif')
      cat = notGif[Math.floor(Math.random() * notGif.length)]
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
    const text = req.params.text ? decodeURIComponent(req.params.text) : ''
    const color = req.query.color || '#ffffff'
    let size = req.query.size || 30
    let type = req.query.type || 'default'
    const filter = req.query.filter || null
    let width = req.query.width || null
    let height = req.query.height || null
    const gravity = req.query.gravity || 'Center'

    if (width !== null) {
      width = width <= 1000 ? width : 1000
    }

    if (height !== null) {
      height = height <= 1000 ? height : 1000
    }

    if (size !== null) {
      size = size <= 100 ? size : 100
    }

    // Don't resize gif if there are no type selected or custom width / height
    if (mimetype === 'image/gif' && type === 'default' && width === null && height === null) {
      type = 'original'
    }

    return imageEditor.edit(buffer, mimetype, type, text, color, size, filter, width, height, gravity)
  },

  getUrl (tag = null, text = null, queries = {}, id = null) {
    let url = '/cat'
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

    let buffer = await imageEditor.readFile(file.filepath)
    const { sizes } = await imageEditor.size(buffer)
    const { width, height } = sizes

    let resizeWidthTo = null
    let resizeHeightTo = null

    if (width > height && width > 1280) {
      resizeWidthTo = 1280
    } else if (height > width && height > 1280) {
      resizeHeightTo = 1280
    }

    if (resizeWidthTo || resizeHeightTo) {
      buffer = await imageEditor.resize(buffer, resizeWidthTo, resizeHeightTo)
    }

    const ext = file.filename.split('.').pop()
    const hashFunction = createHash('md5')
    const hash = hashFunction.update(file.filename).digest('hex')
    const filename = `${hash}.${ext}`

    await imageEditor.writeFile(buffer, `${__dirname}/../../data/images/${filename}`)

    return await store.insert('cats', {
      tags,
      validated: false,
      mimetype: file.mimeType,
      size: file.length,
      file: filename
    })
  }
}
