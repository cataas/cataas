import { z } from '@boutdecode/open-api'
import { CatId, CatText, parameters, textParameters } from '../../definitions/schemas.js'
import handleCatRequest from '../../service/handleCatRequest.js'

export const context = 'api'

export const route = {
  method: 'get',
  pattern: '/cat/{id}/says/{text}'
}

export const input = {
  path: z.object({
    id: CatId,
    text: CatText
  }),
  query: z.object({
    ...parameters.shape,
    ...textParameters.shape
  })
}

export const openapi = {
  operationId: 'cat:get:text',
  tags: ['Cats'],
  description: 'Get cat by id saying text',
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
}

export const handler = handleCatRequest
