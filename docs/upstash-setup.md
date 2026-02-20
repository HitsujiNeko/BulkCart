# Upstash Redis セットアップガイド

**最終更新**: 2026-02-20  
**推定作業時間**: 5分  
**コスト**: $0/月（無料枠: 10GB/月）

---

## 📋 目次

1. [Upstash とは](#upstash-とは)
2. [アカウント作成](#アカウント作成)
3. [データベース作成](#データベース作成)
4. [環境変数の設定](#環境変数の設定)
5. [接続確認](#接続確認)
6. [使用例](#使用例)

---

## Upstash とは

**Upstash Redis** は、サーバーレス環境向けの Redis サービスです。

### BulkCart での用途

- **レシピ検索のキャッシュ**: 頻繁に検索されるレシピをキャッシュ（Phase 5.1）
- **献立生成の一時保存**: 生成中の献立を一時保存（Phase 5.2）
- **API レート制限**: ユーザーごとのリクエスト数制限（Phase 10）

### 無料枠

- **リクエスト数**: 10,000 コマンド/日
- **データサイズ**: 256MB
- **帯域幅**: 無制限
- **同時接続**: 100

> **💡 ヒント**: 月間100ユーザーまで無料枠で十分です。

---

## アカウント作成

### 1. Upstash にサインアップ

1. [https://console.upstash.com](https://console.upstash.com) にアクセス
2. **"Sign Up"** をクリック
3. **"Continue with GitHub"** を選択（推奨）
4. GitHub で認証を完了

---

## データベース作成

### 1. Redis データベースを作成

1. Upstash Console で **"Create Database"** をクリック
2. 以下の設定を入力：

| 項目 | 設定値 |
|------|--------|
| **Name** | `bulkcart-redis` |
| **Type** | `Regional` |
| **Region** | `ap-southeast-1` (Singapore) |
| **TLS** | `Enabled` （推奨） |
| **Eviction** | `No eviction` （デフォルト） |

3. **"Create"** をクリック

**作成時間**: 約30秒

### 2. 接続情報を取得

データベース作成後、以下の情報を確認：

1. **Details** タブで以下をコピー：
   - **Endpoint**: `https://xxxx-xxxx.upstash.io`
   - **Port**: `6379`

2. **REST API** タブで以下をコピー：
   - **UPSTASH_REDIS_REST_URL**: `https://xxxx.upstash.io`
   - **UPSTASH_REDIS_REST_TOKEN**: `AXXXXxxxx...`

---

## 環境変数の設定

### ローカル開発環境

`.env.local` に以下を追加：

```bash
# Upstash Redis（REST APIを使用）
UPSTASH_REDIS_REST_URL=https://xxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXXXXxxxx...
```

### Vercel 本番環境

1. [Vercel Dashboard](https://vercel.com/dashboard) → BulkCart プロジェクト
2. **Settings → Environment Variables** タブ
3. 以下の2つを追加：

| Key | Value | Environment |
|-----|-------|-------------|
| `UPSTASH_REDIS_REST_URL` | `https://xxxx.upstash.io` | Production, Preview, Development |
| `UPSTASH_REDIS_REST_TOKEN` | `AXXXXxxxx...` | Production, Preview, Development |

---

## 接続確認

### 1. ローカルでテスト

```powershell
# Node.js REPL で実行
node
```

```javascript
const { Redis } = require('@upstash/redis');

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// 接続テスト
await redis.set('test', 'Hello from BulkCart!');
const result = await redis.get('test');
console.log(result); // 出力: Hello from BulkCart!

// クリーンアップ
await redis.del('test');
```

**✅ 期待される出力**: `Hello from BulkCart!`

### 2. Upstash Console でデータ確認

1. Upstash Console → データベース詳細
2. **CLI** タブで以下を実行：

```bash
# キーの確認
KEYS *

# 値の確認
GET test
```

---

## 使用例

### レシピ検索のキャッシュ

```typescript
// lib/recipe/search.ts
import { redis } from '@/lib/redis';

export async function searchRecipes(tags: string[]) {
  const cacheKey = `recipes:tags:${tags.sort().join(',')}`;
  
  // キャッシュチェック
  const cached = await redis.get<Recipe[]>(cacheKey);
  if (cached) {
    console.log('Cache hit!');
    return cached;
  }
  
  // DB クエリ
  const { data: recipes } = await supabase
    .from('recipes')
    .select('*')
    .contains('tags', tags);
  
  // キャッシュ保存（1時間）
  await redis.setex(cacheKey, 3600, recipes);
  
  return recipes;
}
```

### API レート制限

```typescript
// app/api/plan/generate/route.ts
import { redis } from '@/lib/redis';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const userId = 'user-id'; // 実際は認証から取得
  
  // レート制限チェック（1日1回）
  const rateLimitKey = `ratelimit:plan:${userId}:${new Date().toISOString().split('T')[0]}`;
  const count = await redis.incr(rateLimitKey);
  
  if (count > 1) {
    return NextResponse.json(
      { error: '献立生成は1日1回までです' },
      { status: 429 }
    );
  }
  
  // 24時間後に自動削除
  await redis.expire(rateLimitKey, 86400);
  
  // 献立生成処理...
  return NextResponse.json({ success: true });
}
```

---

## トラブルシューティング

### エラー: `Connection refused`

**原因**: TLS が有効化されていない、またはエンドポイントが間違っている

**解決策**:
1. Upstash Console で TLS が有効か確認
2. `UPSTASH_REDIS_REST_URL` が正しいか確認（`https://` で始まる）

### エラー: `Unauthorized`

**原因**: トークンが間違っている

**解決策**:
1. Upstash Console → REST API タブで正しいトークンを確認
2. `.env.local` と Vercel の環境変数を更新

---

## 📚 参考リンク

- [Upstash 公式ドキュメント](https://docs.upstash.com/redis)
- [@upstash/redis NPM パッケージ](https://www.npmjs.com/package/@upstash/redis)
- [Vercel + Upstash 統合](https://vercel.com/integrations/upstash)

---

**セットアップ完了！Phase 5.1 のレシピ検索でキャッシュを活用できます 🚀**
