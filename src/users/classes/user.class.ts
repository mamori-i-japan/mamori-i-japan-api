import { Moment } from 'moment-timezone'

export class User {
  userId: string
  created?: Moment
}

export class UserProfile {
  prefecture: number
  organization?: string
}
