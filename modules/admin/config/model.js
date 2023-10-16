const apiConfigGenerator = require('../../../src/shared/api/config-generator')

apiConfigGenerator.addSchema('AdminCat', {
  required: ['file', 'tags', 'validated'],
  type: 'object',
  properties: {
    _id: { type: 'string' },
    validated: { type: 'boolean' },
    file: { type: 'string' },
    mimetype: { type: 'string' },
    size: { type: 'number' },
    tags: {
      type: 'array',
      items: { type: 'string' },
      default: []
    },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' }
  }
})
