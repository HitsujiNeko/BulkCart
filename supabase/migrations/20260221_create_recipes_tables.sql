-- BulkCart マイグレーション: レシピ & 食材テーブル作成
-- 作成日: 2026年2月21日
-- 対象: Phase 5.1 レシピデータベース構築

-- ==================================================
-- 1. RECIPES TABLE (レシピマスタ)
-- ==================================================

CREATE TABLE IF NOT EXISTS recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  cooking_time INT NOT NULL CHECK (cooking_time > 0 AND cooking_time <= 240),
  difficulty TEXT NOT NULL DEFAULT 'easy' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  protein_g DECIMAL(5,1) NOT NULL CHECK (protein_g >= 0),
  fat_g DECIMAL(5,1) NOT NULL CHECK (fat_g >= 0),
  carb_g DECIMAL(5,1) NOT NULL CHECK (carb_g >= 0),
  calories INT NOT NULL CHECK (calories > 0),
  tags TEXT[] DEFAULT '{}'::text[],
  steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  image_url TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- recipes テーブルのインデックス
CREATE INDEX idx_recipes_tags ON recipes USING GIN (tags);
CREATE INDEX idx_recipes_difficulty ON recipes (difficulty);
CREATE INDEX idx_recipes_cooking_time ON recipes (cooking_time);

-- recipes テーブルコメント
COMMENT ON TABLE recipes IS 'レシピマスタテーブル。全ユーザー共通の静的データ';
COMMENT ON COLUMN recipes.name IS 'レシピ名（例：鶏むね塩麹焼き）';
COMMENT ON COLUMN recipes.cooking_time IS '調理時間（分）';
COMMENT ON COLUMN recipes.difficulty IS '難易度: easy/medium/hard';
COMMENT ON COLUMN recipes.tags IS 'タグ配列（例：[''high-protein'', ''low-fat'', ''batchable'']）';
COMMENT ON COLUMN recipes.steps IS '調理手順JSON配列（例：[{step: 1, text: "..."}]）';

-- ==================================================
-- 2. INGREDIENTS TABLE (食材マスタ)
-- ==================================================

CREATE TABLE IF NOT EXISTS ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  aliases TEXT[] DEFAULT '{}'::text[],
  category TEXT NOT NULL CHECK (category IN ('meat', 'fish', 'egg_dairy', 'vegetable', 'grain', 'seasoning', 'other')),
  unit TEXT NOT NULL DEFAULT 'g',
  avg_price_per_unit INT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ingredients テーブルのインデックス
CREATE INDEX idx_ingredients_category ON ingredients (category);
CREATE INDEX idx_ingredients_name ON ingredients (name);

-- ingredients テーブルコメント
COMMENT ON TABLE ingredients IS '食材マスタテーブル。正規化名とカテゴリを管理';
COMMENT ON COLUMN ingredients.name IS '正規化名（例：鶏むね）。UNIQUE制約あり';
COMMENT ON COLUMN ingredients.aliases IS '表記ゆれ配列（例：[''鶏胸'', ''とりむね'']）';
COMMENT ON COLUMN ingredients.category IS 'カテゴリ: meat/fish/egg_dairy/vegetable/grain/seasoning/other';
COMMENT ON COLUMN ingredients.avg_price_per_unit IS '平均単価（円/100g or 円/個）。予算計算に使用';

-- ==================================================
-- 3. RECIPE_INGREDIENTS TABLE (レシピ×食材 中間テーブル)
-- ==================================================

CREATE TABLE IF NOT EXISTS recipe_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
  amount DECIMAL(7,2) NOT NULL CHECK (amount > 0),
  unit TEXT NOT NULL,
  notes TEXT,
  UNIQUE (recipe_id, ingredient_id)
);

-- recipe_ingredients テーブルのインデックス
CREATE INDEX idx_recipe_ingredients_recipe_id ON recipe_ingredients (recipe_id);
CREATE INDEX idx_recipe_ingredients_ingredient_id ON recipe_ingredients (ingredient_id);

-- recipe_ingredients テーブルコメント
COMMENT ON TABLE recipe_ingredients IS 'レシピと食材の関連テーブル';
COMMENT ON COLUMN recipe_ingredients.amount IS '分量（例：300.00g）';
COMMENT ON COLUMN recipe_ingredients.notes IS '備考（例：お好みで、代替可）';

-- ==================================================
-- 4. RLS (Row-Level Security) ポリシー
-- ==================================================

-- recipes: 全ユーザー読み取り可能（静的マスタデータ）
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "recipes_select_all" ON recipes
  FOR SELECT
  USING (true);

-- ingredients: 全ユーザー読み取り可能（静的マスタデータ）
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ingredients_select_all" ON ingredients
  FOR SELECT
  USING (true);

-- recipe_ingredients: 全ユーザー読み取り可能（静的マスタデータ）
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "recipe_ingredients_select_all" ON recipe_ingredients
  FOR SELECT
  USING (true);

-- ==================================================
-- 5. 検証用クエリ
-- ==================================================

-- テーブル作成確認
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('recipes', 'ingredients', 'recipe_ingredients');

-- インデックス確認
-- SELECT tablename, indexname FROM pg_indexes WHERE schemaname = 'public' AND tablename IN ('recipes', 'ingredients', 'recipe_ingredients');

-- RLS ポリシー確認
-- SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public';
