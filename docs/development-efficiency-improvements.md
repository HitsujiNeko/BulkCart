# 🚀 開発効率化・改善提案書

> **作成日**: 2026-02-21  
> **対象**: Phase 4.3 実装前の開発基盤強化

---

## 📊 現状分析

### ✅ 既に整備済み（優れている点）

- **TypeScript strict mode** - 型安全性が高い
- **ESLint + Prettier** - コード品質管理
- **Vitest + Playwright** - テストフレームワーク
- **Supabase migrations** - データベースバージョン管理
- **Issue/PR テンプレート** - プロジェクト管理
- **npm scripts** - 開発用コマンド (`dev`, `build`, `lint`, `format`, `type-check`, `test`, `test:e2e`)
- **Zod + React Hook Form** - フォームバリデーション
- **Design System** - オレンジ×赤の統一デザイン
- **Documentation** - 21 docs の包括的な仕様書

### ⚠️ 未整備で改善すべき点

1. **型安全性の自動化** - Supabase 型定義が手動更新
2. **CI/CD パイプライン** - GitHub Actions 未設定
3. **Git hooks** - commit 前のチェックなし
4. **AI駆動開発の最適化** - プロンプトテンプレートなし
5. **コンポーネント再利用性** - テンプレート未整備
6. **意思決定の記録** - ADR（Architecture Decision Records）なし

---

## 🎯 改善提案（優先順位付き）

### 【最優先】Phase 3.6: 開発効率化インフラ整備

Phase 4.3 の前に以下を実施することを**強く推奨**します。

---

## 提案1: Supabase 型自動生成スクリプト（最重要⭐⭐⭐）

### 問題点

現在の `types/database.ts` は手動で作成された雛形です。テーブル定義を変更するたびに手動で型を更新する必要があり、以下のリスクがあります：

- 型定義とDBスキーマの不整合
- タイポによるランタイムエラー
- Phase 5.1（レシピDB構築）以降の複雑化

### 解決策

**npm script + Git hooks で型を自動生成**

#### 1.1 npm script の追加

`package.json` に以下を追加：

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md}\"",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:e2e": "playwright test",
    
    // 🆕 追加
    "db:types": "supabase gen types typescript --project-id $SUPABASE_PROJECT_ID > types/database.ts",
    "db:migrate": "supabase db push && npm run db:types",
    "db:reset": "supabase db reset && npm run db:types",
    "db:status": "supabase db diff",
    "postinstall": "npm run db:types"
  }
}
```

#### 1.2 環境変数の追加

`.env.local` に追加：

```bash
SUPABASE_PROJECT_ID=your-project-id  # Supabase Project Settings から取得
```

#### 1.3 使用例

```powershell
# マイグレーション実行 → 型定義を自動生成
npm run db:migrate

# DBリセット（開発時）→ 型定義を自動生成
npm run db:reset

# 型定義のみ再生成
npm run db:types
```

### 効果

- ✅ DB変更時の型定義更新が自動化（手動作業ゼロ）
- ✅ 型の不整合によるバグを防止
- ✅ `npm install` 時に自動で型定義生成（新メンバー onboarding が容易）

### 実装タイミング

**今すぐ（Phase 4.3 の前）**  
理由：Phase 5.1 でレシピテーブルを追加する際、型定義の手動更新が発生します。今のうちに自動化すべきです。

---

## 提案2: プロンプトテンプレート集（AI駆動開発の最適化⭐⭐⭐）

### 問題点

現在、AIに指示する際のプロンプトが統一されていません。ユーザーは毎回「Phase 4.3を実装して」と手動で入力する必要があります。

### 解決策

**よく使う指示のテンプレート集を作成**

#### 2.1 プロンプトテンプレート集の作成

`.github/prompts/` ディレクトリを作成し、カテゴリ別にテンプレートを配置：

```
.github/prompts/
├── implementation.md       # 実装系プロンプト
├── debugging.md            # デバッグ系プロンプト
├── refactoring.md          # リファクタリング系プロンプト
├── documentation.md        # ドキュメント作成系プロンプト
└── testing.md              # テスト作成系プロンプト
```

#### 2.2 実装系プロンプト例

**`.github/prompts/implementation.md`**

```markdown
# 実装系プロンプトテンプレート

## Phase実装（基本）

