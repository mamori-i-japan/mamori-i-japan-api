import { Injectable, BadRequestException } from '@nestjs/common'
import { AdminsRepository } from './admins.repository'
import { CreateAdminDto, CreateAdminRequestDto } from './dto/create-admin.dto'
import { Admin } from './interfaces/admin.interface'
import { validateOrReject } from 'class-validator'

@Injectable()
export class AdminsService {
  constructor(private adminsRepository: AdminsRepository) {}

  async createOneAdminUser(createAdminRequest: CreateAdminRequestDto) {
    // TODO @yashmurty : Add firebase user create here and get uid.
    const createAdminDto: CreateAdminDto = new CreateAdminDto()
    createAdminDto.email = createAdminRequest.email
    createAdminDto.adminUserId = 'FIX_ME_ADMIN_USER_ID'

    try {
      await validateOrReject(createAdminDto)
    } catch (errors) {
      throw new BadRequestException(errors, 'Request validation failed')
    }

    return this.adminsRepository.createOne(createAdminDto)
  }

  async findOneAdminById(adminId: string): Promise<Admin | undefined> {
    return this.adminsRepository.findOneById(adminId)
  }

  async findAllAdminUsers(): Promise<Admin[] | undefined> {
    return this.adminsRepository.findAll()
  }
}
