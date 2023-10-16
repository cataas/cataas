const apiConfigGenerator = require('../../../src/shared/api/config-generator')

apiConfigGenerator.addSecurity('jwt', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT'
})

apiConfigGenerator.addSchema('SignIn', {
  required: ['name', 'password'],
  type: 'object',
  properties: {
    username: { type: 'string' },
    password: { type: 'string' }
  }
})

apiConfigGenerator.addSchema('SignUp', {
  required: ['name', 'password', 'mail', 'secret'],
  type: 'object',
  properties: {
    username: { type: 'string' },
    password: { type: 'string' },
    email: { type: 'string' },
    secret: { type: 'string' }
  }
})

apiConfigGenerator.addSchema('Token', {
  type: 'object',
  properties: {
    token: { type: 'string' }
  }
})
