# BulkCart 開発基盤セットアップタスク（AI実行最適化版）

> **使い方**: 各タスクの実行可能性マーカーを確認し、[🤖 AI実行]タスクは「このタスクを実行して」と指示するだけでAIが自動実行します。

## 実行可能性マーカー
- 🤖 **AI実行**: AIが完全自動で実行可能
- 👤 **人間必須**: 人間の作業が必要（インタビュー、支払い、外部登録など）
- 🤝 **AI+人間**: AIが生成→人間が最終確認・承認

---

## Phase 1: 要件定義と計画（Week 1）

### 1.1 🤖 競合分析ドキュメント作成
- [x] deep-research-report.md の競合分析セクションを docs/competitive-analysis.md に抽出
- [x] あすけん、カロミル、Eat This Much の比較表を Markdown で作成
- [x] 差別化ポイントを5つ以上リストアップ
- [x] docs/differentiation-strategy.md として保存

**AI実行プロンプト例**: 「Phase 1.1の競合分析ドキュメントを作成して」

---

### 1.2 🤖 アプリレビュー分析（ユーザーの声の抽出）
- [x] あすけん、カロミルのApp Store/Google Playレビューを分析
- [x] ユーザーの不満・要望を抽出（「献立の困り」「買い物の課題」「食費・節約」「記録の面倒さ」等）
- [x] 定性分析：共通課題 Top 5 を抽出
- [x] BulkCartへの示唆（差別化ポイント）をまとめる
- [x] docs/app-review-analysis.md として保存

**注**: AIが既存レビューデータを分析（実際のインタビューは不要）

**AI実行プロンプト例**: 「Phase 1.2のアプリレビュー分析を実行して」

---

### 1.3 🤖 詳細 PRD（要件定義書）作成
- [x] deep-research-report.md を基に PRD（Product Requirements Document）を生成
- [x] ターゲットペルソナ3パターン（増量学生、減量社会人、コスパ中級者）
- [x] ユースケース（オンボーディング～買い物まで）のフロー図
- [x] MVP スコープ（入れる/入れない）を明確化
- [x] 成功指標（KPI）定義: 獲得 KPI、活性 KPI、収益 KPI
- [x] docs/prd.md として保存

**AI実行プロンプト例**: 「Phase 1.3のPRDを作成して」

---

## Phase 2: 設計・アーキテクチャ（Week 1-2）

### 2.1 🤖 画面フロー・ワイヤーフレーム作成
- [x] 主要画面7個（LP, オンボーディング, 週次献立, 買い物リスト, レシピ詳細, 作り置き段取り, 設定）の ASCII ワイヤーフレーム作成
- [x] 遷移図を mermaid で作成
- [x] UI コンポーネント一覧（Button, Card, Form 等）をリストアップ
- [x] docs/ui-design/ フォルダに保存

**AI実行プロンプト例**: 「Phase 2.1の画面フローとワイヤーフレームを作成して」

---

### 2.2 🤖 データベース設計書作成
- [x] ER図を mermaid で作成（users, profiles, recipes, ingredients, plans 等）
- [x] 各テーブルのカラム定義（型、制約、インデックス）を Markdown 表形式で
- [x] RLS（Row-Level Security）ポリシーを SQL コメント付きで設計
- [x] 初期データ（recipes）の CSV サンプルを作成
- [x] docs/database-design.md として保存

**AI実行プロンプト例**: 「Phase 2.2のデータベース設計書を作成して」

---

### 2.3 🤖 API 仕様書作成
- [x] エンドポイント一覧（POST/GET/DELETE）を表形式で作成
- [x] 各エンドポイントの Request/Response 仕様（JSON スキーマ）
- [x] エラーハンドリング仕様（エラーコード一覧）
- [x] 認証・認可フロー図（Supabase Auth）
- [x] docs/api-specification.md として保存

**AI実行プロンプト例**: 「Phase 2.3のAPI仕様書を作成して」

---

### 2.4 🤖 献立生成ロジック設計
- [x] スコアリング関数の設計（増量/減量/維持別の重み付け）
- [x] 食材共通化アルゴリズムの疑似コード（Greedy Algorithm）
- [x] 制約条件の整理（アレルギー、調理時間、予算等）
- [x] フローチャートを mermaid で作成
- [x] docs/meal-planner-algorithm.md として保存

**AI実行プロンプト例**: 「Phase 2.4の献立生成ロジック設計を作成して」

