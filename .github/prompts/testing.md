# 🧪 テスト作成系プロンプトテンプレート

> Unit Test（Vitest）、E2E Test（Playwright）作成用のプロンプト集。コピー&ペーストして `{変数}` を実際の値に置き換えてください。

---

## ✅ Unit Test 作成（基本）

```
{関数名}のUnit Testを作成して。

テスト対象: {filePath}
テストフレームワーク: Vitest
配置先: {filePath}.test.ts

テストケース：
1. 正常系: {説明}
2. 正常系: {説明}
3. 異常系: {説明}
4. エッジケース: {説明}

実装要件：
- describe/it/expect を使用
- テストデータはモック（Vitest.mock）
- 非同期処理は async/await
- カバレッジ 80% 以上

参照: 
- lib/planner/scoring.test.ts（既存テストの参考）
```

**使用例**：
```
calculateScoreのUnit Testを作成して。

テスト対象: lib/planner/scoring.ts
テストフレームワーク: Vitest
配置先: lib/planner/scoring.test.ts

テストケース：
1. 正常系: 増量目標時、高たんぱく・高炭水化物レシピが高スコア（>0.8）
2. 正常系: 減量目標時、高たんぱく・低脂質レシピが高スコア（>0.8）
3. 正常系: 維持目標時、バランスの良いレシピが高スコア（>0.7）
4. 異常系: たんぱく質0のレシピは低スコア（<0.3）
5. エッジケース: 極端に高カロリーのレシピは減量時に低スコア

実装要件：
- describe('calculateScore', ...) でグループ化
- テストデータはモック（mockRecipe関数作成）
- 非同期処理なし（純粋関数）
- カバレッジ 80% 以上

参照: 
- lib/planner/scoring.test.ts（既存テストの参考）
- docs/meal-planner-algorithm.md（スコアリング仕様）
```

---

## 🔧 API Test 作成

```
{APIエンドポイント}のテストを作成して。

テスト対象: {API Route path}
テストフレームワーク: Vitest + Supertest
配置先: app/api/{path}/route.test.ts

テストケース：
1. 正常系: {説明} → 200 OK
2. 異常系: 認証なし → 401 Unauthorized
3. 異常系: バリデーションエラー → 400 Bad Request
4. 異常系: リソース不在 → 404 Not Found

実装要件：
- Supabase クライアントをモック（vi.mock）
- 認証状態をモック（getUser()）
- Request/Response の型チェック
- エラーレスポンスの検証

参照: 
- app/api/profile/route.test.ts（既存APIテストの参考）
```

**使用例**：
```
献立生成APIのテストを作成して。

テスト対象: app/api/plan/generate/route.ts
テストフレームワーク: Vitest + Supertest
配置先: app/api/plan/generate/route.test.ts

テストケース：
1. 正常系: 献立生成成功 → 200 OK、14食分の献立を返す
2. 正常系: 既存献立がある場合は上書き
3. 異常系: 認証なし → 401 Unauthorized（"Unauthorized"メッセージ）
4. 異常系: user_profile未作成 → 400 Bad Request（"Profile not found"）
5. 異常系: レシピ不足 → 500 Internal Server Error（"Not enough recipes"）

実装要件：
- Supabase クライアントをモック（vi.mock('@/lib/supabase/server')）
- 認証状態をモック（getUser() → { data: { user: mockUser } }）
- generatePlan関数をモック（vi.mock('@/lib/planner/generate')）
- Request/Response の型チェック（Zod schema）
- エラーレスポンスの検証（error.message）

参照: 
- app/api/profile/route.test.ts（既存APIテストの参考）
- docs/api-specification.md（APIレスポンス仕様）
```

---

## 🎭 E2E Test 作成（Playwright）

