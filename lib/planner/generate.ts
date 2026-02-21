/**
 * 献立生成エンジン（メイン関数）
 * 
 * Greedy Algorithmで週次献立（7日×2食=14レシピ）を生成
 * 
 * ## アルゴリズムフロー
 * 1. ユーザープロフィール取得
 * 2. 目標PFC計算
 * 3. 全レシピ取得（食材情報含む）
 * 4. 制約条件フィルタリング（アレルギー、苦手食材）
 * 5. Greedy選択ループ（14スロット）
 *    a. 各レシピにスコア計算
 *    b. 最高スコアレシピを選択
 *    c. 選択済みリストに追加
 * 6. Plan/PlanItemsをDBに保存
 * 7. 生成結果を返す
 */

import { createClient } from '@/lib/supabase/server';
import { calculatePerMealTarget } from './targets';
import {
  calculateTotalScore,
  type RecipeWithIngredients,
  type ScoringContext,
} from './scoring';
import { filterRecipesByConstraints, type FilterConstraints, type Ingredient } from './filters';
import type { Database } from '@/types/database';

type Goal = 'bulk' | 'cut' | 'maintain';
type MealSlot = 'lunch' | 'dinner' | 'snack';

// Supabaseからのクエリ結果型定義
type RecipeRow = Database['public']['Tables']['recipes']['Row'];
type IngredientRow = Database['public']['Tables']['ingredients']['Row'];
type RecipeIngredientRow = Database['public']['Tables']['recipe_ingredients']['Row'];
type PlanItemRow = Database['public']['Tables']['plan_items']['Row'];
type UserProfileRow = Database['public']['Tables']['user_profiles']['Row'];

export interface UserProfileForPlan {
  id: string;
  goal: Goal;
  weight_kg: number | null;
  training_days_per_week: number;
  cooking_time_weekday: number;
  cooking_time_weekend: number;
  allergies: string[];
  dislikes: string[];
}

export interface PlanItem {
  day_of_week: number; // 0=月, 1=火, ..., 6=日
  meal_slot: MealSlot;
  recipe_id: string;
}

export interface Plan {
  id: string;
  user_id: string;
  week_start_date: string;
  goal: Goal;
  items: PlanItem[];
  total_protein_g: number;
  total_calories: number;
}

export interface GeneratePlanInput {
  user_id: string;
  week_start_date: string; // ISO 8601 date string
}

export interface GeneratePlanResult {
  plan: Plan;
  message: string;
}

/**
 * 週の開始日（月曜日）を取得
 * 
 * @param date 基準日
 * @returns 月曜日の日付（YYYY-MM-DD）
 */
export function getWeekStartDate(date: Date = new Date()): string {
  const dayOfWeek = date.getDay(); // 0=日, 1=月, ..., 6=土
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // 月曜日への差分
  const monday = new Date(date);
  monday.setDate(date.getDate() + diff);
  const isoString = monday.toISOString();
  return isoString.split('T')[0] || '';
}

/**
 * 過去のプランからレシピIDを抽出（多様性スコア用）
 * 
 * @param supabase Supabaseクライアント
 * @param userId ユーザーID
 * @param weeksBack 何週間前まで取得するか
 * @returns 過去のレシピID配列
 */
async function getRecentRecipeIds(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  weeksBack: number = 3
): Promise<string[]> {
  const { data: recentPlans, error } = await supabase
    .from('plans')
    .select('id')
    .eq('user_id', userId)
    .order('week_start_date', { ascending: false })
    .limit(weeksBack);

  if (error || !recentPlans || recentPlans.length === 0) {
    return [];
  }

  const planIds = (recentPlans as Pick<Database['public']['Tables']['plans']['Row'], 'id'>[]).map((p) => p.id);

  const { data: planItems, error: itemsError } = await supabase
    .from('plan_items')
    .select('recipe_id')
    .in('plan_id', planIds);

  if (itemsError || !planItems) {
    return [];
  }

  return (planItems as Pick<PlanItemRow, 'recipe_id'>[]).map((item) => item.recipe_id);
}

