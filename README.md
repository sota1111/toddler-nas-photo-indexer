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
