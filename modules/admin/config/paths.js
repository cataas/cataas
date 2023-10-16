const apiConfigGenerator = require('../../../src/shared/api/config-generator')

apiConfigGenerator.addPath('/admin/cats', {
  operationId: 'admin:cats:browse',
  security: [{ jwt: [] }],
  method: 'get',
  tags: ['Admin'],
  description: 'Browse cats',
  parameters: [
    {
      name: 'limit',
      in: 'query',
      schema: { type: 'integer' }
    },
    {
      name: 'skip',
      in: 'query',
      schema: { type: 'integer' }
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
              $ref: '#/components/schemas/AdminCat'
            }
          }
        }
      }
    }
  }
})

apiConfigGenerator.addPath('/admin/cats/{id}/validate', {
  operationId: 'admin:cats:validate',
  security: [{ jwt: [] }],
  method: 'put',
  tags: ['Admin'],
  description: 'Activate cat',
  parameters: [
    {
      name: 'id',
      in: 'path',
      schema: { type: 'string' },
      required: true
    }
  ],
  responses: {
    200: {
      description: 'Cat activated'
    },
    404: {
      description: 'Cat not found'
    }
  }
})

apiConfigGenerator.addPath('/admin/cats/{id}', {
  operationId: 'admin:cats:edit',
  security: [{ jwt: [] }],
  method: 'patch',
  tags: ['Admin'],
  description: 'Activate cat',
  parameters: [
    {
      name: 'id',
      in: 'path',
      schema: { type: 'string' },
      required: true
    }
  ],
  requestBody: {
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            tags: { type: 'string' }
          }
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Cat updated'
    },
    404: {
      description: 'Cat not found'
    }
  }
})

apiConfigGenerator.addPath('/admin/cats/{id}', {
  operationId: 'admin:cats:delete',
  security: [{ jwt: [] }],
  method: 'delete',
  tags: ['Admin'],
  description: 'Delete cat',
  parameters: [
    {
      name: 'id',
      in: 'path',
      schema: { type: 'string' },
      required: true
    }
  ],
  responses: {
    203: {
      description: 'Cat deleted'
    },
    404: {
      description: 'Cat not found'
    }
  }
})
