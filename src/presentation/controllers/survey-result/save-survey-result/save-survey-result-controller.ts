
import { InvalidParamError } from '@/presentation/errors'
import { Controller, forbidden, HttpRequest, HttpResponse, LoadSurveyById, ok, SaveSurveyResult, serverError } from './save-survey-result-controller-protocols'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveyId = httpRequest.params.surveyId
      const answer = httpRequest.body.answer
      const accountId = httpRequest.accountId
      const survey = await this.loadSurveyById.loadById(surveyId)
      if (survey) {
        const answers = survey.answers.map(answer => answer.answer)
        if (!answers.includes(answer)) return forbidden(new InvalidParamError('answer'))
      } else { return forbidden(new InvalidParamError('surveyId')) }
      const surveySResult = await this.saveSurveyResult.save({ accountId, surveyId, answer, date: new Date() })
      return ok(surveySResult)
    } catch (error) {
      return serverError(new Error(error))
    }
  }
}
