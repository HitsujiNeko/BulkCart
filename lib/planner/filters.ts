/**
 * 制約条件フィルタリング
 * 
 * アレルギーや苦手食材を含むレシピを除外
 */

import type { RecipeWithIngredients } from './scoring';

export interface FilterConstraints {
  /** アレルギー食材（日本語）例: ['卵', '乳製品', '小麦'] */
  allergies: string[];
  /** 苦手食材（日本語）例: ['納豆', 'セロリ'] */
  dislikes: string[];
}

export interface Ingredient {
  id: string;
  name: string;
  aliases: string[];
  category: string;
}

/**
 * アレルギー・苦手食材のマッピング（日本語 → 英語タグ）
 * 
 * searchRecipesByProfile()で使用されるパターンと同じ
 */
const allergyTagMapping: Record<string, string[]> = {
  卵: ['egg'],
  乳製品: ['dairy'],
  小麦: ['wheat'],
  大豆: ['soy'],
  魚: ['fish'],
  甲殻類: ['shellfish'],
  ナッツ: ['nuts'],
};

/**
 * アレルギー・苦手食材を含むレシピを除外してフィルタリング
 * 
 * ## フィルタリングロジック
 * 1. レシピのタグに除外タグが含まれていないか確認
 * 2. レシピの食材名に除外文字列が含まれていないか確認
 * 
 * @param recipes 候補レシピリスト（食材情報含む）
 * @param constraints 制約条件（アレルギー、苦手食材）
 * @param ingredientsMap 食材ID → 食材データのマップ
 * @returns フィルタリング後のレシピリスト
 */
export function filterRecipesByConstraints(
  recipes: RecipeWithIngredients[],
  constraints: FilterConstraints,
  ingredientsMap: Map<string, Ingredient>
): RecipeWithIngredients[] {
  // 除外タグリストを作成（アレルギー + 苦手食材）
  const excludeTags: string[] = [];
  
  // アレルギー → タグ変換
  constraints.allergies.forEach((allergy) => {
    const tags = allergyTagMapping[allergy];
    if (tags) {
      excludeTags.push(...tags);
    }
  });

  // 苦手食材もタグとして扱う（小文字化して追加）
  constraints.dislikes.forEach((dislike) => {
    excludeTags.push(dislike.toLowerCase());
  });

  return recipes.filter((recipe) => {
    // 1. レシピのタグに除外タグが含まれているか確認
    const hasExcludedTag = recipe.tags.some((tag) => excludeTags.includes(tag.toLowerCase()));

    if (hasExcludedTag) return false;

    // 2. レシピの食材に除外文字列が含まれているか確認
    const hasExcludedIngredient = recipe.ingredients.some((ri) => {
      const ingredient = ingredientsMap.get(ri.ingredient_id);
      if (!ingredient) return false;

      // 食材名またはエイリアスに除外文字列が含まれているか
      const ingredientNames = [ingredient.name, ...ingredient.aliases];

      return ingredientNames.some((name) => {
        // アレルギー食材チェック
        const matchesAllergy = constraints.allergies.some((allergy) =>
          name.includes(allergy)
        );

        // 苦手食材チェック
        const matchesDislike = constraints.dislikes.some((dislike) =>
          name.includes(dislike)
        );

        return matchesAllergy || matchesDislike;
      });
    });

    return !hasExcludedIngredient;
  });
}

/**
 * 調理時間で追加フィルタリング（オプショナル）
 * 
 * @param recipes 候補レシピリスト
 * @param maxTime 最大調理時間（分）
 * @returns フィルタリング後のレシピリスト
 */
export function filterRecipesByTime(
  recipes: RecipeWithIngredients[],
  maxTime: number
): RecipeWithIngredients[] {
  return recipes.filter((recipe) => recipe.cooking_time <= maxTime);
}

/**
 * 複数の制約条件を適用してフィルタリング
 * 
 * @param recipes 候補レシピリスト
 * @param constraints 制約条件
 * @param ingredientsMap 食材ID → 食材データのマップ
 * @param maxTime 最大調理時間（オプション）
 * @returns フィルタリング後のレシピリスト
 */
export function applyAllFilters(
  recipes: RecipeWithIngredients[],
  constraints: FilterConstraints,
  ingredientsMap: Map<string, Ingredient>,
  maxTime?: number
): RecipeWithIngredients[] {
  let filtered = filterRecipesByConstraints(recipes, constraints, ingredientsMap);

  if (maxTime !== undefined) {
    filtered = filterRecipesByTime(filtered, maxTime);
  }

  return filtered;
}
