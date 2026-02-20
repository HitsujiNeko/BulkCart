# BulkCart 開発タスク一覧

このドキュメントは GitHub Issues として作成すべきタスクをまとめたものです。各タスクは Issue フォーマットで記述されており、そのままコピーして GitHub に登録できます。

---

## Issue #1: Next.js プロジェクト初期化

**Title**: `[SETUP] Next.js プロジェクト雛形作成`

**Labels**: `setup`, `priority:high`, `phase:3`

**Description**:

Next.js 14 (App Router) の基本構成をセットアップします。

### タスク

- [ ] `package.json` 作成（Next.js 14, React 18, TypeScript 5）
- [ ] `tsconfig.json` 作成（strict mode 有効化）
- [ ] `tailwind.config.ts` 作成
- [ ] `postcss.config.js` 作成
- [ ] `.eslintrc.json` 作成
- [ ] `.prettierrc` 作成
- [ ] 基本ディレクトリ構造作成（app/, components/, lib/, types/）

### Acceptance Criteria

- [ ] `npm run dev` でサーバーが起動する
- [ ] TypeScript strict mode でエラーが出ない
- [ ] Tailwind CSS のクラスが機能する
- [ ] ESLint と Prettier が正常に動作する

### References

- [Phase 3.3](../.github/task.prompt.md#33)
- [Copilot Instructions](../.github/copilot-instructions.md)

---

## Issue #2: Supabase 設定ファイル作成

**Title**: `[SETUP] Supabase クライアント初期化とマイグレーション作成`

**Labels**: `setup`, `priority:high`, `phase:3`, `backend`

**Description**:

Supabase クライアントの初期化コードとデータベースマイグレーションファイルを作成します。

### タスク

- [ ] `lib/supabase/client.ts` 作成（ブラウザ用クライアント）
- [ ] `lib/supabase/server.ts` 作成（サーバー用クライアント）
- [ ] `supabase/migrations/20260220000000_initial_schema.sql` 作成
  - user_profiles テーブル
  - recipes テーブル
  - ingredients テーブル
  - recipe_ingredients テーブル
  - meal_plans テーブル
  - meal_slots テーブル
  - grocery_lists テーブル
  - grocery_items テーブル
  - prep_schedules テーブル
- [ ] RLS ポリシー設定
- [ ] `docs/supabase-setup.md` 作成（セットアップ手順書）

### Acceptance Criteria

- [ ] Supabase クライアントが正常に初期化される
- [ ] マイグレーションが実行可能
- [ ] RLS ポリシーが全テーブルに設定済み
- [ ] セットアップ手順書が完成

### References

- [Phase 3.4](../.github/task.prompt.md#34)
- [Database Design](../docs/database-design.md)

---

## Issue #3: Vercel デプロイ設定

**Title**: `[SETUP] Vercel デプロイ設定ファイル作成`

**Labels**: `setup`, `priority:medium`, `phase:3`, `deployment`

**Description**:

Vercel へのデプロイに必要な設定ファイルとドキュメントを作成します。

### タスク

- [ ] `vercel.json` 作成（リダイレクト、ヘッダー設定）
- [ ] `docs/deployment.md` 作成（デプロイ手順書）
- [ ] Environment Variables チェックリスト作成

### Acceptance Criteria

- [ ] vercel.json が正しく構文チェックされる
- [ ] デプロイ手順書が完成
- [ ] 環境変数リストが完全

### References

- [Phase 3.5](../.github/task.prompt.md#35)

---

## Issue #4: 認証基盤実装

**Title**: `[FEATURE] Supabase Auth 認証基盤実装`

**Labels**: `feature`, `priority:critical`, `phase:4`, `frontend`, `backend`

**Description**:

Supabase Auth を使用した認証基盤を実装します。

### タスク

- [ ] `app/(auth)/login/page.tsx` 作成（ログイン画面）
- [ ] `app/(auth)/signup/page.tsx` 作成（サインアップ画面）
- [ ] `hooks/useAuth.ts` 作成（認証状態管理 Hook）
- [ ] `middleware.ts` 作成（Protected Route）
- [ ] ログアウト機能実装
- [ ] セッション管理実装
- [ ] 認証エラーハンドリング

### Acceptance Criteria

- [ ] ログイン/サインアップが正常に動作
- [ ] 認証済みユーザーのみアプリにアクセス可能
- [ ] セッション切れ時に適切にリダイレクト
- [ ] エラーメッセージが適切に表示

### References

- [Phase 4.1](../.github/task.prompt.md#41)
- [API Specification](../docs/api-specification.md#認証フロー)

---

## Issue #5: オンボーディング画面実装

**Title**: `[FEATURE] オンボーディングフロー実装`

**Labels**: `feature`, `priority:high`, `phase:4`, `frontend`

**Description**:

3ステップのオンボーディング画面を実装します。

### タスク

- [ ] `app/(app)/onboarding/page.tsx` 作成
- [ ] Step 1: 目標選択（増量/減量/維持）
- [ ] Step 2: 体重・トレーニング日数・調理時間入力
- [ ] Step 3: アレルギー・苦手食材選択
- [ ] フォームバリデーション（Zod + React Hook Form）
- [ ] プログレスバー実装
- [ ] API 連携（`POST /api/profile`）

### Acceptance Criteria

- [ ] 3ステップすべてが正常に動作
- [ ] バリデーションエラーが適切に表示
- [ ] user_profile に正常に保存される
- [ ] 完了後、献立画面にリダイレクト

### References

- [Phase 4.2](../.github/task.prompt.md#42)
- [PRD - User Flow](../docs/prd.md#ユーザーフロー)

---

## Issue #6: 献立表示画面実装

**Title**: `[FEATURE] 週次献立表示画面実装`

**Labels**: `feature`, `priority:high`, `phase:4`, `frontend`

**Description**:

7日×2食の週次献立を表示する画面を実装します。

### タスク

- [ ] `app/(app)/plan/current/page.tsx` 作成
- [ ] 献立生成ボタン実装（ローディング状態付き）
- [ ] 週次献立表示（カレンダー形式）
- [ ] meal_slot（昼/夜）別表示
- [ ] レシピカード実装
- [ ] レシピ詳細への遷移リンク

### Acceptance Criteria

- [ ] 献立が週次カレンダー形式で表示される
- [ ] 各レシピのPFC値が表示される
- [ ] レシピカードクリックで詳細ページに遷移
- [ ] ローディング状態が適切に表示

### References

- [Phase 4.3](../.github/task.prompt.md#43)
- [Wireframes](../docs/ui-design/wireframes.md#週次献立画面)

---

## Issue #7: レイアウト・ナビゲーション実装

**Title**: `[FEATURE] アプリケーションレイアウト実装`

**Labels**: `feature`, `priority:high`, `phase:4`, `frontend`

**Description**:

Header、Navigation、Loading/Error コンポーネントを実装します。

### タスク

- [ ] `components/layout/header.tsx` 作成
- [ ] `components/layout/navigation.tsx` 作成（Bottom Nav）
- [ ] `app/(app)/layout.tsx` 作成
- [ ] `app/(app)/loading.tsx` 作成
- [ ] `app/(app)/error.tsx` 作成
- [ ] Responsive Design 実装（モバイルファースト）

### Acceptance Criteria

- [ ] Header にロゴとユーザーメニュー表示
- [ ] Navigation が全ページで機能
- [ ] モバイル・タブレット・デスクトップで適切に表示
- [ ] Loading/Error 状態が適切に表示

### References

- [Phase 4.4](../.github/task.prompt.md#44)
- [Components](../docs/ui-design/components.md#レイアウトコンポーネント)

---

## Issue #8: レシピデータベース構築

**Title**: `[BACKEND] レシピデータベース構築とシードデータ投入`

**Labels**: `backend`, `priority:critical`, `phase:5`, `database`

**Description**:

レシピ・食材テーブルの作成とシードデータ投入を実施します。

### タスク

- [ ] `supabase/seed.sql` 作成（初期データ50件）
- [ ] インデックス最適化 SQL 作成
- [ ] `lib/recipe/search.ts` 実装
  - タグフィルタ
  - 難易度フィルタ
  - 調理時間フィルタ
  - アレルギー除外ロジック
- [ ] Unit Test 作成（3件以上）

### Acceptance Criteria

- [ ] シードデータが50件正常に投入される
- [ ] レシピ検索が正常に動作
- [ ] フィルタリングが正常に機能
- [ ] Unit Test がすべて通過

### References

- [Phase 5.1](../.github/task.prompt.md#51)
- [Database Design](../docs/database-design.md)
- [Seed Data](../docs/seed-data/recipes.csv)

---

## Issue #9: 献立生成エンジン実装

**Title**: `[BACKEND] 献立生成エンジン実装（Greedy Algorithm）`

**Labels**: `backend`, `priority:critical`, `phase:5`, `algorithm`

**Description**:

Greedy Algorithm を使用した献立生成エンジンを実装します。

### タスク

- [ ] `lib/planner/targets.ts` 実装（目標PFC計算）
- [ ] `lib/planner/scoring.ts` 実装（スコアリング関数）
- [ ] `lib/planner/filters.ts` 実装（制約条件フィルタ）
- [ ] `lib/planner/generate.ts` 実装（メイン関数）
- [ ] `app/api/plan/generate/route.ts` 実装
- [ ] Unit Test 作成（5件以上）

### Acceptance Criteria

- [ ] 目標PFCが正しく計算される
- [ ] スコアリング関数が目標別に機能
- [ ] 献立が7日×2食で生成される
- [ ] 食材共通化ロジックが機能
- [ ] API が <200ms で応答

### References

- [Phase 5.2](../.github/task.prompt.md#52)
- [Algorithm Design](../docs/meal-planner-algorithm.md)

---

## Issue #10: 買い物リスト生成ロジック実装

**Title**: `[BACKEND] 買い物リスト生成ロジック実装`

**Labels**: `backend`, `priority:high`, `phase:5`

**Description**:

献立から食材を集約して買い物リストを生成します。

### タスク

- [ ] `lib/planner/grocery.ts` 実装
- [ ] 食材正規化処理実装
- [ ] カテゴリ別集計実装
- [ ] `app/api/plan/[id]/grocery/route.ts` 実装
- [ ] 型定義作成（`types/grocery.ts`）

### Acceptance Criteria

- [ ] 献立から食材が正しく抽出される
- [ ] 食材が正規化される（鶏むね、鶏胸 → 鶏むね）
- [ ] カテゴリ別に集計される
- [ ] API が正常に動作

### References

- [Phase 5.3](../.github/task.prompt.md#53)

---

## Issue #11: 作り置き段取り生成実装

**Title**: `[BACKEND] 作り置き段取り生成ロジック実装`

**Labels**: `backend`, `priority:medium`, `phase:5`

**Description**:

週1回バッチ調理のタイムライン段取りを生成します。

### タスク

- [ ] `lib/planner/prep.ts` 実装
- [ ] タイムライン生成ロジック実装（60分想定）
- [ ] 調理タスク逆算ロジック実装
- [ ] `app/api/plan/[id]/prep/route.ts` 実装
- [ ] 型定義作成（`types/prep.ts`）

### Acceptance Criteria

- [ ] 段取りが時系列順に生成される
- [ ] 調理タスクが適切に分割される
- [ ] 60分以内に完了可能な設計
- [ ] API が正常に動作

### References

- [Phase 5.4](../.github/task.prompt.md#54)

---

## Issue #12: 買い物リスト画面実装

**Title**: `[FEATURE] 買い物リスト画面実装`

**Labels**: `feature`, `priority:high`, `phase:6`, `frontend`

**Description**:

カテゴリ別買い物リスト表示と共有機能を実装します。

### タスク

- [ ] `app/(app)/plan/[week]/grocery/page.tsx` 作成
- [ ] カテゴリ別テーブル表示
- [ ] チェックボックス機能（localStorage 連携）
- [ ] コピーボタン実装（Clipboard API）
- [ ] LINE 送信ボタン実装
- [ ] 印刷用 PDF ボタン実装

### Acceptance Criteria

- [ ] カテゴリ別に食材が表示される
- [ ] チェック状態が永続化される
- [ ] コピー機能が正常に動作
- [ ] LINE 共有リンクが生成される
- [ ] 印刷レイアウトが適切

### References

- [Phase 6.1](../.github/task.prompt.md#61)
- [Wireframes](../docs/ui-design/wireframes.md#買い物リスト画面)

---

## Issue #13: レシピ詳細ページ実装

**Title**: `[FEATURE] レシピ詳細ページ実装`

**Labels**: `feature`, `priority:medium`, `phase:6`, `frontend`

**Description**:

レシピの材料・調理手順・栄養情報を表示します。

### タスク

- [ ] `app/(app)/recipes/[id]/page.tsx` 作成
- [ ] 材料一覧表示
- [ ] 調理手順表示（ステップ番号付き）
- [ ] 栄養情報表示（PFC、カロリー）
- [ ] 「この献立に含まれる日」表示
- [ ] お気に入り機能（オプション）

### Acceptance Criteria

- [ ] レシピ情報が正しく表示される
- [ ] 調理手順が分かりやすい
- [ ] 栄養情報が正確
- [ ] 献立での使用日が表示される

### References

- [Phase 6.2](../.github/task.prompt.md#62)

---

## Issue #14: 作り置き段取りページ実装

**Title**: `[FEATURE] 作り置き段取りページ実装`

**Labels**: `feature`, `priority:medium`, `phase:6`, `frontend`

**Description**:

タイムライン形式で作り置き段取りを表示します。

### タスク

- [ ] `app/(app)/plan/[week]/prep/page.tsx` 作成
- [ ] タイムライン表示実装
- [ ] 各タスクの詳細説明表示
- [ ] チェック機能実装
- [ ] タイマー連携（オプション）

### Acceptance Criteria

- [ ] タイムラインが時系列順に表示される
- [ ] タスクごとにチェックできる
- [ ] チェック状態が永続化される
- [ ] モバイルで見やすい UI

### References

- [Phase 6.3](../.github/task.prompt.md#63)

---

## Issue #15: エラーハンドリング UI 実装

**Title**: `[FEATURE] エラーハンドリング UI 実装`

**Labels**: `feature`, `priority:high`, `phase:6`, `frontend`

**Description**:

Error Boundary とエラー UI を実装します。

### タスク

- [ ] `components/error/error-boundary.tsx` 作成
- [ ] `components/error/error-message.tsx` 作成
- [ ] `components/error/retry-button.tsx` 作成
- [ ] 献立生成失敗 UI
- [ ] ネットワークエラー UI
- [ ] フォームエラー UI

### Acceptance Criteria

- [ ] Error Boundary が予期しないエラーをキャッチ
- [ ] エラーメッセージが分かりやすい
- [ ] リトライボタンが機能
- [ ] エラー状態が適切に表示

### References

- [Phase 6.4](../.github/task.prompt.md#64)

---

## Issue #16: 分析ツール導入

**Title**: `[ANALYTICS] PostHog 分析ツール導入`

**Labels**: `analytics`, `priority:medium`, `phase:7`

**Description**:

PostHog を使用したユーザー行動分析を実装します。

### タスク

- [ ] `lib/analytics.ts` 作成（PostHog 初期化）
- [ ] トラッキングコード埋め込み
- [ ] イベント定義リスト作成
  - onboarding_complete
  - plan_generated
  - grocery_viewed
  - recipe_viewed
  - checkout_started
- [ ] `docs/analytics-events.md` 作成
- [ ] プライバシー配慮実装

### Acceptance Criteria

- [ ] PostHog が正常に初期化される
- [ ] 主要イベントがトラッキングされる
- [ ] 個人情報が含まれない
- [ ] イベント仕様書が完成

### References

- [Phase 7.1](../.github/task.prompt.md#71)

---

## Issue #17: エラーログ設定

**Title**: `[MONITORING] Sentry エラーログ設定`

**Labels**: `monitoring`, `priority:medium`, `phase:7`

**Description**:

Sentry を使用したエラー監視を実装します。

### タスク

- [ ] `lib/error-handler.ts` 作成
- [ ] Error Boundary 作成
- [ ] エラーログ送信コード実装
- [ ] フォールバック UI 作成

### Acceptance Criteria

- [ ] Sentry が正常に初期化される
- [ ] エラーが自動的に送信される
- [ ] エラー詳細が記録される
- [ ] フォールバック UI が表示される

### References

- [Phase 7.2](../.github/task.prompt.md#72)

---

## Issue #18: E2E テストシナリオ作成

**Title**: `[TEST] E2E テストシナリオ作成`

**Labels**: `test`, `priority:medium`, `phase:8`

**Description**:

Playwright を使用した E2E テストを作成します。

### タスク

- [ ] `tests/e2e/onboarding.spec.ts` 作成
- [ ] `tests/e2e/plan-generation.spec.ts` 作成
- [ ] `tests/e2e/grocery-list.spec.ts` 作成
- [ ] `tests/e2e/recipe-detail.spec.ts` 作成
- [ ] CI/CD 統合

### Acceptance Criteria

- [ ] オンボーディングフローのテストが通過
- [ ] 献立生成フローのテストが通過
- [ ] 買い物リストのテストが通過
- [ ] レシピ詳細のテストが通過
- [ ] CI で自動実行される

### References

- [Phase 8.1](../.github/task.prompt.md#81)

---

## Issue #19: パフォーマンス最適化チェックリスト作成

**Title**: `[PERFORMANCE] パフォーマンス最適化チェックリスト作成`

**Labels**: `performance`, `priority:medium`, `phase:8`

**Description**:

Next.js Image、バンドルサイズ、API レスポンスタイムの最適化チェックリストを作成します。

### タスク

- [ ] Next.js Image Optimization 適用箇所リスト作成
- [ ] API レスポンスタイム計測ポイント定義
- [ ] Lighthouse スコア改善項目リスト作成
- [ ] バンドルサイズ最適化項目リスト作成
- [ ] `docs/performance-checklist.md` 作成

### Acceptance Criteria

- [ ] すべての画像が Next.js Image で最適化
- [ ] API が <200ms で応答
- [ ] Lighthouse スコア >80
- [ ] バンドルサイズが適切

### References

- [Phase 8.2](../.github/task.prompt.md#82)

---

## Issue #20: 法務文書作成

**Title**: `[LEGAL] プライバシーポリシー・利用規約作成`

**Labels**: `legal`, `priority:high`, `phase:9`

**Description**:

プライバシーポリシーと利用規約を作成します。

### タスク

- [ ] `app/(legal)/privacy/page.tsx` 作成
- [ ] `app/(legal)/terms/page.tsx` 作成
- [ ] GDPR 対応チェックリスト作成
- [ ] Cookie ポリシー作成（必要な場合）
- [ ] 栄養免責事項明記

### Acceptance Criteria

- [ ] プライバシーポリシーが完成
- [ ] 利用規約が完成
- [ ] GDPR 要件を満たす
- [ ] 医療非該当が明記される

### References

- [Phase 9.1](../.github/task.prompt.md#91)

---

## タスク完了チェックリスト

各 Issue 完了時に以下を確認：

- [ ] コードが [Copilot Instructions](../.github/copilot-instructions.md) に準拠
- [ ] TypeScript strict mode でエラーなし
- [ ] エラーハンドリングが実装されている
- [ ] RLS ポリシーが設定されている（DB 変更時）
- [ ] Unit Test が実装されている（lib/* 関数）
- [ ] PR テンプレートに従って PR 作成

---

**最終更新**: 2026年2月20日
