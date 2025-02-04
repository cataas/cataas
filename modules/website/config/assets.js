import path from 'node:path'

export default ({ app, config }) => {
  app.link('/modules', path.resolve(process.cwd(), 'node_modules'), config.cache)
  app.link('/assets', path.resolve(process.cwd(), 'public'), config.cache)
  app.link('/build', path.resolve(process.cwd(), 'public/build'), config.cache)
}
