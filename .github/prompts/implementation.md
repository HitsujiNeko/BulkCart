# 🛠 実装系プロンプトテンプレート

> コピー&ペーストして `{変数}` を実際の値に置き換えてください。

---

## 📱 Phase実装（基本）

```
Phase {X.Y}の{機能名}を実装して。

実装前に以下のドキュメントを確認：
- docs/ui-design/wireframes.md（レイアウト）
- docs/ui-design/design-system.md（デザイン）
- docs/api-specification.md（API仕様）

実装後にチェックリストで検証：
- ✅ TypeScript strict mode 準拠（any型不使用）
- ✅ デザインシステム準拠（bg-primary/accent使用）
- ✅ Responsive対応（モバイルファースト）
- ✅ エラーハンドリング実装
- ✅ 型エラーなし（npm run type-check）
```

**使用例**：
```
Phase 4.3の献立表示画面を実装して。

実装前に以下のドキュメントを確認：
- docs/ui-design/wireframes.md（レイアウト）
- docs/ui-design/design-system.md（デザイン）
- docs/api-specification.md（API仕様）

実装後にチェックリストで検証：
- ✅ TypeScript strict mode 準拠（any型不使用）
- ✅ デザインシステム準拠（bg-primary/accent使用）
- ✅ Responsive対応（モバイルファースト）
- ✅ エラーハンドリング実装
- ✅ 型エラーなし（npm run type-check）
```

---

## 🎨 新規コンポーネント作成

```
{コンポーネント名}を作成して。

配置先: components/{category}/{component-name}.tsx

要件：
- 機能: {説明}
- Props型定義必須（interface {ComponentName}Props）
- デザインシステム準拠
  - Primary Color: bg-primary hover:bg-primary/90
  - Accent Color: text-accent
  - Card: shadow-md hover:shadow-lg transition-shadow
- Responsive対応（モバイルファースト）
- shadcn/ui コンポーネントを活用
- JSDoc コメント必須

参照: 
- docs/ui-design/design-system.md（カラー・スタイル）
- docs/ui-design/components.md（コンポーネント仕様）
- components/templates/ （テンプレート参照）
```

**使用例**：
```
MealPlanTableを作成して。

配置先: components/plan/meal-plan-table.tsx

要件：
- 機能: 週次献立をテーブル形式で表示（7日×3食）
- Props型定義必須（interface MealPlanTableProps）
- デザインシステム準拠
  - Primary Color: bg-primary hover:bg-primary/90
  - Accent Color: text-accent
  - Card: shadow-md hover:shadow-lg transition-shadow
- Responsive対応（モバイル: リスト、デスクトップ: テーブル）
- shadcn/ui の Table コンポーネントを活用
- JSDoc コメント必須

参照: 
- docs/ui-design/design-system.md（カラー・スタイル）
- docs/ui-design/components.md（コンポーネント仕様）
- components/templates/ （テンプレート参照）
```

---

## 🔌 API エンドポイント作成

```
{エンドポイント名}のAPIを実装して。

配置先: app/api/{path}/route.ts

要件：
- メソッド: {GET/POST/DELETE}
- パス: /api/{path}
- ビジネスロジックは lib/{module}/ に配置（API Routeは薄く）
- Request型定義（Zod schema でバリデーション）
- Response型定義（types/api.ts に配置）
- Supabase クライアント: createClient() from '@/lib/supabase/server'
- 認証チェック必須: const { data: { user } } = await supabase.auth.getUser()
- エラーハンドリング: try-catch 必須
- RLS でユーザー認証チェック

参照: 
- docs/api-specification.md の {対応セクション}
- .github/copilot-instructions.md（API Routes 規約）
```

