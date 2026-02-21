# 🔧 リファクタリング系プロンプトテンプレート

> コード品質向上・最適化用のプロンプト集。コピー&ペーストして `{変数}` を実際の値に置き換えてください。

---

## ♻️ コードの整理・最適化（基本）

```
{ファイル名}をリファクタリングして。

現状の問題：
{説明}

改善方針：
- DRY原則（Don't Repeat Yourself）：重複コードを関数化
- 関数の単一責任原則：1関数1機能
- 型安全性の向上（any型削除）
- エラーハンドリングの統一（try-catch）
- コメントの追加（JSDoc）

制約：
- 既存機能を壊さない（動作確認必須）
- テストが通ること
- TypeScript strict mode 準拠

参照: 
- .github/copilot-instructions.md（コーディング規約）
```

**使用例**：
```
lib/planner/generate.tsをリファクタリングして。

現状の問題：
- generatePlan関数が300行超（長すぎ）
- スコアリングロジックが重複
- エラーハンドリングが不統一
- any型が3箇所残っている

改善方針：
- generatePlan を複数の小関数に分割
  - fetchRecipes
  - filterByAllergies
  - calculateScores
  - greedySelection
- スコアリング関数を lib/planner/scoring.ts に分離
- 統一的なエラーハンドリング（try-catch + re-throw）
- any型を適切な型定義に置き換え
- JSDoc コメント追加

制約：
- 既存機能を壊さない（献立生成結果が同じ）
- Unit Test が通ること
- TypeScript strict mode 準拠

参照: 
- .github/copilot-instructions.md（コーディング規約）
- docs/meal-planner-algorithm.md（アルゴリズム仕様）
```

---

## 🧩 重複コードの統合

```
{機能名}の重複コードを統合して。

重複箇所：
- {ファイル1}:{行番号}
- {ファイル2}:{行番号}

改善方針：
- 共通関数を作成（lib/utils/ または lib/shared/）
- 引数でカスタマイズ可能に
- 型定義を明確に
- JSDoc コメント必須

配置先: lib/utils/{function-name}.ts

参照: 
- lib/utils.ts（既存ユーティリティ関数）
```

**使用例**：
```
PFC（たんぱく質・脂質・炭水化物）計算の重複コードを統合して。

重複箇所：
- components/plan/meal-plan-table.tsx:45-52
- components/recipe/recipe-card.tsx:38-45
- lib/planner/scoring.ts:78-85

改善方針：
- lib/nutrition/calculate.ts に calculatePFC 関数を作成
- 引数: Recipe
- 戻り値: { protein: number, fat: number, carbs: number, calories: number }
- 型定義を types/models.ts に追加（NutritionInfo）
- JSDoc コメント必須

配置先: lib/nutrition/calculate.ts

参照: 
- lib/utils.ts（既存ユーティリティ関数）
```

---

## 📐 型定義の改善

```
{ファイル名}の型定義を改善して。

現状の問題：
{説明}

改善方針：
- any型を削除（適切な型に置き換え）
- Union型を活用（'bulk' | 'cut' | 'maintain'）
- Optional型を明示（? または | null）
- Generic型を活用（<T> extends ...）
- 型推論を活用（const, as const）
- 型ガード関数を作成（is演算子）

配置先: types/{file}.ts

参照: 
- types/database.ts（Supabase自動生成型）
- types/models.ts（ドメインモデル型）
```

**使用例**：
```
lib/planner/filters.tsの型定義を改善して。

現状の問題：
- any型が5箇所
- recipe引数の型が不明確（any[]）
- filters引数が Record<string, any>
- 戻り値の型が推論されていない

改善方針：
- Recipe[] 型を明示
- filters を型定義（FilterOptions）
  ```typescript
  interface FilterOptions {
    allergies?: string[];
    dislikedIngredients?: string[];
    maxCookingTime?: number;
    difficulty?: 'easy' | 'medium' | 'hard';
  }
  ```
- 戻り値を Recipe[] に明示
- 型ガード関数を作成（hasAllergy, isDisliked）

配置先: types/models.ts（FilterOptions追加）

参照: 
- types/database.ts（Recipe型）
- types/models.ts（ドメインモデル型）
```

