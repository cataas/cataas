import { z } from '@boutdecode/open-api'
import { Cat, CatId } from '../../definitions/schemas.js'
import handleCatRequest from '../../service/handleCatRequest.js'

export const context = 'api'

export const route = {
  method: 'get',
  pattern: '/cat/{id}'
}

export const input = {
  path: z.object({
    id: CatId
  })
}

export const openapi = {
  operationId: 'cat:get',
  tags: ['Cats'],
  description: 'Get cat by id',
  responses: {
    200: {
      description: 'Cat returned',
      content: {
        'image/*': {
          schema: { type: 'string', format: 'binary' }
        },
        'application/json': {
          schema: Cat
        }
      }
    },
    404: {
      description: 'Cat not found'
    }
  }
}

export const handler = handleCatRequest
