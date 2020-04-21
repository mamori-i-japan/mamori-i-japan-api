import { Moment } from 'moment-timezone'

export interface User {
  userId: string
  phoneNumber: string
  created?: Moment
}

export interface UserProfile {
  prefecture: string
  age: number
  gender: string
  created?: Moment
}
