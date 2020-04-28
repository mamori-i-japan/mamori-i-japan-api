import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { AppLogger } from '../logger/logger.service'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private appLogger: AppLogger) {
    this.appLogger.setContext(LoggingInterceptor.name)
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest()
    const method = request.method
    const url = request.originalUrl
    this.appLogger.debug(`method: ${method} | url: ${url}`)

    const now = Date.now()
    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse()
        const statusCode = response.statusCode

        const responseTime = Date.now() - now
        this.appLogger.debug(
          `method: ${method} | url: ${url} | statusCode: ${statusCode} | responseTime: ${responseTime}ms`
        )
      })
    )
  }
}
