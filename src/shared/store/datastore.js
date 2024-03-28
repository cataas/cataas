const { MongoClient } = require('mongodb')

module.exports = {
  /**
   * Insert document into collection
   * @param {string} collection
   * @param {object} data
   * @returns {Promise<*>}
   */
  async insert (collection, data) {
    const client = new MongoClient(process.env.DB_URL)

    try {
      await client.connect()
      const result = await client.db(process.env.DB_NAME).collection(collection).insertOne(data)
    } finally {
      await client.close()
    }
  },

  /**
   * Update document into collection
   * @param {string} collection
   * @param {object} query
   * @param {object} data
   * @param {object} options
   * @returns {Promise<*>}
   */
  async update (collection, query, data, options = {}) {
    const client = new MongoClient(process.env.DB_URL)

    try {
      await client.connect()
      const result = await client.db(process.env.DB_NAME).collection(collection).updateOne(query, data, options)
    } finally {
      await client.close()
    }
  },

  /**
   * Remove document from collection
   * @param {string} collection
   * @param {object} query
   * @param {object} options
   * @returns {Promise<*>}
   */
  async remove (collection, query, options = {}) {
    const client = new MongoClient(process.env.DB_URL)

    try {
      await client.connect()
      const result = await client.db(process.env.DB_NAME).collection(collection).deleteOne(query, options)
    } finally {
      await client.close()
    }
  },

  /**
   * Find one document from collection
   * @param {string} collection
   * @param {object} query
   * @returns {Promise<*>}
   */
  async findOne (collection, query) {
    const client = new MongoClient(process.env.DB_URL)

    try {
      await client.connect()
      return await client.db(process.env.DB_NAME).collection(collection).findOne(query)
    } finally {
      await client.close()
    }
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
  async find (collection, query = {}, limit = -1, skip = 0, sort = { createdAt: -1 }) {
    const client = new MongoClient(process.env.DB_URL)

    try {
      await client.connect()
      return await client.db(process.env.DB_NAME).collection(collection).find(query).sort(sort).skip(skip).limit(limit).toArray()
    } finally {
      await client.close()
    }
  },

  /**
   * Count document from collection
   * @param {string} collection
   * @param {object} query
   * @returns {Promise<*>}
   */
  async count (collection, query = {}) {
    const client = new MongoClient(process.env.DB_URL)
    try {
      await client.connect()
      return await client.db(process.env.DB_NAME).collection(collection).countDocuments(query)
    } finally {
      await client.close()
    }
  }
}
