import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Moment } from 'moment-timezone'
import { ResourceWithACL, AdminRole } from '../../shared/acl'

export class Admin extends ResourceWithACL {
  @ApiProperty()
  adminUserId: string

  @ApiProperty()
  userAdminRole: AdminRole

  @ApiProperty()
  userAccessKey: string

  @ApiPropertyOptional({
    description: 'Optional, needed when admin role is PREFECTURE_ADMIN_ROLE',
  })
  prefectureId?: number

  @ApiProperty()
  email: string

  @ApiProperty()
  addedByAdminUserId: string

  @ApiProperty()
  addedByAdminEmail: string

  @ApiPropertyOptional({ example: 1588297800 })
  createdAt?: Moment
}
