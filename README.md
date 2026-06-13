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

このアプリは JWT 認証を使用しています。

### 環境変数の設定

`.env.example` をコピーして `.env` を作成し、以下の変数を設定してください：

```env
AUTH_USERNAME=your_username
AUTH_PASSWORD=your_password
AUTH_SECRET_KEY=your_secret_key_at_least_32_chars
```

### ログイン

アプリにアクセスすると自動的にログイン画面へリダイレクトされます。
設定した `AUTH_USERNAME` / `AUTH_PASSWORD` でログインしてください。

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
echo -n "パスワード" | gcloud secrets create nas-indexer-auth-password --data-file=- --project=YOUR_PROJECT_ID
echo -n "秘密鍵" | gcloud secrets create nas-indexer-auth-secret-key --data-file=- --project=YOUR_PROJECT_ID

# Cloud Run サービスアカウントに Secret Manager アクセス権を付与
# (デプロイ後、またはデフォルトのコンピュートSAに付与)
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:YOUR_PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

ローカル開発では `.env` ファイルに値を直接設定してください。


### GCP 実行環境

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

| 変数名 | 説明 |
|--------|------|
| AUTH_USERNAME | 認証ユーザー名 |
| AUTH_PASSWORD | 認証パスワード（Secret Manager 推奨） |
| AUTH_SECRET_KEY | JWT署名キー（Secret Manager 推奨） |

### 注意事項

- 実際の `.env` ファイルは Git 管理対象外 (`.gitignore` 設定済み)
- NAS の接続情報・パスは `.env` で管理し、コードに直書きしないこと
