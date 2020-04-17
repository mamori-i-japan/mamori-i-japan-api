import { Injectable, BadRequestException } from '@nestjs/common'
import { AdminsRepository } from './admins.repository'
import { CreateAdminDto, CreateAdminRequestDto } from './dto/create-admin.dto'
import { Admin } from './interfaces/admin.interface'
import * as firebaseAdmin from 'firebase-admin'

@Injectable()
export class AdminsService {
  constructor(private adminsRepository: AdminsRepository) {}

  async createOneAdminUser(createAdminRequest: CreateAdminRequestDto) {
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

  async findAllAdminUsers(): Promise<Admin[] | undefined> {
    return this.adminsRepository.findAll()
  }
}