/**
 * レシピと食材情報を取得
 * 
 * @param supabase Supabaseクライアント
 * @returns レシピと食材のマップ
 */
async function fetchRecipesAndIngredients(
  supabase: ReturnType<typeof createClient>
): Promise<{
  recipes: RecipeWithIngredients[];
  ingredientsMap: Map<string, Ingredient>;
}> {
  // レシピ取得
  const { data: recipesData, error: recipesError } = await supabase
    .from('recipes')
    .select('*');

  if (recipesError || !recipesData) {
    throw new Error(`レシピ取得失敗: ${recipesError?.message || 'Unknown error'}`);
  }

  // レシピ食材中間テーブル取得
  const { data: recipeIngredientsData, error: riError } = await supabase
    .from('recipe_ingredients')
    .select('*');

  if (riError) {
    throw new Error(`レシピ食材取得失敗: ${riError.message}`);
  }

  // 食材マスタ取得
  const { data: ingredientsData, error: ingredientsError } = await supabase
    .from('ingredients')
    .select('*');

  if (ingredientsError || !ingredientsData) {
    throw new Error(`食材マスタ取得失敗: ${ingredientsError?.message || 'Unknown error'}`);
  }

  // 食材マップ作成
  const ingredientsMap = new Map<string, Ingredient>();
  (ingredientsData as IngredientRow[]).forEach((ing) => {
    ingredientsMap.set(ing.id, {
      id: ing.id,
      name: ing.name,
      aliases: ing.aliases || [],
      category: ing.category,
    });
  });

  // レシピに食材情報を結合
  const recipeIngredients = (recipeIngredientsData || []) as RecipeIngredientRow[];
  const recipes: RecipeWithIngredients[] = (recipesData as RecipeRow[]).map((recipe) => {
    const ingredients = recipeIngredients
      .filter((ri) => ri.recipe_id === recipe.id)
      .map((ri) => ({
        ingredient_id: ri.ingredient_id,
        amount: ri.amount,
        unit: ri.unit,
      }));

    return {
      id: recipe.id,
      name: recipe.name,
      protein_g: recipe.protein_g,
      fat_g: recipe.fat_g,
      carb_g: recipe.carb_g,
      calories: recipe.calories,
      cooking_time: recipe.cooking_time,
      difficulty: recipe.difficulty as 'easy' | 'medium' | 'hard',
      tags: recipe.tags || [],
      ingredients,
    };
  });

  return { recipes, ingredientsMap };
}

/**
 * 献立生成メイン関数（Greedy Algorithm）
 * 
 * @param input 生成入力（ユーザーID、週開始日）
 * @returns 生成結果
 * 
 * @example
 * ```typescript
 * const result = await generatePlan({
 *   user_id: 'uuid',
 *   week_start_date: '2026-02-24'
 * });
 * ```
 */
