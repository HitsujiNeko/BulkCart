/**
 * ドメインモデル型定義
 * 
 * API Response と異なる場合があるため、
 * types/api.ts と明確に分離して管理する。
 */

/**
 * ユーザーの目標タイプ
 */
export type Goal = 'bulk' | 'cut' | 'maintain';

/**
 * レシピの難易度
 */
export type Difficulty = 'easy' | 'medium' | 'hard';

/**
 * 食事のタイミング（献立スロット）
 */
export type MealSlot = 'lunch' | 'dinner' | 'snack';

/**
 * レシピ
 */
export interface Recipe {
  id: string;
  name: string;
  description?: string;
  protein_g: number;
  fat_g: number;
  carb_g: number;
  calories: number;
  cooking_time: number; // 分
  difficulty: Difficulty;
  tags: string[];
  image_url?: string;
}

/**
 * 献立アイテム（1食分）
 */
export interface PlanItem {
  id: string;
  day_of_week: number; // 0=月曜, 6=日曜
  meal_slot: MealSlot;
  recipe: Recipe;
}

/**
 * 週次献立
 */
export interface Plan {
  id: string;
  user_id: string;
  week_start_date: string; // YYYY-MM-DD
  goal: Goal;
  total_protein_g: number | null;
  total_calories: number | null;
  created_at: string;
  items: PlanItem[];
}

/**
 * ユーザープロフィール
 */
export interface UserProfile {
  id: string;
  goal: Goal;
  weight_kg: number | null;
  training_days_per_week: number;
  cooking_time_weekday: number; // 分
  cooking_time_weekend: number; // 分
  budget_per_month: number | null;
  allergies: string[];
  dislikes: string[];
  created_at: string;
  updated_at: string;
}
