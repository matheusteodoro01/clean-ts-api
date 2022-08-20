import { AddSurvey, AddSurveyParams, AddSurveyRepository } from './db-add-survey-protocols'

export class DbAddSuvery implements AddSurvey {
  constructor (private readonly addSurveyRepository: AddSurveyRepository) {}
  async add (data: AddSurveyParams): Promise<void> {
    await this.addSurveyRepository.add(data)
    return await Promise.resolve(null)
  }
}
