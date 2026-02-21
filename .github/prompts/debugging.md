# 🐛 デバッグ系プロンプトテンプレート

> バグ修正・エラー調査用のプロンプト集。コピー&ペーストして `{変数}` を実際の値に置き換えてください。

---

## ❌ エラー調査・修正（基本）

```
{ファイル名}で以下のエラーが発生しています。原因を調査して修正して。

エラー内容：
{エラーメッセージ全文}

発生箇所：
{ファイルパス}:{行番号}

期待する挙動：
{説明}

確認すべき点：
- 型定義の不整合（types/database.ts vs 実装）
- 環境変数の設定（.env.local）
- APIエンドポイントの正しさ
- RLSポリシーの権限
- Supabase認証状態
- import文のパス

修正時の制約：
- any型は使用禁止
- エラーハンドリング必須（try-catch）
- 他の箇所への影響を確認
```

**使用例**：
```
app/(app)/plan/current/page.tsxで以下のエラーが発生しています。原因を調査して修正して。

エラー内容：
Type 'null' is not assignable to type 'MealPlan'.
  const [mealPlan, setMealPlan] = useState<MealPlan>(null);
                                                      ~~~~

発生箇所：
app/(app)/plan/current/page.tsx:12

期待する挙動：
mealPlanの初期値はnullで、APIレスポンス取得後にMealPlanオブジェクトをセット

確認すべき点：
- 型定義の不整合（types/database.ts vs 実装）
- useState の型引数
- null許容型 (MealPlan | null)

修正時の制約：
- any型は使用禁止
- 型安全性を保つ
```

---

## 🔧 TypeScript 型エラー解決

```
TypeScriptの型エラーを修正して。

ファイル: {filePath}
エラー: {error message}

修正方針：
- any型は使用禁止
- 適切な型定義を追加（types/ に配置）
- Database型から派生する場合は適切に型変換
- null/undefined の可能性を考慮（?. や ?? を活用）
- 型ガード関数を使う（if (typeof x === 'string')）

参照: 
- types/database.ts（Supabase自動生成型）
- types/models.ts（ドメインモデル型）
```

**使用例**：
```
TypeScriptの型エラーを修正して。

ファイル: lib/planner/generate.ts
エラー: Property 'mealSlots' does not exist on type 'MealPlan'

修正方針：
- any型は使用禁止
- MealPlanWithRecipes型を types/models.ts に追加
- Database['public']['Tables']['meal_plans']['Row'] から派生
- mealSlots: Array<MealSlot & { recipe: Recipe }> の型定義
- Supabase の .select('*, meal_slots(*, recipe:recipes(*))') から返る型に対応

参照: 
- types/database.ts（Supabase自動生成型）
- types/models.ts（ドメインモデル型）
```

---

## ⚡ パフォーマンス改善

```
{機能名}のパフォーマンスを改善して。

現状の問題：
{説明}

改善案：
- Redis キャッシュの活用（lib/redis.ts）
- DBクエリの最適化
  - Select句の最小化（必要なカラムのみ）
  - インデックスの活用
  - 不要なJOINを削除
- React re-renderの削減
  - useMemo, useCallback の活用
  - コンポーネントの分割
- Next.js Image最適化（priority, sizes, loading="lazy"）
- API レスポンスサイズの削減（JSON圧縮）

目標: レスポンスタイム <200ms / 初期表示 <1000ms

参照: 
- docs/meal-planner-algorithm.md（キャッシュ戦略）
- .github/copilot-instructions.md（パフォーマンス原則）
```

**使用例**：
```
献立生成のパフォーマンスを改善して。

現状の問題：
- 献立生成に5秒以上かかる
- DBクエリが30回以上発行される
- レシピ検索に不要なカラムを取得している

改善案：
- Redis キャッシュの活用（レシピ検索結果を1時間キャッシュ）
- DBクエリの最適化
  - レシピ取得を1回のJOINクエリに統合
  - Select句を最小化（id, name, protein, fat, carbs, tags のみ）
  - インデックスの追加（tags カラムにGINインデックス）
- スコアリング関数の最適化（メモ化）
- 並列処理の導入（Promise.all）

目標: レスポンスタイム <200ms

参照: 
- docs/meal-planner-algorithm.md（キャッシュ戦略）
- lib/planner/generate.ts（現在の実装）
```

