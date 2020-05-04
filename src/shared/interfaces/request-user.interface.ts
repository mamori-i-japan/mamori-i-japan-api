export interface RequestNormalUser {
  readonly isNormalUser: boolean
}

export interface RequestAdminUser {
  readonly isAdminUser: boolean
  readonly userAdminRole: string
  readonly userAccessKey: string
  readonly uid: string
  readonly email: string
}