---

## Phase 3: 開発環境・インフラ構築（Week 2）

### 3.1 🤖 リポジトリ初期化
- [x] `.gitignore` を作成（Node.js, Next.js, .env 対応）
- [x] `.env.example` を作成（必要な環境変数のテンプレート）
- [x] Issue テンプレート作成（bug, feature, question）→ `.github/ISSUE_TEMPLATE/`
- [x] PR テンプレート作成 → `.github/pull_request_template.md`
- [x] README.md を作成（プロジェクト概要、セットアップ手順）

**AI実行プロンプト例**: 「Phase 3.1のリポジトリ初期化を実行して」

---

### 3.2 🤖 プロジェクト管理ドキュメント作成
- [x] 開発タスク 20 件を Issue フォーマットで Markdown 作成
- [x] Priority / Labels の定義表を作成
- [x] Sprint（2週間）スケジュール表を作成
- [x] docs/project-management/ に保存

**注**: 実際の GitHub Projects 設定は 👤人間が行う（ワンクリック作業）

**AI実行プロンプト例**: 「Phase 3.2のプロジェクト管理ドキュメントを作成して」

---

### 3.3 🤖 Next.js プロジェクト雛形作成
- [x] Next.js (App Router) の基本構成をセットアップ
- [x] TypeScript 設定（`tsconfig.json`）
- [x] Tailwind CSS 設定（`tailwind.config.ts`）
- [x] ESLint / Prettier 設定（`.eslintrc.json`, `.prettierrc`）
- [x] 基本的なディレクトリ構造を作成
  ```
  app/
  ├── (auth)/
  ├── (app)/
  ├── api/
  components/
  lib/
  ├── recipe/
  ├── planner/
  ├── nutrition/
  types/
  ```
- [x] ビジネスロジック層の雛形作成（lib/配下）

**AI実行プロンプト例**: 「Phase 3.3のNext.jsプロジェクトを初期化して」

---

### 3.4 🤖 Supabase 設定ファイル作成
- [x] Supabase クライアント初期化コード作成（`lib/supabase.ts`）
- [x] `.env.example` に Supabase の環境変数を追加
- [x] 初期テーブル作成 SQL を `supabase/migrations/` に作成
- [x] Auth 設定の手順書を作成（`docs/supabase-setup.md`）

**注**: 実際の Supabase プロジェクト作成は 👤人間が supabase.com で実施（5分作業）

**AI実行プロンプト例**: 「Phase 3.4のSupabase設定ファイルを作成して」

---

### 3.5 🤖 Vercel デプロイ設定ファイル作成
- [x] `vercel.json` 作成（環境変数、ビルド設定）
- [x] デプロイ手順書を作成（`docs/deployment.md`）
- [x] Environment Variables のチェックリストを作成

**注**: 実際の Vercel 接続は 👤人間が vercel.com で実施（3分作業）

**AI実行プロンプト例**: 「Phase 3.5のVercel設定を作成して」

---

## Phase 4: フロントエンド基盤開発（Week 3-4）

### 4.1 🤖 認証基盤実装
- [x] Supabase Auth との連携コード実装
  - ログイン/サインアップページ (`app/(auth)/login/page.tsx`)
  - 認証状態管理（Context or hook）
  - Protected Route ミドルウェア (`middleware.ts`)
- [x] ログアウト機能
- [x] セッション管理とリダイレクト処理
- [x] 認証エラーハンドリング

**AI実行プロンプト例**: 「Phase 4.1の認証基盤を実装して」

---

### 4.2 🤖 オンボーディング画面実装
- [x] Step 1: 利用目的選択（増量/減量/維持）
- [x] Step 2: トレーニング日数、調理時間の入力
- [x] Step 3: 予算感、アレルギー、苦手食材の入力
- [x] フォームバリデーション（Zod + React Hook Form）
- [x] user_profile テーブルへの保存 API
- [x] プログレスバー表示
- [x] `app/(app)/onboarding/page.tsx` として実装

**AI実行プロンプト例**: 「Phase 4.2のオンボーディング画面を実装して」

---

### 4.3 🤖 献立表示画面実装
- [x] user_profile 読み込み
- [x] 献立生成ボタン（ローディング状態付き）
- [x] 週次献立の表示（カレンダー形式 or リスト）
- [x] 各日の meal_slot（昼/夜/間食）表示
- [x] レシピ詳細への遷移リンク
- [x] `app/(app)/plan/[week]/page.tsx` として実装

