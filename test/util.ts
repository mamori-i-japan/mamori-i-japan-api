import * as request from 'supertest'

export async function generateFirebaseDefaultToken(customToken: string, firebaseAPIKey: string) {
  await request(
    `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken?key=AIzaSyBbg2NNhLmY8YRSFmjibDoDM7O1EgheNEI`
  )
    .post('/auth/login')
    .send({
      token: customToken,
      returnSecureToken: true,
    })
    .set('Content-Type', 'application/json')
    .expect((response) => {
      console.log(response.body)
    })
}
