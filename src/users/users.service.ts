import { Injectable } from '@nestjs/common'
import { UsersRepository } from './users.repository'
import { CreateUserDto, CreateUserProfileDto, UpdateUserProfileDto } from './dto/create-user.dto'
import { User, UserProfile } from './classes/user.class'
import { TEMPID_BATCH_SIZE } from './constants'
import { CreateCloseContactsRequestDto } from './dto/create-close-contact.dto'
import { SetSelfReportedPositiveFlagDto } from './dto/set-positive-flag.dto'

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  createOneUser(user: CreateUserDto, userProfile?: CreateUserProfileDto) {
    return this.usersRepository.createOne(user, userProfile)
  }

  async findOneUserById(userId: string): Promise<User | undefined> {
    return this.usersRepository.findOneUserById(userId)
  }

  async findOneUserProfileById(userId: string): Promise<UserProfile | undefined> {
    return this.usersRepository.findOneUserProfileById(userId)
  }

  async getTempIDs(userId: string): Promise<any[]> {
    const tempIDs = await Promise.all(
      [...Array(TEMPID_BATCH_SIZE).keys()].map(async (i) =>
        this.usersRepository.generateTempId(userId, i)
      )
    )

    return tempIDs
  }

  async uploadPositiveList(): Promise<void> {
    return this.usersRepository.uploadPositiveList()
  }

  async createCloseContacts(
    userId: string,
    createCloseContactsRequestDto: CreateCloseContactsRequestDto
  ): Promise<void> {
    await Promise.all(
      createCloseContactsRequestDto.closeContacts.map(async (closeContact) => {
        closeContact.selfUserId = userId
        return this.usersRepository.createOneCloseContact(userId, closeContact)
      })
    )

    // TODO @yashmurty : Investigate later on how to ingest this data to BigQuert.
    // Also, if we need to save this data as a `JSON` file or not.
  }

  async updateUserProfile(
    userId: string,
    updateUserProfileDto: UpdateUserProfileDto
  ): Promise<void> {
    console.log('-----')
    console.log('userId : ', userId)
    console.log('updateUserProfileDto : ', updateUserProfileDto)

    // TODO @yashmurty :
    // 1. If `prefecture` exists in payload, no action is needed, proceed with passing
    // the prefecture value to repo update function.
    // 2. If `orgCode` exists in payload, check if user already has existing `orgCode`.
    //    A - If existing is same as payload, do nothing.
    //    B - If existing is empty, check if `orgCode` matches any org, then add it and also add custom claim.
    //    C - If existing is different:
    //        - Perform delete operation of `orgCode` for existing user (profile, userStatus, customClaim)
    //        - Perform step B.

    return
  }

  async setSelfReportedPositiveFlag(
    setSelfReportedPositiveFlag: SetSelfReportedPositiveFlagDto
  ): Promise<void> {
    return this.usersRepository.setSelfReportedPositiveFlag(setSelfReportedPositiveFlag)
  }
}
