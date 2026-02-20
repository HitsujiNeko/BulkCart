# BulkCart デプロイガイド（Vercel）

**最終更新**: 2026-02-20  
**対象環境**: Vercel (無料枠)  
**推定作業時間**: 15分

---

## 📋 目次

1. [前提条件](#前提条件)
2. [Vercel プロジェクト作成](#vercel-プロジェクト作成)
3. [環境変数の設定](#環境変数の設定)
4. [ビルド設定の確認](#ビルド設定の確認)
5. [デプロイ実行](#デプロイ実行)
6. [カスタムドメイン設定](#カスタムドメイン設定)
7. [デプロイ後の確認](#デプロイ後の確認)
8. [トラブルシューティング](#トラブルシューティング)

---

## 前提条件

以下が完了していることを確認してください：

- ✅ Supabase プロジェクトが作成済み（[docs/supabase-setup.md](./supabase-setup.md) 参照）
- ✅ GitHub リポジトリに BulkCart のコードが push 済み
- ✅ `.env.local` に環境変数が設定済み（動作確認済み）
- ✅ Vercel アカウント作成済み（[vercel.com](https://vercel.com) で GitHub 連携）

---

## Vercel プロジェクト作成

### 1. Vercel にログイン

1. [https://vercel.com](https://vercel.com) にアクセス
2. **"Continue with GitHub"** をクリック
3. GitHub での認証を完了

### 2. プロジェクトをインポート

1. Vercel ダッシュボードで **"Add New" → "Project"** をクリック
2. **"Import Git Repository"** セクションで BulkCart リポジトリを検索
3. **"Import"** をクリック

### 3. プロジェクト設定

以下の設定を行います：

| 項目 | 設定値 |
|------|--------|
| **Project Name** | `bulkcart` |
| **Framework Preset** | `Next.js` （自動検出） |
| **Root Directory** | `./` （デフォルト） |
| **Build Command** | `npm run build` （デフォルト） |
| **Output Directory** | `.next` （デフォルト） |
| **Install Command** | `npm install` （デフォルト） |

> **💡 ヒント**: Framework Preset は自動検出されるので、変更不要です。

---

## 環境変数の設定

### 環境変数チェックリスト

以下の環境変数を Vercel に設定します。

#### 必須環境変数（8個）

| 変数名 | 取得元 | 説明 |
|--------|--------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Project Settings → API | Supabase プロジェクトURL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Project Settings → API | Supabase 匿名キー（公開可能） |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Project Settings → API | Supabase サービスロールキー（**秘密**） |
| `DATABASE_URL` | Supabase Dashboard → Project Settings → Database | PostgreSQL 接続文字列 |
| `NEXT_PUBLIC_APP_URL` | Vercel | `https://bulkcart.vercel.app` （デプロイ後に設定） |
| `UPSTASH_REDIS_REST_URL` | Upstash Console | Redis REST API URL |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Console | Redis認証トークン |
| `NODE_ENV` | 手動設定 | `production` |

#### オプション環境変数（フェーズ後半で追加）

| 変数名 | 取得元 | 説明 |
|--------|--------|------|
| `STRIPE_SECRET_KEY` | Stripe Dashboard | Stripe秘密鍵（Phase 10.1で設定） |
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard | Webhook署名検証用（Phase 10.1で設定） |
| `POSTHOG_API_KEY` | PostHog | 分析トラッキング用（Phase 7.1で設定） |
| `SENTRY_DSN` | Sentry | エラートラッキング用（Phase 7.2で設定） |
| `RESEND_API_KEY` | Resend | メール送信用（Phase 9.3で設定） |

### 環境変数の設定手順

#### 方法1: Vercel ダッシュボード（推奨）

1. Vercel プロジェクトページで **"Settings" → "Environment Variables"** タブを開く
2. 各変数を追加：
   - **Key**: 変数名（例: `NEXT_PUBLIC_SUPABASE_URL`）
   - **Value**: 値を貼り付け
   - **Environment**: **Production**, **Preview**, **Development** すべてにチェック
3. **"Save"** をクリック

#### 方法2: Vercel CLI（上級者向け）

```powershell
# Vercel CLI インストール
npm install -g vercel

# ログイン
vercel login

# プロジェクトにリンク
vercel link

# 環境変数を追加
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# 値を入力してEnter

# 他の変数も同様に追加...
```

### ⚠️ セキュリティ注意事項

1. **`SUPABASE_SERVICE_ROLE_KEY` は絶対に公開しないこと**
   - GitHub にコミットしない
   - クライアントサイドコードで使用しない
   - ログに出力しない

2. **`NEXT_PUBLIC_*` プレフィックスの変数のみクライアント公開可能**
   - `NEXT_PUBLIC_SUPABASE_URL` ✅ 公開可能
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` ✅ 公開可能
   - `SUPABASE_SERVICE_ROLE_KEY` ❌ サーバー専用

---

## ビルド設定の確認

### 1. ビルド設定の確認

Vercel プロジェクトページで **"Settings" → "General"** を開き、以下を確認：

| 設定項目 | 推奨値 |
|----------|--------|
| **Node.js Version** | `22.x` （最新LTS） |
| **Build Command** | `npm run build` |
| **Output Directory** | `.next` |
| **Install Command** | `npm install` |
| **Development Command** | `npm run dev` |

### 2. 地域設定（Regions）

- **推奨リージョン**: `sin1` (Singapore) または `nrt1` (Tokyo)
- 日本のユーザーが多い場合は `sin1` が最速

**変更方法**:
1. **Settings → Functions** を開く
2. **Function Region** で `Singapore (sin1)` を選択

---

## デプロイ実行

### 初回デプロイ

1. 環境変数を設定後、Vercel ダッシュボードに戻る
2. **"Deploy"** ボタンをクリック
3. ビルドログをリアルタイムで確認

**ビルド時間**: 約2-4分

### デプロイURL

デプロイ完了後、以下のURLが生成されます：

- **Production**: `https://bulkcart.vercel.app`
- **Preview** (ブランチ別): `https://bulkcart-<branch-name>.vercel.app`

### 自動デプロイ設定

GitHub リポジトリにプッシュすると自動デプロイされます：

| ブランチ | デプロイ先 |
|----------|-----------|
| `main` | Production (`bulkcart.vercel.app`) |
| その他 | Preview (`bulkcart-<branch>.vercel.app`) |

---

## カスタムドメイン設定

### 1. ドメイン追加

1. Vercel プロジェクトページで **"Settings" → "Domains"** を開く
2. **"Add Domain"** をクリック
3. ドメイン名を入力（例: `bulkcart.jp`）
4. **"Add"** をクリック

### 2. DNS レコード設定

Vercel が指示するDNSレコードを、ドメインレジストラ（例: お名前.com, Cloudflare）で設定：

| タイプ | ホスト | 値 |
|--------|--------|-----|
| **A** | `@` | `76.76.21.21` |
| **CNAME** | `www` | `cname.vercel-dns.com` |

### 3. SSL証明書

- Vercel が自動で Let's Encrypt SSL証明書を発行（数分）
- HTTPS が有効化されたことを確認

---

## デプロイ後の確認

### 1. 動作確認チェックリスト

以下を確認してください：

- [ ] トップページ (`/`) が表示される
- [ ] Supabase 接続が成功している（ログイン画面が表示される）
- [ ] 環境変数が正しく読み込まれている（開発者ツール → Console でエラーなし）
- [ ] 画像が表示される
- [ ] レスポンシブデザインが機能している（モバイル表示確認）

### 2. Health Check

以下のエンドポイントで動作確認：

```bash
# Production URL で確認
curl https://bulkcart.vercel.app

# ステータスコード 200 が返ることを確認
```

### 3. Supabase 接続確認

ブラウザの開発者ツール（F12）→ Console で確認：

```javascript
// エラーがないことを確認
// Supabase connection error などがないか
```

### 4. Vercel Analytics 有効化（オプション）

1. Vercel プロジェクトページで **"Analytics"** タブを開く
2. **"Enable Analytics"** をクリック（無料枠: 100k イベント/月）

---

## トラブルシューティング

### ビルドエラー

#### エラー: `Module not found: Can't resolve '...'`

**原因**: 依存パッケージがインストールされていない

**解決策**:
1. ローカルで `npm install` を実行
2. `package.json` と `package-lock.json` を両方コミット
3. 再デプロイ

```powershell
npm install
git add package.json package-lock.json
git commit -m "fix: update dependencies"
git push
```

#### エラー: `Type error: ...`

**原因**: TypeScript コンパイルエラー

**解決策**:
1. ローカルで型チェック実行
```powershell
npm run type-check
```
2. エラーを修正してコミット

---

### 環境変数エラー

#### エラー: `NEXT_PUBLIC_SUPABASE_URL is not defined`

**原因**: 環境変数が設定されていない

**解決策**:
1. Vercel ダッシュボード → **Settings → Environment Variables** を開く
2. 必須変数がすべて設定されているか確認
3. **Redeploy** をクリックして再デプロイ

---

### Supabase 接続エラー

#### エラー: `Failed to connect to Supabase`

**原因**: URL または API キーが間違っている

**解決策**:
1. Supabase ダッシュボードで正しい値を確認
2. Vercel の環境変数を修正
3. 再デプロイ

---

### パフォーマンス問題

#### ページ読み込みが遅い

**解決策**:
1. **画像最適化**: `next/image` を使用しているか確認
2. **バンドルサイズ確認**:
```powershell
npm run build
# Build output で各ページのサイズを確認
```
3. **Vercel Analytics** でパフォーマンス計測

---

## 🚀 次のステップ

デプロイ完了後：

1. **Phase 4.1: 認証基盤実装**
   - Supabase Auth との連携
   - ログイン/サインアップページ作成

2. **Phase 5.1: レシピデータベース構築**
   - 初期レシピデータ投入
   - シードデータ作成

3. **Phase 7.1-7.2: 分析・エラーログ設定**
   - PostHog / Sentry 統合

---

## 📚 参考リンク

- [Vercel 公式ドキュメント](https://vercel.com/docs)
- [Next.js デプロイガイド](https://nextjs.org/docs/deployment)
- [Supabase Production Checklist](https://supabase.com/docs/guides/platform/going-into-prod)
- [Vercel 無料枠制限](https://vercel.com/docs/concepts/limits/overview)

---

## 💰 コスト管理

### Vercel 無料枠（Hobby Plan）

| リソース | 無料枠 | 超過時 |
|----------|--------|--------|
| **デプロイ** | 無制限 | - |
| **ビルド時間** | 100時間/月 | 無効化 |
| **帯域幅** | 100GB/月 | 無効化 |
| **Serverless Functions** | 100GB-時間/月 | 無効化 |
| **Edge Functions** | 100k リクエスト/日 | 無効化 |

> **⚠️ 注意**: 無料枠を超えるとデプロイが無効化されます。アップグレードが必要になります（Pro: $20/月）。

### コスト削減のヒント

1. **画像最適化**: `next/image` で自動最適化（帯域幅削減）
2. **キャッシュ活用**: Vercel Edge Network で静的ファイルキャッシュ
3. **バンドルサイズ削減**: 不要な依存を削除（`npm run build` で確認）

---

**デプロイ完了！筋トレ民のための献立・買い物自動化アプリ BulkCart が稼働中です 💪🚀**
