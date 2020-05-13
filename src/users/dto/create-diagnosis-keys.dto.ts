import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsArray, ValidateNested } from 'class-validator'
import { Type, Transform } from 'class-transformer'
import { Moment } from 'moment-timezone'
import * as moment from 'moment-timezone'

export class TempIDDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  tempID: string

  @ApiProperty({ example: 1588297800 })
  @IsNotEmpty()
  @Type(() => Date)
  @Transform((value) => moment.unix(value), { toClassOnly: true })
  validFrom: Moment

  @ApiProperty({ example: 1588297800 })
  @IsNotEmpty()
  @Type(() => Date)
  @Transform((value) => moment.unix(value), { toClassOnly: true })
  validTo: Moment
}

export class CreateDiagnosisKeysDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  randomID: string

  @ApiProperty({ type: TempIDDto, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TempIDDto)
  tempIDs: TempIDDto[]

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  healthCenterToken: string
}
