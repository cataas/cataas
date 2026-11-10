import assert from 'node:assert/strict'
import { test } from 'node:test'
import sharp from 'sharp'

import ImageEditor from './imageEditor.js'

const source = () => sharp({ create: { width: 100, height: 80, channels: 3, background: '#808080' } }).jpeg().toBuffer()

test('solid creates an image of the requested size and color', async () => {
  const buffer = await ImageEditor.solid(200, 100, '#ff0000')
  const meta = await sharp(buffer).metadata()
  assert.equal(meta.format, 'png')
  assert.equal(meta.width, 200)
  assert.equal(meta.height, 100)

  const { data } = await sharp(buffer).raw().toBuffer({ resolveWithObject: true })
  const center = (50 * 200 + 100) * meta.channels
  assert.deepEqual([data[center], data[center + 1], data[center + 2]], [255, 0, 0])
})

test('solid with a caption keeps the size and honours the format', async () => {
  const buffer = await ImageEditor.solid(300, 200, '#336699', { text: '300x200', fontSize: 20, format: 'webp' })
  const meta = await sharp(buffer).metadata()
  assert.equal(meta.format, 'webp')
  assert.equal(meta.width, 300)
  assert.equal(meta.height, 200)
})

test('edit converts to the requested format', async () => {
  const buffer = await ImageEditor.edit(await source(), 'image/jpeg', { format: 'webp', quality: '50', width: 50, height: 40 })
  const meta = await sharp(buffer).metadata()
  assert.equal(meta.format, 'webp')
  assert.equal(meta.width, 50)
})

test('edit keeps the source format without format', async () => {
  const buffer = await ImageEditor.edit(await source(), 'image/jpeg', {})
  assert.equal((await sharp(buffer).metadata()).format, 'jpeg')
})
