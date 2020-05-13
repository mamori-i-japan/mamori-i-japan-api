import axios from 'axios'

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
      console.log(error.response.data)
      console.log('-----')
      console.log(error.response.data.error)
      throw error
    })

  return firebaseDefaultToken
}
