/**
 * レシピスコアリング関数
 * 献立生成時にレシピに0〜100点のスコアを付与
 * 
 * スコア構成:
 * - PFC適合度: 40点（目標PFCとのマッチング度）
 * - 食材共通化: 30点（既選択レシピとの食材重複度）
 * - 調理時間・難易度: 20点（調理時間の短さ、難易度の低さ）
 * - 多様性: 10点（過去の献立との重複回避）
 */

import type { Goal, MealNutritionTarget } from './targets';

export interface Recipe {
  id: string;
  name: string;
  protein_g: number;
  fat_g: number;
  carb_g: number;
  calories: number;
  cooking_time: number;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}

export interface RecipeIngredient {
  ingredient_id: string;
  amount: number;
  unit: string;
}

export interface RecipeWithIngredients extends Recipe {
  ingredients: RecipeIngredient[];
}

export interface ScoringContext {
  target: MealNutritionTarget;
  goal: Goal;
  selectedRecipes: RecipeWithIngredients[];
  maxTime: number;
  recentRecipeIds: string[];
}

/**
 * PFC適合度スコアを計算（40点満点）
 * 
 * 目標別の重み設定:
 * - 増量（bulk）: たんぱく質40% + 脂質10% + 炭水化物50%
 * - 減量（cut）: たんぱく質60% + 脂質20% + 炭水化物20%
 * - 維持（maintain）: たんぱく質40% + 脂質30% + 炭水化物30%
 * 
 * @param recipe レシピ
 * @param target 1食あたりの目標栄養
 * @param goal 目標（bulk/cut/maintain）
 * @returns PFC適合度スコア（0〜40）
 */
export function calculatePFCScore(
  recipe: Recipe,
  target: MealNutritionTarget,
  goal: Goal
): number {
  // 目標別の重み設定
  const weights: Record<Goal, { protein: number; fat: number; carb: number }> = {
    bulk: { protein: 0.4, fat: 0.1, carb: 0.5 },
    cut: { protein: 0.6, fat: 0.2, carb: 0.2 },
    maintain: { protein: 0.4, fat: 0.3, carb: 0.3 },
  };

  const w = weights[goal];

  // 各栄養素の適合度（0〜1）目標に近いほど1に近づく
  const proteinFit = 1 - Math.abs(recipe.protein_g - target.protein_g) / Math.max(target.protein_g, 1);
  const fatFit = 1 - Math.abs(recipe.fat_g - target.fat_g) / Math.max(target.fat_g, 1);
  const carbFit = 1 - Math.abs(recipe.carb_g - target.carb_g) / Math.max(target.carb_g, 1);

  // 0〜1の範囲にクリップ
  const clamp = (val: number) => Math.max(0, Math.min(1, val));

  const pfcScore = w.protein * clamp(proteinFit) + w.fat * clamp(fatFit) + w.carb * clamp(carbFit);

  return pfcScore * 40; // 40点満点
}

/**
 * 食材共通化スコアを計算（30点満点）
 * 
 * 既に選択されたレシピと食材を共有するレシピにボーナス加点。
 * 買い物リストの集約と食材ロス削減を促進。
 * 
 * @param recipe レシピ（食材情報含む）
 * @param selectedRecipes 既選択レシピリスト
 * @returns 食材共通化スコア（0〜30）
 */
export function calculateIngredientOverlapScore(
  recipe: RecipeWithIngredients,
  selectedRecipes: RecipeWithIngredients[]
): number {
  if (selectedRecipes.length === 0) return 0;

  // 既選択レシピの食材ID集合
  const selectedIngredientIds = new Set<string>();
  selectedRecipes.forEach((r) => {
    r.ingredients.forEach((ri) => selectedIngredientIds.add(ri.ingredient_id));
  });

  // 現在のレシピの食材との重複数
  const recipeIngredientIds = recipe.ingredients.map((ri) => ri.ingredient_id);
  const overlapCount = recipeIngredientIds.filter((id) => selectedIngredientIds.has(id)).length;

  // 重複率（0〜1）
  const overlapRatio = recipeIngredientIds.length > 0 ? overlapCount / recipeIngredientIds.length : 0;

  return overlapRatio * 30; // 30点満点
}

/**
 * 調理時間・難易度スコアを計算（20点満点）
 * 
 * - 調理時間スコア: 15点満点（短いほど高スコア）
 * - 難易度スコア: 5点満点（easy: 5点, medium: 3点, hard: 0点）
 * 
 * @param recipe レシピ
 * @param maxTime 最大調理時間（分）
 * @returns 利便性スコア（0〜20）
 */
export function calculateConvenienceScore(recipe: Recipe, maxTime: number): number {
  // 調理時間スコア（15点満点）
  // maxTime以内なら満点、超過するほどペナルティ
  const timeScore = Math.max(0, 1 - recipe.cooking_time / Math.max(maxTime, 1)) * 15;

  // 難易度スコア（5点満点）
  const difficultyScore: Record<Recipe['difficulty'], number> = {
    easy: 5,
    medium: 3,
    hard: 0,
  };

  return timeScore + difficultyScore[recipe.difficulty];
}

/**
 * 多様性スコアを計算（10点満点）
 * 
 * 過去の献立との重複を回避してバリエーションを増やす。
 * 
 * @param recipe レシピ
 * @param recentRecipeIds 過去3週間のレシピID
 * @returns 多様性スコア（0〜10）
 */
export function calculateDiversityScore(recipe: Recipe, recentRecipeIds: string[]): number {
  // 過去3週間に使用されていなければ満点
  if (recentRecipeIds.length === 0) return 10;

  const usedCount = recentRecipeIds.filter((id) => id === recipe.id).length;

  // 使用回数が多いほどペナルティ
  const diversityScore = Math.max(0, 10 - usedCount * 3);

  return diversityScore;
}

/**
 * 総合スコアを計算（100点満点）
 * 
 * @param recipe レシピ（食材情報含む）
 * @param context スコアリングコンテキスト
 * @returns 総合スコア（0〜100）
 */
export function calculateTotalScore(
  recipe: RecipeWithIngredients,
  context: ScoringContext
): number {
  const pfcScore = calculatePFCScore(recipe, context.target, context.goal);
  const overlapScore = calculateIngredientOverlapScore(recipe, context.selectedRecipes);
  const convenienceScore = calculateConvenienceScore(recipe, context.maxTime);
  const diversityScore = calculateDiversityScore(recipe, context.recentRecipeIds);

  return pfcScore + overlapScore + convenienceScore + diversityScore;
}
