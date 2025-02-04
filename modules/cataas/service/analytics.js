import https from 'node:https'

export const sendAnalytic = (req) => {
  if (req.headers['user-agent']) {
    try {
      fetch('https://analytics.boutdecode.fr/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': req.headers['user-agent']
        },
        agent: new https.Agent({ rejectUnauthorized: false }),
        body: JSON.stringify({
          payload: {
            website: process.env.ANALYTICS_ID,
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
