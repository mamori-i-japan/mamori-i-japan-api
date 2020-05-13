import * as request from 'supertest'

// TODO @yashmurty : WIP.
export async function generateFirebaseDefaultToken(
  customToken: string,
  firebaseWebAPIKey: string
): Promise<string> {
  let firebaseDefaultToken: string
  await request(`https://identitytoolkit.googleapis.com/`)
    .post(
      `/v1/accounts:signInWithCustomToken?key=
    ${firebaseWebAPIKey}`
    )
    .send({
      token: customToken,
      returnSecureToken: true,
    })
    .set('Content-Type', 'application/json')
    .expect((response) => {
      expect(response.body.idToken).toBeDefined()
      firebaseDefaultToken = response.body.idToken
    })

  return firebaseDefaultToken
}
