import * as Sentry from '@sentry/node'

export default () => {
  const sampleRate = Number(process.env.SENTRY_SAMPLE_RATE ?? 0.1)

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: sampleRate,
    profilesSampleRate: sampleRate,
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
