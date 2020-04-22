import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNumber, IsNotEmpty, IsArray, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateCloseContactDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  uniqueInsertKey: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  externalTempId: string

  @ApiProperty()
  @IsNumber()
  contactStartTime: number

  @ApiProperty()
  @IsNumber()
  contactEndTime: number
}

export class CreateCloseContactsRequestDto {
  @ApiProperty({ type: CreateCloseContactDto, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCloseContactDto)
  closeContacts: CreateCloseContactDto[]
}
