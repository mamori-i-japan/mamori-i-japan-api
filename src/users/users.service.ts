import { Injectable } from '@nestjs/common'
import { UsersRepository } from './users.repository'
import { CreateUserDto, CreateUserProfileDto } from './dto/create-user.dto'
import { User } from './interfaces/user.interface'
import { TEMPID_BATCH_SIZE, TEMPID_VALIDITY_PERIOD } from './constants'
import CustomEncrypter from '../utils/CustomEncrypter'
import * as moment from 'moment'

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
        this.generateTempId(encryptionKey, userId, i)
      )
    )

    return tempIDs
  }

  private async generateTempId(encryptionKey: Buffer, userId: string, i: number) {
    // allow the first message to be valid a minute earlier
    const start = moment.utc().add(TEMPID_VALIDITY_PERIOD * i, 'hours').add(-1, 'minute')
    const expiry = start.add(TEMPID_VALIDITY_PERIOD, 'hours')

    // Prepare encrypter
    const customEncrypter = new CustomEncrypter(encryptionKey)

    // Encrypt userId, start, expiry and encode payload
    // 21 bytes for userId, 4 bytes each for start and expiry timestamp
    const USERID_SIZE = 21
    const TIME_SIZE = 4
    const TEMPID_SIZE = USERID_SIZE + TIME_SIZE * 2

    const plainData = Buffer.alloc(TEMPID_SIZE)
    plainData.write(userId, 0, USERID_SIZE, 'base64')
    plainData.writeInt32BE(start.unix(), USERID_SIZE)
    plainData.writeInt32BE(expiry.unix(), USERID_SIZE + TIME_SIZE)

    const encodedData = customEncrypter.encryptAndEncode(plainData)
    const tempID = encodedData.toString('base64')

    return {
      tempID: tempID,
      validFrom: start,
      validTo: expiry,
    }
  }
}
