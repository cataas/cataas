import Token from './token'

export default class Auth {
  constructor (clientId) {
    this.clientId = clientId

    this._accessToken = localStorage.getItem(this.clientId + '-access-token') || null
    this._refreshToken = localStorage.getItem(this.clientId + '-refresh-token') || null
  }

  set accessToken (token) {
    if (token) {
      localStorage.removeItem(this.clientId + '-access-token')
      localStorage.setItem(this.clientId + '-access-token', token)
      this._accessToken = token
    }
  }

  get accessToken () {
    return this._accessToken
  }

  set refreshToken (token) {
    if (token) {
      localStorage.removeItem(this.clientId + '-refresh-token')
      localStorage.setItem(this.clientId + '-refresh-token', token)
      this._refreshToken = token
    }
  }

  get refreshToken () {
    return this._refreshToken
  }

  isAuthenticated () {
    return !!this._accessToken
  }

  logout () {
    this._accessToken = null
    this._refreshToken = null
    localStorage.removeItem(this.clientId + '-access-token')
    localStorage.removeItem(this.clientId + '-refresh-token')

    window.location.reload()
  }

  getAuthHeader () {
    const headers = new Headers()
    headers.append('Authorization', `Bearer ${this._accessToken || ''}`)

    return headers
  }

  get token () {
    if (this._accessToken !== null && this._refreshToken !== null) {
      return new Token(this._accessToken, this._refreshToken)
    }

    return null
  }
}
