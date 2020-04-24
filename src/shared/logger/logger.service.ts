import { Injectable, Scope, Logger } from '@nestjs/common'

// We inject a transient instance of the Logger into our feature modules
// so that each one has its own custom context.
@Injectable({ scope: Scope.TRANSIENT })
export class AppLogger extends Logger {}
