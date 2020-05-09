import { v4 as uuidv4 } from 'uuid'
import { REQUEST_ID_TOKEN_HEADER } from '../constants'
import { Request, Response } from 'express'

export function RequestIdMiddleware(request: Request, response: Response, next: Function): void {
  if (!request.headers[REQUEST_ID_TOKEN_HEADER]) {
    request.headers[REQUEST_ID_TOKEN_HEADER] = uuidv4()
  }
  response.set(REQUEST_ID_TOKEN_HEADER, request.headers[REQUEST_ID_TOKEN_HEADER])

  next()
}
