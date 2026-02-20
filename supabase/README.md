# Supabase 設定ファイル

このディレクトリには Supabase 関連の設定ファイルが配置されています。

## ディレクトリ構成

```
supabase/
├── migrations/                    # データベースマイグレーション
│   └── 20260220000000_initial_schema.sql
├── seed.sql                       # シードデータ（Phase 5.1で作成予定）
└── config.toml                    # Supabase CLI 設定（未作成）
```

## マイグレーション

### 初期スキーマ (20260220000000_initial_schema.sql)

以下のテーブルを作成します：

1. **user_profiles** - ユーザープロフィール
2. **recipes** - レシピ
3. **ingredients** - 食材
4. **recipe_ingredients** - レシピ-食材中間テーブル
5. **recipe_steps** - レシピ手順
6. **meal_plans** - 献立
7. **meal_slots** - 献立スロット

### マイグレーション実行

```bash
# Supabase プロジェクトにリンク
npx supabase link --project-ref your-project-id

# マイグレーション実行
npx supabase db push
```

> **💡 ヒント**: Scoop でインストール済みの場合は `supabase` コマンドのみで OK です。

## シードデータ

Phase 5.1 で以下のシードデータが作成されます：

- レシピ 50 件（筋トレ飯特化）
- 食材 100 件
- レシピ-食材の関連データ

## RLS（Row-Level Security）

すべてのテーブルに RLS が設定されています：

- ユーザーは自分のデータのみアクセス可能
- レシピ・食材は全ユーザーが閲覧可能

詳細は [docs/supabase-setup.md](../docs/supabase-setup.md) を参照してください。
