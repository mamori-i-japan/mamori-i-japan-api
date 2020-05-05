import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common'
import { PrefecturesRepository } from './prefectures.repository'
import { CreatePrefectureRequestDto, UpdatePrefectureRequestDto } from './dto/create-prefecture.dto'
import { Prefecture } from './classes/prefecture.class'
import {
  getSuperAdminACLKey,
  getNationalAdminACLKey,
  getPrefectureAdminACLKey,
  canUserAccessResource,
  canUserCreateNationalAdmin,
} from '../shared/acl'
import { RequestAdminUser } from '../shared/interfaces'

@Injectable()
export class PrefecturesService {
  constructor(private prefecturesRepository: PrefecturesRepository) {}

  async createOnePrefecture(
    requestAdminUser: RequestAdminUser,
    createPrefectureRequest: CreatePrefectureRequestDto
  ): Promise<Prefecture> {
    // New prefecture can only be created by superAdmin or NationalAdmin.
    if (!canUserCreateNationalAdmin(requestAdminUser.userAccessKey)) {
      throw new UnauthorizedException('User does not have access to create this resource')
    }

    const randomCode = 1
    createPrefectureRequest.prefectureId = randomCode
    createPrefectureRequest.addedByAdminUserId = requestAdminUser.uid
    createPrefectureRequest.addedByAdminEmail = requestAdminUser.email
    createPrefectureRequest.accessControlList = [
      getSuperAdminACLKey(),
      getNationalAdminACLKey(),
      getPrefectureAdminACLKey(randomCode),
    ]

    return this.prefecturesRepository.createOne(createPrefectureRequest)
  }

  async findAllPrefectures(requestAdminUser: RequestAdminUser): Promise<Prefecture[]> {
    // ACL check is automatically performed in the repository function.
    return this.prefecturesRepository.findAll(requestAdminUser.userAccessKey)
  }

  async findOnePrefectureById(
    requestAdminUser: RequestAdminUser,
    prefectureId: number
  ): Promise<Prefecture> {
    // Fetch resource and perform ACL check.
    const prefecture = await this.prefecturesRepository.findOneById(prefectureId)
    if (!canUserAccessResource(requestAdminUser.userAccessKey, prefecture)) {
      throw new UnauthorizedException('User does not have access on this resource')
    }

    return prefecture
  }

  async updateOnePrefecture(
    requestAdminUser: RequestAdminUser,
    updatePrefectureRequest: UpdatePrefectureRequestDto
  ): Promise<void> {
    // Fetch resource and perform ACL check.
    const prefecture = await this.prefecturesRepository.findOneById(
      updatePrefectureRequest.prefectureId
    )
    if (!canUserAccessResource(requestAdminUser.userAccessKey, prefecture)) {
      throw new UnauthorizedException('User does not have access on this resource')
    }

    return this.prefecturesRepository.updateOne(updatePrefectureRequest)
  }

  /**
   * Checks if prefecture code/id provided is valid or not.
   * @param prefectureId: number
   */
  async isPrefectureCodeValid(prefectureId: number): Promise<boolean> {
    const prefecture = await this.prefecturesRepository.findOneById(prefectureId)
    if (!prefecture) {
      return false
    }
    // This is just a sanity check. Since prefecture id and code should always have same value.
    if (prefectureId !== prefecture.prefectureId) {
      throw new BadRequestException('prefecture id does not match prefecture id in firestore')
    }

    return true
  }
}
