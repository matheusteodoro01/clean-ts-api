import { loginPath, surveysPath } from './paths'
import { badRequest, unauthorized, serverError, notFound, forbidden } from './components'
import { accountSchema, loginParamsSchema, errorSchema, surveysSchema, surveySchema, surveyAnswerSchema, apiKeyAuthSchema } from './schemas'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description: 'API para realizar enquetes entre programadores',
    version: '1.0.0'
  },
  license: {
    name: 'ISC',
    url: 'https://opensource.org/licenses/ISC'
  },
  contact: {
    name: 'Matheus Teodoro',
    email: 'matheus.apteodoro@gmail.com',
    url: 'https://github.com/matheusteodoro01'
  },
  servers: [{
    url: '/api'
  }],
  tags: [{
    name: 'Login'
  }, {
    name: 'Enquete'
  }],
  paths: {
    '/login': loginPath,
    '/surveys': surveysPath
  },
  schemas: {
    account: accountSchema,
    survey: surveySchema,
    surveyAnswer: surveyAnswerSchema,
    surveys: surveysSchema,
    loginParams: loginParamsSchema,
    error: errorSchema
  },
  components: {
    securitySchemes: { apiKeyAuth: apiKeyAuthSchema },
    badRequest,
    unauthorized,
    forbidden,
    notFound,
    serverError
  }
}
