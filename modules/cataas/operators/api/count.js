import { z } from '@boutdecode/open-api'
import { count } from '../../service/operations.js'
import { CatTags } from '../../definitions/schemas.js'

export const context = 'api'

export const route = {
  method: 'get',
  pattern: '/api/count'
}

export const output = z.object({
  count: z.number()
})

export const openapi = {
  operationId: 'api:count',
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
}

export const handler = async ({ res, store }) => {
  try {
    res.send(await count(store)())
  } catch (error) {
    res.send({ code: error.code, error }, error.code)
  }
}
