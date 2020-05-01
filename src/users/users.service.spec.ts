import { Test, TestingModule } from '@nestjs/testing'
import { UsersService } from './users.service'
import { UsersRepository } from './users.repository'
import { FirebaseService } from '../shared/firebase/firebase.service'

describe('UsersService', () => {
  let service: UsersService
  const usersRepository = { findAll: () => ['test'] }
  const firebaseService = {}

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, UsersRepository, FirebaseService],
    })
      .overrideProvider(UsersRepository)
      .useValue(usersRepository)
      .overrideProvider(FirebaseService)
      .useValue(firebaseService)
      .compile()

    service = module.get<UsersService>(UsersService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