---

## ⚡ パフォーマンス最適化

```
{機能名}のパフォーマンスを最適化して。

現状の問題：
{説明}

改善方針：
- React re-renderの削減
  - useMemo: 計算結果のメモ化
  - useCallback: 関数のメモ化
  - React.memo: コンポーネントのメモ化
- DBクエリの最適化
  - Select句の最小化
  - インデックスの活用
  - クエリ回数の削減（JOIN活用）
- Redis キャッシュの活用
- 不要な処理の削除
- 非同期処理の並列化（Promise.all）

目標: {レスポンスタイム or 初期表示時間}

参照: 
- .github/copilot-instructions.md（パフォーマンス原則）
```

**使用例**：
```
献立表示画面（MealPlanTable）のパフォーマンスを最適化して。

現状の問題：
- 献立を変更すると全コンポーネントが再レンダリング
- 14個のRecipeCard全てが毎回再生成
- スクロール時にカクつく

改善方針：
- useMemo: mealSlotsの計算結果をメモ化
- useCallback: onRecipeClick関数をメモ化
- React.memo: RecipeCardコンポーネントをメモ化
- 仮想スクロール導入（react-virtualized or react-window）
- 画像の遅延読み込み（loading="lazy"）

目標: スクロール時60fps、初期表示 <500ms

参照: 
- .github/copilot-instructions.md（パフォーマンス原則）
- components/plan/meal-plan-table.tsx（現在の実装）
```

---

## 🧪 テストの追加・改善

```
{機能名}のテストを追加/改善して。

現状：
{説明}

追加すべきテストケース：
- 正常系: {説明}
- 異常系: {説明}
- エッジケース: {説明}

テストフレームワーク: Vitest
配置先: {file}.test.ts

参照: 
- lib/planner/scoring.test.ts（既存テストの参考）
```

**使用例**：
```
lib/planner/filters.tsのテストを追加/改善して。

現状：
- テストが未作成
- カバレッジ0%

追加すべきテストケース：
- 正常系: アレルギー除外が正しく動作
- 正常系: 調理時間フィルタが正しく動作
- 異常系: 空配列が渡された場合
- 異常系: 存在しないアレルギーが指定された場合
- エッジケース: 全レシピが除外された場合（空配列を返す）
- エッジケース: filters が未指定の場合（全レシピを返す）

テストフレームワーク: Vitest
配置先: lib/planner/filters.test.ts

参照: 
- lib/planner/scoring.test.ts（既存テストの参考）
```

---

## 🗂️ ファイル構成の整理

```
{ディレクトリ}のファイル構成を整理して。

現状の問題：
{説明}

改善方針：
- 関心事の分離（Separation of Concerns）
- ファイル名の統一（kebab-case）
- index.ts でre-exportを整理
- 循環参照の解消

新しい構成：
{ディレクトリツリー}

参照: 
- docs/architecture-simple.md（ディレクトリ構造）
```

**使用例**：
```
components/plan/ のファイル構成を整理して。

現状の問題：
- ファイルが1つのディレクトリに混在（15ファイル）
- meal-plan-table.tsx が1000行超
- コンポーネント間の依存関係が不明確

改善方針：
- 関心事の分離
  - components/plan/table/ （テーブル表示）
  - components/plan/card/ （カード表示）
  - components/plan/calendar/ （カレンダー表示）
- meal-plan-table.tsx を分割
  - MealPlanTable（親）
  - MealPlanRow（行）
  - MealPlanCell（セル）
- index.ts でre-export
- 循環参照の解消

新しい構成：
```
components/plan/
├── index.ts
├── table/
│   ├── index.ts
│   ├── meal-plan-table.tsx
│   ├── meal-plan-row.tsx
│   └── meal-plan-cell.tsx
├── card/
│   └── meal-plan-card.tsx
└── calendar/
    └── meal-plan-calendar.tsx
