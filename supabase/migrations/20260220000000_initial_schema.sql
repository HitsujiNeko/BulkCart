-- BulkCart 初期スキーマ作成
-- Migration: 20260220000000_initial_schema
-- Created: 2026-02-20
-- Description: ユーザープロフィール、レシピ、食材、献立テーブルの作成

-- ====================
-- 1. Enums
-- ====================
-- Note: PostgreSQL 13+ の組み込み関数 gen_random_uuid() を使用（uuid-ossp 拡張不要）

-- 目標タイプ（増量/減量/維持）
CREATE TYPE goal_type AS ENUM ('bulk', 'cut', 'maintain');

-- 難易度レベル
CREATE TYPE difficulty_level AS ENUM ('easy', 'medium', 'hard');

-- 食材カテゴリ
CREATE TYPE ingredient_category AS ENUM ('meat', 'fish', 'dairy', 'vegetable', 'grain', 'seasoning', 'other');

-- 食事タイプ
CREATE TYPE meal_type AS ENUM ('lunch', 'dinner', 'snack');

-- サブスクリプションステータス
CREATE TYPE subscription_status_type AS ENUM ('free', 'pro', 'canceled');

-- 予算レベル
CREATE TYPE budget_level_type AS ENUM ('low', 'medium', 'high');

-- 献立ステータス
CREATE TYPE meal_plan_status AS ENUM ('draft', 'active', 'completed');

-- ====================
-- 2. Tables
-- ====================

-- ---------------------
-- 2.1 user_profiles テーブル
-- ---------------------
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  goal goal_type NOT NULL,
  weight_kg DECIMAL(5, 2) NOT NULL CHECK (weight_kg > 0 AND weight_kg <= 300),
  training_days_per_week INTEGER NOT NULL CHECK (training_days_per_week >= 0 AND training_days_per_week <= 7),
  cooking_time_per_meal INTEGER NOT NULL CHECK (cooking_time_per_meal > 0),
  budget_level budget_level_type NOT NULL DEFAULT 'medium',
  allergies TEXT[] DEFAULT '{}',
  disliked_ingredients TEXT[] DEFAULT '{}',
  subscription_status subscription_status_type NOT NULL DEFAULT 'free',
  subscription_end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_user_profiles_goal ON user_profiles(goal);
CREATE INDEX idx_user_profiles_subscription_status ON user_profiles(subscription_status);

-- RLS（Row-Level Security）設定
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- ユーザーは自分のプロフィールのみ閲覧可能
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

-- ユーザーは自分のプロフィールのみ更新可能
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- ユーザーは自分のプロフィールを作成可能
CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ---------------------
-- 2.2 recipes テーブル
-- ---------------------
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  cooking_time_minutes INTEGER NOT NULL CHECK (cooking_time_minutes > 0),
  difficulty difficulty_level NOT NULL DEFAULT 'medium',
  calories_per_serving DECIMAL(7, 2) NOT NULL CHECK (calories_per_serving >= 0),
  protein_per_serving DECIMAL(6, 2) NOT NULL CHECK (protein_per_serving >= 0),
  fat_per_serving DECIMAL(6, 2) NOT NULL CHECK (fat_per_serving >= 0),
  carbs_per_serving DECIMAL(6, 2) NOT NULL CHECK (carbs_per_serving >= 0),
  tags TEXT[] NOT NULL DEFAULT '{}',
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_recipes_difficulty ON recipes(difficulty);
CREATE INDEX idx_recipes_cooking_time ON recipes(cooking_time_minutes);
CREATE INDEX idx_recipes_tags ON recipes USING GIN(tags);
CREATE INDEX idx_recipes_protein ON recipes(protein_per_serving DESC);

-- RLS 設定（レシピは全ユーザーが閲覧可能）
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Recipes are viewable by all authenticated users"
  ON recipes FOR SELECT
  TO authenticated
  USING (true);

-- ---------------------
-- 2.3 ingredients テーブル
-- ---------------------
CREATE TABLE ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  normalized_name TEXT NOT NULL,
  category ingredient_category NOT NULL,
  unit TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(normalized_name)
);

-- インデックス
CREATE INDEX idx_ingredients_category ON ingredients(category);
CREATE INDEX idx_ingredients_normalized_name ON ingredients(normalized_name);

-- RLS 設定（食材は全ユーザーが閲覧可能）
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Ingredients are viewable by all authenticated users"
  ON ingredients FOR SELECT
  TO authenticated
  USING (true);

-- ---------------------
-- 2.4 recipe_ingredients テーブル
-- ---------------------
CREATE TABLE recipe_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  quantity DECIMAL(8, 2) NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(recipe_id, ingredient_id)
);

-- インデックス
CREATE INDEX idx_recipe_ingredients_recipe_id ON recipe_ingredients(recipe_id);
CREATE INDEX idx_recipe_ingredients_ingredient_id ON recipe_ingredients(ingredient_id);

