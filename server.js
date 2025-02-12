import sentry from './plugins/sentry.js'
import store from './plugins/store.js'
import { bootstrap } from '@boutdecode/yion'

bootstrap({
  plugins: [sentry, store],
  config: {
    application: {
      hostname: process.env.HOST || 'http://localhost',
      metaTitle: 'Cat as a service (CATAAS)',
      metaDescription: 'Cat as a service (CATAAS) is a REST API to spread peace and love (or not) thanks to cats.',
      metaAuthor: 'Kevin Balicot <kevinbalicot@gmail.com>',
      analytics: {
        url: 'https://analytics.boutdecode.fr/getinfo',
        websiteId: process.env.ANALYTICS_ID
      },
    },
    cache: {
      'Cache-Control': 'public, max-age=' + (86400 * 30),
      'Content-Encoding': 'gzip',
      ETag: Date.now(),
      Vary: 'Accept-Encoding'
    },
    assets: true,
    cors: {
      origin: process.env.CORS || '*',
      headers: 'X-Requested-With, Content-Type, Accept, Origin, Authorization',
      methods: 'GET, POST, PUT, DELETE, OPTIONS'
    },
    api: {
      apiPrefix: '',
      info: {
        version: '1.0.0',
        title: 'Cat as a service (CATAAS)',
        description: 'Cat as a service (CATAAS) is a REST API to spread peace and love (or not) thanks to cats.',
      },
      tags: [
        { name: 'Cats', description: 'Cataas API' },
        { name: 'API', description: 'Public API' },
      ]
    },
    view: {
      render: 'pug',
      folder: 'templates',
      globals: {}
    },
    translation: {
      fallback: process.env.LOCALE,
      locales: ['fr', 'en']
    },
    modules: {
      modules: ['website', 'cataas'],
      folder: 'modules'
    }
  }
})