---

## 🔒 Supabase RLS エラー

```
Supabase RLSエラーを修正して。

エラー内容：
new row violates row-level security policy for table "{table_name}"

発生箇所：
{API endpoint or function}

確認すべき点：
1. RLSポリシーが有効か（ALTER TABLE ... ENABLE ROW LEVEL SECURITY）
2. SELECT/INSERT/UPDATE/DELETE ポリシーが正しいか
   - USING句: 閲覧条件（auth.uid() = user_id）
   - WITH CHECK句: 挿入条件（auth.uid() = user_id）
3. 認証状態が正しいか（supabase.auth.getUser()）
4. Service Role Key を誤って使っていないか（Client側でSERVICE_ROLE_KEYは禁止）

修正：
- RLSポリシーを修正（supabase/migrations/ に新規マイグレーション作成）
- 認証チェックを追加

参照: 
- docs/database-design.md（RLSポリシー仕様）
- supabase/migrations/20260220000000_initial_schema.sql（既存ポリシー）
```

**使用例**：
```
Supabase RLSエラーを修正して。

エラー内容：
new row violates row-level security policy for table "meal_plans"
INSERT INTO meal_plans (user_id, week_start_date, status) VALUES (...)

発生箇所：
app/api/plan/generate/route.ts:45

確認すべき点：
1. meal_plans テーブルのRLSが有効か
2. INSERT ポリシーが存在するか
   - WITH CHECK (auth.uid() = user_id)
3. API Route で認証チェックしているか
4. createClient() を正しく使用しているか（server.ts）

修正：
- RLSポリシーを追加（supabase/migrations/20260221000001_fix_meal_plans_rls.sql）
- INSERT ポリシー作成: WITH CHECK (auth.uid() = user_id)

参照: 
- docs/database-design.md（RLSポリシー仕様）
- supabase/migrations/20260220000000_initial_schema.sql（既存ポリシー）
```

---

## 🌐 CORS エラー

```
CORS エラーを修正して。

エラー内容：
Access to fetch at '{URL}' from origin '{origin}' has been blocked by CORS policy

発生箇所：
{ブラウザコンソール}

確認すべき点：
1. Supabase → Authentication → URL Configuration
   - Site URL: {現在のURL}
   - Redirect URLs: {現在のURL}/**
2. Vercel 環境変数設定
   - NEXT_PUBLIC_APP_URL が正しいか
3. API Route のレスポンスヘッダー
   - Access-Control-Allow-Origin
   - Access-Control-Allow-Methods

修正：
- Supabase ダッシュボードで URL 追加
- または next.config.mjs に headers 追加

参照: 
- docs/supabase-setup.md（CORS設定）
```

**使用例**：
```
CORS エラーを修正して。

エラー内容：
Access to fetch at 'https://abcdefg.supabase.co/auth/v1/token' from origin 'https://bulkcart.vercel.app' has been blocked by CORS policy

発生箇所：
ブラウザコンソール（Production環境）

確認すべき点：
1. Supabase → Authentication → URL Configuration
   - Site URL: https://bulkcart.vercel.app
   - Redirect URLs: https://bulkcart.vercel.app/**
2. Vercel 環境変数設定
   - NEXT_PUBLIC_APP_URL が https://bulkcart.vercel.app になっているか
3. middleware.ts のリダイレクト処理

修正：
- Supabase ダッシュボードで Production URL を追加
- Site URL: https://bulkcart.vercel.app
- Redirect URLs: https://bulkcart.vercel.app/**, https://bulkcart.vercel.app/api/auth/callback

参照: 
- docs/supabase-setup.md（CORS設定）
```

---

## 💾 データ不整合エラー

```
データベースの不整合エラーを調査・修正して。

エラー内容：
{エラーメッセージ}

発生箇所：
{API endpoint or function}

確認すべき点：
1. 外部キー制約が正しいか
2. NULL制約が適切か
3. マイグレーション順序が正しいか
4. シードデータが正しいか
5. トランザクション処理が必要か

修正：
- マイグレーションを追加（制約修正）
- データ修正スクリプト作成
- ビジネスロジック修正

参照: 
- docs/database-design.md（ER図）
- supabase/migrations/（既存マイグレーション）
```

