import { z } from '@boutdecode/open-api'

import { parameters, textParameters } from '../../definitions/schemas.js'
import handleCatRequest from '../../service/handleCatRequest.js'
import ImageEditor from '../../service/imageEditor.js'
import { defaultFontSize, escapeXml, mimeByFormat, parsePlaceholderSize } from '../../service/placeholder.js'

export const context = 'api'

export const route = {
  method: 'get',
  pattern: '/placeholder/{size}'
}

export const input = {
  path: z.object({
    size: z.string().openapi({ param: { in: 'path', name: 'size' }, description: 'Dimensions as WxH (max 1000), optional extension, e.g. 600x400.png' })
  }),
  query: z.object({
    ...parameters.shape,
    ...textParameters.partial().shape,
    color: z.string().regex(/^([0-9a-fA-F]{3,8}|[a-zA-Z]+)$/).optional().openapi({ description: 'Solid background (hex without #, or CSS color name) instead of a cat' }),
    label: z.string().max(80).optional().openapi({ description: 'Caption, defaults to WxH, empty to hide it' })
  })
}

export const openapi = {
  operationId: 'cat:placeholder',
  tags: ['Cats'],
  description: 'Get a random cat (or a solid color) cropped to the given size, captioned with its dimensions',
  responses: {
    200: {
      description: 'Placeholder returned',
      content: {
        'image/*': {
          schema: { type: 'string', format: 'binary' }
        }
      }
    }
  }
}

export const handler = async (ctx) => {
  const { req, res } = ctx
  const size = parsePlaceholderSize(req.params.size)

  if (!size) {
    return res.send('Invalid size, expected WxH (e.g. 600x400)', 400)
  }

  const { width, height } = size
  const query = { ...req.query }
  const format = query.format || size.format
  const label = escapeXml(query.label ?? `${width}x${height}`)
  const fontSize = Number(query.fontSize) || defaultFontSize(width, height)

  if (format) query.format = format

  if (query.color) {
    const color = /^[0-9a-fA-F]+$/.test(query.color) ? `#${query.color}` : query.color
    let buffer
    try {
      buffer = await ImageEditor.solid(width, height, color, {
        text: label,
        fontSize,
        font: query.font,
        fontColor: query.fontColor,
        fontBackground: query.fontBackground,
        format,
        quality: query.quality
      })
    } catch (error) {
      return res.send('Invalid color', 400)
    }

    res.setHeader('Content-Type', mimeByFormat[format || 'png'])
    res.setHeader('Content-Length', buffer.length)
    res.write(buffer)
    return res.end()
  }

  // editImage decodes req.params.text, so the label travels URI-encoded
  const wrapped = Object.create(req, {
    params: { value: { text: encodeURIComponent(label) } },
    query: { value: { ...query, width, height, fit: 'cover', fontSize } }
  })

  return handleCatRequest({ ...ctx, req: wrapped })
}
