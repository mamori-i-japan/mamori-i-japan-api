import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

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
  created?: number
}

export class AdminProfile {
  name: string
}
