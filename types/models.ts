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

/**
 * 食材カテゴリ
 */
export type IngredientCategory = 
  | 'meat' 
  | 'fish' 
  | 'egg_dairy' 
  | 'vegetable' 
  | 'grain' 
  | 'seasoning' 
  | 'other';

/**
 * 買い物リストアイテム
 */
export interface GroceryItem {
  ingredient_id: string;
  name: string;
  amount: number;
  unit: string;
  estimated_price: number | null;
}

/**
 * カテゴリ別買い物リスト
 */
export interface GroceryCategory {
  category: IngredientCategory;
  category_name: string;
  items: GroceryItem[];
}

/**
 * 買い物リスト（献立から自動生成）
 */
export interface GroceryList {
  plan_id: string;
  week_start_date: string; // YYYY-MM-DD
  categories: GroceryCategory[];
  total_estimated_price: number;
}

/**
 * 作り置き段取りタスク
 */
export interface PrepTask {
  time: string; // HH:MM形式（例: '00:05'）
  duration_minutes: number; // 所要時間（分）
  task: string; // タスク名（例: '鶏むね下処理（1.2kg）'）
  description: string; // 詳細説明
  recipes: string[]; // 関連レシピ名リスト
}

/**
 * 作り置き段取りタイムライン
 */
export interface PrepTimeline {
  plan_id: string;
  week_start_date: string; // YYYY-MM-DD
  prep_day: string; // 曜日（例: '日曜日'）
  total_time_minutes: number; // 合計所要時間
  tasks: PrepTask[]; // タスクリスト（時系列順）
}
