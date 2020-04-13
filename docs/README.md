# contact-tracing/api

## API List (🚧 This will be Swaggerized in the near future 🚧)

### APIs for Mobile APP

#### Auth

認証処理自体はアプリから直接 Firebase Authentication を呼ぶ（SMS認証）。
電話番号リサイクル対応のため、重複した電話番号でのサインアップがされたら新規作成する。
性別・都道府県などを保存する必要あり。PUT /profiles 的なAPIを用意？要検討。

1. GET /temp_ids
  - 認証時に発行される UserID とは別に、複数個の TempIDs を生成し返す。
  - 端末同士の接触通信時には、この TempID を使用することでセキュリティを高める。
  - 生成方法などはシンガポールのアプリ実装が参考になる。
    - https://github.com/opentrace-community/opentrace-cloud-functions/blob/master/functions/src/opentrace/getTempIDs.ts
  - APIリクエスト時だけでなく、サーバー側からブロードキャストする仕組みも検討が必要？

#### Close Contact

1. POST /contacts
    - 情報提供に同意した場合のみ叩かれる。
    - 濃厚接触者リストを Cloud Datastore に保存する。
  - クラスター発生状況の分析などに利用されるデータとなる。
  - バリデーション処理が必要。

#### Notification

濃厚接触者への案内メッセージを都道府県ごとくらいの単位で出し分ける。

#### Push Notification

陽性者の追加をトリガーにキックされる。
全ユーザーにサイレントプッシュ？濃厚接触者に通知？そもそも不要？要検討。

#### APP Version

Firebase Remote Config を利用する想定。

### APIs for Admin Panel

#### Auth

認証処理自体は JS から直接 Firebase Authentication を呼ぶ。（パスワード認証）

#### Positive

Cloud Firestore クライアントライブラリは初期化が遅く、 Cloud Functions とは相性が良くないとの情報があり、サーバー側から Firestore を呼ぶ場合、パフォーマンスに懸念あり。  
refs) https://github.com/firebase/firebase-functions/issues/263
Web上にはいくつかの対応方法情報あり。要検証。
e.g.) https://qiita.com/takehilo/items/9ab4a25a02b8328a6d5e

1. POST /admin/positives
    - 未定だが、一旦アプリではなく管理画面からの操作になると想定。
    - フロント側から直接 Firestore に投げる？ API を経由する？
        - 前社の場合、 Firestore の認証をどうするか。
        - 後者の場合、上述のパフォーマンスの懸念がある。
  - Firestore から各端末に同期されるが、補完的にサイレントプッシュを送ることを検討中。
  - 電話番号リサイクル対応のため、最新のユーザーを見る必要がある。
1. DELETE /admin/positives/:id
    - フロント側から直接 Firestore に投げる？ API を経由する？
        - 前社の場合、 Firestore の認証をどうするか。
        - 後者の場合、上述のパフォーマンスの懸念がある。
  - 「陽性判定からn日が経過すれば、陰性とする」という仕様にするのであれば API は不要に出来る。
    - 能動的に削除するのは現実的ではないので、おそらくこちらになる。 by Kawatsu さん

---

以下、現時点で要件不明。MVPには含まれないかも？

#### Analysis

1. GET /admin/contacts
    - クラスター発生状況の分析用に必要になると想定。
