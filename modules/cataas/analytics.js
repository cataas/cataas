const fetch = require('node-fetch')
const config = require('../../src/shared/configuration/configurator')

module.exports = {
  sendAnalytic (req) {
    if (req.headers['user-agent']) {
      try {
        fetch('https://analytics.boutdecode.fr/api/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': req.headers['user-agent']
          },
          body: JSON.stringify({
            payload: {
              website: config.get('analytics.websiteId', process.env.ANALYTICS_ID),
              url: req.url,
              referrer: req.headers.referer || '',
              hostname: req.headers.host
            },
            type: 'event'
          })
        })
      } catch (e) {
        console.error(e)
      }
    }
  }
}
