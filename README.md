# 🥩 BulkCart

**筋トレ民向け献立・買い物自動化アプリ**

増量・減量・維持の目標に合わせて、週次献立を自動生成。買い物リストと作り置き段取りで、筋トレ飯の継続を最大化します。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com/)

---

## 📋 目次

- [概要](#概要)
- [主な機能](#主な機能)
- [技術スタック](#技術スタック)
- [セットアップ](#セットアップ)
- [開発](#開発)
- [デプロイ](#デプロイ)
- [ドキュメント](#ドキュメント)
- [貢献](#貢献)
- [ライセンス](#ライセンス)

---

## 🎯 概要

**BulkCart** は、筋トレをする人のために設計された献立・買い物自動化サービスです。

### ターゲットユーザー

- **増量学生**: たんぱく質140g/日を目指す、バイト代で自炊頑張る学生
- **減量社会人**: 平日は15分調理、外食を減らして食費節約したい会社員
- **コスパ中級者**: PFC管理はできるが、マンネリ解消と効率化を求める筋トレ中級者

### 解決する課題

- ❌ **献立マンネリ**: 鶏むね・卵・白米のループから抜け出せない
- ❌ **買い物の手間**: 何をどれだけ買えばいいか分からない、食材ロス多い
- ❌ **意思決定疲れ**: 「今日何食べよう」の毎日の悩み
- ❌ **PFC計算の面倒さ**: 増量/減量期の栄養管理が続かない

### BulkCartの価値提案

✅ **週次献立を自動生成**: 増量/減量/維持の目標に合わせて、7日×2食=14食を最適化  
✅ **買い物リスト自動作成**: 食材を集約してカテゴリ別に表示、コピー＆LINE送信可能  
✅ **作り置き段取り表**: 日曜60分で1週間分を準備、タイムライン形式で効率化  
✅ **食材共通化で節約**: 同じ食材を使いまわして買い物リストを最小化、食材ロス削減

---

## ✨ 主な機能

### MVP（最小機能版）

| 機能 | 説明 | 無料プラン | Proプラン |
|---|---|---|---|
| **オンボーディング** | 目標（増量/減量/維持）、体重、調理時間、アレルギーを入力 | ✅ | ✅ |
| **週次献立生成** | 7日×2食（昼・夜）を自動生成、PFC目標達成 | 月1回 | 無制限 |
| **買い物リスト** | カテゴリ別に食材を表示、価格推定、チェック機能 | ✅ | ✅ |
| **作り置き段取り** | 日曜60分のタイムライン表示、効率的な調理順序 | ✅ | ✅ |
| **レシピ詳細** | 材料、調理手順、栄養情報、PFC値 | ✅ | ✅ |
| **献立履歴** | 過去の献立を閲覧、再利用 | 直近1週分 | 無制限 |

### 開発予定機能（Phase 6以降）

- 🔄 **献立の部分変更**: 特定の日だけレシピを入れ替え
- 🔄 **お気に入りレシピ**: よく使うレシピをブックマーク
- 🔄 **カスタムレシピ追加**: ユーザー独自のレシピを登録
- 🔄 **栄養分析ダッシュボード**: 週次・月次のPFC達成率グラフ
- 🔄 **LINE通知**: 買い物リマインド、作り置きDay通知

---

## 🛠 技術スタック

### Frontend

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **UI Library**: [React 18](https://react.dev/)
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)

### Backend

- **API**: Next.js API Routes (Serverless Functions)
- **Business Logic**: TypeScript functions in `lib/` directory
- **Database**: [PostgreSQL 15](https://www.postgresql.org/) (Supabase)
- **Authentication**: [Supabase Auth](https://supabase.com/auth)
- **Cache**: [Upstash Redis](https://upstash.com/)

### Infrastructure

- **Hosting**: [Vercel](https://vercel.com/) (無料枠)
- **Database Hosting**: [Supabase](https://supabase.com/) (無料枠: 500MB DB, 50k MAU)
- **Cache Hosting**: [Upstash](https://upstash.com/) (無料枠: 10GB/月)
- **Payments**: [Stripe](https://stripe.com/)
- **Analytics**: [PostHog](https://posthog.com/) (無料枠: 100万イベント/月)
- **Error Tracking**: [Sentry](https://sentry.io/) (無料枠: 5,000イベント/月)

### Development Tools

- **Package Manager**: npm or pnpm
- **Linting**: ESLint
- **Formatting**: Prettier
- **Testing**: Vitest (unit tests), Playwright (E2E tests)
- **Git Hooks**: Husky

### 月額コスト

**MVP期（0-100ユーザー）**: **$0/月** 🎉

全ての技術が無料枠で動作します。詳細は [docs/architecture-simple.md](docs/architecture-simple.md) を参照。

---

## 🚀 セットアップ

### 前提条件

- Node.js 18.17以上
- npm または pnpm
- Git

### 1. リポジトリをクローン

```bash
git clone https://github.com/YOUR_USERNAME/bulkcart.git
cd bulkcart
```

### 2. 依存関係をインストール

```bash
npm install
# または
pnpm install
```

### 3. 環境変数を設定

`.env.example` をコピーして `.env.local` を作成:

```bash
cp .env.example .env.local
```

以下の環境変数を設定してください:

#### Supabase（必須）

1. [Supabase](https://supabase.com/) でプロジェクトを作成（5分）
2. Project Settings → API から以下をコピー:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

#### Upstash Redis（任意、キャッシュ用）

1. [Upstash](https://upstash.com/) でRedisデータベースを作成（3分）
2. REST API タブから以下をコピー:

```env
UPSTASH_REDIS_REST_URL=https://your-redis-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token-here
```

#### その他（開発時は不要）

- **Stripe**: [Phase 10] 有料化時に設定
- **PostHog**: [Phase 7] 分析導入時に設定
- **Sentry**: [Phase 7] エラー監視導入時に設定

### 4. データベースをセットアップ

Supabaseでマイグレーションを実行:

```bash
# Supabase CLIをインストール（初回のみ）
npm install -g supabase

# Supabaseにログイン
supabase login

# ローカル開発環境を起動（Dockerが必要）
supabase start

# マイグレーションを実行（Phase 5.1完了後）
supabase db push

# 初期データ投入（Phase 5.1完了後）
supabase db seed
```

### 5. 開発サーバーを起動

```bash
npm run dev
```

http://localhost:3000 でアプリが起動します。

---

## 💻 開発

### ディレクトリ構造

```
BulkCart/
├── app/                    # Next.js App Router
│   ├── (auth)/             # 認証ページ
│   ├── (app)/              # メインアプリ（認証必須）
│   └── api/                # API Routes
├── components/             # Reactコンポーネント
│   ├── ui/                 # shadcn/ui コンポーネント
│   ├── layout/             # Header, Navigation等
│   ├── plan/               # 献立関連
│   ├── grocery/            # 買い物リスト関連
│   └── recipe/             # レシピ関連
├── lib/                    # ビジネスロジック層
│   ├── supabase/           # Supabaseクライアント
│   ├── auth/               # 認証ヘルパー
│   ├── recipe/             # レシピ検索
│   ├── planner/            # 献立生成エンジン
│   │   ├── generate.ts     # メイン関数
│   │   ├── scoring.ts      # スコアリング
│   │   ├── filters.ts      # フィルタリング
│   │   ├── grocery.ts      # 買い物リスト生成
│   │   └── prep.ts         # 作り置き段取り生成
│   └── nutrition/          # 栄養計算
├── types/                  # TypeScript型定義
├── supabase/               # Supabaseマイグレーション
├── docs/                   # ドキュメント
└── .github/                # GitHub設定
```

詳細なアーキテクチャは [docs/architecture-simple.md](docs/architecture-simple.md) を参照。

### コーディング規約

- **TypeScript strict mode**: `any`型は使用禁止（理由コメント必須の場合のみ）
- **Functional components**: React Hooks使用
- **CSS**: Tailwind CSSのみ（CSS Modulesは不使用）
- **Import順序**: React → Next.js → 外部ライブラリ → 内部モジュール

### 主要コマンド

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# 本番環境で起動
npm start

# Lint
npm run lint

# フォーマット
npm run format

# 型チェック
npm run type-check

# テスト（Unit）
npm run test

# テスト（E2E）
npm run test:e2e

# Supabaseマイグレーション作成
supabase migration new migration_name

# Supabaseマイグレーション適用
supabase db push
```

---

## 🌐 デプロイ

### Vercelへのデプロイ（推奨）

1. [Vercel](https://vercel.com/) でアカウント作成
2. GitHubリポジトリを接続
3. Environment Variablesを設定（`.env.example`参照）
4. Deploy

詳細は [docs/deployment.md](docs/deployment.md)（Phase 3.5で作成）を参照。

### 本番環境チェックリスト

- [ ] Supabase Production プロジェクト作成済み
- [ ] 環境変数が本番用に設定済み
- [ ] データベースマイグレーション実行済み
- [ ] 初期レシピデータ投入済み
- [ ] Stripe本番環境設定済み（有料化時）
- [ ] カスタムドメイン設定済み（オプション）

---

## 📚 ドキュメント

### 設計ドキュメント

- [PRD（要件定義書）](docs/prd.md) - 詳細な機能要件とKPI
- [データベース設計](docs/database-design.md) - ER図、テーブル定義、RLS
- [API仕様書](docs/api-specification.md) - 14エンドポイントの詳細
- [献立生成アルゴリズム](docs/meal-planner-algorithm.md) - スコアリング関数、Greedy Algorithm
- [シンプルアーキテクチャ](docs/architecture-simple.md) - コストゼロの技術構成

### UI設計

- [画面フロー](docs/ui-design/screen-flow.md) - Mermaid遷移図
- [ワイヤーフレーム](docs/ui-design/wireframes.md) - 7画面のASCII図
- [コンポーネント一覧](docs/ui-design/components.md) - shadcn/ui構成

### 開発ガイド

- [Supabaseセットアップ](docs/supabase-setup.md)（Phase 3.4で作成）
- [デプロイ手順](docs/deployment.md)（Phase 3.5で作成）
- [パフォーマンス最適化](docs/performance-checklist.md)（Phase 8.2で作成）
- [トラブルシューティング](docs/troubleshooting.md)（Phase 8.4で作成）

### プロジェクト管理

- [タスクプロンプト](.github/task.prompt.md) - AI実行可能な開発タスク一覧

---

## 🤝 貢献

BulkCartへの貢献を歓迎します！

### Issue作成

バグ報告や機能提案は [GitHub Issues](https://github.com/YOUR_USERNAME/bulkcart/issues) で作成してください。

- **Bug Report**: [.github/ISSUE_TEMPLATE/bug_report.md](.github/ISSUE_TEMPLATE/bug_report.md)
- **Feature Request**: [.github/ISSUE_TEMPLATE/feature_request.md](.github/ISSUE_TEMPLATE/feature_request.md)
- **Question**: [.github/ISSUE_TEMPLATE/question.md](.github/ISSUE_TEMPLATE/question.md)

### Pull Request作成

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. コミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. Pull Requestを作成（テンプレートに従って記入）

詳細は [.github/pull_request_template.md](.github/pull_request_template.md) を参照。

---

## 📄 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。詳細は [LICENSE](LICENSE) を参照してください。

---

## 👨‍💻 開発者

**BulkCart** は筋トレ民による筋トレ民のためのプロジェクトです。

- **GitHub**: [@YOUR_USERNAME](https://github.com/YOUR_USERNAME)
- **Twitter**: [@YOUR_HANDLE](https://twitter.com/YOUR_HANDLE)

---

## 🙏 謝辞

- [Next.js](https://nextjs.org/) - フロントエンドフレームワーク
- [Supabase](https://supabase.com/) - バックエンドインフラ
- [shadcn/ui](https://ui.shadcn.com/) - UIコンポーネント
- [Vercel](https://vercel.com/) - ホスティング
- 全てのOSSコントリビューターに感謝 🎉

---

## 📞 サポート

質問や問題がありましたら:

- 📧 Email: support@bulkcart.jp (準備中)
- 💬 Discord: [BulkCart Community](https://discord.gg/bulkcart) (Phase 9.5で作成)
- 🐦 Twitter: [@BulkCartApp](https://twitter.com/bulkcartapp) (準備中)

---

**Let's bulk together! 💪🥩**
