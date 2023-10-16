export default class Token {
  constructor (access, refresh = null) {
    const parts = access.split('.')

    if (parts.length < 3) {
      throw new Error('Invalid access token')
    }

    try {
      this.header = JSON.parse(window.atob(parts[0]))
    } catch (error) {
      throw new Error('Access token header is invalid')
    }

    try {
      this.payload = JSON.parse(this.decodeBase64(parts[1]))
    } catch (error) {
      throw new Error('Access token payload is invalid')
    }

    this.payload.iat = new Date(this.payload.iat * 1000)
    this.payload.nbf = new Date(this.payload.nbf * 1000)
    this.payload.exp = new Date(this.payload.exp * 1000)

    this.signature = parts[2]
    this.access = access
    this.refresh = refresh

    Object.freeze(this)
  }

  isGranted (scope) {
    return this.payload.scopes.indexOf(scope) > -1
  }

  isExpired () {
    return this.payload.exp.getTime() <= Date.now()
  }

  toString () {
    return this.access
  }

  decodeBase64 (s) {
    const e = {}; let i; let b = 0; let c; let x; let l = 0; let a; let r = ''; const w = String.fromCharCode; const L = s.length
    const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
    for (i = 0; i < 64; i++) { e[A.charAt(i)] = i }
    for (x = 0; x < L; x++) {
      c = e[s.charAt(x)]; b = (b << 6) + c; l += 6
      while (l >= 8) { ((a = (b >>> (l -= 8)) & 0xff) || (x < (L - 2))) && (r += w(a)) }
    }
    return r
  }
}
