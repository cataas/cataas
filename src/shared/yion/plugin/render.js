const path = require('node:path')
const pug = require('pug')
const Intl = require('intl')
const { trans } = require('@boutdecode/i18n')

const config = require('../../../../config/config')
const { asset } = require('../../asset/asset')

module.exports = {
  type: 'renderer',
  handle (req, res, app, next) {
    const templateDirectory = config.get('pug.templateDirectory', path.resolve(process.cwd(), 'templates'))
    const templateFunctions = {
      get canonical () {
        return req.path(res.routeMatched.name, { ...req.params, locale: config.get('translation.fallback', 'en') }, req.query, true)
      },

      get locale () {
        return req.attributes.locale || config.get('translation.fallback', 'en')
      },

      get locales () {
        return config.get('translation.locales', [])
      },

      get route () {
        return res.routeMatched
      },

      get analytics() {
        return {
          url: `${config.get('analytics.url')}/script.js`,
          websiteId: config.get('analytics.websiteId'),
        }
      },

      get url () {
        return config.get('application.hostname') + req.uri
      },

      query (key = null, def = null) {
        return req.query[key] ? req.query[key] : (def || req.query)
      },

      is (name) {
        return name === res.routeMatched.name
      },

      path (name, params = {}, queries = {}, absolute = false) {
        const route = app.findRoute(name)

        if (route) {
          return route.generatePath({ locale: req.attributes.locale, ...params }, queries, absolute)
        }

        return null
      },

      asset (assetName) {
        return asset(assetName)
      },

      trans (key, options) {
        return trans(key, { ...options, lng: req.attributes.locale })
      },

      date (date, options = {}) {
        const df = new Intl.DateTimeFormat(req.attributes.locale, {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          ...options
        })

        return df.format(date)
      },

      time (date, options = {}) {
        const df = new Intl.DateTimeFormat(req.attributes.locale, {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          ...options
        })

        return df.format(date)
      },

      flash () {
        const messages = {}
        for (const level in req.session.flashMessages) {
          messages[level] = req.session.flashMessages[level]
        }
        req.session.clearFlash()

        return messages
      },

      settings (key) {
        return trans(config.get(`application.${key}`), { lng: req.attributes.locale })
      }
    }

    res.render = (
      templateName,
      data = {},
      status = 200,
      headers = { 'Content-Type': 'text/html', 'Content-Encoding': 'gzip' }
    ) => {
      for (const name in headers) {
        res.set(name, headers[name])
      }

      try {
        res
          .status(status)
          .send(
            pug.renderFile(
              `${templateDirectory}/${templateName}.pug`,
              {
                ...templateFunctions,
                ...data,
                ...config.get('pug.globals', {})
              }
            )
          )
      } catch (e) {
        console.error(e)

        res.status(500).send(e.message)
      }
    }

    next()
  }
}
