export interface Admin {
  adminUserId: string
  email: string
  // addedByAdminUserId: string
  // addedByAdminEmail: string
  created?: number
}

export interface AdminProfile {
  name: string
}
