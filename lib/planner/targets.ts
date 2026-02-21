/**
 * 目標PFC計算関数
 * ユーザーの目標（増量/減量/維持）に基づいて1日あたりの栄養目標を計算
 */

export type Goal = 'bulk' | 'cut' | 'maintain';

export interface UserProfile {
  goal: Goal;
  weight_kg: number | null;
  training_days_per_week: number;
}

export interface DailyNutritionTarget {
  protein_g: number;
  fat_g: number;
  carb_g: number;
  calories: number;
}

export interface MealNutritionTarget {
  protein_g: number;
  fat_g: number;
  carb_g: number;
  calories: number;
}

/**
 * 1日あたりの目標PFCを計算
 * 
 * ## 目標別計算式（体重ベース）
 * 
 * ### 増量（bulk）
 * - たんぱく質: 体重 × 2.0g/日
 * - 脂質: 体重 × 0.8g/日
 * - 炭水化物: 体重 × 5.0g/日
 * 
 * ### 減量（cut）
 * - たんぱく質: 体重 × 2.2g/日
 * - 脂質: 体重 × 0.5g/日
 * - 炭水化物: 体重 × 2.5g/日
 * 
 * ### 維持（maintain）
 * - たんぱく質: 体重 × 1.8g/日
 * - 脂質: 体重 × 0.7g/日
 * - 炭水化物: 体重 × 3.5g/日
 * 
 * @param profile ユーザープロフィール
 * @returns 1日あたりの栄養目標
 */
export function calculateDailyTarget(profile: UserProfile): DailyNutritionTarget {
  // 体重不明時のデフォルト値（70kg想定）
  const weight = profile.weight_kg || 70;

  // 目標別の係数
  const coefficients: Record<Goal, { protein: number; fat: number; carb: number }> = {
    bulk: { protein: 2.0, fat: 0.8, carb: 5.0 },
    cut: { protein: 2.2, fat: 0.5, carb: 2.5 },
    maintain: { protein: 1.8, fat: 0.7, carb: 3.5 },
  };

  const coef = coefficients[profile.goal];

  const protein_g = weight * coef.protein;
  const fat_g = weight * coef.fat;
  const carb_g = weight * coef.carb;

  // カロリー計算（P: 4kcal/g, F: 9kcal/g, C: 4kcal/g）
  const calories = Math.round(protein_g * 4 + fat_g * 9 + carb_g * 4);

  return {
    protein_g: Math.round(protein_g * 10) / 10, // 小数第1位まで
    fat_g: Math.round(fat_g * 10) / 10,
    carb_g: Math.round(carb_g * 10) / 10,
    calories,
  };
}

/**
 * 1食あたりの目標PFCを計算（昼・夜で均等分割）
 * 
 * @param profile ユーザープロフィール
 * @returns 1食あたりの栄養目標
 */
export function calculatePerMealTarget(profile: UserProfile): MealNutritionTarget {
  const dailyTarget = calculateDailyTarget(profile);

  return {
    protein_g: Math.round((dailyTarget.protein_g / 2) * 10) / 10,
    fat_g: Math.round((dailyTarget.fat_g / 2) * 10) / 10,
    carb_g: Math.round((dailyTarget.carb_g / 2) * 10) / 10,
    calories: Math.round(dailyTarget.calories / 2),
  };
}

/**
 * 週間の目標PFCを計算（7日分）
 * 
 * @param profile ユーザープロフィール
 * @returns 週間の栄養目標
 */
export function calculateWeeklyTarget(profile: UserProfile): DailyNutritionTarget {
  const dailyTarget = calculateDailyTarget(profile);

  return {
    protein_g: Math.round(dailyTarget.protein_g * 7 * 10) / 10,
    fat_g: Math.round(dailyTarget.fat_g * 7 * 10) / 10,
    carb_g: Math.round(dailyTarget.carb_g * 7 * 10) / 10,
    calories: Math.round(dailyTarget.calories * 7),
  };
}
