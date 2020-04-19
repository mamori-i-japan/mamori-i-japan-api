import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { UsersService } from './users/users.service'

exports.handler = async () => {
  const app = await NestFactory.create(AppModule)
  await app.init()

  const usersService = app.get(UsersService)
  return usersService.uploadPositiveList()
}
