const fetch = require('node-fetch')
const config = require('../../src/shared/configuration/configurator')
const https = require("https");

module.exports = {
  async sendAnalytic (req) {
    if (req.headers['user-agent']) {
      try {
        const response = await fetch('https://analytics.boutdecode.fr/api/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': req.headers['user-agent']
          },
          agent: new https.Agent({ rejectUnauthorized: false }),
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
