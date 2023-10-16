const path = require('node:path')

const assetsFolder = process.env.ASSETS_FOLDER || (path.resolve(process.cwd(), 'public'))
module.exports = {
  asset (assetName) {
    const manifest = require(`${assetsFolder}/manifest.json`)

    return manifest[assetName] ? `/${manifest[assetName].file}` : null
  }
}
