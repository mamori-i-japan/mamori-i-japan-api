import * as request from 'supertest'

// TODO @yashmurty : WIP.
export async function generateFirebaseDefaultToken(
  customToken: string,
  firebaseServerAPIKey: string
) {
  await request(
    `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken?key=${firebaseServerAPIKey}`
  )
    .post('/')
    .send({
      token: customToken,
      returnSecureToken: true,
    })
    .set('Content-Type', 'application/json')
    .expect((response) => {
      console.log(response.body)
    })
}
