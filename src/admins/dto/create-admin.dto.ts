import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsEnum, IsEmail, ValidateIf, Min, IsInt, Max } from 'class-validator'
import { AdminRole, ResourceWithACL } from '../../shared/acl'

export class CreateAdminDto extends ResourceWithACL {
  // Keys without any decorators are non-Whitelisted. Validator will throw error if it's passed in payload.
  adminUserId: string
  userAdminRole: AdminRole
  userAccessKey: string
  prefectureId: number
  email: string
  addedByAdminUserId: string
  addedByAdminEmail: string
}

export class CreateAdminRequestDto {
  @ApiProperty({ example: 'hello@emample.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty({ enum: AdminRole })
  @IsNotEmpty()
  @IsEnum(AdminRole)
  adminRole: AdminRole

  @ApiPropertyOptional({
    description: 'Optional, needed when admin role is PREFECTURE_ADMIN_ROLE',
  })
  @ValidateIf((o) => o.adminRole === AdminRole.prefectureAdminRole)
  @IsInt()
  @Min(0)
  @Max(47)
  prefectureId: number
}
