import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsEnum, IsEmail, ValidateIf } from 'class-validator'
import { AdminRole } from '../../shared/acl'

export class CreateAdminProfileDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string
}

export class CreateAdminDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  adminUserId: string

  @ApiProperty({ enum: AdminRole })
  @IsNotEmpty()
  @IsEnum(AdminRole)
  userAdminRole: AdminRole

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userAccessKey: string

  @ApiPropertyOptional({
    description: 'Optional, needed when admin role is ORGANIZATION_ADMIN_ROLE',
  })
  @ValidateIf((o) => o.userAdminRole === AdminRole.organizationAdminRole)
  @IsString()
  @IsNotEmpty()
  organizationId: string

  @ApiPropertyOptional({
    description: 'Optional, needed when admin role is PREFECTURE_ADMIN_ROLE',
  })
  @ValidateIf((o) => o.userAdminRole === AdminRole.prefectureAdminRole)
  @IsString()
  @IsNotEmpty()
  prefectureId: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  addedByAdminUserId: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
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
    description: 'Optional, needed when admin role is ORGANIZATION_ADMIN_ROLE',
  })
  @ValidateIf((o) => o.adminRole === AdminRole.organizationAdminRole)
  @IsString()
  @IsNotEmpty()
  organizationId: string

  @ApiPropertyOptional({
    description: 'Optional, needed when admin role is PREFECTURE_ADMIN_ROLE',
  })
  @ValidateIf((o) => o.adminRole === AdminRole.prefectureAdminRole)
  @IsString()
  @IsNotEmpty()
  prefectureId: string
}
