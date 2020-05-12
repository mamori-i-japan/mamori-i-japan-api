import { Moment } from 'moment-timezone'
import { ApiProperty } from '@nestjs/swagger'

export class User {
  userId: string
  createdAt?: Moment
}

export class UserProfile {
  @ApiProperty({ example: 14 })
  prefecture: number
}
