export default class Requester {
  constructor (apiUrl, auth = null) {
    this.apiUrl = apiUrl
    this.auth = auth
  }

  get (path, params = {}, headers = {}) {
    return this._request(path, 'GET', params, headers)
  }

  post (path, params = {}, headers = {}) {
    return this._request(path, 'POST', params, headers)
  }

  patch (path, params = {}, headers = {}) {
    return this._request(path, 'PATCH', params, headers)
  }

  put (path, params = {}, headers = {}) {
    return this._request(path, 'PUT', params, headers)
  }

  delete (path, params = {}, headers = {}) {
    return this._request(path, 'DELETE', params, headers)
  }

  query (path, method = 'GET', params = {}, headers = {}) {
    return this._request(path, method, params, headers)
  }

  _prepareParams (params = {}) {
    const result = []
    for (const key in params) {
      if (typeof params[key] === 'object') {
        for (const param in params[key]) {
          result.push(`${key}[${param}]=${params[key][param]}`)
        }
      } else {
        result.push(`${key}=${params[key]}`)
      }
    }

    return result.join('&')
  }

  _prepareBody (form, headers) {
    const formData = new FormData(form)
    if (this._isJson(headers)) {
      const data = {}
      for (const pair of formData.entries()) {
        data[pair[0]] = pair[1]
      }

      return JSON.stringify(data)
    }

    return formData
  }

  _prepareHeaders (headers = {}, alreadyHeader = null) {
    let h = alreadyHeader
    if (!alreadyHeader) {
      h = new Headers()
    }

    for (const key in headers) {
      h.append(key, headers[key])
    }

    return h
  }

  _isJson (headers) {
    return headers.has('Content-Type') && headers.get('Content-Type').match('application/json')
  }

  _request (path, method = 'GET', params = {}, headers = {}) {
    let uri
    let body

    if (this.auth && this.auth.isAuthenticated()) {
      headers = this._prepareHeaders(headers, this.auth.getAuthHeader())
    } else {
      headers = this._prepareHeaders(headers)
    }

    if (method === 'GET') {
      uri = `${this.apiUrl}${path}?${this._prepareParams(params)}`
    } else {
      uri = `${this.apiUrl}${path}`

      if (params instanceof HTMLFormElement) {
        body = this._prepareBody(params, headers)
      } else if (this._isJson(headers)) {
        body = JSON.stringify(params)
      } else {
        headers.append('Content-Type', 'application/x-www-form-urlencoded')
        body = this._prepareParams(params)
      }
    }

    return fetch(uri, { method, body, headers })
      .then(res => {
        if (res.status === 401 && this.auth) {
          // window.location = '/admin'
        }

        if (!res.ok) {
          return res.json().then(data => Promise.reject(data))
        }

        return res.status === 204 ? null : res.json()
      })
  }
}
