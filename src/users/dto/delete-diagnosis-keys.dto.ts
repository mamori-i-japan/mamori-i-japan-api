import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, IsNotEmpty, IsArray, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class RandomIDDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  randomID: string
}

export class DeleteDiagnosisKeysDto {
  @ApiProperty({ type: RandomIDDto, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RandomIDDto)
  randomIDs: RandomIDDto[]
}
