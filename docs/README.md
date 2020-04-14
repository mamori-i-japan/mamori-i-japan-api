## API List (🚧 This will be Swaggerized in the near future 🚧)

### APIs for Mobile APP

#### Notification

濃厚接触者への案内メッセージを都道府県ごとくらいの単位で出し分ける。

#### Push Notification

陽性者の追加をトリガーにキックされる。
全ユーザーにサイレントプッシュ？濃厚接触者に通知？そもそも不要？要検討。

#### APP Version

Firebase Remote Config を利用する想定。

### APIs for Admin Panel

以下、現時点で要件不明。MVPには含まれないかも？

#### Analysis

1. GET /admin/contacts
    - クラスター発生状況の分析用に必要になると想定。
