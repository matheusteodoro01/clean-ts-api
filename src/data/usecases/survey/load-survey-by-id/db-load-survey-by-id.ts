import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-idrepository'
import { SurveyModel } from '@/domain/models/survey'
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'

export class DbLoadSurveyById implements LoadSurveyById {
  constructor (private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository) {}
  async loadById (id: string): Promise<SurveyModel> {
    const surveys = await this.loadSurveyByIdRepository.loadById(id)
    return surveys
  }
}