export async function generatePlan(input: GeneratePlanInput): Promise<GeneratePlanResult> {
  const supabase = createClient();

  // 1. ユーザープロフィール取得
  const { data: profileData, error: profileError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', input.user_id)
    .single();

  if (profileError || !profileData) {
    throw new Error(`プロフィール取得失敗: ${profileError?.message || 'Not found'}`);
  }

  const profileRow = profileData as UserProfileRow;

  const profile: UserProfileForPlan = {
    id: profileRow.id,
    goal: profileRow.goal as Goal,
    weight_kg: profileRow.weight_kg,
    training_days_per_week: profileRow.training_days_per_week,
    cooking_time_weekday: profileRow.cooking_time_weekday || 30,
    cooking_time_weekend: profileRow.cooking_time_weekend || 60,
    allergies: profileRow.allergies || [],
    dislikes: profileRow.disliked_ingredients || [],
  };

  // 2. 目標PFC計算
  const perMealTarget = calculatePerMealTarget({
    goal: profile.goal,
    weight_kg: profile.weight_kg,
    training_days_per_week: profile.training_days_per_week,
  });

  // 3. 全レシピ・食材取得
  const { recipes, ingredientsMap } = await fetchRecipesAndIngredients(supabase);

  // 4. 制約条件フィルタリング
  const constraints: FilterConstraints = {
    allergies: profile.allergies,
    dislikes: profile.dislikes,
  };

  const filteredRecipes = filterRecipesByConstraints(recipes, constraints, ingredientsMap);

  if (filteredRecipes.length === 0) {
    throw new Error('PLAN_GENERATION_FAILED: 制約条件を満たすレシピが見つかりません');
  }

  // 5. 過去のレシピID取得（多様性スコア用）
  const recentRecipeIds = await getRecentRecipeIds(supabase, input.user_id, 3);

  // 6. Greedy選択ループ（14スロット: 7日×2食）
  const selectedRecipes: RecipeWithIngredients[] = [];
  const planItems: PlanItem[] = [];

  for (let day = 0; day < 7; day++) {
    for (const mealSlot of ['lunch', 'dinner'] as MealSlot[]) {
      // 曜日に応じた調理時間制限
      const isWeekday = day >= 0 && day <= 4; // 月〜金
      const maxTime = isWeekday ? profile.cooking_time_weekday : profile.cooking_time_weekend;

      // スコアリングコンテキスト
      const context: ScoringContext = {
        target: perMealTarget,
        goal: profile.goal,
        selectedRecipes,
        maxTime,
        recentRecipeIds,
      };

      // 全候補にスコア計算
      const scoredRecipes = filteredRecipes.map((recipe) => ({
        recipe,
        score: calculateTotalScore(recipe, context),
      }));

      // 最高スコアのレシピを選択
      scoredRecipes.sort((a, b) => b.score - a.score);
      const bestRecipe = scoredRecipes[0]?.recipe;

      if (!bestRecipe) {
        throw new Error(`PLAN_GENERATION_FAILED: Day ${day}, ${mealSlot} でレシピ選択失敗`);
      }

      selectedRecipes.push(bestRecipe);
      planItems.push({
        day_of_week: day,
        meal_slot: mealSlot,
        recipe_id: bestRecipe.id,
      });
    }
  }

  // 7. Plan作成
  const planId = crypto.randomUUID();

  const totalProtein = selectedRecipes.reduce((sum, r) => sum + r.protein_g, 0);
  const totalCalories = selectedRecipes.reduce((sum, r) => sum + r.calories, 0);

  const plan: Plan = {
    id: planId,
    user_id: input.user_id,
    week_start_date: input.week_start_date,
    goal: profile.goal,
    items: planItems,
    total_protein_g: Math.round(totalProtein * 10) / 10,
    total_calories: Math.round(totalCalories),
  };

  // 8. DBに保存
  // @ts-expect-error Supabase insert型の複雑性によりエラーが出るが、実行時は正常動作する
  const { error: planError } = await supabase.from('plans').insert({
    id: plan.id,
    user_id: plan.user_id,
    week_start_date: plan.week_start_date,
    goal: plan.goal,
    total_protein_g: plan.total_protein_g,
    total_calories: plan.total_calories,
  });

  if (planError) {
    throw new Error(`プラン保存失敗: ${planError.message}`);
  }

  const planItemsToInsert = planItems.map((item) => ({
    plan_id: plan.id,
    day_of_week: item.day_of_week,
    meal_slot: item.meal_slot,
    recipe_id: item.recipe_id,
  }));

  // @ts-expect-error Supabase insert型の複雑性によりエラーが出るが、実行時は正常動作する
  const { error: itemsError } = await supabase.from('plan_items').insert(planItemsToInsert);

  if (itemsError) {
    throw new Error(`プランアイテム保存失敗: ${itemsError.message}`);
  }

  return {
    plan,
    message: `献立生成完了: ${plan.items.length}レシピ（週合計 P: ${plan.total_protein_g}g, Calories: ${plan.total_calories}kcal）`,
  };
}
