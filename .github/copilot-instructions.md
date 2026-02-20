# BulkCart - GitHub Copilot Instructions

このファイルは GitHub Copilot が BulkCart プロジェクトのコードを生成する際に従うべき規約とアーキテクチャ原則を定義します。

---

## 🎯 プロジェクト概要

**BulkCart** は筋トレ民向け献立・買い物自動化アプリです。

- **目標**: 増量/減量/維持に合わせた週次献立を自動生成
- **技術スタック**: Next.js 14 (App Router), Supabase, shadcn/ui
- **アーキテクチャ原則**: コストゼロ設計（月間100ユーザーまで$0/月）

---

## 📐 アーキテクチャ原則

### 1. コストゼロ設計（最重要）

**すべての実装は無料枠サービスのみを使用すること**

- ✅ Vercel (無料枠: 無制限デプロイ)
- ✅ Supabase Free (500MB DB, 50k MAU)
- ✅ Upstash Redis Free (10GB/月)
- ✅ Stripe (取引手数料のみ)
- ❌ Railway/Render などの有料サーバー（**絶対に使用禁止**）
- ❌ AWS Lambda (Vercel Functions で代替)

### 2. 3層アーキテクチャ

```
Frontend (React/Next.js)
    ↓
API Routes (app/api/)
    ↓
Business Logic (lib/*)
    ↓
Supabase (PostgreSQL + Auth)
```

**重要**: MCP Server は使用しない。すべてのビジネスロジックは `lib/*` 内の TypeScript 関数として実装する。

### 3. ディレクトリ構造

```
app/
├── (auth)/          # 認証ページ（ログイン/サインアップ）
├── (app)/           # メインアプリ（認証必須）
│   ├── plan/        # 献立関連
│   ├── recipes/     # レシピ詳細
│   └── settings/    # 設定
├── api/             # API Routes
│   ├── plan/        # 献立生成API
│   ├── recipes/     # レシピ検索API
│   └── webhooks/    # Stripe Webhook等
└── page.tsx         # ランディングページ

components/
├── ui/              # shadcn/ui コンポーネント
├── layout/          # Header, Navigation等
├── plan/            # 献立関連コンポーネント
├── grocery/         # 買い物リスト関連
└── recipe/          # レシピ関連

lib/
├── supabase/        # Supabaseクライアント（client.ts, server.ts）
├── auth/            # 認証ヘルパー
├── recipe/          # レシピ検索ロジック
│   └── search.ts    # タグフィルタ、アレルギー除外等
├── planner/         # 献立生成エンジン
│   ├── generate.ts  # メイン関数（Greedy Algorithm）
│   ├── scoring.ts   # スコアリング関数
│   ├── filters.ts   # 制約条件フィルタ
│   ├── grocery.ts   # 買い物リスト生成
│   └── prep.ts      # 作り置き段取り生成
├── nutrition/       # 栄養計算
│   └── calculate.ts # PFC計算
├── stripe.ts        # Stripe統合
└── redis.ts         # Upstash Redis

types/               # TypeScript型定義
├── database.ts      # Supabaseテーブル型
├── api.ts           # API Request/Response型
└── models.ts        # ドメインモデル型
```

---

## 💻 コーディング規約

### TypeScript

**strict mode 必須**

```typescript
// ✅ 良い例
function calculatePFC(recipe: Recipe): NutritionInfo {
  return {
    protein: recipe.protein_per_serving,
    fat: recipe.fat_per_serving,
    carbs: recipe.carbs_per_serving,
    calories: recipe.calories_per_serving,
  };
}

// ❌ 悪い例（any型は禁止）
function calculatePFC(recipe: any) {
  // ...
}
```

**`any` 型は原則禁止**（やむを得ない場合は `// @ts-expect-error: [理由]` でコメント必須）

**型定義の場所**
- Supabase テーブル型: `types/database.ts`
- API Request/Response: `types/api.ts`
- ドメインモデル: `types/models.ts`

### React

**Functional Components のみ使用**

```typescript
// ✅ 良い例
'use client';

import { useState } from 'react';

export function PlanGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  
  return (
    <div>
      <Button onClick={() => setIsLoading(true)}>
        献立生成
      </Button>
    </div>
  );
}

// ❌ 悪い例（Class Component禁止）
class PlanGenerator extends React.Component {
  // ...
}
```

**Hooks ルール**
- `useState`, `useEffect`, `useCallback`, `useMemo` を適切に使用
- Custom Hooks は `hooks/` ディレクトリに配置（例: `hooks/useAuth.ts`）

### CSS/Styling

**Tailwind CSS のみ使用（CSS Modules 禁止）**

```typescript
// ✅ 良い例
<div className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-md">
  <h2 className="text-2xl font-bold text-gray-900">週次献立</h2>
  <p className="text-gray-600">7日×2食を自動生成します</p>
</div>

// ❌ 悪い例（CSS Modules禁止）
import styles from './plan.module.css';
<div className={styles.container}>...</div>
```

