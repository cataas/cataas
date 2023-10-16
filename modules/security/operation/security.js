const { insert, findOne } = require('../../../src/shared/store/datastore')
const { hashPassword, createToken } = require('../../../src/shared/security/crypto')
const HttpError = require('../../../src/shared/http/http-error')

module.exports = {
  async signIn ({ username, password }) {
    const user = await findOne('users', { username, password: hashPassword(password) })
    if (!user) {
      throw new HttpError('Unauthorized', 401)
    }

    return { token: createToken(user.username) }
  },

  async signUp ({ username, email, password, secret }) {
    if (process.env.SECURITY_SALT !== secret) {
      throw new HttpError('Unauthorized', 401)
    }

    const alreadyUser = await findOne('users', { username })
    if (alreadyUser) {
      throw new HttpError(`User ${username} already exists`, 400)
    }

    return insert('users', { username, email, password: hashPassword(password) })
  }
}
