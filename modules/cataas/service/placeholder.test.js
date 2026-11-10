import assert from 'node:assert/strict'
import { test } from 'node:test'

import { escapeXml, parsePlaceholderSize } from './placeholder.js'

test('parses WxH and an optional extension', () => {
  assert.deepEqual(parsePlaceholderSize('600x400'), { width: 600, height: 400, format: undefined })
  assert.deepEqual(parsePlaceholderSize('600x400.png'), { width: 600, height: 400, format: 'png' })
  assert.equal(parsePlaceholderSize('10x10.jpg').format, 'jpeg')
})

test('caps sizes at 1000 and rejects invalid input', () => {
  assert.deepEqual(parsePlaceholderSize('5000x5000'), { width: 1000, height: 1000, format: undefined })
  assert.equal(parsePlaceholderSize('0x10'), null)
  assert.equal(parsePlaceholderSize('abc'), null)
  assert.equal(parsePlaceholderSize('10x10.exe'), null)
  assert.equal(parsePlaceholderSize(undefined), null)
})

test('escapes XML special characters', () => {
  assert.equal(escapeXml('<script>"a"&\'b\''), '&lt;script&gt;&quot;a&quot;&amp;&apos;b&apos;')
})