```

参照: 
- docs/architecture-simple.md（ディレクトリ構造）
```

---

## 🔐 セキュリティ改善

```
{機能名}のセキュリティを改善して。

現状の問題：
{説明}

改善方針：
- 入力値のバリデーション（Zod）
- SQLインジェクション対策（Supabase parameterized query）
- XSS対策（React default escaping + DOMPurify）
- CSRF対策（Next.js default protection）
- RLSポリシーの強化
- 環境変数の適切な管理（NEXT_PUBLIC_* vs サーバー専用）
- Service Role Key の誤用防止

参照: 
- .github/copilot-instructions.md（セキュリティ原則）
- docs/database-design.md（RLSポリシー）
```

**使用例**：
```
ユーザープロフィール更新APIのセキュリティを改善して。

現状の問題：
- 入力値バリデーションなし（body.weight に "abc" が渡せる）
- 他ユーザーのプロフィールを更新できる（RLS未設定）
- Service Role Key をクライアントで使用している

改善方針：
- Zod schema でバリデーション
  - weight: z.number().min(30).max(300)
  - training_days: z.number().int().min(0).max(7)
- RLSポリシー強化
  - UPDATE: auth.uid() = id のみ更新可能
- createClient() を @/lib/supabase/server から使用（Client側でサービスロール禁止）
- エラーハンドリング（401 Unauthorized, 400 Bad Request）

参照: 
- .github/copilot-instructions.md（セキュリティ原則）
- docs/database-design.md（user_profiles RLS）
```

---

## 📚 ドキュメント改善

```
{機能名}のドキュメントを改善して。

現状の問題：
{説明}

改善方針：
- JSDoc コメント追加
  - @param, @returns, @throws
  - @example でサンプルコード
- README 更新
- API ドキュメント生成（TypeDoc or TSDoc）
- コード内コメント（複雑なロジックの説明）

参照: 
- .github/copilot-instructions.md（コメント規約）
```

**使用例**：
```
lib/planner/generate.tsのドキュメントを改善して。

現状の問題：
- JSDoc コメントがない
- 関数の引数・戻り値が不明確
- アルゴリズムの説明がない

改善方針：
- JSDoc コメント追加
  ```typescript
  /**
   * 週次献立を生成する（Greedy Algorithm）
   * 
   * @param supabase - Supabaseクライアント
   * @param userId - ユーザーID
   * @param startDate - 週の開始日（月曜日）
   * @returns 14食分の献立（7日×2食）
   * @throws {Error} レシピ不足の場合
   * 
   * @example
   * ```typescript
   * const plan = await generatePlan(supabase, userId, new Date('2026-02-24'));
   * console.log(plan.mealSlots.length); // 14
   * ```
   */
  ```
- README にアルゴリズムの説明追加
  - Greedy Algorithm の概要
  - スコアリング関数の仕様
  - 食材共通化ロジック
- コード内コメント（複雑なループの説明）

参照: 
- .github/copilot-instructions.md（コメント規約）
- docs/meal-planner-algorithm.md（アルゴリズム仕様）
```

---

## 📝 リファクタリングのコツ

### ✅ 効果的なリファクタリング

1. **小さく始める**: 1ファイルずつ、1関数ずつ
2. **テストを先に**: リファクタリング前にテストを書く
3. **動作確認**: 各ステップで動作確認
4. **型安全性優先**: any型を削除してから最適化
5. **段階的に**: 一度に全部やらない

### ❌ 避けるべきリファクタリング

- 動作確認なしで大量変更
- テストなしでリファクタリング
- 「ついでに機能追加」→ リファクタリングと機能追加は分離

---

**作成日**: 2026-02-21  
**更新日**: 2026-02-21