```
{機能名}のE2E Testを作成して。

テスト対象: {ユーザーフロー説明}
テストフレームワーク: Playwright
配置先: tests/e2e/{test-name}.spec.ts

テストシナリオ：
1. {ステップ1}
2. {ステップ2}
3. {ステップ3}
4. {期待結果}

実装要件：
- test('...', async ({ page }) => { ... })
- ページ遷移の確認（expect(page).toHaveURL(...)）
- 要素の表示確認（expect(page.locator(...)).toBeVisible()）
- フォーム入力・送信
- 非同期処理の待機（await page.waitForSelector(...)）

参照: 
- tests/e2e/onboarding.spec.ts（既存E2Eテストの参考）
```

**使用例**：
```
献立生成フローのE2E Testを作成して。

テスト対象: オンボーディング完了 → 献立生成 → 献立表示
テストフレームワーク: Playwright
配置先: tests/e2e/meal-plan-generation.spec.ts

テストシナリオ：
1. ログイン → オンボーディング完了（増量、体重70kg、週4回）
2. 献立画面に遷移（/app/plan/current）
3. 「献立生成」ボタンをクリック
4. ローディング表示（3秒以内）
5. 献立が表示される（14食分）
6. 各レシピカードにP/F/C表示
7. 期待結果: 14個のレシピカードが表示される

実装要件：
- test('献立生成フローが成功する', async ({ page }) => { ... })
- ページ遷移の確認（expect(page).toHaveURL('/app/plan/current')）
- ボタンの表示確認（await page.waitForSelector('button:has-text("献立生成")')）
- ローディング状態の確認（await page.waitForSelector('[role="progressbar"]', { timeout: 3000 })）
- 献立表示の確認（await page.locator('.recipe-card').count() === 14）
- P/F/C表示の確認（expect(page.locator('text=/P|F|C/')).toHaveCount(42)）

参照: 
- tests/e2e/onboarding.spec.ts（既存E2Eテストの参考）
- docs/ui-design/wireframes.md（献立画面のレイアウト）
```

---

## 🧩 Component Test 作成（React Testing Library）

```
{コンポーネント名}のテストを作成して。

テスト対象: {component path}
テストフレームワーク: Vitest + React Testing Library
配置先: {component path}.test.tsx

テストケース：
1. レンダリング: {説明}
2. イベント: {説明}
3. Props: {説明}
4. 状態変化: {説明}

実装要件：
- render, screen, waitFor を使用
- ユーザー操作をシミュレート（userEvent）
- 非同期処理の待機（waitFor）
- Props の型チェック

参照: 
- components/ui/button.test.tsx（既存コンポーネントテストの参考）
```

**使用例**：
```
RecipeCardのテストを作成して。

テスト対象: components/recipe/recipe-card.tsx
テストフレームワーク: Vitest + React Testing Library
配置先: components/recipe/recipe-card.test.tsx

テストケース：
1. レンダリング: レシピ名、P/F/C、難易度が表示される
2. レンダリング: 画像URLがある場合はImageコンポーネントが表示される
3. レンダリング: 画像URLがない場合はプレースホルダー表示
4. イベント: クリック時にonClick関数が呼ばれる
5. Props: 異なるdifficulty（easy/medium/hard）で正しいラベル表示
6. Props: protein値が正しく表示される（単位: g）

実装要件：
- render(<RecipeCard {...mockProps} />)
- screen.getByText('鶏むね肉のグリル')
- screen.getByText(/40g/) （protein表示）
- userEvent.click(screen.getByRole('button'))
- expect(onClickMock).toHaveBeenCalledTimes(1)
- expect(screen.getByAltText('鶏むね肉のグリル')).toBeInTheDocument()

参照: 
- components/ui/button.test.tsx（既存コンポーネントテストの参考）
- components/recipe/recipe-card.tsx（実装）
```

---

## 🔄 Integration Test 作成

```
{機能名}のIntegration Testを作成して。

テスト対象: {複数モジュールの統合}
テストフレームワーク: Vitest
配置先: tests/integration/{test-name}.test.ts

テストシナリオ：
1. {モジュール1} と {モジュール2} の連携
2. {データフロー説明}
3. {期待結果}

実装要件：
- 実際のSupabaseクライアント使用（テストDB）
- トランザクション処理
- データのクリーンアップ（afterEach）
- エンドツーエンドのデータフロー検証

参照: 
- tests/integration/meal-plan.test.ts（既存統合テストの参考）
```

