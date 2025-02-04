const Datastore = require('nedb')

const config = {
  get dataFolder () {
    return 'data'
  },

  get stores () {
    return ['cats']
  }
}

const stores = {}
const getCollection = (name) => {
  if (!config.stores.includes(name)) {
    throw new Error(`Collection ${name} does not exists.`)
  }

  if (!stores[name]) {
    stores[name] = new Datastore({ filename: `${config.dataFolder}/${name}_production.db`, autoload: true })
  }

  return stores[name]
}

module.exports = {
  /**
   * Insert document into collection
   * @param {string} collection
   * @param {object} data
   * @returns {Promise<*>}
   */
  insert (collection, data) {
    return new Promise((resolve, reject) => {
      data.createdAt = new Date()
      data.editedAt = new Date()

      getCollection(collection).insert(data, (err, result) => {
        if (err) {
          return reject(err)
        }

        return resolve(result)
      })
    })
  },

  /**
   * Update document into collection
   * @param {string} collection
   * @param {object} query
   * @param {object} data
   * @param {object} options
   * @returns {Promise<*>}
   */
  update (collection, query, data, options = {}) {
    return new Promise((resolve, reject) => {
      if (data.$set) {
        data.$set.editedAt = new Date()
      } else {
        data.editedAt = new Date()
      }

      getCollection(collection).update(query, data, options, (err, result) => {
        if (err) {
          return reject(err)
        }

        return resolve(result)
      })
    })
  },

  /**
   * Remove document from collection
   * @param {string} collection
   * @param {object} query
   * @param {object} options
   * @returns {Promise<*>}
   */
  remove (collection, query, options = {}) {
    return new Promise((resolve, reject) => {
      getCollection(collection).remove(query, options, (err, result) => {
        if (err) {
          return reject(err)
        }

        return resolve(result)
      })
    })
  },

  /**
   * Find one document from collection
   * @param {string} collection
   * @param {object} query
   * @returns {Promise<*>}
   */
  findOne (collection, query) {
    return new Promise((resolve, reject) => {
      getCollection(collection).findOne(query, (err, result) => {
        if (err) {
          return reject(err)
        }

        return resolve(result)
      })
    })
  },

  /**
   * Find document from collection
   * @param {string} collection
   * @param {object} query
   * @param {number} limit
   * @param {number} skip
   * @param {object} sort
   * @returns {Promise<*>}
   */
  find (collection, query = {}, limit = 1, skip = 0, sort = { createdAt: -1 }) {
    return new Promise((resolve, reject) => {
      getCollection(collection).find(query).sort(sort).limit(limit).skip(skip).exec((err, result) => {
        if (err) {
          return reject(err)
        }

        return resolve(result)
      })
    })
  },

  /**
   * Count document from collection
   * @param {string} collection
   * @param {object} query
   * @returns {Promise<*>}
   */
  count (collection, query = {}) {
    return new Promise((resolve, reject) => {
      getCollection(collection).count(query, (err, count) => {
        if (err) {
          return reject(err)
        }

        return resolve(count)
      })
    })
  }
}
