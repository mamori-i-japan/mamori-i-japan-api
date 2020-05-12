import { IsNumber, IsOptional } from 'class-validator'
import { Transform } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class PaginationParamsDto {
  @ApiPropertyOptional({
    description: 'Optional, defaults to 100',
  })
  @IsNumber()
  @IsOptional()
  @Transform((value) => parseInt(value, 10), { toClassOnly: true })
  size: number
}