**AI実行プロンプト例**: 「Phase 4.3の献立表示画面を実装して」

---

### 4.4 🤖 レイアウト・ナビゲーション実装
- [x] Header コンポーネント（ロゴ、ユーザーメニュー）
- [x] Navigation（Sidebar or Bottom Nav）
- [x] Responsive Design の基本設定（モバイル優先）
- [x] Loading / Error コンポーネント
- [x] `app/(app)/layout.tsx` として実装

**AI実行プロンプト例**: 「Phase 4.4のレイアウトとナビゲーションを実装して」

---

## Phase 5: バックエンド・ロジック開発（Week 3-5）

### 5.1 🤖 レシピデータベース構築
- [x] recipes, ingredients, recipe_ingredients テーブル作成 SQL
- [x] 初期レシピデータ（docs/seed-data/recipes.csv の50件を使用）
- [x] CSV → DB 投入スクリプト作成（seed script）
- [x] DB インデックス最適化 SQL
- [x] レシピ検索関数実装（`lib/recipe/search.ts`）
  - タグフィルタ、難易度フィルタ、調理時間フィルタ
  - アレルギー除外ロジック
- [x] `supabase/migrations/` と `supabase/seed.sql` に保存

**AI実行プロンプト例**: 「Phase 5.1のレシピデータベースとシードデータを作成して」

---

### 5.2 🤖 献立生成エンジン実装
- [x] 目標PFC計算関数（`lib/planner/targets.ts`）
- [x] スコアリング関数実装（`lib/planner/scoring.ts`）
  - 増量: 高たんぱく + 高炭水化物
  - 減量: 高たんぱく + 低脂質
  - 維持: バランス
- [x] 制約条件フィルタリング（`lib/planner/filters.ts`）
- [x] 献立生成メイン関数（`lib/planner/generate.ts`）
  - Greedy Algorithm実装
  - 食材共通化ロジック
- [x] API エンドポイント実装 (`app/api/plan/generate/route.ts`)
  - lib/planner/generate.tsを呼び出し
- [x] Unit Test（Vitest）を 3-5 個作成

**AI実行プロンプト例**: 「Phase 5.2の献立生成エンジンを実装して」

---

### 5.3 🤖 買い物リスト生成ロジック
- [x] 献立から食材を抽出する関数（`lib/planner/grocery.ts`）
- [x] ingredient の正規化処理（鶏むね、鶏胸 → 鶏むね）
- [x] カテゴリ別集計（肉/魚/卵乳/野菜/主食/調味料）
- [x] API エンドポイント実装 (`app/api/plan/[id]/grocery/route.ts`)
- [x] レスポンス形式の型定義（TypeScript）

**AI実行プロンプト例**: 「Phase 5.3の買い物リスト生成ロジックを実装して」

---

### 5.4 🤖 作り置き段取り生成
- [x] 献立→調理タスクの逆算ロジック（`lib/planner/prep.ts`）
- [x] 週 1 回バッチ想定のタイムライン生成
  - 例: 日曜 60分（00:00 米炊く、00:05 鶏むね下処理...）
- [x] API エンドポイント実装 (`app/api/plan/[id]/prep/route.ts`)
- [x] タイムライン表示形式の型定義

**AI実行プロンプト例**: 「Phase 5.4の作り置き段取り生成を実装して」

---

## Phase 6: UI 完成（Week 4-5）

### 6.1 🤖 買い物リスト画面実装
- [x] カテゴリ別テーブル表示（肉/魚/卵乳/野菜/主食/調味料）
- [x] チェックボックス（ローカル State または localStorage）
- [x] 「コピー」ボタン（クリップボード API）
- [x] 「LINE に送る」ボタン（共有リンク生成）
- [x] 「印刷用 PDF」ボタン（ブラウザ印刷 or PDF 生成）
- [x] `app/(app)/plan/[id]/grocery/page.tsx` として実装

**AI実行プロンプト例**: 「Phase 6.1の買い物リスト画面を実装して」

---

### 6.2 🤖 レシピ詳細ページ実装
- [ ] 材料一覧表示（正規化名、分量）
- [ ] 調理手順表示（ステップ番号付き）
- [ ] 栄養情報表示（P/F/C、kcal）
- [ ] 「この献立に含まれる日」を表示
- [ ] お気に入り機能（オプション）
- [ ] `app/(app)/recipes/[id]/page.tsx` として実装

