import { Injectable } from '@nestjs/common'
import { UsersRepository } from './users.repository'
import { CreateUserDto, CreateUserProfileDto } from './dto/create-user.dto'
import { User } from './interfaces/user.interface'
import { ConfigService } from '@nestjs/config'
import { TEMPID_BATCH_SIZE } from './constants'

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private configService: ConfigService,
  ) {}

  create(user: CreateUserDto, userProfile?: CreateUserProfileDto) {
    return this.usersRepository.createOne(user, userProfile)
  }

  async findOne(userId: string): Promise<User | undefined> {
    return this.usersRepository.findOne(userId)
  }

  async getTempIDs(userId: string): Promise<any[]> {
    const encryptionKey = Buffer.from(this.configService.get('encryptionKey').toString(), 'base64')

    const tempIDs = await Promise.all(
      [...Array(TEMPID_BATCH_SIZE).keys()].map(async (i) =>
        this.usersRepository.generateTempId(encryptionKey, userId, i)
      )
    )

    return tempIDs
  }
}
