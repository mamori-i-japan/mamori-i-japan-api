import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Moment } from 'moment-timezone'

export class Admin {
  @ApiProperty()
  adminUserId: string

  @ApiProperty()
  email: string

  @ApiProperty()
  addedByAdminUserId: string

  @ApiProperty()
  addedByAdminEmail: string

  @ApiPropertyOptional({ example: 1588297800 })
  created?: Moment
}

export class AdminProfile {
  name: string
}
