import { Injectable, BadRequestException, ConflictException } from '@nestjs/common'
import { AdminsRepository } from './admins.repository'
import { CreateAdminDto, CreateAdminRequestDto } from './dto/create-admin.dto'
import { Admin } from './classes/admin.class'
import * as firebaseAdmin from 'firebase-admin'

@Injectable()
export class AdminsService {
  constructor(private adminsRepository: AdminsRepository) {}

  async createOneAdminUser(createAdminRequest: CreateAdminRequestDto): Promise<void> {
    console.log('createAdminRequest : ', createAdminRequest)
    // Check if an admin already exists with this email.
    const adminExists = await this.adminsRepository.findOneByEmail(createAdminRequest.email)
    if (adminExists) {
      throw new ConflictException('An admin with this email already exists')
    }

    // Check if the user has access to create new user with adminRole in the payload.

    let firebaseUserRecord: firebaseAdmin.auth.UserRecord
    try {
      firebaseUserRecord = await firebaseAdmin.auth().createUser({
        email: createAdminRequest.email,
        emailVerified: false,
        disabled: false,
      })
    } catch (error) {
      throw new BadRequestException(error.message)
    }

    const createAdminDto: CreateAdminDto = new CreateAdminDto()
    createAdminDto.adminUserId = firebaseUserRecord.uid
    createAdminDto.email = createAdminRequest.email
    createAdminDto.addedByAdminUserId = createAdminRequest.addedByAdminUserId
    createAdminDto.addedByAdminEmail = createAdminRequest.addedByAdminEmail

    return this.adminsRepository.createOne(createAdminDto)
  }

  async findOneAdminById(adminId: string): Promise<Admin | undefined> {
    return this.adminsRepository.findOneById(adminId)
  }

  async findAllAdminUsers(): Promise<Admin[]> {
    return this.adminsRepository.findAll()
  }
}