**使用例**：
```
データベースの不整合エラーを調査・修正して。

エラー内容：
foreign key constraint "meal_slots_recipe_id_fkey" violated
DELETE FROM recipes WHERE id = 'xxx'

発生箇所：
レシピ削除API (app/api/recipes/[id]/route.ts)

確認すべき点：
1. meal_slots テーブルがレシピを参照している
2. ON DELETE CASCADE が設定されているか
3. レシピ削除前に献立から削除すべきか

修正：
- マイグレーションを追加（ON DELETE CASCADE を設定）
  ALTER TABLE meal_slots 
  DROP CONSTRAINT meal_slots_recipe_id_fkey,
  ADD CONSTRAINT meal_slots_recipe_id_fkey 
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE;

参照: 
- docs/database-design.md（ER図）
- supabase/migrations/20260220000000_initial_schema.sql
```

---

## 🎨 UI表示エラー

```
{コンポーネント名}で表示エラーが発生しています。修正して。

エラー内容：
{説明}

期待する表示：
{説明}

確認すべき点：
1. デザインシステム準拠か（bg-primary, text-accent）
2. Responsive対応か（sm:, md:, lg:）
3. データの取得状態（loading, error, data）
4. 条件分岐（空状態、エラー状態）
5. shadcn/ui コンポーネントの props

修正：
- デザインシステムに準拠
- エラー状態の表示改善
- ローディング状態の追加

参照: 
- docs/ui-design/design-system.md（カラー・スタイル）
- docs/ui-design/wireframes.md（レイアウト）
```

**使用例**：
```
RecipeCardで表示エラーが発生しています。修正して。

エラー内容：
- カードの色が青色（デザインシステムではオレンジ）
- モバイルで画像が切れる
- P/F/Cの表示が横並びでなく縦並び

期待する表示：
- Primary Color: オレンジ (#FF7A1A)
- モバイル: 画像の高さを固定（h-48）
- P/F/C: grid grid-cols-4 で横並び

確認すべき点：
1. デザインシステム準拠か（bg-primary, text-accent）
2. Responsive対応か（sm:, md:, lg:）
3. Image コンポーネントの fill, object-cover
4. grid レイアウトのクラス名

修正：
- bg-blue-500 → bg-primary
- Image に fill, className="object-cover" 追加
- grid grid-cols-4 gap-2 をP/F/C表示に適用

参照: 
- docs/ui-design/design-system.md（カラー・スタイル）
- components/templates/recipe-card.tsx（テンプレート）
```

---

## 🔄 無限ループ・Re-render エラー

```
{コンポーネント名}で無限ループが発生しています。修正して。

エラー内容：
{説明}

確認すべき点：
1. useEffect の依存配列が正しいか
2. setState を useEffect 内で呼んでいないか（無限ループ）
3. useCallback, useMemo を使うべきか
4. 不要な再レンダリングが発生していないか

修正：
- 依存配列の修正
- useCallback, useMemo の追加
- コンポーネントの分割

参照: 
- React 公式ドキュメント（useEffect, useCallback）
```

**使用例**：
```
useMealPlanで無限ループが発生しています。修正して。

エラー内容：
- useEffect が無限に実行される
- APIリクエストが連続で発行される
- ブラウザがフリーズする

確認すべき点：
1. useEffect の依存配列に関数が含まれている
2. fetchMealPlan 関数が毎回新しく作成されている
3. useCallback を使うべき

修正：
- fetchMealPlan を useCallback でメモ化
- 依存配列を空配列に（初回マウント時のみ実行）
- または、依存配列に必要な値のみ含める

参照: 
- hooks/useAuth.ts（useCallback の使用例）
```

---

## 📝 デバッグのコツ

### ✅ 効果的なエラー調査

1. **エラーメッセージ全文をコピー**: スタックトレース含めて
2. **発生箇所を特定**: ファイル名・行番号を明記
3. **期待する挙動を明確に**: 「動かない」ではなく「〇〇が表示されるべき」
4. **環境情報**: ブラウザ、Node.js バージョン、ローカル/Production

### ❌ 避けるべきデバッグ

- 「なんかエラーが出る」→ エラーメッセージを全文コピー
- 「動かない」→ 何が期待通りでないか具体的に
- console.log 多用 → try-catch + エラーハンドリング

---

**作成日**: 2026-02-21  
**更新日**: 2026-02-21
