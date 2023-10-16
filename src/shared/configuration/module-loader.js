const fs = require('node:fs')
const path = require('node:path')

const modulesFolder = process.env.MODULES_FOLDER || (path.resolve(process.cwd(), 'modules'))
module.exports = {
  configure (app) {
    try {
      fs.readdirSync(modulesFolder).forEach(folder => {
        if (fs.existsSync(`${modulesFolder}/${folder}/config/index.js`)) {
          // eslint-disable-next-line no-console
          console.log(`⚙️ Configuring "${folder}" module...`)
          require(`${modulesFolder}/${folder}/config/index.js`)(app)
        }
      })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('⛔️ Module loader throw error : ', error)
    }
  },

  load (app) {
    try {
      fs.readdirSync(modulesFolder).forEach(folder => {
        if (fs.existsSync(`${modulesFolder}/${folder}/index.js`)) {
          // eslint-disable-next-line no-console
          console.log(`📦 Loading "${folder}" module...`)
          require(`${modulesFolder}/${folder}/index.js`)(app)
        }
      })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('⛔️ Module loader throw error : ', error)
    }
  }
}
