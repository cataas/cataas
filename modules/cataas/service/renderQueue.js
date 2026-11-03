// File de rendus : limite la concurrence, borne l'attente et regroupe les rendus identiques.
// Sans cela, chaque cache miss lance son propre rendu sharp et garde ses buffers en mémoire.

export class QueueFullError extends Error {
  constructor () {
    super('Render queue is full')
    this.code = 'QUEUE_FULL'
  }
}

const toInt = (value, fallback) => {
  const n = parseInt(value, 10)
  return Number.isFinite(n) && n > 0 ? n : fallback
}

export const createRenderQueue = ({
  concurrency = toInt(process.env.RENDER_CONCURRENCY, 4),
  maxQueue = toInt(process.env.RENDER_QUEUE_MAX, 50)
} = {}) => {
  let running = 0
  const waiting = []
  const inflight = new Map()

  const release = () => {
    running--
    const next = waiting.shift()
    if (next) next()
  }

  const acquire = () => {
    if (running < concurrency) {
      running++
      return Promise.resolve()
    }

    if (waiting.length >= maxQueue) {
      return Promise.reject(new QueueFullError())
    }

    return new Promise(resolve => {
      waiting.push(() => {
        running++
        resolve()
      })
    })
  }

  // Les appels simultanés avec la même clé partagent un seul rendu
  const run = (key, task) => {
    const existing = inflight.get(key)
    if (existing) return existing

    const promise = acquire()
      .then(() => task().finally(release))
      .finally(() => inflight.delete(key))

    inflight.set(key, promise)

    return promise
  }

  return { run, stats: () => ({ running, waiting: waiting.length, inflight: inflight.size }) }
}

export default createRenderQueue()
