# Toddler NAS Photo Indexer

NAS連携型 一歳児家庭向け写真・動画インデックスアプリのバックエンド。

## 概要

このアプリは、自宅のNASに保存されている写真や動画のメタデータ（ファイルパス、日付、月齢、イベント名、タグなど）を管理し、簡単に検索・閲覧できるようにするためのものです。実際のファイルはNAS上に残したまま、インデックスのみをSQLiteデータベースで管理します。

## セットアップ

### ローカル環境での実行

1.  Python 3.12以上がインストールされていることを確認してください。
2.  バックエンドディレクトリに移動します。
    ```bash
    cd backend
    ```
3.  依存パッケージをインストールします。
    ```bash
    pip install -r requirements.txt
    ```
4.  サンプルデータを投入します。
    ```bash
    python -m app.seed
    ```
5.  サーバーを起動します。
    ```bash
    uvicorn app.main:app --reload
    ```

APIは `http://localhost:8000` で起動します。
Swagger UI (APIドキュメント) は `http://localhost:8000/docs` で確認できます。

### Dockerを使用する場合

1.  プロジェクトのルートディレクトリで以下のコマンドを実行します。
    ```bash
    docker-compose up
    ```

## APIエンドポイント

### メディア管理
- `POST   /api/media` — 新規登録
- `GET    /api/media` — 一覧取得 (フィルタリング・検索可能)
- `GET    /api/media/{id}` — 詳細取得
- `PUT    /api/media/{id}` — 更新
- `DELETE /api/media/{id}` — 削除
- `PATCH  /api/media/{id}/favorite` — お気に入り切り替え

### フィルタリング・分析
- `GET    /api/media/by-age/{age_months}` — 月齢別一覧
- `GET    /api/media/by-event/{event_name}` — イベント別一覧
- `GET    /api/media/search?q=keyword` — キーワード検索
- `GET    /api/media/tags` — ユニークなタグ一覧
- `GET    /api/media/events` — ユニークなイベント名一覧
- `GET    /api/media/age-groups` — 月齢別グループと件数

## 認証設定

このアプリは Firebase Authentication を使用しており、フロントエンドとバックエンドで役割を分担しています。

### 責務分離 (Responsibility Split)

-   **Backend (FastAPI)**: API専用サーバーです。`/login` などのUIは持ちません。
    -   Frontend から送られてきた Firebase **ID Token** を `firebase_admin.verify_id_token` で検証します。
    -   `ALLOWED_USER_EMAILS` に含まれるユーザーのみ許可し、HMAC署名付きのセッションCookie (`auth_token`) を発行します。
    -   以降のリクエストではこの Cookie を検証して認可を行います。
-   **Frontend (React)**: `/login` 画面を提供し、認証フローを開始します。
    -   Firebase クライアントSDK (`VITE_FIREBASE_*`) を使用してサインインし、ID Token を取得します。
    -   取得した ID Token を `POST /api/auth/session` に送信してセッションを開始します。

### 環境変数の設定

`.env.example` を参考に、役割ごとに以下の変数を設定してください。

#### Frontend (Firebase設定)
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_APP_ID`

#### Backend (認証・認可)
- `ALLOWED_USER_EMAILS`: 許可するメールアドレス（カンマ区切り）
- `AUTH_SECRET`: セッションCookie署名用のランダムな文字列
- `GOOGLE_CLOUD_PROJECT`: ID Token検証に使用するGCPプロジェクトID
- `CORS_ORIGINS`: フロントエンドのURL（例: `http://localhost:5173`）

### ログインフロー

1. アプリ（Frontend）にアクセスすると、未認証の場合は `/login` 画面が表示されます。
2. Google 認証やメールアドレス/パスワード等（設定による）でサインインします。
3. Frontend が ID Token を取得し、Backend の `/api/auth/session` に送信します。
4. Backend がセッションCookieを発行し、以降の API 利用が可能になります。

## GCP デプロイ準備

### 概要

このアプリは FastAPI (Backend) + React (Frontend) 構成であり、Cloud Run にデプロイできます。

**重要**: NAS 上の写真・動画ファイル本体は GCP に保存しません。GCP 側はメタデータ管理と検索機能のみを担当します。

### コンテナ化

```bash
# Backend
docker build -t toddler-nas-photo-indexer-backend ./backend
docker run -p 8000:8000 --env-file .env toddler-nas-photo-indexer-backend

# Frontend
docker build -t toddler-nas-photo-indexer-frontend ./frontend
docker run -p 8080:8080 toddler-nas-photo-indexer-frontend
```
### GCP Secret Manager セットアップ (Cloud Run本番デプロイ時)

Cloud Run へのデプロイ前に、以下の機密情報をSecret Managerに登録してください。

```bash
# Secret の作成
echo -n "your-random-secret" | gcloud secrets create AUTH_SECRET --data-file=- --project=YOUR_PROJECT_ID
echo -n "user@example.com" | gcloud secrets create ALLOWED_USER_EMAILS --data-file=- --project=YOUR_PROJECT_ID

# Cloud Run サービスアカウントに Secret Manager アクセス権を付与
# (デプロイ後、またはデフォルトのコンピュートSAに付与)
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:YOUR_PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

ローカル開発では `.env` ファイルに値を直接設定してください。


### GCP 実行環境

- **判断: Frontend のデプロイは必須 (Required)**
    - 理由: `/login` 画面の提供と Firebase クライアントサインイン（ID Token 発行）を Frontend が担うため、Backend だけでは認証フローが成立しません。
- **Backend**: Cloud Run (ポート `8000`)
- **Frontend**: Cloud Run (ポート `8080`) または Firebase Hosting

### データ永続化について

現在 SQLite を使用しています。Cloud Run はステートレスなため、本番環境では以下を検討してください:

- メタデータ: **Firestore** または **Cloud SQL** への移行
- NAS ファイル: ローカル NAS に残し、バックエンドが NAS に接続する構成

### NAS 接続について

- GCP 上の Cloud Run から直接 NAS へのアクセスには VPN または別の接続方法が必要
- 将来的には NAS 側にエージェントを置き、GCP に同期する方式を検討

### 環境変数

| 変数名 | 担当 | 説明 |
|--------|------|------|
| `VITE_FIREBASE_API_KEY` | Frontend | Firebase API Key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Frontend | Firebase Auth Domain |
| `VITE_FIREBASE_PROJECT_ID` | Frontend | Firebase Project ID |
| `VITE_FIREBASE_APP_ID` | Frontend | Firebase App ID |
| `ALLOWED_USER_EMAILS` | Backend | 許可するメールアドレス（カンマ区切り） |
| `AUTH_SECRET` | Backend | セッションCookie署名用シークレット |
| `GOOGLE_CLOUD_PROJECT` | Backend | ID Token検証用GCPプロジェクトID |
| `CORS_ORIGINS` | Backend | 許可するオリジン（フロントエンドのURL） |

### 注意事項

- 実際の `.env` ファイルは Git 管理対象外 (`.gitignore` 設定済み)
- NAS の接続情報・パスは `.env` で管理し、コードに直書きしないこと
