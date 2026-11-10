import { parameters } from '../../definitions/schemas.js'
import handleCatRequest from '../../service/handleCatRequest.js'

export const context = 'api'

export const route = {
  method: 'get',
  pattern: '/cat'
}

export const input = {
  query: parameters
}

export const openapi = {
  operationId: 'cat:random',
  tags: ['Cats'],
  description: 'Get a random cat',
  responses: {
    200: {
      description: 'Cat returned',
      content: {
        'image/*': {
          schema: { type: 'string', format: 'binary' }
        },
        'application/json': {
          schema: { $ref: '#/components/schemas/Cat' }
        }
      }
    }
  }
}

export const handler = handleCatRequest
