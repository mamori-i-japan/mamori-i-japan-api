import { Injectable } from '@nestjs/common'
import * as firebaseAdmin from 'firebase-admin'
import { ConfigService } from '@nestjs/config'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const serviceAccount = require('../../serviceAccountKey.json')

@Injectable()
export class FirebaseService {
  constructor(private configService: ConfigService) {
    const firebaseDatabaseURL = this.configService.get('FIREBASE_DATABASE_URL')

    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(serviceAccount),
      databaseURL: firebaseDatabaseURL,
    })
  }

  async firebaseFirestore(): Promise<firebaseAdmin.firestore.Firestore> {
    return firebaseAdmin.firestore()
  }
}
