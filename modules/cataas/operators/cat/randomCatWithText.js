import { z } from '@boutdecode/open-api'
import { CatText, parameters, textParameters } from '../../definitions/schemas.js'
import handleCatRequest from '../../service/handleCatRequest.js'

export const context = 'api'

export const route = {
  method: 'get',
  pattern: '/cat/says/{text}'
}

export const input = {
  path: z.object({
    text: CatText
  }),
  query: z.object({
    ...parameters.shape,
    ...textParameters.shape
  })
}

export const openapi = {
  operationId: 'cat:random:text',
  tags: ['Cats'],
  description: 'Get random cat saying text',
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
}

export const handler = handleCatRequest
