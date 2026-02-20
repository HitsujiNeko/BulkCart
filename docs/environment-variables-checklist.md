# Vercel 環境変数チェックリスト

**最終更新**: 2026-02-20

## 📋 デプロイ前チェック

このチェックリストを使用して、Vercel デプロイ前に環境変数が正しく設定されているか確認してください。

---

## Phase 3-4: 初期デプロイ（必須）

### Supabase 関連（4個）

- [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - 取得元: [Supabase Dashboard](https://app.supabase.com) → Project Settings → API
  - 例: `https://xxxxxxxxxxxx.supabase.co`
  - 環境: Production, Preview, Development

- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - 取得元: Supabase Dashboard → Project Settings → API
  - 例: `eyJhbGc...`
  - 環境: Production, Preview, Development

- [ ] `SUPABASE_SERVICE_ROLE_KEY`
  - 取得元: Supabase Dashboard → Project Settings → API
  - ⚠️ **秘密**: 絶対にクライアントで使用しない
  - 環境: Production のみ

- [ ] `DATABASE_URL`
  - 取得元: Supabase Dashboard → Project Settings → Database → Connection string → URI
  - 例: `postgresql://postgres:[PASSWORD]@db.xxxxxxxxxxxx.supabase.co:5432/postgres`
  - 環境: Production のみ

### Upstash Redis 関連（2個）

- [ ] `UPSTASH_REDIS_REST_URL`
  - 取得元: [Upstash Console](https://console.upstash.com) → Database → REST API → UPSTASH_REDIS_REST_URL
  - 例: `https://xxxx.upstash.io`
  - 環境: Production, Preview, Development

- [ ] `UPSTASH_REDIS_REST_TOKEN`
  - 取得元: Upstash Console → Database → REST API → UPSTASH_REDIS_REST_TOKEN
  - 環境: Production, Preview, Development

### アプリ設定（2個）

- [ ] `NEXT_PUBLIC_APP_URL`
  - 値: `https://bulkcart.vercel.app` (初回デプロイ後に設定)
  - 環境: Production

- [ ] `NODE_ENV`
  - 値: `production`
  - 環境: Production

---

## Phase 7.1: 分析ツール（オプション）

### PostHog（1個）

- [ ] `NEXT_PUBLIC_POSTHOG_KEY`
  - 取得元: [PostHog](https://app.posthog.com) → Project Settings → Project API Key
  - 環境: Production, Preview

- [ ] `NEXT_PUBLIC_POSTHOG_HOST`
  - 値: `https://app.posthog.com` (US) or `https://eu.posthog.com` (EU)
  - 環境: Production, Preview

---

## Phase 7.2: エラーログ（オプション）

### Sentry（2個）

- [ ] `NEXT_PUBLIC_SENTRY_DSN`
  - 取得元: [Sentry](https://sentry.io) → Project Settings → Client Keys (DSN)
  - 環境: Production, Preview

- [ ] `SENTRY_AUTH_TOKEN`
  - 取得元: Sentry → User Settings → Auth Tokens
  - 環境: Production のみ

---

## Phase 9.3: メール配信（オプション）

### Resend（1個）

- [ ] `RESEND_API_KEY`
  - 取得元: [Resend](https://resend.com) → API Keys
  - 環境: Production のみ

---

## Phase 10.1: Stripe 統合（オプション）

### Stripe（3個）

- [ ] `STRIPE_SECRET_KEY`
  - 取得元: [Stripe Dashboard](https://dashboard.stripe.com) → Developers → API keys → Secret key
  - ⚠️ **秘密**: Test key と Live key を使い分ける
  - 環境: Production のみ

- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - 取得元: Stripe Dashboard → Developers → API keys → Publishable key
  - 環境: Production, Preview

- [ ] `STRIPE_WEBHOOK_SECRET`
  - 取得元: Stripe Dashboard → Developers → Webhooks → Add endpoint → Signing secret
  - 環境: Production のみ

---

## 🛠️ 設定方法

### Vercel ダッシュボード

1. [Vercel ダッシュボード](https://vercel.com/dashboard) にログイン
2. BulkCart プロジェクトを選択
3. **Settings → Environment Variables** タブを開く
4. 各変数を追加：
   - **Key**: 変数名
   - **Value**: 値を貼り付け
   - **Environment**: Production / Preview / Development を選択
5. **Save** をクリック

### Vercel CLI（上級者向け）

```powershell
# 変数を追加
vercel env add <変数名> production

# 変数を確認
vercel env ls

# 変数を削除
vercel env rm <変数名> production
```

---

## ✅ 確認方法

### 1. ローカルで確認

```powershell
# .env.local に環境変数が設定されているか確認
cat .env.local

# 開発サーバーで動作確認
npm run dev
```

### 2. Vercel で確認

デプロイ後、以下を確認：

```powershell
# Production URL で動作確認
curl https://bulkcart.vercel.app
```

ブラウザの開発者ツール（F12）→ Console で環境変数エラーがないか確認

---

## ⚠️ セキュリティ注意事項

### 公開してはいけない変数

以下は **絶対に** GitHub や公開ログに含めないこと：

- ❌ `SUPABASE_SERVICE_ROLE_KEY`
- ❌ `DATABASE_URL` (パスワード含む)
- ❌ `STRIPE_SECRET_KEY`
- ❌ `STRIPE_WEBHOOK_SECRET`
- ❌ `RESEND_API_KEY`
- ❌ `SENTRY_AUTH_TOKEN`

### 公開可能な変数（`NEXT_PUBLIC_*`）

以下はクライアント側で使用可能：

- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ `NEXT_PUBLIC_APP_URL`
- ✅ `NEXT_PUBLIC_POSTHOG_KEY`
- ✅ `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

---

## 📚 参考

- [Vercel 環境変数ガイド](https://vercel.com/docs/concepts/projects/environment-variables)
- [Next.js 環境変数](https://nextjs.org/docs/basic-features/environment-variables)
- [Supabase Environment Variables](https://supabase.com/docs/guides/api#environment-variables)

---

**設定完了後、[docs/deployment.md](./deployment.md) の手順に従ってデプロイしてください 🚀**
