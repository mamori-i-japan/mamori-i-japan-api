export interface User {
  userId: string
  phoneNumber: string
  created?: number
}

export interface UserProfile {
  prefecture: string
  age: number
  gender: string
  created?: number
}