```
Phase {X.Y}の{機能名}を実装して。

実装前に以下のドキュメントを確認：
- docs/ui-design/wireframes.md（レイアウト）
- docs/ui-design/design-system.md（デザイン）
- docs/api-specification.md（API仕様）

実装後にチェックリストで検証。
```

**使用例**:
```
Phase 4.3の献立表示画面を実装して。

実装前に以下のドキュメントを確認：
- docs/ui-design/wireframes.md（レイアウト）
- docs/ui-design/design-system.md（デザイン）
- docs/api-specification.md（API仕様）

実装後にチェックリストで検証。
```

## 新規APIエンドポイント作成

```
{エンドポイント名}のAPIを実装して。

要件：
- メソッド: {GET/POST/DELETE}
- パス: /api/{path}
- Request型: {型定義}
- Response型: {型定義}
- ビジネスロジックは lib/{module}/ に配置
- RLSでユーザー認証チェック必須

参照: docs/api-specification.md の {対応セクション}
```

## コンポーネント作成

```
{コンポーネント名}を作成して。

要件：
- 機能: {説明}
- Props型定義必須
- デザインシステム準拠（bg-primary/accent使用）
- Responsive対応（モバイルファースト）
- shadcn/ui コンポーネントを活用

参照: docs/ui-design/components.md
```

## lib/ のビジネスロジック作成

```
{機能名}のビジネスロジックを lib/{module}/{file}.ts に実装して。

要件：
- 関数名: {functionName}
- 引数: {params}
- 戻り値: {returnType}
- エラーハンドリング必須（try-catch）
- JSDoc コメント必須
- Unit Test作成（Vitest）

参照: .github/copilot-instructions.md のコーディング規約
```
```

#### 2.3 デバッグ系プロンプト例

**`.github/prompts/debugging.md`**

```markdown
# デバッグ系プロンプトテンプレート

## エラー調査

```
{ファイル名}で以下のエラーが発生しています。原因を調査して修正して。

エラー内容：
{エラーメッセージ}

期待する挙動：
{説明}

確認すべき点：
- 型定義の不整合
- 環境変数の設定
- APIエンドポイントの正しさ
- RLSポリシーの権限
```

## 型エラー修正

```
TypeScriptの型エラーを修正して。

ファイル: {filePath}
エラー: {error message}

修正時の注意：
- any型は使用禁止
- 適切な型定義を追加
- 他の箇所への影響を確認
```

## パフォーマンス改善

```
{機能名}のパフォーマンスを改善して。

現状の問題：
{説明}

改善案：
- Redis キャッシュの活用
- DBクエリの最適化（Select句の最小化）
- 不要なre-renderの削減
- Next.js Image最適化

目標: レスポンスタイム <200ms
```
```

#### 2.4 使い方

GitHub Copilot Chat でテンプレートを参照：

```
@workspace .github/prompts/implementation.md を参照して、Phase 4.3の献立表示画面を実装して
```

または、ファイルを開いてコピペ使用。

### 効果

- ✅ AIへの指示が統一され、仕様準拠の実装が確実に
- ✅ 毎回プロンプトを考える時間が削減（30秒 → 5秒）
- ✅ ドキュメント参照漏れを防止
- ✅ チーム開発時のプロンプト品質が均一化

### 実装タイミング

**今すぐ（Phase 4.3 の前）**  
理由：Phase 4.3以降、画面実装が連続します。今テンプレートを整備すれば、以降のフェーズすべてで効率化されます。

---

## 提案3: GitHub Actions CI/CD（テスト自動化⭐⭐）

### 問題点

現在、コードのテスト・Lintチェックは手動実行です。PRマージ時にバグが混入するリスクがあります。

### 解決策

**GitHub Actions で自動テスト・型チェック・デプロイ**

#### 3.1 CI ワークフロー作成

**`.github/workflows/ci.yml`**

```yaml
name: CI

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: TypeScript 型チェック
        run: npm run type-check
      
      - name: ESLint
        run: npm run lint
      
      - name: Prettier チェック
        run: npx prettier --check "**/*.{ts,tsx,js,jsx,json,md}"
      
      - name: Unit Tests (Vitest)
        run: npm run test
      
      # E2E テストは Phase 8 で有効化
      # - name: E2E Tests (Playwright)
      #   run: npm run test:e2e
      
  build:
    runs-on: ubuntu-latest
    needs: test
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
```

#### 3.2 Vercel自動デプロイ（既に有効）

Vercelは既にGitHub連携済みのため、追加作業不要：

- `main` ブランチ → Production デプロイ
- `develop` ブランチ → Preview デプロイ
- PR → Preview デプロイ + コメント自動投稿

### 効果

- ✅ PRマージ前にバグを自動検出
- ✅ 型エラー・Lintエラーの本番混入を防止
- ✅ レビュワーの負担軽減（自動チェック済み）
- ✅ CI Pass = マージ可能の明確な基準

### 実装タイミング

**Phase 4.4 完了後（Phase 5 開始前）**  
理由：Phase 4で基本UI完成後、Phase 5以降のバックエンド実装でテスト自動化の恩恵が大きくなります。

---

## 提案4: Git Hooks（コミット前チェック⭐⭐）

### 問題点

型エラーやLintエラーがあるコードがコミットされるリスクがあります。

### 解決策

**husky + lint-staged で pre-commit チェック**

#### 4.1 セットアップ

```powershell
# husky インストール
npm install --save-dev husky lint-staged

