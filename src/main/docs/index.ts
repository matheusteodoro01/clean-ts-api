import { loginPath, signUpPath, surveysPath, surveyResultPath } from './paths'
import { badRequest, unauthorized, serverError, notFound, forbidden } from './components'
import { accountSchema, loginParamsSchema, errorSchema, surveysSchema, surveySchema, surveyAnswerSchema, apiKeyAuthSchema, signUpParamsSchema, addSurveyParamsSchema, surveyResultParamsSchema } from './schemas'
import { surveyResultSchema } from './schemas/survey-result-schema'

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
    '/signup': signUpPath,
    '/surveys': surveysPath,
    '/surveys/{surveyId}/results': surveyResultPath
  },
  schemas: {
    account: accountSchema,
    survey: surveySchema,
    surveyAnswer: surveyAnswerSchema,
    surveys: surveysSchema,
    surveyResult: surveyResultSchema,
    addSurveyParams: addSurveyParamsSchema,
    surveyResultParams: surveyResultParamsSchema,
    signUpParams: signUpParamsSchema,
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
