# Supabase セットアップガイド

**対象**: BulkCart 開発者  
**所要時間**: 約 10 分  
**前提条件**: Node.js 18.17.0以上、npm 9.0.0以上がインストール済み

---

## 目次

1. [Supabase プロジェクト作成](#1-supabase-プロジェクト作成)
2. [環境変数の設定](#2-環境変数の設定)
3. [Supabase CLI のインストール](#3-supabase-cli-のインストール)
4. [データベースマイグレーション実行](#4-データベースマイグレーション実行)
5. [RLS（Row-Level Security）の確認](#5-rlsrow-level-security-の確認)
6. [接続テスト](#6-接続テスト)
7. [トラブルシューティング](#7-トラブルシューティング)

---

## 1. Supabase プロジェクト作成

### 1.1 Supabase アカウント作成

1. https://supabase.com にアクセス
2. **"Start your project"** をクリック
3. GitHub アカウントでサインイン（推奨）または Email で登録

### 1.2 新規プロジェクト作成

1. **"New project"** ボタンをクリック
2. 以下の情報を入力：
   - **Name**: `bulkcart`（または任意の名前）
   - **Database Password**: 強力なパスワードを生成（必ず保存すること）
   - **Region**: `Northeast Asia (Tokyo)` （日本のユーザー向けに最適化）
   - **Pricing Plan**: `Free` （500MB DB、50k MAU まで無料）

3. **"Create new project"** をクリック

### 1.3 プロジェクト初期化待機

- プロジェクトの初期化には約 2〜3 分かかります
- 「Setting up project...」の表示が消えるまで待機

---

## 2. 環境変数の設定

### 2.1 Supabase 認証情報の取得

プロジェクトダッシュボードで以下の手順を実行：

1. 左サイドバーから **"Project Settings"**（⚙️）をクリック
2. **"API"** タブを選択
3. 以下の値をコピー：
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon public key**: `eyJhbG...` で始まる長い文字列
   - **service_role key**: `eyJhbG...` で始まる長い文字列（⚠️ 秘密鍵）

### 2.2 `.env.local` ファイル作成

プロジェクトルートで以下のコマンドを実行：

```powershell
# .env.example をコピー
Copy-Item .env.example .env.local
```

`.env.local` ファイルを開き、以下の値を更新：

```dotenv
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG... # anon public key
SUPABASE_SERVICE_ROLE_KEY=eyJhbG... # service_role key（⚠️ 絶対に公開しない）

# Database URL (for Supabase CLI migrations)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.your-project-id.supabase.co:5432/postgres
```

**⚠️ 重要**: `.env.local` ファイルは絶対に Git にコミットしないこと（`.gitignore` で除外済み）

---

## 3. Supabase CLI のセットアップ

### 3.1 CLI の使用方法（2つの選択肢）

#### 方法1: npx経由で使用（推奨、インストール不要）

```powershell
# インストール不要、そのまま使用可能
npx supabase --version
# 出力例: 1.148.0
```

> **⚠️ 注意**: `npm install -g supabase` はサポート終了しました。npx経由の使用が推奨されています。

#### 方法2: Scoopでインストール（Windows向け）

```powershell
# Scoopがインストールされていない場合（初回のみ）
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression

# Supabase CLIをインストール
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# バージョン確認
supabase --version
```

### 3.2 Supabase にログイン

**npx経由の場合**:
```powershell
npx supabase login
```

**Scoopインストールの場合**:
```powershell
supabase login
```

- ブラウザが開き、認証を求められます
- **"Authorize"** をクリックして CLI を承認

---

## 4. データベースマイグレーション実行

### 4.1 プロジェクトとのリンク

```powershell
# プロジェクトルートで実行
cd c:\work\WebApp\BulkCart

# Supabase プロジェクトにリンク
npx supabase link --project-ref your-project-id
```

> **💡 ヒント**: 以降のコマンドも同様に `npx supabase` として実行してください（Scoopインストール済みの場合は `supabase` のみでOK）。

**`your-project-id` の確認方法**:
- Supabase ダッシュボード → Project Settings → General → Reference ID

### 4.2 マイグレーション実行

```powershell
# マイグレーションを実行
npx supabase db push
```

**実行内容**:
- `supabase/migrations/20260220000000_initial_schema.sql` が実行されます
- 以下のテーブルが作成されます：
  - `user_profiles` - ユーザープロフィール
  - `recipes` - レシピ
  - `ingredients` - 食材
  - `recipe_ingredients` - レシピ-食材中間テーブル
  - `recipe_steps` - レシピ手順
  - `meal_plans` - 献立
  - `meal_slots` - 献立スロット

### 4.3 マイグレーション確認

```powershell
# テーブル一覧を確認
npx supabase db diff
```

または、Supabase ダッシュボードで確認：
1. 左サイドバーから **"Table Editor"** をクリック
2. 7 つのテーブルが作成されていることを確認

---

## 5. RLS（Row-Level Security）の確認

### 5.1 RLS の重要性

BulkCart ではセキュリティのため、**すべてのテーブルに RLS が設定されています**。

- ユーザーは自分のデータのみアクセス可能
- レシピ・食材は全ユーザーが閲覧可能

### 5.2 RLS ポリシーの確認

Supabase ダッシュボードで確認：

1. **"Authentication"** → **"Policies"** をクリック
2. 以下のポリシーが設定されていることを確認：

**user_profiles テーブル**:
- `Users can view own profile` (SELECT)
- `Users can update own profile` (UPDATE)
- `Users can insert own profile` (INSERT)

**recipes テーブル**:
- `Recipes are viewable by all authenticated users` (SELECT)

**meal_plans テーブル**:
- `Users can view own meal plans` (SELECT)
- `Users can insert own meal plans` (INSERT)
- `Users can update own meal plans` (UPDATE)
- `Users can delete own meal plans` (DELETE)

---

## 6. 接続テスト

### 6.1 型定義の生成

Supabase から TypeScript 型定義を生成：

```powershell
# 型定義を生成（types/database.ts を上書き）
npx supabase gen types typescript --project-id your-project-id > types/database.ts
```

### 6.2 開発サーバー起動

```powershell
npm run dev
```

→ http://localhost:3000 で「🥩 BulkCart」が表示されることを確認

### 6.3 Supabase 接続テスト（オプション）

簡易的な接続テストを実行：

```powershell
# Node.js REPL で実行
node
```

```javascript
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://your-project-id.supabase.co',
  'your-anon-key'
);

// レシピテーブルに接続テスト
supabase.from('recipes').select('count').then(console.log);

// 出力例: { data: { count: 0 }, error: null }
```

---

## 7. トラブルシューティング

### 7.1 マイグレーションエラー

**エラー**: `Error: Failed to connect to database`

**解決策**:
1. `DATABASE_URL` が正しいか確認
2. データベースパスワードが正しいか確認（特殊文字はURLエンコードが必要）
3. Supabase ダッシュボードでプロジェクトが起動中か確認

### 7.2 RLS エラー

**エラー**: `new row violates row-level security policy`

**原因**: 認証されていないユーザーがデータを挿入しようとしている

**解決策**:
1. `supabase.auth.signUp()` でユーザーを作成
2. `supabase.auth.signInWithPassword()` でログイン
3. ログイン後に API を実行

### 7.3 型エラー

**エラー**: `Cannot find module '@/types/database'`

**解決策**:
1. `types/database.ts` が存在するか確認
2. `npx supabase gen types` を再実行
3. VS Code を再起動（TypeScript Language Server をリフレッシュ）

### 7.4 CORS エラー

**エラー**: `Access to fetch at 'https://...' from origin 'http://localhost:3000' has been blocked by CORS`

**解決策**:
1. Supabase ダッシュボード → Authentication → URL Configuration
2. **Site URL** に `http://localhost:3000` を追加
3. **Redirect URLs** に `http://localhost:3000/**` を追加

---

## 次のステップ

✅ Supabase セットアップ完了！

**Phase 3.5: Vercel デプロイ設定** に進んでください：

```
Phase 3.5を実行して
```

または、先にシードデータ（レシピ50件）を投入する場合：

```
Phase 5.1のレシピデータベースとシードデータを作成して
```

---

## 参考リンク

- [Supabase 公式ドキュメント](https://supabase.com/docs)
- [Supabase Auth with Next.js](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Row-Level Security (RLS)](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase CLI リファレンス](https://supabase.com/docs/reference/cli)

---

**作成者**: AI Assistant  
**最終更新**: 2026年2月20日