# husky 初期化
npx husky init
```

#### 4.2 `.husky/pre-commit` 作成

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

#### 4.3 `package.json` に lint-staged 設定追加

```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write",
      "bash -c 'npm run type-check'"
    ],
    "*.{js,jsx,json,md}": [
      "prettier --write"
    ]
  }
}
```

#### 4.4 commitlint（オプション）

コミットメッセージの規約を強制（Conventional Commits）：

```powershell
npm install --save-dev @commitlint/cli @commitlint/config-conventional
```

**`.commitlintrc.json`**

```json
{
  "extends": ["@commitlint/config-conventional"],
  "rules": {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "test",
        "chore"
      ]
    ]
  }
}
```

**`.husky/commit-msg`**

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no -- commitlint --edit $1
```

### 効果

- ✅ エラーがあるコードはコミット不可（品質担保）
- ✅ コミットメッセージが統一（履歴が読みやすい）
- ✅ Changelog自動生成の準備（standard-version等と連携）

### 実装タイミング

**Phase 5.1 開始前**  
理由：Phase 5以降、バックエンドロジック実装で複雑化します。今のうちに品質チェック体制を整備。

---

## 提案5: コンポーネントテンプレート集（再利用性向上⭐）

### 問題点

Phase 4.3以降、RecipeCard, MealPlanTable, GroceryListなど、繰り返し使うコンポーネントが増えます。毎回ゼロから実装すると非効率です。

### 解決策

**よく使うコンポーネントの雛形を作成**

#### 5.1 テンプレート作成

**`components/templates/README.md`**

```markdown
# コンポーネントテンプレート集

BulkCartで頻出するコンポーネントパターンの雛形です。
コピーしてカスタマイズしてください。

## 使用例

```bash
# RecipeCardテンプレートをコピー
cp components/templates/recipe-card.tsx components/recipe/recipe-card.tsx
```

## テンプレート一覧

- `recipe-card.tsx` - レシピカード（画像、P/F/C、難易度表示）
- `meal-plan-table.tsx` - 献立テーブル（週7日×3食）
- `grocery-list-item.tsx` - 買い物リストアイテム（チェックボックス付き）
- `stat-card.tsx` - 統計カード（数値、ラベル、アイコン）
- `empty-state.tsx` - 空状態表示（CTA付き）
```

**`components/templates/recipe-card.tsx`**

