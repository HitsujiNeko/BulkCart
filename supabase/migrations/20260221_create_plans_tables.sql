-- =====================================================
-- BulkCart DB Schema: Plans and Plan Items
-- Created: 2026-02-21
-- Purpose: 週次献立プランとその詳細アイテムを管理
-- =====================================================

-- -----------------------------------------------------
-- Table: plans (週次プラン)
-- -----------------------------------------------------
CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start_date DATE NOT NULL,
  goal TEXT NOT NULL CHECK (goal IN ('bulk', 'cut', 'maintain')),
  total_protein_g DECIMAL(6,1),
  total_calories INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for plans
CREATE INDEX idx_plans_user_id_week ON plans (user_id, week_start_date DESC);

-- RLS for plans
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "plans_select_own" ON plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "plans_insert_own" ON plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "plans_update_own" ON plans FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "plans_delete_own" ON plans FOR DELETE
  USING (auth.uid() = user_id);

-- -----------------------------------------------------
-- Table: plan_items (プラン×日×食×レシピ)
-- -----------------------------------------------------
CREATE TABLE plan_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  meal_slot TEXT NOT NULL CHECK (meal_slot IN ('lunch', 'dinner', 'snack')),
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  UNIQUE (plan_id, day_of_week, meal_slot)
);

-- Indexes for plan_items
CREATE INDEX idx_plan_items_plan_id ON plan_items (plan_id);
CREATE INDEX idx_plan_items_recipe_id ON plan_items (recipe_id);

-- RLS for plan_items
ALTER TABLE plan_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "plan_items_select_own" ON plan_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM plans
      WHERE plans.id = plan_items.plan_id
      AND plans.user_id = auth.uid()
    )
  );

CREATE POLICY "plan_items_insert_own" ON plan_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM plans
      WHERE plans.id = plan_items.plan_id
      AND plans.user_id = auth.uid()
    )
  );

CREATE POLICY "plan_items_update_own" ON plan_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM plans
      WHERE plans.id = plan_items.plan_id
      AND plans.user_id = auth.uid()
    )
  );

CREATE POLICY "plan_items_delete_own" ON plan_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM plans
      WHERE plans.id = plan_items.plan_id
      AND plans.user_id = auth.uid()
    )
  );

-- -----------------------------------------------------
-- Comments
-- -----------------------------------------------------
COMMENT ON TABLE plans IS '週次献立プラン（7日×2食）';
COMMENT ON TABLE plan_items IS 'プランの各日・各食とレシピの関連付け';

COMMENT ON COLUMN plans.week_start_date IS '週の開始日（月曜日）';
COMMENT ON COLUMN plans.goal IS '生成時の目標（bulk/cut/maintain）';
COMMENT ON COLUMN plans.total_protein_g IS '週合計たんぱく質（g）キャッシュ';
COMMENT ON COLUMN plans.total_calories IS '週合計カロリー（kcal）キャッシュ';

COMMENT ON COLUMN plan_items.day_of_week IS '曜日（0=月, 1=火, ..., 6=日）';
COMMENT ON COLUMN plan_items.meal_slot IS '食事スロット（lunch/dinner/snack）';
