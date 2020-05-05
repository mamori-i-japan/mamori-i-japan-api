import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Moment } from 'moment-timezone'
import { ResourceWithACL } from '../../shared/acl'

export class Organization extends ResourceWithACL {
  @ApiProperty()
  organizationId: string

  @ApiProperty()
  name: string

  @ApiPropertyOptional({ example: 'This is optional message' })
  message?: string

  @ApiProperty()
  organizationCode: string

  @ApiProperty()
  addedByAdminUserId: string

  @ApiProperty()
  addedByAdminEmail: string

  @ApiPropertyOptional({ example: 1588297800 })
  createdAt?: Moment

  @ApiPropertyOptional({ example: 1588297800 })
  updatedAt?: Moment
}

export class OrganizationForAppAccess {
  messageForAppAccess: string
}
