import { z } from '@boutdecode/open-api'
import { tags } from '../../service/operations.js'
import { CatTags } from '../../definitions/schemas.js'

export const context = 'api'

export const route = {
  method: 'get',
  pattern: '/api/tags'
}

export const output = z.array(CatTags)

export const openapi = {
  operationId: 'api:tags',
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
}

export const handler = async ({ res, store }) => {
  try {
    res.send(await tags(store)())
  } catch (error) {
    res.send({ code: error.code, error }, error.code)
  }
}
