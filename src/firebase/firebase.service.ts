import { Injectable } from '@nestjs/common'
import * as firebaseAdmin from 'firebase-admin'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class FirebaseService {
  constructor(private configService: ConfigService) {
    const firebaseDatabaseURL = this.configService.get('FIREBASE_DATABASE_URL')
    const firebaseStorageBucket = this.configService.get('FIREBASE_STORAGE_BUCKET')

    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(this.configService.get('firebase')),
      databaseURL: firebaseDatabaseURL,
      storageBucket: firebaseStorageBucket,
    })
  }

  async Firestore(): Promise<firebaseAdmin.firestore.Firestore> {
    return firebaseAdmin.firestore()
  }

  async Storage(): Promise<firebaseAdmin.storage.Storage> {
    return firebaseAdmin.storage()
  }
}
