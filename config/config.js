require('dotenv').config()

const path = require('node:path')
const configurator = require('./../src/shared/configuration/configurator')

configurator.set({
  application: {
    hostname: process.env.HOST || 'http://localhost',
    metaTitle: 'Cat as a service (CATAAS)',
    metaDescription: 'Cat as a service (CATAAS) is a REST API to spread peace and love (or not) thanks to cats.',
    metaAuthor: 'Kevin Balicot <kevinbalicot@gmail.com>'
  },
  cache: {
    'Cache-Control': 'public, max-age=' + (86400 * 30),
    'Content-Encoding': 'gzip',
    ETag: Date.now(),
    Vary: 'Accept-Encoding'
  },
  api: {
    version: '1.0.0',
    title: 'Cat as a service (CATAAS)',
    description: 'Cat as a service (CATAAS) is a REST API to spread peace and love (or not) thanks to cats.',
    tags: [
      { name: 'Cats', description: 'Cataas API' },
      { name: 'API', description: 'Public API' },
      { name: 'Security', description: 'Security' },
      { name: 'Admin', description: 'Admin API' },
    ]
  },
  data: {
    dataFolder: path.resolve(process.cwd(), 'data'),
    stores: ['cats', 'users']
  },
  pug: {
    templateDirectory: path.resolve(process.cwd(), 'templates'),
    globals: {}
  },
  translation: {
    fallback: process.env.LOCALE,
    locales: ['fr', 'en']
  },
  analytics: {
    url: 'https://analytics.boutdecode.fr',
    websiteId: process.env.ANALYTICS_ID
  }
})

module.exports = configurator
