const { verifyToken } = require('../../src/shared/security/crypto')
const { signIn, signUp } = require('./operation/security')

module.exports = ({ api }) => {
  api.on('authentication:jwt', (req, res, next, config, scopes, token) => {
    try {
      req.attributes.user = verifyToken(token)

      return true
    } catch (error) {
      return false
    }
  })

  api.on('api:security:sign-in', async (req, res) => {
    try {
      res.send(await signIn(req.body))
    } catch (error) {
      res.send({ message: error.message }, error.code)
    }
  })

  api.on('api:security:sign-up', async (req, res) => {
    try {
      await signUp(req.body)

      return res.send(null, 201)
    } catch (error) {
      res.send({ message: error.message }, error.code)
    }
  })
}
