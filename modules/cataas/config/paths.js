const apiConfigGenerator = require('../../../src/shared/api/config-generator')

const parameters = [
  {
    name: 'type',
    in: 'query',
    schema: { type: 'string', enum: ['square', 'medium', 'small', 'xsmall'] }
  },
  {
    name: 'filter',
    in: 'query',
    schema: { type: 'string', enum: ['mono', 'negate', 'custom'] }
  },
  {
    name: 'fit',
    in: 'query',
    schema: { type: 'string', enum: ['cover', 'contain', 'fill', 'inside', 'outside'] }
  },
  {
    name: 'position',
    in: 'query',
    schema: { type: 'string', default: 'center', enum: ['top', 'right top', 'right', 'right bottom', 'bottom', 'left bottom', 'left', 'left top', 'center'] }
  },
  {
    name: 'width',
    in: 'query',
    schema: { type: 'integer' }
  },
  {
    name: 'height',
    in: 'query',
    schema: { type: 'integer' }
  },
  {
    name: 'blur',
    in: 'query',
    schema: { type: 'integer' }
  },
  {
    name: 'r',
    in: 'query',
    schema: { type: 'integer' },
    description: 'Red'
  },
  {
    name: 'g',
    in: 'query',
    schema: { type: 'integer' },
    description: 'Green'
  },
  {
    name: 'b',
    in: 'query',
    schema: { type: 'integer' },
    description: 'Blue'
  },
  {
    name: 'brightness',
    in: 'query',
    schema: { type: 'number', format: 'float' },
    description: 'Brightness multiplier'
  },
  {
    name: 'saturation',
    in: 'query',
    schema: { type: 'number', format: 'float' },
    description: 'Saturation multiplier'
  },
  {
    name: 'hue',
    in: 'query',
    schema: { type: 'integer' },
    description: 'Hue rotation in degrees'
  },
  {
    name: 'lightness',
    in: 'query',
    schema: { type: 'integer' },
    description: 'Lightness addend'
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
]

const textParameters = [
  {
    name: 'font',
    in: 'query',
    schema: { type: 'string', default: 'Impact', enum: ['Andale Mono', 'Impact', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Georgia', 'Times New Roman', 'Verdana', 'Webdings'] }
  },
  {
    name: 'fontSize',
    in: 'query',
    schema: { type: 'integer', default: 30 }
  },
  {
    name: 'fontColor',
    in: 'query',
    schema: { type: 'string', default: '#000' }
  },
  {
    name: 'fontBackground',
    in: 'query',
    schema: { type: 'string', default: 'none' }
  },
  /*{
    name: 'fontPosition',
    in: 'query',
    schema: { type: 'string', default: 'south', enum: ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest', 'center'] }
  }*/
]

apiConfigGenerator.addPath('/cat', {
  operationId: 'cat:random',
  method: 'get',
  tags: ['Cats'],
  description: 'Get a random cat',
  parameters,
  responses: {
    200: {
      description: 'Cat returned',
      content: {
        'image/*': {
          schema: { type: 'string', format: 'binary'}
        },
        'application/json': {
          schema: { $ref: '#/components/schemas/Cat' }
        }
      }
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
    ...parameters
  ],
  responses: {
    200: {
      description: 'Cat returned',
      content: {
        'image/*': {
          schema: { type: 'string', format: 'binary'}
        },
        'application/json': {
          schema: { $ref: '#/components/schemas/Cat' }
        }
      }
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
    ...parameters
  ],
  responses: {
    200: {
      description: 'Cat returned',
      content: {
        'image/*': {
          schema: { type: 'string', format: 'binary'}
        },
        'application/json': {
          schema: { $ref: '#/components/schemas/Cat' }
        }
      }
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
    ...textParameters,
    ...parameters
  ],
  responses: {
    200: {
      description: 'Cat returned',
      content: {
        'image/*': {
          schema: { type: 'string', format: 'binary'}
        },
        'application/json': {
          schema: { $ref: '#/components/schemas/Cat' }
        }
      }
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
    ...textParameters,
    ...parameters
  ],
  responses: {
    200: {
      description: 'Cat returned',
      content: {
        'image/*': {
          schema: { type: 'string', format: 'binary'}
        },
        'application/json': {
          schema: { $ref: '#/components/schemas/Cat' }
        }
      }
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
    ...textParameters,
    ...parameters
  ],
  responses: {
    200: {
      description: 'Cat returned',
      content: {
        'image/*': {
          schema: { type: 'string', format: 'binary'}
        },
        'application/json': {
          schema: { $ref: '#/components/schemas/Cat' }
        }
      }
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
