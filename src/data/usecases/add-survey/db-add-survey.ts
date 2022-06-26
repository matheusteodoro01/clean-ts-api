import { AddSurvey, AddSurveyModel, AddSurveyRepository } from './db-add-survey-protocols'

export class DbAddSuvery implements AddSurvey {
  constructor (private readonly addSurveyRepository: AddSurveyRepository) {}
  async add (data: AddSurveyModel): Promise<void> {
    await this.addSurveyRepository.add(data)
    return await Promise.resolve(null)
  }
}
