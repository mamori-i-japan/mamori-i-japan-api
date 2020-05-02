import { Injectable, BadRequestException } from '@nestjs/common'
import { UsersRepository } from './users.repository'
import { CreateUserDto, CreateUserProfileDto, UpdateUserProfileDto } from './dto/create-user.dto'
import { User, UserProfile } from './classes/user.class'
import { CreateDiagnosisKeysForOrgDto } from './dto/create-diagnosis-keys.dto'
import { FirebaseService } from '../shared/firebase/firebase.service'
import { OrganizationsService } from '../organizations/organizations.service'

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private firebaseService: FirebaseService,
    private organizationsService: OrganizationsService
  ) {}

  createOneUser(user: CreateUserDto, userProfile?: CreateUserProfileDto) {
    return this.usersRepository.createOne(user, userProfile)
  }

  async findOneUserById(userId: string): Promise<User | undefined> {
    return this.usersRepository.findOneUserById(userId)
  }

  async findOneUserProfileById(userId: string): Promise<UserProfile | undefined> {
    return this.usersRepository.findOneUserProfileById(userId)
  }

  async uploadDiagnosisKeysForOrgList(): Promise<void> {
    return this.usersRepository.uploadDiagnosisKeysForOrgList()
  }

  /**
   * Updates user profile. Takes care of multiple cases for organization code update.
   * Organization code update case:
   * - Check organization code validity.
   * - Add organization code to user profile and add custom claims to JWT.
   * - In case of empty string payload, remove organization code from user profile and add custom claims.
   * @param updateUserProfileDto: UpdateUserProfileDto
   */
  async updateUserProfile(updateUserProfileDto: UpdateUserProfileDto): Promise<void> {
    if (updateUserProfileDto.prefecture) {
      await this.usersRepository.updateUserProfilePrefecture(updateUserProfileDto)
    }

    console.log('updateUserProfileDto : ', updateUserProfileDto)

    if (updateUserProfileDto.organizationCode) {
      const isOrganizationCodeValid = await this.organizationsService.isOrganizationCodeValid(
        updateUserProfileDto.organizationCode
      )
      if (!isOrganizationCodeValid) {
        throw new BadRequestException('Organization code does not match any existing organization')
      }

      // 2. Fetch user from DB and check for existing `orgCode`.

      const userProfile = await this.findOneUserProfileById(updateUserProfileDto.userId)
      console.log('userProfile : ', userProfile)

      //    A - If existing DB value is empty, then add it to DB and also add custom claim.

      //    B - If existing DB value is same as payload, do nothing.

      //    C - If existing DB value is different from payload:
      //        - Perform step D defined below (delete org code).
      //        - Then, Perform step A.
    }

    if (updateUserProfileDto.organizationCode === '') {
      await this.removeUserOrganizationCode(updateUserProfileDto.userId)
    }

    console.log('---- FINISH UPDATE FUNCTION')
    return
  }

  /**
   * Removes the organization code from user profile DB and user JWT custom claim.
   * @param userId: string
   */
  private async removeUserOrganizationCode(userId: string): Promise<void> {
    await this.usersRepository.deleteUserProfileOrganizationCode(userId)

    // Removes the custom claim organization code from user JWT.
    await this.firebaseService.DeleteCustomClaims(userId, ['organizationCode'])
  }

  async createDiagnosisKeysForOrg(
    createDiagnosisKeysForOrg: CreateDiagnosisKeysForOrgDto
  ): Promise<void> {
    return this.usersRepository.createDiagnosisKeysForOrg(createDiagnosisKeysForOrg)
  }
}
