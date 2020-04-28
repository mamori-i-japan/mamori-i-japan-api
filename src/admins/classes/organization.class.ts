import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class Organization {
  @ApiProperty()
  name: string

  @ApiProperty()
  organizationCode: string

  @ApiProperty()
  addedByAdminUserId: string

  @ApiProperty()
  addedByAdminEmail: string

  @ApiPropertyOptional({ example: 1588297800 })
  created?: number
}
