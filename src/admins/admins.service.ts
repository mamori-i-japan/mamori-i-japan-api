import { Injectable } from '@nestjs/common'
import { AdminsRepository } from './admins.repository'
import { CreateAdminDto, CreateAdminProfileDto } from './dto/create-admin.dto'
import { Admin } from './interfaces/admin.interface'

@Injectable()
export class AdminsService {
  constructor(private adminsRepository: AdminsRepository) {}

  create(admin: CreateAdminDto, adminProfile?: CreateAdminProfileDto) {
    return this.adminsRepository.createOne(admin, adminProfile)
  }

  async findOne(adminId: string): Promise<Admin | undefined> {
    return this.adminsRepository.findOne(adminId)
  }

  async findAllAdminUsers(): Promise<Admin[] | undefined> {
    return this.adminsRepository.findAll()
  }
}
