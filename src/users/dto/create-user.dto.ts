import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  IsArray,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'

export class CreateUserProfileDto {
  @ApiProperty()
  @IsNumber()
  prefecture: number

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  age: number

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  gender: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  job: string
}

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phoneNumber: string
}

export class CreateCloseContactDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  externalTempId: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  contactStartTime: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  contactEndTime: string

  @ApiProperty()
  @IsNumber()
  averageDistance: number
}

export class CreateCloseContactsRequestDto {
  @ApiProperty({ type: CreateCloseContactDto, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCloseContactDto)
  closeContacts: CreateCloseContactDto[]
}
