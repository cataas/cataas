const apiConfigGenerator = require('../../../src/shared/api/config-generator')

apiConfigGenerator.addPath('/security/sign-in', {
  operationId: 'api:security:sign-in',
  method: 'post',
  tags: ['Security'],
  requestBody: {
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/SignIn'
        }
      }
    }
  },
  responses: {
    200: {
      description: 'Authenticated',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/Token'
          }
        }
      }
    },

    401: {
      description: 'Unauthorized'
    }
  }
})

apiConfigGenerator.addPath('/security/sign-up', {
  operationId: 'api:security:sign-up',
  method: 'post',
  tags: ['Security'],
  requestBody: {
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/SignUp'
        }
      }
    }
  },
  responses: {
    201: {
      description: 'Registered'
    },

    400: {
      description: 'Bad request'
    }
  }
})
