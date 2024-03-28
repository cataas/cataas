const { MongoClient } = require('mongodb')

const client = new MongoClient(process.env.DB_URL)

module.exports = {
  /**
   * Insert document into collection
   * @param {string} collection
   * @param {object} data
   * @returns {Promise<*>}
   */
  insert (collection, data) {
    return client.db(process.env.DB_NAME).collection(collection).insertOne(data)
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
    return client.db(process.env.DB_NAME).collection(collection).updateOne(query, data, options)
  },

  /**
   * Remove document from collection
   * @param {string} collection
   * @param {object} query
   * @param {object} options
   * @returns {Promise<*>}
   */
  remove (collection, query, options = {}) {
    return client.db(process.env.DB_NAME).collection(collection).deleteOne(query, options)
  },

  /**
   * Find one document from collection
   * @param {string} collection
   * @param {object} query
   * @returns {Promise<*>}
   */
  findOne (collection, query) {
    return client.db(process.env.DB_NAME).collection(collection).findOne(query)
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
  find (collection, query = {}, limit = -1, skip = 0, sort = { createdAt: -1 }) {
    return client.db(process.env.DB_NAME).collection(collection).find(query).sort(sort).skip(skip).limit(limit).toArray()
  },

  /**
   * Count document from collection
   * @param {string} collection
   * @param {object} query
   * @returns {Promise<*>}
   */
  count (collection, query = {}) {
    return client.db(process.env.DB_NAME).collection(collection).countDocuments(query)
  }
}
