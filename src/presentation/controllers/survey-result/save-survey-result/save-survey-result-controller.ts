import { InvalidParamError } from '@/presentation/errors'
import { Controller, forbidden, HttpRequest, HttpResponse, LoadSurveyById } from './save-survey-result-controller-protocols'

export class SaveSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { params } = httpRequest

    const survey = await this.loadSurveyById.loadById(params.surveyId)
    if (!survey) return forbidden(new InvalidParamError('surveyId'))
    return await Promise.resolve(null)
  }
}