**使用例**：
```
献立生成APIを実装して。

配置先: app/api/plan/generate/route.ts

要件：
- メソッド: POST
- パス: /api/plan/generate
- ビジネスロジックは lib/planner/generate.ts に配置（API Routeは薄く）
- Request型定義（Zod schema でバリデーション）
  - userId: z.string().uuid()
  - startDate: z.string().datetime()
- Response型定義（types/api.ts に配置）
  - plan: MealPlan
- Supabase クライアント: createClient() from '@/lib/supabase/server'
- 認証チェック必須: const { data: { user } } = await supabase.auth.getUser()
- エラーハンドリング: try-catch 必須
- RLS でユーザー認証チェック

参照: 
- docs/api-specification.md の献立生成セクション
- .github/copilot-instructions.md（API Routes 規約）
```

---

## 📦 lib/ のビジネスロジック作成

```
{機能名}のビジネスロジックを lib/{module}/{file}.ts に実装して。

要件：
- 関数名: {functionName}
- 引数: {params}
- 戻り値: {returnType}
- Supabase クライアントを引数で受け取る（DI）
- エラーハンドリング必須（try-catch + re-throw）
- JSDoc コメント必須（@param, @returns, @throws）
- 型定義は types/ を使用（any型禁止）
- Unit Test作成（Vitest）

参照: 
- .github/copilot-instructions.md のコーディング規約
- docs/meal-planner-algorithm.md（献立生成ロジックの場合）
```

**使用例**：
```
献立生成のスコアリング関数を lib/planner/scoring.ts に実装して。

要件：
- 関数名: calculateScore
- 引数: 
  - recipe: Recipe
  - goal: GoalType ('bulk' | 'cut' | 'maintain')
  - targetPFC: { protein: number, fat: number, carbs: number }
- 戻り値: number（0.0 ~ 1.0のスコア）
- Supabase クライアント不要（純粋関数）
- エラーハンドリング必須（try-catch + re-throw）
- JSDoc コメント必須（@param, @returns, @throws）
- 型定義は types/ を使用（any型禁止）
- Unit Test作成（Vitest）
  - 増量目標：高たんぱく・高炭水化物レシピが高スコア
  - 減量目標：高たんぱく・低脂質レシピが高スコア
  - 維持目標：バランスの良いレシピが高スコア

参照: 
- .github/copilot-instructions.md のコーディング規約
- docs/meal-planner-algorithm.md（スコアリング関数の仕様）
```

---

## 🗄️ Supabase マイグレーション作成

```
{テーブル名} テーブルのマイグレーションを作成して。

配置先: supabase/migrations/{timestamp}_{table_name}.sql

要件：
- カラム定義: {カラムリスト}
- 制約: {NOT NULL, UNIQUE, CHECK 等}
- 外部キー: {参照先テーブル}
- インデックス: {対象カラム}
- RLS ポリシー必須
  - ユーザー自身のデータのみ閲覧・編集可能
  - SELECT/INSERT/UPDATE/DELETE ポリシーを作成
- Comment 追加（テーブル・カラムの説明）

参照: 
- docs/database-design.md の {対応テーブル}
- supabase/migrations/20260220000000_initial_schema.sql（既存マイグレーションの例）
```

**使用例**：
```
user_goals テーブルのマイグレーションを作成して。

配置先: supabase/migrations/20260221000000_create_user_goals.sql

要件：
- カラム定義:
  - id: UUID PRIMARY KEY
  - user_id: UUID REFERENCES auth.users(id)
  - goal_type: goal_type ENUM NOT NULL
  - target_weight_kg: DECIMAL(5, 2)
  - target_date: DATE
  - created_at: TIMESTAMPTZ DEFAULT NOW()
- 制約:
  - target_weight_kg > 0 AND target_weight_kg <= 300
  - target_date >= CURRENT_DATE
- 外部キー: user_id → auth.users(id) ON DELETE CASCADE
- インデックス: user_id（検索高速化）
- RLS ポリシー必須
  - SELECT: auth.uid() = user_id
  - INSERT: auth.uid() = user_id
  - UPDATE: auth.uid() = user_id
  - DELETE: auth.uid() = user_id
- Comment 追加: "ユーザー目標テーブル：体重目標・期限を管理"

参照: 
- docs/database-design.md のuser_goalsテーブル
- supabase/migrations/20260220000000_initial_schema.sql（既存マイグレーションの例）
```

