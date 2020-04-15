import { Injectable } from '@nestjs/common'
import * as firebaseAdmin from 'firebase-admin'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class FirebaseService {
  constructor(private configService: ConfigService) {
    const firebaseDatabaseURL = this.configService.get('FIREBASE_DATABASE_URL')

    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(this.configService.get('firebase')),
      databaseURL: firebaseDatabaseURL,
    })
  }

  async Firestore(): Promise<firebaseAdmin.firestore.Firestore> {
    return firebaseAdmin.firestore()
  }
}
