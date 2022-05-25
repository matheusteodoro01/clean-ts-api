import { ServerError, UnautrorizedError } from '../../errors'
import { HttpResponse } from '../../protocols/http'

export const unthorized = (): HttpResponse => ({

  statusCode: 401,
  body: new UnautrorizedError()

})
export const badRequest = (error: Error): HttpResponse => ({

  statusCode: 400,
  body: error

})

export const serverError = (error: Error): HttpResponse => ({

  statusCode: 500,
  body: new ServerError(error.stack as string)

})

export const ok = (data: any): HttpResponse => ({

  statusCode: 200,
  body: data

})