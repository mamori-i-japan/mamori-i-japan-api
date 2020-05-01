import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { UsersService } from '../users/users.service'
import { AdminsService } from '../admins/admins.service'
import { FirebaseService } from '../shared/firebase/firebase.service'

describe('AuthService', () => {
  let service: AuthService
  const usersService = { findAll: () => ['test'] }
  const adminsService = { findAll: () => ['test'] }
  const firebaseService = {}

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UsersService, AdminsService, FirebaseService],
    })
      .overrideProvider(UsersService)
      .useValue(usersService)
      .overrideProvider(AdminsService)
      .useValue(adminsService)
      .overrideProvider(FirebaseService)
      .useValue(firebaseService)
      .compile()

    service = module.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