**レスポンシブデザイン（モバイルファースト）**

```typescript
<div className="w-full md:w-1/2 lg:w-1/3">
  {/* モバイル: 100%, タブレット: 50%, デスクトップ: 33.33% */}
</div>
```

### Import 順序

**必ず以下の順序で import すること**

```typescript
// 1. React
import { useState, useEffect } from 'react';

// 2. Next.js
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// 3. 外部ライブラリ
import { z } from 'zod';
import { useForm } from 'react-hook-form';

// 4. 内部モジュール（絶対パス）
import { Button } from '@/components/ui/button';
import { generatePlan } from '@/lib/planner/generate';
import type { Recipe } from '@/types/models';

// 5. 相対パス（同じディレクトリ内のみ）
import { PlanCard } from './plan-card';
```

---

## 🔐 セキュリティ原則

### 1. Row-Level Security (RLS) 必須

**すべての Supabase テーブルに RLS を設定すること**

```sql
-- ✅ 良い例
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  goal TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 有効化
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- ポリシー作成
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);
```

### 2. 環境変数管理

**絶対に `.env` ファイルを使用しない（`.env.local` のみ）**

```typescript
// ✅ 良い例（公開可能な変数）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

// ✅ 良い例（サーバーサイド専用）
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// ❌ 悪い例（Service Role Key をクライアントで使用禁止）
'use client';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // これは危険
```

**環境変数の命名規則**
- クライアントサイド: `NEXT_PUBLIC_*` プレフィックス必須
- サーバーサイド: プレフィックスなし

### 3. 認証

**Supabase Auth を使用**

```typescript
// lib/supabase/client.ts（クライアントサイド用）
import { createBrowserClient } from '@supabase/ssr';

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// lib/supabase/server.ts（サーバーサイド用）
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const createClient = () => {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
};
```

**認証が必要なページは middleware.ts で保護**

```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const supabase = createServerClient(/* ... */);
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user && request.nextUrl.pathname.startsWith('/app')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/app/:path*'],
};
```

---

## 📊 データアクセスパターン

### API Routes → lib/* → Supabase

