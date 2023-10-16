const assert = require('node:assert')
const { validateConfig } = require('@tamia-web/tamia')
const configuration = require('../configuration/configurator')

const apiConfig = configuration.get('api', {})
module.exports = {
  _schemas: {},
  _paths: {},
  _security: {},

  get config () {
    return {
      openapi: '3.0.3',
      info: {
        version: apiConfig.version,
        title: apiConfig.title,
        description: apiConfig.description
      },
      servers: [
        { url: `http://localhost:${process.env.NODE_PORT}` },
        { url: `${process.env.HOST}` }
      ],
      tags: apiConfig.tags || [],
      components: this.components,
      paths: this.paths
    }
  },

  get components () {
    return {
      securitySchemes: this._security,
      schemas: this._schemas
    }
  },

  get paths () {
    return this._paths
  },

  /**
   * Add schema to API config
   *
   * @param {string} name
   * @param {object} [data={}]
   * @returns {Promise<*>}
   */
  async addSchema (name, data = {}) {
    this._schemas[name] = data

    return await validateConfig(this.config)
  },

  /**
   * Add path to API config
   *
   * @param {string} path
   * @param {object} options
   * @returns {Promise<*>}
   */
  async addPath (path, options) {
    if (!this._paths[path]) {
      this._paths[path] = {}
    }

    const { method, operationId } = options
    assert.ok(method, 'Need method')
    assert.ok(operationId, 'Need operationId')

    delete options.method
    delete options.operationId

    this._paths[path][method] = {
      operationId,
      ...options
    }

    return await validateConfig(this.config)
  },

  /**
   * Add security schema
   *
   * @param {string} type
   * @param {object} options
   */
  addSecurity (type, options) {
    this._security[type] = options
  }
}