**AI実行プロンプト例**: 「Phase 6.2のレシピ詳細ページを実装して」

---

### 6.3 🤖 作り置き段取りページ実装
- [ ] タイムライン表示（例：日曜 00:00, 00:20, 00:35）
- [ ] 各タスクの詳細説明
- [ ] チェック機能（完了マーク）
- [ ] タイマー連携（オプション）
- [ ] `app/(app)/plan/[week]/prep/page.tsx` として実装

**AI実行プロンプト例**: 「Phase 6.3の作り置き段取りページを実装して」

---

### 6.4 🤖 エラーハンドリング UI
- [ ] 献立生成失敗時のメッセージとリトライボタン
- [ ] ネットワークエラー時の再試行 UI
- [ ] フォーム入力エラーの警告表示
- [ ] Error Boundary コンポーネント
- [ ] `components/error/` に配置

**AI実行プロンプト例**: 「Phase 6.4のエラーハンドリングUIを実装して」

---

## Phase 7: 計測・分析セットアップ（Week 5）

### 7.1 🤖 分析ツール導入コード作成
- [ ] PostHog（or Mixpanel）の初期化コード作成
- [ ] トラッキングコード埋め込み（`lib/analytics.ts`）
- [ ] イベント定義リスト作成
  - onboarding_complete
  - plan_generated
  - grocery_viewed
  - recipe_viewed
  - checkout_started
- [ ] プライバシー配慮（個人情報を含めない）
- [ ] `docs/analytics-events.md` にイベント仕様を記録

**注**: 実際の PostHog プロジェクト作成は 👤人間が posthog.com で実施（5分作業）

**AI実行プロンプト例**: 「Phase 7.1の分析ツール導入コードを作成して」

---

### 7.2 🤖 エラーログ設定コード作成
- [ ] Error Boundary コンポーネント作成
- [ ] エラーログ送信コード（Sentry 等への送信準備）
- [ ] エラーハンドリング関数（`lib/error-handler.ts`）
- [ ] フォールバック UI コンポーネント

**注**: 実際の Sentry プロジェクト作成は 👤人間が sentry.io で実施（5分作業）

**AI実行プロンプト例**: 「Phase 7.2のエラーログ設定を作成して」

---

## Phase 8: MVP 完成・テスト（Week 5-6）

### 8.1 🤝 E2E テストシナリオ作成
- [ ] テストシナリオリストを作成（Markdown）
  - オンボーディング完了フロー
  - 献立生成フロー
  - 買い物リスト表示・チェック・共有
  - レシピ詳細表示
- [ ] Playwright or Cypress のテストコード雛形を作成
- [ ] `tests/e2e/` に保存

**注**: 実際のテスト実行は 👤人間が確認（または CI で自動化）

**AI実行プロンプト例**: 「Phase 8.1のE2Eテストシナリオを作成して」

---

### 8.2 🤖 パフォーマンス最適化チェックリスト作成
- [ ] Next.js Image Optimization の適用箇所リスト
- [ ] API レスポンスタイム計測ポイント（目標 <200ms）
- [ ] Lighthouse スコア改善項目リスト（目標 >80）
- [ ] バンドルサイズ最適化項目
- [ ] `docs/performance-checklist.md` として保存

**AI実行プロンプト例**: 「Phase 8.2のパフォーマンス最適化チェックリストを作成して」

---

### 8.3 👤 Staging デプロイ（人間タスク）
- [ ] Vercel Preview へデプロイ（ボタンクリック）
- [ ] Staging URL で全機能確認
- [ ] モバイル実機テスト（iOS/Android）

**所要時間**: 30分

---

### 8.4 🤖 ドキュメント整備
- [ ] README.md 完成版（セットアップ手順、スクリーンショット）
- [ ] 開発ガイド（ディレクトリ構成、コーディング規約）
- [ ] デプロイ手順書（`docs/deployment.md`）
- [ ] トラブルシューティング FAQ（`docs/troubleshooting.md`）

**AI実行プロンプト例**: 「Phase 8.4のドキュメント整備を完成させて」

---

## Phase 9: β ローンチ準備（Week 6-7）

### 9.1 🤖 法務文書作成
- [ ] プライバシーポリシー作成（テンプレート利用）
- [ ] 利用規約作成（栄養免責、医療非該当を明記）
- [ ] GDPR / 個人情報保護対応チェックリスト
- [ ] Cookie ポリシー（必要な場合）
- [ ] `app/(legal)/` に配置

