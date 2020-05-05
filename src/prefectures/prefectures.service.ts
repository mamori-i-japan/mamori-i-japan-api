import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common'
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

    createPrefectureRequest.accessControlList = [
      getSuperAdminACLKey(),
      getNationalAdminACLKey(),
      getPrefectureAdminACLKey(createPrefectureRequest.prefectureId),
    ]

    return this.prefecturesRepository.createOne(createPrefectureRequest)
  }

  async findAllPrefectures(requestAdminUser: RequestAdminUser): Promise<Prefecture[]> {
    // ACL check is automatically performed in the repository function.
    return this.prefecturesRepository.findAll(requestAdminUser.userAccessKey)
  }

  async getOnePrefectureById(
    requestAdminUser: RequestAdminUser,
    prefectureId: number
  ): Promise<Prefecture> {
    // Fetch resource and perform ACL check.
    const prefecture = await this.prefecturesRepository.findOneById(prefectureId)
    if (!prefecture) {
      throw new NotFoundException('Could not find prefecture with this id')
    }
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
    if (!prefecture) {
      throw new NotFoundException('Could not find prefecture with this id')
    }
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

  /**
   * Creates the necessary prefecture if does not exist.
   */
  async setupInitialPrefectures(requestAdminUser: RequestAdminUser): Promise<void> {
    const startPrefectureId = 0
    const endPrefectureId = 47

    // This initial setup can only be performed by superAdmin or NationalAdmin.
    if (!canUserCreateNationalAdmin(requestAdminUser.userAccessKey)) {
      throw new UnauthorizedException('User does not have access to create this resource')
    }

    for (let prefectureId = startPrefectureId; prefectureId <= endPrefectureId; prefectureId++) {
      const existingPrefecture = await this.prefecturesRepository.findOneById(prefectureId)
      if (existingPrefecture) {
        console.log('Prefecture already exists for this id : ', prefectureId)
        continue
      }

      console.log('Creating new prefecture for this id : ', prefectureId)
      const createPrefectureRequest = new CreatePrefectureRequestDto()
      createPrefectureRequest.prefectureId = prefectureId
      createPrefectureRequest.name = 'Prefecture name ' + prefectureId
      createPrefectureRequest.message = 'Prefecture message ' + prefectureId

      await this.createOnePrefecture(requestAdminUser, createPrefectureRequest)
    }
  }
}
