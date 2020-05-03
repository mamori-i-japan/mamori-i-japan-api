import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common'
import { AppLogger } from '../logger/logger.service'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private appLogger: AppLogger) {
    this.appLogger.setContext(AllExceptionsFilter.name)
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()

    if (exception instanceof HttpException) {
      const status = exception.getStatus()
      const errorMessage = exception.getResponse() as HttpException

      const responseObject = {
        statusCode: status,
        timestamp: new Date().toISOString(),
        url: request.url,
        ...errorMessage,
      }

      this.appLogger.debug(JSON.stringify({ status, responseObject }))
      return response.status(status).json(responseObject)
    }

    // Log the stack for non-HttpException errors
    if (exception instanceof Error) {
      this.appLogger.error(exception.message, exception.stack, exception.name)
    } else {
      console.log(exception)
    }

    const status = HttpStatus.INTERNAL_SERVER_ERROR
    const responseObject = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      url: request.url,
    }

    this.appLogger.debug(JSON.stringify({ status, responseObject }))
    return response.status(status).json(responseObject)
  }
}