**使用例**：
```
献立生成フロー全体のIntegration Testを作成して。

テスト対象: 献立生成（lib/planner/generate.ts） → DB保存（meal_plans, meal_slots） → 買い物リスト生成（lib/planner/grocery.ts）
テストフレームワーク: Vitest
配置先: tests/integration/meal-plan-generation.test.ts

テストシナリオ：
1. テストユーザー作成（user_profile: 増量目標、体重70kg）
2. テストレシピ20件作成（高たんぱくレシピ）
3. generatePlan() 実行 → meal_plansテーブルに保存
4. meal_slotsテーブルに14件保存
5. generateGroceryList() 実行 → 食材リスト取得
6. 期待結果: 14食分の献立 + 食材リスト

実装要件：
- 実際のSupabaseクライアント使用（テストDB: supabase/functions/test）
- beforeEach: テストデータ作成
- afterEach: データクリーンアップ（DELETE FROM meal_plans WHERE user_id = testUserId）
- エンドツーエンドのデータフロー検証
  - expect(mealPlan.mealSlots).toHaveLength(14)
  - expect(groceryList.items).toContainEqual({ name: '鶏むね肉', quantity: 1400, unit: 'g' })

参照: 
- tests/integration/meal-plan.test.ts（既存統合テストの参考）
- docs/meal-planner-algorithm.md（献立生成フロー）
```

---

## 📊 Test Coverage 改善

```
{ファイル名}のテストカバレッジを{目標%}以上にして。

現状カバレッジ: {現在の%}
目標カバレッジ: {目標%}

未カバー箇所：
- {行番号}: {説明}
- {行番号}: {説明}

追加すべきテストケース：
1. {説明}
2. {説明}

実装要件：
- npm run test -- --coverage で確認
- 重要な分岐（if/else）を全てカバー
- エラーハンドリングのテスト必須

参照: 
- vitest.config.ts（カバレッジ設定）
```

**使用例**：
```
lib/planner/filters.tsのテストカバレッジを80%以上にして。

現状カバレッジ: 45%
目標カバレッジ: 80%

未カバー箇所：
- 45-52行: アレルギー除外のエッジケース（allergiesが空配列）
- 67-74行: 調理時間フィルタの境界値（maxCookingTime === 0）
- 89-92行: エラーハンドリング（レシピが全て除外された場合）

追加すべきテストケース：
1. allergiesが空配列の場合、全レシピを返す
2. maxCookingTime === 0 の場合、全レシピを除外
3. 全レシピが除外された場合、空配列を返す（エラーを投げない）
4. dislikedIngredientsとallergiesの両方が指定された場合

実装要件：
- npm run test -- --coverage で確認
- 重要な分岐（if/else）を全てカバー
- エラーハンドリングのテスト必須
- describe('フィルタ機能', ...) でグループ化

参照: 
- vitest.config.ts（カバレッジ設定
- lib/planner/filters.ts（実装）
```

---

## 📝 テスト作成のコツ

### ✅ 効果的なテスト

1. **AAA パターン**: Arrange（準備）→ Act（実行）→ Assert（検証）
2. **独立性**: 各テストは独立して実行可能
3. **再現性**: 何度実行しても同じ結果
4. **明確な命名**: `it('増量目標時、高たんぱくレシピが高スコア')`
5. **境界値テスト**: 0, 1, 最大値, null, undefined

### ❌ 避けるべきテスト

- テスト間の依存（test1の結果をtest2が使う）
- 実際のDBを汚染（クリーンアップなし）
- 曖昧なアサーション（`expect(result).toBeTruthy()` より `expect(result).toBe(true)`）

---

**作成日**: 2026-02-21  
**更新日**: 2026-02-21
