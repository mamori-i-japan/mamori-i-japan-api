import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Moment } from 'moment-timezone'
import { ResourceWithACL } from '../../shared/acl'
import * as firebaseAdmin from 'firebase-admin'

export class Prefecture extends ResourceWithACL {
  @ApiProperty()
  prefectureId: number

  @ApiPropertyOptional({ example: 'This is optional message' })
  message?: string

  @ApiPropertyOptional({ type: firebaseAdmin.firestore.Timestamp })
  createdAt?: Moment

  @ApiPropertyOptional({ example: 1588297800 })
  updatedAt?: Moment
}

export class PrefectureForAppAccess {
  messageForAppAccess: string
}
