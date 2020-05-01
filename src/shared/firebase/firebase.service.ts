import { Injectable } from '@nestjs/common'
import * as firebaseAdmin from 'firebase-admin'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class FirebaseService {
  constructor(private configService: ConfigService) {
    const firebaseDatabaseURL = this.configService.get('FIREBASE_DATABASE_URL')
    const firebaseStorageBucket = this.configService.get('FIREBASE_STORAGE_BUCKET')

    if (!firebaseAdmin.apps.length) {
      firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(this.configService.get('firebase')),
        databaseURL: firebaseDatabaseURL,
        storageBucket: firebaseStorageBucket,
      })
    }
  }

  async Firestore(): Promise<firebaseAdmin.firestore.Firestore> {
    return firebaseAdmin.firestore()
  }

  async Storage(): Promise<firebaseAdmin.storage.Storage> {
    return firebaseAdmin.storage()
  }

  /**
   * Update custom claims in firebase without overwriting all existing claims.
   * @param userId: string
   * @param upsertCustomClaims: Record<string, any>
   */
  async UpsertCustomClaim(userId: string, upsertCustomClaims: Record<string, any>): Promise<void> {
    const firebaseUser = await firebaseAdmin.auth().getUser(userId)
    const existingCustomClaims = firebaseUser.customClaims

    // Merge upsertCustomClaims in to existingCustomClaims.
    const newCustomClaims = Object.assign({}, existingCustomClaims, upsertCustomClaims)

    // Overwrite firebase custom claims with newCustomClaims.
    await firebaseAdmin.auth().setCustomUserClaims(userId, newCustomClaims)
  }
}
