import { Injectable } from '@nestjs/common'
import { UsersRepository } from './users.repository'
import { CreateUserDto, CreateUserProfileDto } from './dto/create-user.dto'
import { User } from './interfaces/user.interface'
import { TEMPID_BATCH_SIZE } from './constants'

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  create(user: CreateUserDto, userProfile?: CreateUserProfileDto) {
    return this.usersRepository.createOne(user, userProfile)
  }

  async findOne(userId: string): Promise<User | undefined> {
    return this.usersRepository.findOne(userId)
  }

  async getTempIDs(userId: string): Promise<any[]> {
    // TODO @shogo-mitomo : make the key envvar
    const encryptionKey = Buffer.from('0QCvPzM2eQnEmp1C5R8voY7K81NNPXX0+INFe5kgn5w=', 'base64')

    const tempIDs = await Promise.all(
      [...Array(TEMPID_BATCH_SIZE).keys()].map(async (i) =>
        this.usersRepository.generateTempId(encryptionKey, userId, i)
      )
    )

    return tempIDs
  }
}