-- RLS 設定
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Recipe ingredients are viewable by all authenticated users"
  ON recipe_ingredients FOR SELECT
  TO authenticated
  USING (true);

-- ---------------------
-- 2.5 recipe_steps テーブル
-- ---------------------
CREATE TABLE recipe_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL CHECK (step_number > 0),
  instruction TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(recipe_id, step_number)
);

-- インデックス
CREATE INDEX idx_recipe_steps_recipe_id ON recipe_steps(recipe_id);

-- RLS 設定
ALTER TABLE recipe_steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Recipe steps are viewable by all authenticated users"
  ON recipe_steps FOR SELECT
  TO authenticated
  USING (true);

-- ---------------------
-- 2.6 meal_plans テーブル
-- ---------------------
CREATE TABLE meal_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start_date DATE NOT NULL,
  status meal_plan_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, week_start_date)
);

-- インデックス
CREATE INDEX idx_meal_plans_user_id ON meal_plans(user_id);
CREATE INDEX idx_meal_plans_week_start_date ON meal_plans(week_start_date DESC);
CREATE INDEX idx_meal_plans_status ON meal_plans(status);

-- RLS 設定
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;

-- ユーザーは自分の献立のみ閲覧可能
CREATE POLICY "Users can view own meal plans"
  ON meal_plans FOR SELECT
  USING (auth.uid() = user_id);

-- ユーザーは自分の献立を作成可能
CREATE POLICY "Users can insert own meal plans"
  ON meal_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ユーザーは自分の献立を更新可能
CREATE POLICY "Users can update own meal plans"
  ON meal_plans FOR UPDATE
  USING (auth.uid() = user_id);

-- ユーザーは自分の献立を削除可能
CREATE POLICY "Users can delete own meal plans"
  ON meal_plans FOR DELETE
  USING (auth.uid() = user_id);

-- ---------------------
-- 2.7 meal_slots テーブル
-- ---------------------
CREATE TABLE meal_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_plan_id UUID NOT NULL REFERENCES meal_plans(id) ON DELETE CASCADE,
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  meal_type meal_type NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(meal_plan_id, day_of_week, meal_type)
);

-- インデックス
CREATE INDEX idx_meal_slots_meal_plan_id ON meal_slots(meal_plan_id);
CREATE INDEX idx_meal_slots_recipe_id ON meal_slots(recipe_id);

-- RLS 設定
ALTER TABLE meal_slots ENABLE ROW LEVEL SECURITY;

-- ユーザーは自分の献立スロットのみ閲覧可能
CREATE POLICY "Users can view own meal slots"
  ON meal_slots FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM meal_plans
      WHERE meal_plans.id = meal_slots.meal_plan_id
        AND meal_plans.user_id = auth.uid()
    )
  );

-- ユーザーは自分の献立スロットを作成可能
CREATE POLICY "Users can insert own meal slots"
  ON meal_slots FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM meal_plans
      WHERE meal_plans.id = meal_slots.meal_plan_id
        AND meal_plans.user_id = auth.uid()
    )
  );

-- ユーザーは自分の献立スロットを更新可能
CREATE POLICY "Users can update own meal slots"
  ON meal_slots FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM meal_plans
      WHERE meal_plans.id = meal_slots.meal_plan_id
        AND meal_plans.user_id = auth.uid()
    )
  );

-- ユーザーは自分の献立スロットを削除可能
CREATE POLICY "Users can delete own meal slots"
  ON meal_slots FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM meal_plans
      WHERE meal_plans.id = meal_slots.meal_plan_id
        AND meal_plans.user_id = auth.uid()
    )
  );

-- ====================
-- 3. Functions
-- ====================

-- updated_at 自動更新トリガー関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- トリガー設定
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recipes_updated_at
  BEFORE UPDATE ON recipes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meal_plans_updated_at
  BEFORE UPDATE ON meal_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ====================
-- 4. Comments
-- ====================

COMMENT ON TABLE user_profiles IS 'ユーザープロフィールテーブル：目標、体重、トレーニング日数、予算等を管理';
COMMENT ON TABLE recipes IS 'レシピテーブル：レシピ名、調理時間、栄養情報等を管理';
COMMENT ON TABLE ingredients IS '食材テーブル：食材名、カテゴリ、単位を管理';
COMMENT ON TABLE recipe_ingredients IS 'レシピ-食材中間テーブル：レシピと食材の関連を管理';
COMMENT ON TABLE recipe_steps IS 'レシピ手順テーブル：調理手順を管理';
COMMENT ON TABLE meal_plans IS '献立テーブル：週次献立を管理';
COMMENT ON TABLE meal_slots IS '献立スロットテーブル：各曜日・食事タイプのレシピを管理';
