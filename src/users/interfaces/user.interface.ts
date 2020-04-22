import { Moment } from 'moment-timezone'

export interface User {
  userId: string
  phoneNumber: string
  created?: Moment
}

export interface UserProfile {
  prefecture: number
  age: number
  gender: string
  job: string
}