**AI実行プロンプト例**: 「Phase 9.1の法務文書を作成して」

---

### 9.2 🤖 LP（ランディングページ）作成
- [ ] Hero section（価値訴求、キャッチコピー）
- [ ] Features セクション（献立、買い物、段取り）
- [ ] Testimonial セクション（β テスター用の雛形）
- [ ] CTA（β登録、無料試用）
- [ ] FAQ セクション
- [ ] `app/page.tsx` として実装

**AI実行プロンプト例**: 「Phase 9.2のランディングページを実装して」

---

### 9.3 🤖 メール配信テンプレート作成
- [ ] β参加確認メールテンプレート（HTML + テキスト）
- [ ] ウェルカムメールテンプレート
- [ ] 週次リマインドメールテンプレート
- [ ] `email-templates/` フォルダに保存
- [ ] Resend（or SendGrid）統合コード作成

**注**: 実際の Resend/SendGrid 登録は 👤人間が実施（5分作業）

**AI実行プロンプト例**: 「Phase 9.3のメール配信テンプレートを作成して」

---

### 9.4 🤖 SNS コンテンツ準備
- [ ] 10 本のテンプレ投稿（deep-research-report.md から抽出）
- [ ] 投稿スケジュール表（Week 1-4）
- [ ] ハッシュタグ戦略リスト
- [ ] `docs/social-media-content.md` に保存

**注**: 実際の投稿は 👤人間が実施（週30分作業）

**AI実行プロンプト例**: 「Phase 9.4のSNSコンテンツを準備して」

---

### 9.5 🤖 β テスター募集設定
- [ ] Waitlist フォーム作成（shadcn/ui Form）
- [ ] フィードバック収集 Google Form の質問項目作成
- [ ] Discord サーバー設定ガイド作成
- [ ] β参加者向けオンボーディングガイド作成

**注**: 実際の Discord サーバー作成は 👤人間が実施（10分作業）



---

## Phase 10: 有料化準備（Week 7）

### 10.1 🤖 Stripe 統合コード作成
- [ ] Stripe Checkout Session API 実装（`app/api/billing/create-checkout-session/route.ts`）
- [ ] Webhook エンドポイント実装（`app/api/webhooks/stripe/route.ts`）
  - payment_intent.succeeded
  - customer.subscription.created
  - customer.subscription.deleted
- [ ] subscription_status カラム追加 SQL
- [ ] Stripe クライアント初期化コード（`lib/stripe.ts`）

**注**: 実際の Stripe アカウント作成・Product/Price 設定は 👤人間が stripe.com で実施（15分作業）

**AI実行プロンプト例**: 「Phase 10.1のStripe統合コードを作成して」

---

### 10.2 🤖 有料機能制限ロジック実装
- [ ] Free プラン制限ロジック（月 1 回献立生成）
- [ ] Pro プラン判定ロジック（無制限）
- [ ] API で課金状態確認ミドルウェア
- [ ] プラン別の UI 表示切り替え
- [ ] `lib/subscription.ts` に実装

**AI実行プロンプト例**: 「Phase 10.2の有料機能制限ロジックを実装して」

---

### 10.3 🤖 販売ページ実装
- [ ] `/pricing` ページ作成
- [ ] Free vs Pro 比較表（shadcn/ui Table）
- [ ] FAQ セクション（よくある質問）
- [ ] 支払い方法説明（Stripe 手数料、返金ポリシー）
- [ ] 購入ボタン→Checkout への導線

**AI実行プロンプト例**: 「Phase 10.3の販売ページを実装して」

---

## Phase 11: 本番デプロイ・ローンチ（Week 8）

### 11.1 🤖 本番環境設定ドキュメント作成
- [ ] Vercel Production デプロイチェックリスト作成
- [ ] ドメイン設定手順書（bulkcart.jp など）
- [ ] Environment Variables 設定リスト（Production用）
- [ ] SSL 証明書確認手順
- [ ] `docs/production-deployment.md` として保存

**注**: 実際のデプロイ作業は 👤人間が実施（30分作業）

**AI実行プロンプト例**: 「Phase 11.1の本番環境設定ドキュメントを作成して」

---

### 11.2 🤖 監視設定コード作成
- [ ] Uptime Monitoring 設定手順書（StatusPage or UptimeRobot）
- [ ] アラート設定（Slack webhook 統合コード）
- [ ] ダッシュボード構築手順（ユーザー数、支払い、エラー）
- [ ] `docs/monitoring-setup.md` として保存

