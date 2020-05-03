export interface RequestNormalUser {
  readonly isNormalUser: boolean
}

export interface RequestAdminUser {
  readonly isAdminUser: boolean
  readonly uid: string
  readonly email: string
}
