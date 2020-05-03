import {
  superAdminKey,
  nationalAdminKey,
  prefectureAdminKey,
  organizationAdminKey,
} from './acl.constants'

/**
 * getXXXAdminACLEntry function returns the keys that need to be added to
 * the accessControlList of a resource.
 */
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
 * canUserEditResource function is used to check if a user can view/edit a resource
 */
export function canUserEditResource(userAccessKey: string, accessControlList: string[]): boolean {
  // WIP
  return false
}

/**
 * canUserCreateXXX function is used when inviting new admin users with admin roles.
 * - It will prevent organization admin user to create a super admin, etc.
 */
export function canUserCreateSuperAdmin(userAccessKey: string): boolean {
  // Checks if the user performing an action has superAdmin access.
  if (userAccessKey === superAdminKey) {
    return true
  }
  return false
}

export function canUserCreateNationalAdmin(userAccessKey: string): boolean {
  // Checks if the user performing an action has nationalAdmin access or above.
  if (userAccessKey === superAdminKey) {
    return true
  }
  if (userAccessKey === nationalAdminKey) {
    return true
  }
  return false
}

export function canUserCreatePrefectureAdmin(userAccessKey: string, prefectureId: string): boolean {
  // Checks if the user performing an action has prefectureAdmin access or above.
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

export function canUserCreateOrganizationAdmin(
  userAccessKey: string,
  organizationId: string
): boolean {
  // Checks if the user performing an action has organizationAdmin access or above.
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
