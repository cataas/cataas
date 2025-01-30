const { createApi } = require('@tamia-web/tamia')
const apiDocPlugin = require('@tamia-web/doc-plugin')
const { createApp, createServer } = require('yion')
const Sentry = require('@sentry/node')
const bodyParser = require('yion-body-parser')
const sessionPlugin = require('@boutdecode/session/yion/session-plugin')
const i18nPlugin = require('@boutdecode/i18n/yion/i18n-plugin')
const encodingPlugin = require('@boutdecode/encoding/yion/encoding-plugin')

const routerPlugin = require('./src/shared/yion/plugin/router')
const renderPlugin = require('./src/shared/yion/plugin/render')
const apiConfigGenerator = require('./src/shared/api/config-generator')
const moduleLoader = require('./src/shared/configuration/module-loader')

require('./config/config')

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: process.env.SENTRY_SAMPLE_RATE || 1.0,
})

moduleLoader.configure()

const app = createApp()
const server = createServer(app, [renderPlugin, routerPlugin, sessionPlugin, i18nPlugin, encodingPlugin, bodyParser])
app.api = createApi(apiConfigGenerator.config, { prefix: '', plugins: [apiDocPlugin('')] })

app.use((req, res, next) => {
  try {
    next()
  } catch (e) {
    Sentry.captureException(e)
    next()
  }
})

moduleLoader.load(app)

app.group('')
  .use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', process.env.CORS || '*' )
    res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
    res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    if (req.method === 'OPTIONS') {
      return res.send()
    }

    next()
  })
  .use(app.api.middleware)

server.listen(process.env.NODE_PORT)
    .on('listening', () => console.log(`🤖 Server starting on port ${process.env.NODE_PORT}.`))
