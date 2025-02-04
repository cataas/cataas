import * as Sentry from '@sentry/node'

export default () => {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: process.env.SENTRY_SAMPLE_RATE || 1.0,
    profilesSampleRate: process.env.SENTRY_SAMPLE_RATE || 1.0,
  })

  return (context, next) => {
    try {
      next()
    } catch (e) {
      Sentry.captureException(e)
      next()
    }
  }
}
