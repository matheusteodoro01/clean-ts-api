import {
  loginPath,
  signUpPath,
  surveysPath,
  surveyResultPath
} from './paths/'

export default {
  '/login': loginPath,
  '/signup': signUpPath,
  '/surveys': surveysPath,
  '/surveys/{surveyId}/results': surveyResultPath
}
