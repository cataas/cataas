const apiConfigGenerator = require('../../../src/shared/api/config-generator')

apiConfigGenerator.addPath('/cat', {
  operationId: 'cat:random',
  method: 'get',
  tags: ['Cats'],
  description: 'Get a random cat',
  parameters: [
    {
      name: 'type',
      in: 'query',
      schema: { type: 'string' }
    },
    {
      name: 'filter',
      in: 'query',
      schema: { type: 'string' }
    },
    {
      name: 'width',
      in: 'query',
      schema: { type: 'string' }
    },
    {
      name: 'height',
      in: 'query',
      schema: { type: 'string' }
    },
    {
      name: 'html',
      in: 'query',
      schema: { type: 'boolean' }
    },
    {
      name: 'json',
      in: 'query',
      schema: { type: 'boolean' }
    }
  ],
  responses: {
    200: {
      description: 'Cat returned'
    }
  }
})

apiConfigGenerator.addPath('/cat/{id}', {
  operationId: 'cat:get',
  method: 'get',
  tags: ['Cats'],
  description: 'Get cat by id',
  parameters: [
    {
      name: 'id',
      in: 'path',
      schema: { type: 'string' },
      required: true
    },
    {
      name: 'type',
      in: 'query',
      schema: { type: 'string' }
    },
    {
      name: 'filter',
      in: 'query',
      schema: { type: 'string' }
    },
    {
      name: 'width',
      in: 'query',
      schema: { type: 'string' }
    },
    {
      name: 'height',
      in: 'query',
      schema: { type: 'string' }
    },
    {
      name: 'html',
      in: 'query',
      schema: { type: 'boolean' }
    },
    {
      name: 'json',
      in: 'query',
      schema: { type: 'boolean' }
    }
  ],
  responses: {
    200: {
      description: 'Cat returned'
    },
    404: {
      description: 'Cat not found'
    }
  }
})

apiConfigGenerator.addPath('/cat/{tag}', {
  operationId: 'cat:random:tag',
  method: 'get',
  tags: ['Cats'],
  description: 'Get random cat by tag',
  parameters: [
    {
      name: 'tag',
      in: 'path',
      schema: { type: 'string' },
      required: true
    },
    {
      name: 'type',
      in: 'query',
      schema: { type: 'string' }
    },
    {
      name: 'filter',
      in: 'query',
      schema: { type: 'string' }
    },
    {
      name: 'width',
      in: 'query',
      schema: { type: 'string' }
    },
    {
      name: 'height',
      in: 'query',
      schema: { type: 'string' }
    },
    {
      name: 'html',
      in: 'query',
      schema: { type: 'boolean' }
    },
    {
      name: 'json',
      in: 'query',
      schema: { type: 'boolean' }
    }
  ],
  responses: {
    200: {
      description: 'Cat returned'
    }
  }
})

apiConfigGenerator.addPath('/cat/says/{text}', {
  operationId: 'cat:random:text',
  method: 'get',
  tags: ['Cats'],
  description: 'Get random cat saying text',
  parameters: [
    {
      name: 'text',
      in: 'path',
      schema: { type: 'string' },
      required: true
    },
    {
      name: 'type',
      in: 'query',
      schema: { type: 'string' }
    },
    {
      name: 'filter',
      in: 'query',
      schema: { type: 'string' }
    },
    {
      name: 'width',
      in: 'query',
      schema: { type: 'string' }
    },
    {
      name: 'height',
      in: 'query',
      schema: { type: 'string' }
    },
    {
      name: 'html',
      in: 'query',
      schema: { type: 'boolean' }
    },
    {
      name: 'json',
      in: 'query',
      schema: { type: 'boolean' }
    }
  ],
  responses: {
    200: {
      description: 'Cat returned'
    }
  }
})

apiConfigGenerator.addPath('/cat/{id}/says/{text}', {
  operationId: 'cat:get:text',
  method: 'get',
  tags: ['Cats'],
  description: 'Get cat by id saying text',
  parameters: [
    {
      name: 'id',
      in: 'path',
      schema: { type: 'string' },
      required: true
    },
    {
      name: 'text',
      in: 'path',
      schema: { type: 'string' },
      required: true
    },
    {
      name: 'type',
      in: 'query',
      schema: { type: 'string' }
    },
    {
      name: 'filter',
      in: 'query',
      schema: { type: 'string' }
    },
    {
      name: 'width',
      in: 'query',
      schema: { type: 'string' }
    },
    {
      name: 'height',
      in: 'query',
      schema: { type: 'string' }
    },
    {
      name: 'html',
      in: 'query',
      schema: { type: 'boolean' }
    },
    {
      name: 'json',
      in: 'query',
      schema: { type: 'boolean' }
    }
  ],
  responses: {
    200: {
      description: 'Cat returned'
    },
    404: {
      description: 'Cat not found'
    }
  }
})

apiConfigGenerator.addPath('/cat/{tag}/says/{text}', {
  operationId: 'cat:random:tag:text',
  method: 'get',
  tags: ['Cats'],
  description: 'Get random cat by tag saying text',
  parameters: [
    {
      name: 'tag',
      in: 'path',
      schema: { type: 'string' },
      required: true
    },
    {
      name: 'text',
      in: 'path',
      schema: { type: 'string' },
      required: true
    },
    {
      name: 'type',
      in: 'query',
      schema: { type: 'string' }
    },
    {
      name: 'filter',
      in: 'query',
      schema: { type: 'string' }
    },
    {
      name: 'width',
      in: 'query',
      schema: { type: 'string' }
    },
    {
      name: 'height',
      in: 'query',
      schema: { type: 'string' }
    },
    {
      name: 'html',
      in: 'query',
      schema: { type: 'boolean' }
    },
    {
      name: 'json',
      in: 'query',
      schema: { type: 'boolean' }
    }
  ],
  responses: {
    200: {
      description: 'Cat returned'
    }
  }
})

apiConfigGenerator.addPath('/api/cats', {
  operationId: 'api:cats',
  method: 'get',
  tags: ['API'],
  description: 'Will return all cats',
  parameters: [
    {
      name: 'limit',
      in: 'query',
      schema: { type: 'number', default: 10 }
    },
    {
      name: 'skip',
      in: 'query',
      schema: { type: 'number', default: 0 }
    },
    {
      name: 'tags',
      in: 'query',
      schema: { type: 'string' }
    }
  ],
  responses: {
    200: {
      description: 'List of cats',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Cat'
            }
          }
        }
      }
    }
  }
})

apiConfigGenerator.addPath('/api/tags', {
  operationId: 'api:tags',
  method: 'get',
  tags: ['API'],
  description: 'Will return all tags',
  responses: {
    200: {
      description: 'List of tags',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: { type: 'string' }
          }
        }
      }
    }
  }
})

apiConfigGenerator.addPath('/api/count', {
  operationId: 'api:count',
  method: 'get',
  tags: ['API'],
  description: 'Count how many cat',
  responses: {
    200: {
      description: 'List of tags',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              count: { type: 'number' }
            }
          }
        }
      }
    }
  }
})