---

## 🎣 Custom Hook 作成

```
{hook名}を作成して。

配置先: hooks/{use-hook-name}.ts

要件：
- 機能: {説明}
- 戻り値: {型定義}
- Supabase クライアント: supabase from '@/lib/supabase/client'
- React hooks 使用: useState, useEffect, useCallback 等
- エラーハンドリング: try-catch + エラーステート管理
- ローディングステート管理
- JSDoc コメント必須

参照: 
- hooks/useAuth.ts（既存hookの参考）
```

**使用例**：
```
useMealPlanを作成して。

配置先: hooks/use-meal-plan.ts

要件：
- 機能: 現在の週の献立を取得・管理
- 戻り値: 
  - mealPlan: MealPlan | null
  - isLoading: boolean
  - error: Error | null
  - refetch: () => Promise<void>
- Supabase クライアント: supabase from '@/lib/supabase/client'
- React hooks 使用: useState, useEffect, useCallback
- エラーハンドリング: try-catch + エラーステート管理
- ローディングステート管理
- JSDoc コメント必須
- 初回マウント時に自動取得
- キャッシュ管理（SWR風）

参照: 
- hooks/useAuth.ts（既存hookの参考）
```

---

## 📄 型定義追加

```
{型名}を types/{file}.ts に追加して。

要件：
- 型定義: {詳細}
- export 必須
- JSDoc コメント必須
- 他の型との関連を明記
- Database型から派生する場合は適切に型変換

参照: 
- types/database.ts（Supabase自動生成型）
- types/models.ts（ドメインモデル型）
```

**使用例**：
```
MealPlanWithRecipes型を types/models.ts に追加して。

要件：
- 型定義: MealPlan + レシピの詳細情報を含む
  ```typescript
  interface MealPlanWithRecipes {
    id: string;
    userId: string;
    weekStartDate: string;
    status: 'draft' | 'active' | 'completed';
    mealSlots: Array<{
      id: string;
      dayOfWeek: number;
      mealType: 'lunch' | 'dinner' | 'snack';
      recipe: Recipe;
    }>;
    createdAt: string;
    updatedAt: string;
  }
  ```
- export 必須
- JSDoc コメント必須
- Database['public']['Tables']['meal_plans']['Row'] から派生

参照: 
- types/database.ts（Supabase自動生成型）
- types/models.ts（ドメインモデル型）
```

---

## 🔧 開発用スクリプト追加

```
{スクリプト名}を package.json の scripts に追加して。

要件：
- コマンド: {実行内容}
- 説明: {スクリプトの目的}
- クロスプラットフォーム対応（Windows/Mac/Linux）

参照: 
- package.json の既存 scripts
```

**使用例**：
```
シードデータ投入スクリプトを package.json の scripts に追加して。

要件：
- コマンド: supabase db reset && supabase seed
- スクリプト名: db:seed
- 説明: データベースをリセットしてシードデータを投入
- クロスプラットフォーム対応（Windows/Mac/Linux）

参照: 
- package.json の既存 scripts
```

---

## 📝 使い方のコツ

### ✅ 効果的なプロンプトの書き方

1. **具体的に**: 「レシピ一覧画面」より「RecipeListPage に RecipeCard を 10件表示、ページネーション付き」
2. **参照ドキュメント明記**: AI が正しい仕様を参照するよう誘導
3. **チェックリスト付き**: 実装後に自動でバリデーション
4. **型定義優先**: 「any型禁止」「Props型定義必須」を明記

### ❌ 避けるべきプロンプト

- 「レシピページを作って」→ 曖昧すぎ、デザインシステム違反のリスク
- 「適当に実装して」→ ドキュメント参照せず、仕様違反
- 「とりあえず動くように」→ エラーハンドリング・型定義が不十分

---

**作成日**: 2026-02-21  
**更新日**: 2026-02-21
