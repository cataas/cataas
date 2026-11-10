import assert from 'node:assert/strict'
import { test } from 'node:test'

import { findCat, seededRandom } from './operations.js'

test('same seed gives the same sequence', () => {
  const a = seededRandom('alice')
  const b = seededRandom('alice')
  const seqA = Array.from({ length: 10 }, () => a(0, 1000))
  const seqB = Array.from({ length: 10 }, () => b(0, 1000))
  assert.deepEqual(seqA, seqB)
})

test('different seeds give different sequences', () => {
  const a = seededRandom('alice')
  const b = seededRandom('bob')
  const seqA = Array.from({ length: 10 }, () => a(0, 1000))
  const seqB = Array.from({ length: 10 }, () => b(0, 1000))
  assert.notDeepEqual(seqA, seqB)
})

test('values stay within [min, max]', () => {
  const r = seededRandom('x')
  for (let i = 0; i < 1000; i++) {
    const v = r(3, 7)
    assert.ok(v >= 3 && v <= 7)
  }
})

test('findCat asks the store for the same skip with the same seed', async () => {
  const skips = []
  const store = {
    cat: {
      count: async () => 50,
      findMany: async ({ skip }) => { skips.push(skip); return [{ id: 'c' }] }
    }
  }
  await findCat(store)({}, { rand: seededRandom('alice') })
  await findCat(store)({}, { rand: seededRandom('alice') })
  assert.equal(skips[0], skips[1])
})
