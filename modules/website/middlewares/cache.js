export const context = 'app'

export const handler = ({ req, res, config }, next) => {
  if (req.headers['if-none-match'] && req.headers['if-none-match'] === config.cache.ETag) {
    return res.status(304).send()
  }

  next()
}
