const apiConfigGenerator = require('../../../src/shared/api/config-generator')

apiConfigGenerator.addSchema('Cat', {
  required: ['file', 'tags'],
  type: 'object',
  properties: {
    _id: { type: 'string' },
    mimetype: { type: 'string' },
    size: { type: 'number' },
    tags: {
      type: 'array',
      items: { type: 'string' },
      default: []
    }
  }
})

apiConfigGenerator.addSchema('EditCat', {
  required: ['tags'],
  type: 'object',
  properties: {
    tags: {
      type: 'array',
      items: { type: 'string' },
      default: []
    }
  }
})

apiConfigGenerator.addSchema('Error', {
  type: 'object',
  properties: {
    message: { type: 'string' },
    code: { type: 'number' }
  }
})