**API Routes は薄く保ち、ビジネスロジックは lib/* に配置**

```typescript
// ✅ 良い例
// app/api/plan/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generatePlan } from '@/lib/planner/generate';
import { z } from 'zod';

const requestSchema = z.object({
  userId: z.string().uuid(),
  startDate: z.string().datetime(),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { userId, startDate } = requestSchema.parse(body);
    
    // ビジネスロジックは lib/* に委譲
    const plan = await generatePlan(supabase, userId, new Date(startDate));
    
    return NextResponse.json({ plan }, { status: 200 });
  } catch (error) {
    console.error('Failed to generate plan:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// lib/planner/generate.ts
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

export async function generatePlan(
  supabase: SupabaseClient<Database>,
  userId: string,
  startDate: Date
) {
  // 複雑なビジネスロジックはここに実装
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  // スコアリング、フィルタリング、最適化...
  // ...
  
  return plan;
}
```

### Redis キャッシュ活用

**頻繁にアクセスされるデータはキャッシュすること**

```typescript
// lib/redis.ts
import { Redis } from '@upstash/redis';

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// lib/recipe/search.ts
import { redis } from '@/lib/redis';

export async function searchRecipes(tags: string[]) {
  const cacheKey = `recipes:tags:${tags.sort().join(',')}`;
  
  // キャッシュチェック
  const cached = await redis.get<Recipe[]>(cacheKey);
  if (cached) return cached;
  
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

---

## ⚡ パフォーマンス原則

### 1. Next.js Image 最適化

```typescript
// ✅ 良い例
import Image from 'next/image';

<Image
  src="/recipe-image.jpg"
  alt="鶏むね肉のグリル"
  width={400}
  height={300}
  priority // Above the fold の場合
/>

// ❌ 悪い例
<img src="/recipe-image.jpg" alt="鶏むね肉のグリル" />
```

### 2. API レスポンスタイム目標

**すべての API エンドポイントは <200ms を目標とする**

- DB クエリの最適化（インデックス、Select 句の最小化）
- Redis キャッシュの活用
- 不要な `JOIN` を避ける

### 3. バンドルサイズ最適化

```typescript
// ✅ 良い例（Named Import）
import { Button } from '@/components/ui/button';

// ❌ 悪い例（Default Import with large library）
import _ from 'lodash'; // lodash 全体をインポート禁止
// 代わりに
import debounce from 'lodash/debounce';
```

---

## 🧪 テスト

### Unit Tests (Vitest)

**ビジネスロジック（lib/*）には必ずテストを書くこと**

```typescript
// lib/planner/scoring.test.ts
import { describe, it, expect } from 'vitest';
import { calculateScore } from './scoring';

describe('calculateScore', () => {
  it('増量目標の場合、高たんぱく・高炭水化物レシピを高く評価する', () => {
    const recipe = {
      protein_per_serving: 40,
      carbs_per_serving: 60,
      fat_per_serving: 10,
      calories_per_serving: 450,
    };
    
    const score = calculateScore(recipe, 'bulk');
    expect(score).toBeGreaterThan(0.8);
  });
  
  it('減量目標の場合、高たんぱく・低脂質レシピを高く評価する', () => {
    const recipe = {
      protein_per_serving: 35,
      carbs_per_serving: 20,
      fat_per_serving: 5,
      calories_per_serving: 250,
    };
    
    const score = calculateScore(recipe, 'cut');
    expect(score).toBeGreaterThan(0.8);
  });
});
```

### E2E Tests (Playwright)

**主要なユーザーフローをテスト**

```typescript
// tests/e2e/onboarding.spec.ts
import { test, expect } from '@playwright/test';

test('オンボーディングフローを完了できる', async ({ page }) => {
  await page.goto('/onboarding');
  
  // Step 1: 目標選択
  await page.click('text=増量');
  await page.click('text=次へ');
  
  // Step 2: 体重・トレーニング日数
  await page.fill('input[name="weight"]', '70');
  await page.fill('input[name="training_days"]', '4');
  await page.click('text=次へ');
  
  // Step 3: アレルギー
  await page.click('text=なし');
  await page.click('text=完了');
  
  // 献立画面へリダイレクトされることを確認
  await expect(page).toHaveURL('/app/plan/current');
});
```

---

## 🐛 エラーハンドリング

### try-catch 必須

**すべての非同期処理には try-catch を使用**

```typescript
// ✅ 良い例
async function fetchUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    throw new Error('ユーザープロフィールの取得に失敗しました');
  }
}

// ❌ 悪い例（エラーハンドリングなし）
async function fetchUserProfile(userId: string) {
  const { data } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  return data; // error を無視している
}
```

### Error Boundary

**予期しないエラーをキャッチ**

```typescript
// app/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h2 className="text-2xl font-bold">エラーが発生しました</h2>
      <p className="text-gray-600">{error.message}</p>
      <Button onClick={() => reset()}>再試行</Button>
    </div>
  );
}
```

---

## 📝 コメント規約

### 複雑なロジックには日本語コメント

```typescript
// ✅ 良い例
export function generatePlan(recipes: Recipe[], goal: Goal) {
  // 1. 目標PFCを計算（増量: P=体重×2g, C=体重×5g）
  const targetPFC = calculateTargetPFC(goal);
  
  // 2. レシピをスコアリング（目標PFCとの近さ + 食材共通化ボーナス）
  const scoredRecipes = recipes.map(r => ({
    recipe: r,
    score: calculateScore(r, goal) + ingredientCommonalityBonus(r, recipes),
  }));
  
  // 3. Greedy Algorithm で週次献立を生成（貪欲法：毎回最高スコアを選択）
  return greedySelection(scoredRecipes, 14); // 7日 × 2食
}
```

### JSDoc（型定義に推奨）

```typescript
/**
 * 献立を生成する
 * @param recipes - 候補レシピ一覧
 * @param goal - ユーザーの目標（増量/減量/維持）
 * @returns 7日×2食の週次献立
 */
export function generatePlan(recipes: Recipe[], goal: Goal): Plan {
  // ...
}
```

---

## 🚫 禁止事項

### 絶対に使用禁止

1. **MCP Server / Express.js サーバー**（コスト増加のため）
2. **CSS Modules**（Tailwind CSS のみ使用）
3. **Class Components**（Functional Components のみ）
4. **`any` 型**（型安全性を損なう）
5. **`.env` ファイル**（`.env.local` のみ使用）
6. **Service Role Key のクライアントサイド使用**（セキュリティリスク）
7. **RLS なしのテーブル**（セキュリティリスク）

---

## 📚 参考ドキュメント

開発時は以下のドキュメントを参照すること：

- [PRD (要件定義)](../docs/prd.md)
- [データベース設計](../docs/database-design.md)
- [API 仕様書](../docs/api-specification.md)
- [献立生成アルゴリズム](../docs/meal-planner-algorithm.md)
- [アーキテクチャ（コストゼロ版）](../docs/architecture-simple.md)

---

## 🎯 コード生成時のチェックリスト

GitHub Copilot がコードを生成する際、以下を確認すること：

- [ ] TypeScript strict mode に準拠（`any` 型不使用）
- [ ] Tailwind CSS のみ使用（CSS Modules 不使用）
- [ ] API Routes → lib/* → Supabase の3層構造
- [ ] エラーハンドリング実装（try-catch）
- [ ] RLS ポリシー設定済み（テーブル作成時）
- [ ] 環境変数の適切な使用（NEXT_PUBLIC_* vs サーバー専用）
- [ ] Redis キャッシュ活用（頻繁なクエリ）
- [ ] Next.js Image 最適化（画像使用時）
- [ ] Import 順序遵守（React → Next.js → 外部 → 内部）
- [ ] コメント記載（複雑なロジック）

---

**Let's build cost-free, secure, and performant code! 💪🚀**
