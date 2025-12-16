# NFT Airdrop System

## 位置情報認証機能

このシステムには位置情報を使用したNFT受け取り制限機能が実装されています。

### 設定手順

1. **Google Maps APIキーの取得**
   - [Google Cloud Console](https://console.cloud.google.com/)でプロジェクトを作成
   - Maps JavaScript APIを有効化
   - APIキーを作成

2. **環境変数の設定**
   ```bash
   cp .env.example .env.local
   ```

   `.env.local`に以下を設定：
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   NEXT_PUBLIC_SERVER_URL=http://localhost:3001
   ```

3. **位置情報認証の使用方法**
   - 管理画面でコレクション編集
   - 「位置情報認証」をONに設定
   - 地図上で受け取り可能範囲を設定
   - または手動で緯度経度を入力

### 位置情報認証機能

- **地図上での範囲設定**: Google Mapsを使用して直感的に範囲を設定
- **矩形範囲チェック**: 左上・右下座標で定義された範囲内での受け取り制限
- **モバイル限定**: 位置情報認証はモバイルデバイスでのみ利用可能
- **セキュリティ**: JWTトークンとデバイス・IPハッシュで横流し防止
- **短命トークン**: 認証トークンは5分間有効

## TODO
- CloudStorageに画像をアップロードする前にCORSを設定する必要があります
- CORS設定コマンドはこちら

```
gsutil cors set cors_setting.json gs://tokken
```# gittest
