import { ValidationPipeOptions } from '@nestjs/common'

export const VALIDATION_PIPE_OPTIONS: Readonly<ValidationPipeOptions> = {
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
}
