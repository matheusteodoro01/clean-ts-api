import {
  accountSchema,
  loginParamsSchema,
  errorSchema,
  surveysSchema,
  surveySchema,
  surveyAnswerSchema,
  apiKeyAuthSchema,
  signUpParamsSchema,
  addSurveyParamsSchema,
  surveyResultParamsSchema,
  surveyResultSchema
} from './schemas/'

export default {
  account: accountSchema,
  survey: surveySchema,
  surveyAnswer: surveyAnswerSchema,
  surveys: surveysSchema,
  surveyResult: surveyResultSchema,
  addSurveyParams: addSurveyParamsSchema,
  surveyResultParams: surveyResultParamsSchema,
  signUpParams: signUpParamsSchema,
  loginParams: loginParamsSchema,
  error: errorSchema,
  apiKeyAuthSchema
}
