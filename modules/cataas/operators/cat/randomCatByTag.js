import { z } from '@boutdecode/open-api'
import { CatTags, parameters } from '../../definitions/schemas.js'
import handleCatRequest from '../../service/handleCatRequest.js'

export const context = 'api'

export const route = {
  method: 'get',
  pattern: '/cat/{tag}'
}

export const input = {
  path: z.object({
    tag: CatTags
  }),
  query: parameters
}

export const openapi = {
  operationId: 'cat:random:tag',
  tags: ['Cats'],
  description: 'Get random cat by tag',
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
