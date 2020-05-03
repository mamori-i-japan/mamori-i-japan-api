import {
  superAdminKey,
  nationalAdminKey,
  prefectureAdminKey,
  organizationAdminKey,
} from './acl.constants'

export function getSuperAdminACLEntry() {
  return superAdminKey
}

export function getNationalAdminACLEntry() {
  return nationalAdminKey
}

export function getPrefectureAdminACLEntry(prefectureId: string) {
  return prefectureAdminKey + '|' + prefectureId
}

export function getOrganizationAdminACLEntry(organizationId: string) {
  return organizationAdminKey + '|' + organizationId
}

/**
 * This function is used when inviting new admin users with admin roles.
 * It will be used to prevent organization admin user to create a super admin, etc.
 */
export function canUserEditSuperAdmin(userAccessKey: string): boolean {
  if (userAccessKey === superAdminKey) {
    return true
  }
  return false
}

export function canUserEditNationalAdmin(userAccessKey: string): boolean {
  if (userAccessKey === superAdminKey) {
    return true
  }
  if (userAccessKey === nationalAdminKey) {
    return true
  }
  return false
}

export function canUserEditPrefectureAdmin(userAccessKey: string, prefectureId: string): boolean {
  if (userAccessKey === superAdminKey) {
    return true
  }
  if (userAccessKey === nationalAdminKey) {
    return true
  }
  if (userAccessKey === getPrefectureAdminACLEntry(prefectureId)) {
    return true
  }
  return false
}

export function canUserEditOrganizationAdmin(
  userAccessKey: string,
  organizationId: string
): boolean {
  if (userAccessKey === superAdminKey) {
    return true
  }
  if (userAccessKey === nationalAdminKey) {
    return true
  }
  if (userAccessKey === getOrganizationAdminACLEntry(organizationId)) {
    return true
  }
  return false
}
