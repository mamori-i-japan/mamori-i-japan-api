import { Test, TestingModule } from '@nestjs/testing'
import { UsersService } from './users.service'
import { UsersRepository } from './users.repository'
import { ConfigService } from '@nestjs/config'

describe('UsersService', () => {
  let service: UsersService
  const usersRepository = { findAll: () => ['test'] }
  const configService = { findAll: () => ['test'] }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, UsersRepository, ConfigService],
    })
      .overrideProvider(UsersRepository)
      .useValue(usersRepository)
      .overrideProvider(ConfigService)
      .useValue(configService)
      .compile()

    service = module.get<UsersService>(UsersService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
