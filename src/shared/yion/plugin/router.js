const config = require('../../configuration/configurator')

module.exports = {
  type: 'router',
  handle: (req, res, app, next) => {
    req.path = (name, params = {}, queries = {}, absolute = false) => {
      const hostname = config.get('application.hostname' || '')
      const route = app.findRoute(name)
      if (!route) {
        throw new Error(`Route ${name} not found`)
      }

      const locale = req.attributes.locale || config.get('translation.fallback', 'en')
      const path = route.generatePath({ locale, ...params }, queries)

      return absolute ? `${hostname}${path}` : path
    }

    next()
  }
}
