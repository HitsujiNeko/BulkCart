/**
 * レシピ検索関数
 * 
 * ## 機能
 * - タグフィルタ（高たんぱく、低脂質、作り置き可など）
 * - 難易度フィルタ（easy, medium, hard）
 * - 調理時間フィルタ（最大調理時間）
 * - アレルギー除外ロジック
 * - 苦手食材除外ロジック
 * 
 * ## Phase 5.2での拡張予定
 * - スコアリング関数による並び替え
 * - 食材共通化ボーナス
 */

import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/types/database';

type Recipe = Database['public']['Tables']['recipes']['Row'];
type Difficulty = 'easy' | 'medium' | 'hard';

export interface RecipeSearchOptions {
  /** タグフィルタ（AND条件）。例: ['high-protein', 'batchable'] */
  tags?: string[];
  /** 難易度フィルタ */
  difficulty?: Difficulty | Difficulty[];
  /** 最大調理時間（分）。この時間以下のレシピのみ */
  maxCookingTime?: number;
  /** 除外するタグ（アレルギー対応）。例: ['egg', 'dairy'] */
  excludeTags?: string[];
  /** 検索結果の最大件数 */
  limit?: number;
}

/**
 * レシピを検索する
 * 
 * @param options - 検索オプション
 * @returns レシピ配列
 * 
 * @example
 * ```typescript
 * // 増量向けレシピを検索（高たんぱく、作り置き可、卵アレルギー除外）
 * const recipes = await searchRecipes({
 *   tags: ['high-protein', 'batchable'],
 *   excludeTags: ['egg'],
 *   maxCookingTime: 60,
 *   limit: 20
 * });
 * ```
 */
export async function searchRecipes(options: RecipeSearchOptions = {}): Promise<Recipe[]> {
  const {
    tags = [],
    difficulty,
    maxCookingTime,
    excludeTags = [],
    limit = 50,
  } = options;

  const supabase = createClient();

  try {
    let query = supabase.from('recipes').select('*');

    // タグフィルタ（AND条件）: 指定したタグをすべて含むレシピ
    if (tags.length > 0) {
      query = query.contains('tags', tags);
    }

    // 除外タグ（アレルギー・苦手食材）: 指定したタグを1つでも含まないレシピ
    if (excludeTags.length > 0) {
      // PostgreSQL の配列オペレータ: NOT (tags && excludeTags)
      // ※ Supabase JS Client では直接サポートされていないため、個別に not.contains を使用
      excludeTags.forEach((excludeTag) => {
        query = query.not('tags', 'cs', `{"${excludeTag}"}`);
      });
    }

    // 難易度フィルタ
    if (difficulty) {
      if (Array.isArray(difficulty)) {
        query = query.in('difficulty', difficulty);
      } else {
        query = query.eq('difficulty', difficulty);
      }
    }

    // 調理時間フィルタ
    if (maxCookingTime) {
      query = query.lte('cooking_time', maxCookingTime);
    }

    // 結果数制限
    query = query.limit(limit);

    const { data, error } = await query;

    if (error) {
      console.error('Failed to search recipes:', error);
      throw new Error(`レシピ検索に失敗しました: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Recipe search error:', error);
    throw error;
  }
}

/**
 * 高たんぱくレシピを検索する（ショートカット関数）
 * 
 * @param excludeTags - 除外するタグ（アレルギー対応）
 * @param limit - 最大件数
 * @returns 高たんぱくレシピ配列
 */
export async function searchHighProteinRecipes(
  excludeTags: string[] = [],
  limit = 30
): Promise<Recipe[]> {
  return searchRecipes({
    tags: ['high-protein'],
    excludeTags,
    limit,
  });
}

/**
 * 作り置き可能レシピを検索する（ショートカット関数）
 * 
 * @param excludeTags - 除外するタグ（アレルギー対応）
 * @param limit - 最大件数
 * @returns 作り置き可能レシピ配列
 */
export async function searchBatchableRecipes(
  excludeTags: string[] = [],
  limit = 30
): Promise<Recipe[]> {
  return searchRecipes({
    tags: ['batchable'],
    excludeTags,
    limit,
  });
}

/**
 * 時短レシピを検索する（ショートカット関数）
 * 
 * @param maxCookingTime - 最大調理時間（デフォルト: 15分）
 * @param excludeTags - 除外するタグ（アレルギー対応）
 * @param limit - 最大件数
 * @returns 時短レシピ配列
 */
export async function searchQuickRecipes(
  maxCookingTime = 15,
  excludeTags: string[] = [],
  limit = 30
): Promise<Recipe[]> {
  return searchRecipes({
    tags: ['quick'],
    maxCookingTime,
    excludeTags,
    limit,
  });
}

/**
 * 難易度が簡単なレシピを検索する（ショートカット関数）
 * 
 * @param excludeTags - 除外するタグ（アレルギー対応）
 * @param limit - 最大件数
 * @returns 簡単レシピ配列
 */
export async function searchEasyRecipes(
  excludeTags: string[] = [],
  limit = 30
): Promise<Recipe[]> {
  return searchRecipes({
    difficulty: 'easy',
    excludeTags,
    limit,
  });
}

/**
 * ユーザープロフィールに基づいてレシピを検索する
 * 
 * @param userProfile - ユーザープロフィール
 * @param limit - 最大件数
 * @returns ユーザーに適したレシピ配列
 * 
 * @example
 * ```typescript
 * const profile = {
 *   goal: 'bulk',
 *   allergies: ['卵', '乳製品'],
 *   dislikes: ['セロリ'],
 *   cooking_time_weekday: 15
 * };
 * const recipes = await searchRecipesByProfile(profile);
 * ```
 */
export async function searchRecipesByProfile(
  userProfile: {
    goal: 'bulk' | 'cut' | 'maintain';
    allergies?: string[];
    dislikes?: string[];
    cooking_time_weekday?: number;
  },
  limit = 50
): Promise<Recipe[]> {
  const { goal, allergies = [], dislikes = [], cooking_time_weekday } = userProfile;

  // アレルギー・苦手食材をタグに変換
  const allergiesMap: Record<string, string[]> = {
    '卵': ['egg'],
    '乳製品': ['dairy'],
    '小麦': ['wheat'],
    '大豆': ['soy'],
    '魚': ['fish'],
    '甲殻類': ['shellfish'],
    'ナッツ': ['nuts'],
  };

  const dislikesMap: Record<string, string[]> = {
    'セロリ': ['celery'],
    'パクチー': ['coriander'],
    // 必要に応じて追加
  };

  const excludeTags: string[] = [];

  // アレルギー除外
  allergies.forEach((allergy) => {
    const tags = allergiesMap[allergy];
    if (tags) {
      excludeTags.push(...tags);
    }
  });

  // 苦手食材除外
  dislikes.forEach((dislike) => {
    const tags = dislikesMap[dislike];
    if (tags) {
      excludeTags.push(...tags);
    }
  });

  // 目標に応じたタグフィルタ
  const goalTags: Record<string, string[]> = {
    bulk: ['high-protein', 'high-carb'], // 増量: 高たんぱく+高炭水化物
    cut: ['high-protein', 'low-fat'], // 減量: 高たんぱく+低脂質
    maintain: ['high-protein'], // 維持: 高たんぱく
  };

  return searchRecipes({
    tags: goalTags[goal] || [],
    excludeTags,
    maxCookingTime: cooking_time_weekday,
    limit,
  });
}
