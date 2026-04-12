# FitLog

トレーニングを記録して、成長を可視化するWebアプリケーションです。

## 機能

- **トレーニング記録** — 日付・部位・種目・セット（重量・回数）を記録
- **カレンダー表示** — 月ごとにトレーニング実施日を確認、日付クリックで内容をプレビュー
- **グラフ分析**
  - 総ボリューム（重量 × 回数の合計）の棒グラフ（全体 / 部位別 / 種目別）
  - 推定1RMの折れ線グラフ
  - 期間フィルター：1ヶ月 / 3ヶ月 / 1年 / 全期間
- **フレンド機能** — フレンド申請・承認・削除、フレンドのトレーニングを閲覧
- **Google OAuth ログイン**
- **レスポンシブ対応** — デスクトップは2カラム、モバイルはタブ切り替え

## 技術スタック

| レイヤー | 技術 |
|---|---|
| フロントエンド | Next.js 16 (App Router) / React 19 / TypeScript |
| スタイリング | Tailwind CSS v4 |
| 状態管理 | TanStack Query v5 / Zustand v5 |
| グラフ | Recharts v3 |
| バックエンド | Ruby on Rails 8.1 (API モード) |
| データベース | PostgreSQL 16 |
| 認証 | Google OAuth 2.0 (OmniAuth) / JWT |
| インフラ | Docker / AWS ECS Fargate / ECR / RDS / ALB / CloudFront |
| CI/CD | GitHub Actions |

## ディレクトリ構成

```
fitlog/
├── docker-compose.yml
├── my-next-app/          # Next.js フロントエンド
│   └── src/
│       ├── app/          # App Router ページ
│       ├── components/   # UIコンポーネント
│       └── lib/          # hooks / API / store / types
└── my-rails-api/         # Rails API バックエンド
    ├── app/
    │   ├── controllers/
    │   ├── models/
    │   └── ...
    └── db/
        └── schema.rb
```

## セットアップ

### 必要なもの

- Docker / Docker Compose
- Google Cloud Console のOAuth 2.0 クライアントID

### 環境変数

プロジェクトルートに `.env` ファイルを作成してください。

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
POSTGRES_PASSWORD=your_db_password
SECRET_KEY_BASE=your_secret_key_base
FRONTEND_URL=http://localhost:3000
```

### 起動

```bash
# コンテナをビルド・起動
docker compose up --build

# DBのセットアップ（初回のみ）
docker compose exec rails bin/rails db:create db:migrate db:seed
```

ブラウザで `http://localhost:3000` を開いてください。

### テスト実行

```bash
docker compose exec rails bin/rspec
```

## データベース構成

```
users
  └── body_parts (部位)
        └── exercises (種目)
              └── workout_logs (トレーニングログ)
                    └── workout_sets (セット詳細)

users ←→ users (friendships: フレンド関係)
```

## Google Cloud Console 設定

1. [Google Cloud Console](https://console.cloud.google.com/) でプロジェクトを作成
2. 「APIとサービス」→「認証情報」→「OAuth 2.0 クライアント ID」を作成
3. 承認済みリダイレクト URI に以下を追加：
   - ローカル: `http://localhost:3001/api/v1/auth/google/callback`
   - 本番: `https://d3e9xoft44wqjy.cloudfront.net/api/v1/auth/google/callback`
4. 取得した Client ID / Secret を `.env` に設定

## 本番インフラ構成（AWS）

```
ブラウザ
  ↓ HTTPS
CloudFront (d3e9xoft44wqjy.cloudfront.net)
  ↓ HTTP（VPC内部通信）
ALB (Application Load Balancer)
  ├── /api/* → Rails API (ECS Fargate)
  └── /*     → Next.js  (ECS Fargate)
                    ↓
              PostgreSQL (RDS)
```

### HTTPS対応

カスタムドメインを持たないため、CloudFrontのデフォルトドメイン（`*.cloudfront.net`）でHTTPSを実現。CloudFrontがSSL証明書を管理し、ブラウザ〜CloudFront間はHTTPS、CloudFront〜ALB間はVPC内部のHTTP通信。

### Google OAuth対応

Rails側で `config.assume_ssl = true` を設定し `X-Forwarded-Proto` ヘッダーを信頼することで、コールバックURLを `https://` で生成。Google OAuthの本番環境要件に対応。

### ALBパスベースルーティング

| 条件 | 転送先 |
|------|--------|
| `/api/*` | Rails ターゲットグループ |
| `/*` | Next.js ターゲットグループ |

### CI/CD（GitHub Actions）

`main` ブランチへのプッシュで自動デプロイ。Rails → Next.js の順にビルド・ECRプッシュ・ECSデプロイを実行。

必要なGitHub Secrets:

| 変数名 | 説明 |
|--------|------|
| `AWS_ACCESS_KEY_ID` | AWSアクセスキー |
| `AWS_SECRET_ACCESS_KEY` | AWSシークレットキー |
| `AWS_REGION` | AWSリージョン |
| `RAILS_ECR_REPOSITORY` | Rails用ECRリポジトリ名 |
| `NEXT_ECR_REPOSITORY` | Next.js用ECRリポジトリ名 |
| `ECS_CLUSTER` | ECSクラスター名 |
| `ECS_RAILS_TASK_DEFINITION` | RailsタスクDefinition名 |
| `ECS_NEXT_TASK_DEFINITION` | Next.jsタスクDefinition名 |
| `ECS_RAILS_SERVICE_ARN` | RailsサービスARN |
| `ECS_NEXT_SERVICE_ARN` | Next.jsサービスARN |
| `RAILS_CONTAINER_NAME` | Railsコンテナ名 |
| `NEXT_CONTAINER_NAME` | Next.jsコンテナ名 |
| `DATABASE_URL` | RDS接続URL |
| `SECRET_KEY_BASE` | Rails秘密鍵 |
| `GOOGLE_CLIENT_ID` | Google OAuthクライアントID |
| `GOOGLE_CLIENT_SECRET` | Google OAuthクライアントシークレット |
| `FRONTEND_URL` | Next.jsのURL（CORS設定用） |
| `NEXT_PUBLIC_RAILS_API_URL` | RailsのURL（Next.jsビルド時埋め込み） |
