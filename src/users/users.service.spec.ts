import { Test, TestingModule } from '@nestjs/testing'
import { UsersService } from './users.service'
import { UsersRepository } from './users.repository'
import { FirebaseService } from '../shared/firebase/firebase.service'
import { OrganizationsService } from '../organizations/organizations.service'

describe('UsersService', () => {
  let service: UsersService
  const usersRepository = { findAll: () => ['test'] }
  const firebaseService = {}
  const organizationsService = {}

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, UsersRepository, FirebaseService, OrganizationsService],
    })
      .overrideProvider(UsersRepository)
      .useValue(usersRepository)
      .overrideProvider(FirebaseService)
      .useValue(firebaseService)
      .overrideProvider(OrganizationsService)
      .useValue(organizationsService)
      .compile()

    service = module.get<UsersService>(UsersService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
