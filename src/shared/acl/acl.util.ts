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