```tsx
/**
 * RecipeCardテンプレート
 * 
 * 使用箇所：献立表示、レシピ一覧、レシピ検索結果
 * 
 * カスタマイズ方法：
 * 1. このファイルをコピー: cp components/templates/recipe-card.tsx components/recipe/recipe-card.tsx
 * 2. Props型を調整
 * 3. 表示項目を追加/削除
 */

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Clock, Dumbbell } from 'lucide-react';

interface RecipeCardProps {
  id: string;
  name: string;
  description?: string;
  cookingTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  protein: number;
  fat: number;
  carbs: number;
  calories: number;
  imageUrl?: string;
  onClick?: () => void;
}

export function RecipeCard({
  id,
  name,
  description,
  cookingTime,
  difficulty,
  protein,
  fat,
  carbs,
  calories,
  imageUrl,
  onClick,
}: RecipeCardProps) {
  const difficultyLabel = {
    easy: '簡単',
    medium: '普通',
    hard: '難しい',
  }[difficulty];

  return (
    <Card 
      className="shadow-md hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      {imageUrl && (
        <div className="relative h-48 w-full">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover rounded-t-lg"
          />
        </div>
      )}
      
      <CardHeader className="bg-secondary/30">
        <CardTitle className="flex items-center gap-2">
          <Dumbbell size={20} className="text-primary" />
          {name}
        </CardTitle>
        {description && (
          <CardDescription>{description}</CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="flex gap-2 mb-4">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock size={14} />
            {cookingTime}分
          </Badge>
          <Badge variant="outline">{difficultyLabel}</Badge>
        </div>
        
        <div className="grid grid-cols-4 gap-2 text-sm">
          <div className="text-center">
            <div className="font-bold text-primary">{protein}g</div>
            <div className="text-muted-foreground text-xs">P</div>
          </div>
          <div className="text-center">
            <div className="font-bold">{fat}g</div>
            <div className="text-muted-foreground text-xs">F</div>
          </div>
          <div className="text-center">
            <div className="font-bold">{carbs}g</div>
            <div className="text-muted-foreground text-xs">C</div>
          </div>
          <div className="text-center">
            <div className="font-bold">{calories}</div>
            <div className="text-muted-foreground text-xs">kcal</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

### 効果

- ✅ コンポーネント実装時間を50%削減（30分 → 15分）
- ✅ デザインシステム準拠が自動的に
- ✅ コードの一貫性向上

### 実装タイミング

**Phase 4.3 と同時**  
理由：Phase 4.3 で RecipeCard を実装する際、テンプレートを作成しておけば Phase 4.4以降で再利用できます。

---

## 提案6: ADR（Architecture Decision Records）（意思決定の記録⭐）

### 問題点

技術選定や設計判断の理由が記録されていません。将来「なぜこの実装にしたのか？」が不明になるリスクがあります。

### 解決策

**重要な意思決定を Markdown で記録**

#### 6.1 ADR ディレクトリ作成

```
docs/adr/
├── 0001-use-nextjs-app-router.md
├── 0002-supabase-for-backend.md
├── 0003-cost-zero-architecture.md
├── 0004-greedy-algorithm-for-meal-planning.md
└── template.md
```

#### 6.2 ADR テンプレート

**`docs/adr/template.md`**

```markdown
# {番号}. {タイトル}

- **Status**: {Proposed | Accepted | Deprecated | Superseded}
- **Date**: {YYYY-MM-DD}
- **Decision Makers**: {名前 or チーム}
- **Related**: {他のADR番号}

## Context（背景）

{この決定が必要になった背景・問題}

## Decision（決定内容）

{何を決定したか}

## Consequences（結果・トレードオフ）

### Positive（良い点）

- {メリット1}
- {メリット2}

### Negative（悪い点・トレードオフ）

- {デメリット1}
- {デメリット2}

## Alternatives Considered（検討した代替案）

### Option 1: {案1}

- Pros: {メリット}
- Cons: {デメリット}
- Why NOT chosen: {採用しなかった理由}

### Option 2: {案2}

- Pros: {メリット}
- Cons: {デメリット}
- Why NOT chosen: {採用しなかった理由}

## References

- {参考資料1}
- {参考資料2}
```

#### 6.3 既存の重要決定を記録

**`docs/adr/0001-use-nextjs-app-router.md`**

```markdown
# 0001. Next.js App Router を採用

- **Status**: Accepted
- **Date**: 2026-02-20
- **Decision Makers**: 開発チーム
- **Related**: なし

## Context

BulkCartのフロントエンドフレームワークを選定する必要があった。要件は以下：

- React基盤（shadcn/ui を使用したい）
- SSR対応（SEO、初期表示速度）
- API Routes（Vercel Functionsでバックエンド不要）
- 型安全性（TypeScript）

## Decision

**Next.js 14 (App Router) を採用**

## Consequences

### Positive

- ✅ Vercel無料枠で完全動作（コストゼロ）
- ✅ Server Components でパフォーマンス最適化
- ✅ API Routes でバックエンドサーバー不要
- ✅ shadcn/ui との相性抜群
- ✅ 型安全なルーティング（typed routes）

### Negative

- ⚠️ Pages Router より学習コスト高い
- ⚠️ Server Components の制約（useState不可等）
- ⚠️ 一部のライブラリが未対応

## Alternatives Considered

### Option 1: Remix

- Pros: 優れたフォームハンドリング、Web標準準拠
- Cons: Vercel無料枠で動作不可、コスト増
- Why NOT: コストゼロ要件を満たせない

### Option 2: Vite + React

