import { z } from '@boutdecode/open-api'
import { cats } from '../../service/operations.js'
import { Cat } from '../../definitions/schemas.js'

export const context = 'api'

export const route = {
  method: 'get',
  pattern: '/api/cats'
}

export const input = {
  query: z.object({
    limit: z.coerce.number().default(10),
    skip: z.coerce.number().default(0),
    tags: z.string().optional()
  })
}

export const output = z.array(Cat)

export const openapi = {
  operationId: 'api:cats',
  tags: ['API'],
  description: 'Will return all cats',
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
}

export const handler = async ({ req, res, store }) => {
  try {
    res.send(await cats(store)(req.query))
  } catch (error) {
    res.send({ code: error.code, error }, error.code)
  }
}
