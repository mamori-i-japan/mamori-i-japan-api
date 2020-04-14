import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateCatDto {
  @ApiProperty()
  name: string

  @ApiProperty({
    // We can explicitly set the definitions like this
    description: 'The age of a cat',
    minimum: 1,
    default: 1,
    type: Number,
  })
  age: number

  @ApiPropertyOptional()
  breeds: string[]
}

// refs. https://docs.nestjs.com/recipes/swagger
