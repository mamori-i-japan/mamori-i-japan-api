import { Injectable } from '@nestjs/common'
import { UsersRepository } from './users.repository'
import { CreateUserDto, CreateUserProfileDto, UpdateUserProfileDto } from './dto/create-user.dto'
import { CreateDiagnosisKeysDto } from './dto/create-diagnosis-keys.dto'
import { User, UserProfile } from './classes/user.class'
import { FirebaseService } from '../shared/firebase/firebase.service'

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository, private firebaseService: FirebaseService) {}

  createOneUser(user: CreateUserDto, userProfile?: CreateUserProfileDto) {
    return this.usersRepository.createOne(user, userProfile)
  }

  async findOneUserById(userId: string): Promise<User | undefined> {
    return this.usersRepository.findOneUserById(userId)
  }

  async findOneUserProfileById(userId: string): Promise<UserProfile | undefined> {
    return this.usersRepository.findOneUserProfileById(userId)
  }

  /**
   * Updates user profile.
   * @param updateUserProfileDto: UpdateUserProfileDto
   */
  async updateUserProfile(updateUserProfileDto: UpdateUserProfileDto): Promise<void> {
    if (updateUserProfileDto.prefecture) {
      await this.usersRepository.updateUserProfilePrefecture(updateUserProfileDto)
    }
  }

  async createDiagnosisKeys(createDiagnosisKeys: CreateDiagnosisKeysDto): Promise<void> {
    return this.usersRepository.createDiagnosisKeys(createDiagnosisKeys)
  }

  async uploadDiagnosisKeysList(): Promise<void> {
    return this.usersRepository.uploadDiagnosisKeysList()
  }
}