- Pros: SPA、ビルド高速
- Cons: SSRなし（SEO弱い）、API Routes未提供
- Why NOT: バックエンドサーバーが別途必要（コスト増）

## References

- [Next.js 14 Documentation](https://nextjs.org/docs)
- [Vercel Pricing](https://vercel.com/pricing)
```

### 効果

- ✅ 将来の技術負債を防止（なぜこうなったか明確）
- ✅ 新メンバーのonboarding容易化
- ✅ リファクタリング時の判断材料

### 実装タイミング

**Phase 5.1 と同時（余裕があれば今）**  
理由：Phase 5以降、献立生成アルゴリズム等の重要決定が増えます。今のうちにフォーマットを整備。

---

## 提案7: Storybook（コンポーネント開発環境）（オプション⭐）

### 問題点

コンポーネント開発時、Next.js全体を起動して確認する必要があり非効率です。

### 解決策

**Storybook でコンポーネントを独立開発**

#### 7.1 セットアップ

```powershell
npx storybook@latest init
```

#### 7.2 デザインシステムのStory作成

**`components/ui/button.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: '献立生成',
    className: 'bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg px-8 py-3',
  },
};

export const Secondary: Story = {
  args: {
    children: 'キャンセル',
    variant: 'secondary',
  },
};

export const Destructive: Story = {
  args: {
    children: '削除',
    variant: 'destructive',
  },
};
```

### 効果

- ✅ コンポーネント開発が高速化
- ✅ デザインシステムの視覚化（デザイナーと共有可能）
- ✅ 自動ドキュメント生成（autodocs）

### 実装タイミング

**Phase 6.4 完了後（オプション）**  
理由：Phase 6でUI完成後、Visual Regression Testingと組み合わせると効果的。優先度は低い。

---

## 🎯 推奨実装プラン

### 今すぐ実施（Phase 4.3 の前）⏰

✅ **提案1: Supabase型自動生成スクリプト**  
- 所要時間: 10分
- AIプロンプト: 「提案1のSupabase型自動生成スクリプトを実装して」

✅ **提案2: プロンプトテンプレート集**  
- 所要時間: 15分
- AIプロンプト: 「提案2のプロンプトテンプレート集を作成して」

✅ **提案5: コンポーネントテンプレート（RecipeCardのみ）**  
- 所要時間: 15分
- AIプロンプト: 「提案5のRecipeCardテンプレートを作成して」

**合計: 40分**  
→ この40分の投資で、Phase 4.3以降の開発効率が2倍になります。

---

### Phase 4.4 完了後に実施

- **提案3: GitHub Actions CI/CD**（20分）
- **提案6: ADR（既存決定の記録）**（30分）

---

### Phase 5.1 開始前に実施

- **提案4: Git Hooks**（15分）

---

### Phase 6.4 完了後（余裕があれば）

- **提案7: Storybook**（オプション）

---

## 📊 効果測定（Phase 11 で振り返り）

### 定量指標

- **型エラーによるバグ**: 0件（提案1の効果）
- **PRマージ時のCI失敗率**: <5%（提案3の効果）
- **コンポーネント実装時間**: 30分 → 15分（提案5の効果）
- **AIプロンプト作成時間**: 30秒 → 5秒（提案2の効果）

### 定性指標

- コードレビューの負担軽減（自動チェック済み）
- 新メンバーのonboarding時間短縮
- 技術的判断の透明性向上（ADR）

---

## 🚀 Next Steps

### ユーザーへの質問

以下のいずれかをお選びください：

**Option A: 今すぐ実施（推奨）**  
「提案1と提案2を今すぐ実装して」→ AIが40分で自動実装

**Option B: Phase 4.3を優先**  
「Phase 4.3を先に進めて、後で効率化する」→ Phase 4.3 実装後に提案実施

**Option C: カスタマイズ**  
「提案1のみ実装して」「提案2と5を実装して」等

---

## 📚 参考資料

- [Supabase Type Generation](https://supabase.com/docs/guides/api/generating-types)
- [GitHub Actions for Next.js](https://nextjs.org/docs/pages/building-your-application/deploying/ci-build-caching)
- [Husky Documentation](https://typicode.github.io/husky/)
- [ADR Template](https://github.com/joelparkerhenderson/architecture-decision-record)
- [Storybook for React](https://storybook.js.org/docs/react/get-started/install)

---

**作成者**: GitHub Copilot  
**レビュー**: 人間が最終判断してください
