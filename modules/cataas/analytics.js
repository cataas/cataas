module.exports = {
  sendAnalytic (req) {
    if (req.headers['user-agent']) {
      fetch('https://analytics.boutdecode.fr/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': req.headers['user-agent']
        },
        body: JSON.stringify({
          payload: {
            website: '48df2664-03fc-478e-a271-1baea1695dcf',
            url: req.url,
            referrer: req.headers.referer || '',
            hostname: req.headers.host
          },
          type: 'event'
        })
      })
    }
  }
}
