import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survery-result-repository'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'
import { mockSurveyResultModel } from '../../domain/test/mock-survey'

export const mockSaveResultSurveySurveyRepository = (): SaveSurveyResultRepository => {
  class SaveResultSurveySurveyRepositoryStub implements SaveSurveyResultRepository {
    async save (model: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return await Promise.resolve(mockSurveyResultModel())
    }
  }
  return new SaveResultSurveySurveyRepositoryStub()
}
