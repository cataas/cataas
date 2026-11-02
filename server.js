import sentry from './plugins/sentry.js'
import store from './plugins/store.js'
import { bootstrap } from '@boutdecode/yion'

bootstrap({
  plugins: [sentry, store],
  config: {
    application: {
      hostname: process.env.HOST || 'http://localhost',
      metaTitle: 'meta.title',
      metaDescription: 'meta.description',
      metaAuthor: 'Kevin Balicot <kevinbalicot@gmail.com>',
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
        title: 'CATAAS — Cat as a Service',
        description: 'CATAAS — Cat as a Service — serves random cat images and GIFs, with text, filters and tags. One link, one cat. That\'s it.',
      },
      tags: [
        { name: 'Cats', description: 'CATAAS API' },
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
      modules: ['website', 'cataas', 'admin'],
      folder: 'modules'
    }
  }
})
