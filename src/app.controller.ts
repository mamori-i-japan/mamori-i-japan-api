import { Controller, Get, Request, UseGuards } from '@nestjs/common'
import { AppService } from './app.service'
import { FirebaseNormalUserValidateGuard } from './auth/guards/firebase-normal-user-validate.guard'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    console.log('WIP - getHello function')

    return this.appService.getHello()
  }

  @UseGuards(FirebaseNormalUserValidateGuard)
  @Get('profile')
  getProfileFirebase(@Request() req) {
    return req.user
  }
}