**注**: 実際のサービス登録は 👤人間が実施（15分作業）

**AI実行プロンプト例**: 「Phase 11.2の監視設定を作成して」

---

### 11.3 👤 β 公開（人間タスク）
- [ ] LP 公開（Vercel Production）
- [ ] SNS で投稿（準備済みコンテンツを使用）
- [ ] Waitlist 登録開始
- [ ] メール配信開始

**所要時間**: 1時間

---

### 11.4 🤝 初期ユーザーオンボーディング
- [ ] β テスター招待メールテンプレート作成（AI）
- [ ] Discord での定期フィードバック会議アジェンダ作成（AI）
- [ ] 改善サイクルのフレームワーク作成（AI）
- [ ] 実際の招待送信と会議運営（人間）

**AI実行プロンプト例**: 「Phase 11.4のオンボーディング資料を作成して」

---

## 定期チェックリスト

### 毎週（Sprint Review）- 🤖 AI 支援可能
- [ ] GitHub Issues の完了確認レポート生成（AI）
- [ ] KPI ダッシュボード更新（人間が確認、AI が分析）
- [ ] ユーザーフィードバック分類・優先化（AI がカテゴリ分け、人間が最終判断）

**AI実行プロンプト例**: 「今週のSprint Reviewレポートを作成して」

---

### 毎月 - 🤖 AI 支援可能
- [ ] 収支レビュー（AI が集計、人間が確認）
- [ ] 継続率分析（解約理由の傾向分析を AI が実施）
- [ ] 競合の機能更新確認（AI が調査、人間が戦略判断）
- [ ] ロードマップ調整（AI が提案、人間が最終決定）

**AI実行プロンプト例**: 「今月の月次レビューレポートを作成して」

---

## 🚀 クイックスタートガイド（AI実行最適化版）

### 人間がやること（合計 2-3時間/週）
1. **外部サービス登録**（初回のみ、合計60分）
   - Supabase プロジェクト作成（5分）
   - Vercel 接続（3分）
   - Stripe アカウント作成（15分）
   - PostHog/Sentry 登録（10分）
   - Resend/SendGrid 登録（5分）
   - Discord サーバー作成（10分）

2. **週次レビュー**（30分/週）
   - AI が作成したコードのレビューと承認
   - ユーザーフィードバックの最終判断
   - SNS 投稿（準備済みコンテンツの投稿）

3. **月次戦略**（60分/月）
   - AI 分析レポートのレビュー
   - ロードマップの最終決定

### AIがやること（自動実行）
- すべてのコード生成
- すべてのドキュメント作成
- テンプレート・設定ファイル作成
- データ分析とレポート生成
- フィードバックの分類と提案

---

## 📋 最優先タスク順序（AI実行版）

1. ✅ **Phase 1.1-1.3**: 設計ドキュメント作成（完了）
2. ✅ **Phase 2.1-2.4**: アーキテクチャ設計（完了）
3. 🤖 **Phase 3.1-3.5**: プロジェクト初期化（AI が自動生成、コストゼロ構成）
4. 👤 **Phase 3補足**: Supabase/Vercel 外部サービス登録（人間が15分で完了）
5. 🤖 **Phase 4-5**: フロント・バックエンド実装（AI が自動生成）
6. 🤝 **Phase 6-8**: UI完成・テスト（AI が生成→人間が確認）
7. 🤖 **Phase 9-10**: ローンチ準備・有料化（AI が生成）
8. 👤 **Phase 11**: 本番デプロイ（人間が1時間で完了）

### 💰 月額コスト: $0
- Vercel無料枠: 無制限デプロイ
- Supabase無料枠: 500MB DB、50k MAU
- Upstash無料枠: 10GB Redis/月
- **合計: $0/月**（100ユーザーまで無料）

---

## 💡 使い方のヒント

### タスクを実行するには
各タスクの「AI実行プロンプト例」をそのままコピーして、AIに指示してください。

例：
```
Phase 1.1の競合分析ドキュメントを作成して
```

### まとめて実行するには
```
Phase 1（要件定義）のすべてのAI実行可能タスクを順番に実行して
```

### カスタマイズするには
```
Phase 5.1のレシピデータベースを作成して。ただしレシピ数は50件で、和食中心にして
```