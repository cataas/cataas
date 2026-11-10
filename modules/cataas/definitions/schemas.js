import { z } from '@boutdecode/open-api'

export const parameters = z.object({
  type: z.enum(['square', 'medium', 'small', 'xsmall']).optional(),
  filter: z.enum(['mono', 'negate', 'custom']).optional(),
  fit: z.enum(['cover', 'contain', 'fill', 'inside', 'outside']).optional(),
  position: z.enum(['top', 'right top', 'right', 'right bottom', 'bottom', 'left bottom', 'left', 'left top', 'center']).default('center'),
  width: z.coerce.number().int().min(1).max(1000).optional(),
  height: z.coerce.number().int().min(1).max(1000).optional(),
  blur: z.coerce.number().min(0.3).max(20).optional(),
  r: z.coerce.number().int().min(0).max(255).optional().openapi({ description: 'With custom filter, define red value between 0 and 255' }),
  g: z.coerce.number().int().min(0).max(255).optional().openapi({ description: 'With custom filter, define green value between 0 and 255' }),
  b: z.coerce.number().int().min(0).max(255).optional().openapi({ description: 'With custom filter, define blue value between 0 and 255' }),
  brightness: z.coerce.number().min(0).max(10).optional().openapi({ description: 'With custom filter, define brightness' }),
  saturation: z.coerce.number().min(0).max(10).optional().openapi({ description: 'With custom filter, define saturation' }),
  hue: z.coerce.number().min(0).max(360).optional().openapi({ description: 'With custom filter, define hue' }),
  lightness: z.coerce.number().min(0).max(10).optional().openapi({ description: 'With custom filter, define lightness' }),
  format: z.enum(['png', 'jpeg', 'webp', 'avif']).optional(),
  quality: z.coerce.number().min(1).max(100).optional(),
  html: z.coerce.boolean().optional(),
  json: z.coerce.boolean().optional(),
})

export const textParameters = z.object({
  font: z.enum(['Andale Mono', 'Impact', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Georgia', 'Times New Roman', 'Verdana', 'Webdings']).default('Impact'),
  fontSize: z.coerce.number().min(1).max(200).default(50),
  fontColor: z.string().max(32).default('#fff'),
  fontBackground: z.string().max(32).default('none'),
  //fontPosition: z.enum(['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest', 'center']).default('south'),
})

export const CatId = z
  .string()
  .openapi({
    param: {
      in: 'path',
      name: 'id',
    },
  })

export const CatText = z
  .string()
  .max(200)
  .openapi({
    param: {
      in: 'path',
      name: 'text',
    },
  })

export const CatTags = z
  .string()
  .openapi({
    param: {
      in: 'path',
      name: 'tag',
    },
  })

export const Cat = z.object({
    id: CatId,
    tags: z.array(z.string()),
    mimetype: z.string(),
    createdAt: z.date(),
  })
  .openapi({
    ref: 'Cat'
  })
