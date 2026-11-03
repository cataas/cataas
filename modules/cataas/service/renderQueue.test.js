import assert from 'node:assert/strict'
import { test } from 'node:test'

import { createRenderQueue, QueueFullError } from './renderQueue.js'

const deferred = () => {
  let resolve
  const promise = new Promise(r => { resolve = r })
  return { promise, resolve }
}

test('regroupe les rendus de même clé', async () => {
  const queue = createRenderQueue({ concurrency: 2, maxQueue: 5 })
  let calls = 0
  const gate = deferred()
  const task = async () => { calls++; await gate.promise; return 'ok' }

  const results = [queue.run('a', task), queue.run('a', task), queue.run('a', task)]
  gate.resolve()

  assert.deepEqual(await Promise.all(results), ['ok', 'ok', 'ok'])
  assert.equal(calls, 1)
})

test('limite la concurrence et rejette quand la file est pleine', async () => {
  const queue = createRenderQueue({ concurrency: 1, maxQueue: 1 })
  const gate = deferred()
  const task = async () => { await gate.promise; return 1 }

  const first = queue.run('a', task)
  const second = queue.run('b', task)

  await assert.rejects(queue.run('c', task), QueueFullError)
  assert.deepEqual(queue.stats(), { running: 1, waiting: 1, inflight: 2 })

  gate.resolve()
  await Promise.all([first, second])
  assert.deepEqual(queue.stats(), { running: 0, waiting: 0, inflight: 0 })
})

test('libère le slot quand le rendu échoue', async () => {
  const queue = createRenderQueue({ concurrency: 1, maxQueue: 1 })

  await assert.rejects(queue.run('a', async () => { throw new Error('boom') }), /boom/)
  assert.equal(await queue.run('b', async () => 'ok'), 'ok')
  assert.deepEqual(queue.stats(), { running: 0, waiting: 0, inflight: 0 })
})
