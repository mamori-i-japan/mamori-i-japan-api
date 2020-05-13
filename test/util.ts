import axios from 'axios'
import * as firebaseAdmin from 'firebase-admin'

export async function generateFirebaseDefaultToken(
  customToken: string,
  firebaseWebAPIKey: string
): Promise<string> {
  let firebaseDefaultToken: string

  await axios
    .post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=
    ${firebaseWebAPIKey}`,
      {
        token: customToken,
        returnSecureToken: true,
      }
    )
    .then(function(response) {
      firebaseDefaultToken = response.data.idToken
    })
    .catch(function(error) {
      console.log(error.response.data.error)
      throw error
    })

  return firebaseDefaultToken
}

/**
 * Delete the test user from firebase auth and firestore.
 * @param testUIDNormalUser
 */

export async function deleteFirebaseTestUser(testUIDNormalUser: string): Promise<void> {
  await firebaseAdmin.auth().deleteUser(testUIDNormalUser)
  await firebaseAdmin
    .firestore()
    .collection('users')
    .doc(testUIDNormalUser)
    .collection('profile')
    .doc(testUIDNormalUser)
    .delete()
  await firebaseAdmin
    .firestore()
    .collection('users')
    .doc(testUIDNormalUser)
    .delete()
}
