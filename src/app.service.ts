import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World! NestJS v7 running on AWS Lambda via Serverless Framework!'
  }
}
