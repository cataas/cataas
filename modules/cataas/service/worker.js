const { parentPort, workerData } = require('node:worker_threads')

const imageEditor = require('./image-editor')

const { buffer, mimetype, args, text, size, width, height } = workerData

setTimeout(() => process.exit(), 10000)

imageEditor.edit(
  buffer,
  mimetype,
  { text, ...args, size, width, height }
)
  .then(b => {
    parentPort.postMessage(b)
    process.exit()
  })
  .catch(error => process.exit(error))
