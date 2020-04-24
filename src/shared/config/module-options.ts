import configuration from './configuration'
import * as Joi from '@hapi/joi'
import { ConfigModuleOptions } from '@nestjs/config/dist/interfaces'

export const configModuleOptions: ConfigModuleOptions = {
  envFilePath: '.env',
  load: [configuration],
  validationSchema: Joi.object({
    NODE_ENV: Joi.string()
      .valid('development', 'production', 'test', 'provision')
      .default('development'),
    BACKEND_APP_PORT: Joi.number().default(3000),
    // Making the AWS access tokens as required.
    // They will be injected directly in Lambda functions, but we must add them to env locally.
    AWS_ACCESS_KEY_ID: Joi.string().required(),
    AWS_SECRET_ACCESS_KEY: Joi.string().required(),
    AWS_SESSION_TOKEN: Joi.string()
      .allow('')
      .optional(),
    FIREBASE_DATABASE_URL: Joi.string().required(),
    FIREBASE_STORAGE_BUCKET: Joi.string().required(),
    // eslint-disable-next-line @typescript-eslint/camelcase
    FIREBASE_private_key: Joi.string().required(),
  }),
}
