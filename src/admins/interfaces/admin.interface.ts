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

  @ApiPropertyOptional()
  created?: number
}

export interface AdminProfile {
  name: string
}
