const fs = require('fs')
const store = require('../../src/shared/store/datastore')

module.exports = {
  async browse ({ limit, skip }) {
    return await store.find('cats', {}, limit, skip)
  },

  async validate ({ id }) {
    const cat = await store.findOne('cats', { _id: id })
    if (!cat) {
      throw new Error('Cat not found')
    }

    return await store.update('cats', { _id: id }, { $set: { validated: true } })
  },

  async edit ({ id, tags }) {
    const cat = await store.findOne('cats', { _id: id })
    if (!cat) {
      throw new Error('Cat not found')
    }

    return await store.update('cats', { _id: id }, { $set: { tags: tags.split(',') } })
  },

  async remove ({ id }) {
    const cat = await store.findOne('cats', { _id: id })
    if (!cat) {
      throw new Error('Cat not found')
    }

    if (fs.existsSync(`${__dirname}/../../data/images/${cat.file}`)) {
      fs.unlinkSync(`${__dirname}/../../data/images/${cat.file}`)
    }

    return await store.remove('cats', { _id: id })
  }
}
