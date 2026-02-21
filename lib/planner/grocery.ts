/**
 * 買い物リスト生成ロジック
 * 
 * 献立から食材を抽出、正規化、カテゴリ別に集計する。
 * 
 * @module lib/planner/grocery
 */

import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/types/database';
import type {
  GroceryList,
  GroceryCategory,
  GroceryItem,
  IngredientCategory,
} from '@/types/models';

type IngredientRow = Database['public']['Tables']['ingredients']['Row'];
type RecipeIngredientRow = Database['public']['Tables']['recipe_ingredients']['Row'];
type PlanRow = Database['public']['Tables']['plans']['Row'];

/**
 * カテゴリ名の日本語マッピング
 */
const CATEGORY_NAMES: Record<IngredientCategory, string> = {
  meat: '肉類',
  fish: '魚介類',
  egg_dairy: '卵・乳製品',
  vegetable: '野菜',
  grain: '穀物',
  seasoning: '調味料',
  other: 'その他',
};

/**
 * 買い物リストを生成する
 * 
 * @param planId 献立ID
 * @returns 買い物リスト
 * 
 * @example
 * ```typescript
 * const groceryList = await generateGroceryList('plan-uuid-1234');
 * console.log(groceryList.categories[0].items); // カテゴリ別食材リスト
 * ```
 */
export async function generateGroceryList(planId: string): Promise<GroceryList> {
  const supabase = createClient();

  // 1. 献立とアイテムを取得
  const { data: plan, error: planError } = await supabase
    .from('plans')
    .select('*')
    .eq('id', planId)
    .single();

  if (planError || !plan) {
    throw new Error(`Plan not found: ${planId}`);
  }

  const planRow = plan as PlanRow;

  // 2. plan_items を取得
  const { data: planItems, error: itemsError } = await supabase
    .from('plan_items')
    .select('recipe_id')
    .eq('plan_id', planId);

  if (itemsError || !planItems) {
    throw new Error(`Failed to fetch plan items: ${itemsError?.message}`);
  }

  type PlanItemPartial = Pick<Database['public']['Tables']['plan_items']['Row'], 'recipe_id'>;
  const recipeIds = (planItems as PlanItemPartial[]).map((item) => item.recipe_id);

  if (recipeIds.length === 0) {
    // 献立が空の場合は空のリストを返す
    return {
      plan_id: planId,
      week_start_date: planRow.week_start_date,
      categories: [],
      total_estimated_price: 0,
    };
  }

  // 3. レシピの食材情報を取得
  const { data: recipeIngredients, error: riError } = await supabase
    .from('recipe_ingredients')
    .select('recipe_id, ingredient_id, amount, unit')
    .in('recipe_id', recipeIds);

  if (riError) {
    throw new Error(`Failed to fetch recipe ingredients: ${riError.message}`);
  }

  const recipeIngredientsData = (recipeIngredients || []) as RecipeIngredientRow[];

  // 4. 食材マスタを取得
  const ingredientIds = Array.from(
    new Set(recipeIngredientsData.map((ri) => ri.ingredient_id))
  );

  const { data: ingredients, error: ingError } = await supabase
    .from('ingredients')
    .select('*')
    .in('id', ingredientIds);

  if (ingError) {
    throw new Error(`Failed to fetch ingredients: ${ingError.message}`);
  }

  const ingredientsData = (ingredients || []) as IngredientRow[];
  const ingredientsMap = new Map<string, IngredientRow>();
  ingredientsData.forEach((ing) => {
    ingredientsMap.set(ing.id, ing);
  });

  // 5. 食材を集約（同一ingredient_idの数量を合算）
  const ingredientAggregateMap = new Map<
    string,
    {
      ingredient: IngredientRow;
      totalAmount: number;
      unit: string;
    }
  >();

  recipeIngredientsData.forEach((ri) => {
    const ingredient = ingredientsMap.get(ri.ingredient_id);
    if (!ingredient) return;

    const existing = ingredientAggregateMap.get(ri.ingredient_id);

    if (existing) {
      // 単位が同じ場合のみ合算（異なる場合は別食材として扱う可能性があるが、ここでは単純化）
      if (existing.unit === ri.unit) {
        existing.totalAmount += ri.amount;
      }
    } else {
      ingredientAggregateMap.set(ri.ingredient_id, {
        ingredient,
        totalAmount: ri.amount,
        unit: ri.unit,
      });
    }
  });

  // 6. カテゴリ別に分類
  const categoriesOrder: IngredientCategory[] = [
    'meat',
    'fish',
    'egg_dairy',
    'vegetable',
    'grain',
    'seasoning',
    'other',
  ];

  const categories: GroceryCategory[] = [];
  let totalEstimatedPrice = 0;

  categoriesOrder.forEach((category) => {
    const items: GroceryItem[] = [];

    ingredientAggregateMap.forEach((value, ingredientId) => {
      const { ingredient, totalAmount, unit } = value;

      if (ingredient.category === category) {
        // 価格推定（avg_price_per_unit × amount / 100）
        // avg_price_per_unit は「円/100g」または「円/個」を想定
        const estimatedPrice = ingredient.avg_price_per_unit
          ? Math.ceil((totalAmount / 100) * ingredient.avg_price_per_unit)
          : null;

        items.push({
          ingredient_id: ingredientId,
          name: ingredient.name,
          amount: Math.ceil(totalAmount), // 切り上げ
          unit,
          estimated_price: estimatedPrice,
        });

        if (estimatedPrice) {
          totalEstimatedPrice += estimatedPrice;
        }
      }
    });

    // カテゴリにアイテムがある場合のみ追加
    if (items.length > 0) {
      // 名前順でソート（見やすさのため）
      items.sort((a, b) => a.name.localeCompare(b.name, 'ja'));

      categories.push({
        category,
        category_name: CATEGORY_NAMES[category],
        items,
      });
    }
  });

  // 7. DBに保存（キャッシュ）
  await saveGroceryItems(supabase, planId, categories);

  // 8. GroceryListを返す
  return {
    plan_id: planId,
    week_start_date: planRow.week_start_date,
    categories,
    total_estimated_price: totalEstimatedPrice,
  };
}

/**
 * grocery_items テーブルに保存（既存データは削除して再作成）
 * 
 * @param supabase Supabaseクライアント
 * @param planId 献立ID
 * @param categories カテゴリ別食材リスト
 */
async function saveGroceryItems(
  supabase: ReturnType<typeof createClient>,
  planId: string,
  categories: GroceryCategory[]
): Promise<void> {
  // 1. 既存データを削除（献立が変更された場合に対応）
  const { error: deleteError } = await supabase
    .from('grocery_items')
    .delete()
    .eq('plan_id', planId);

  if (deleteError) {
    console.error('Failed to delete old grocery items:', deleteError);
    // エラーでも続行
  }

  // 2. 新しいデータを挿入
  const groceryItemsToInsert = categories.flatMap((category) =>
    category.items.map((item) => ({
      plan_id: planId,
      ingredient_id: item.ingredient_id,
      amount: item.amount,
      unit: item.unit,
      category: category.category,
      estimated_price: item.estimated_price,
    }))
  );

  if (groceryItemsToInsert.length > 0) {
    const { error: insertError } = await (
      // @ts-expect-error Supabase insert型の複雑性によりエラーが出るが、実行時は正常動作する
      supabase.from('grocery_items').insert(groceryItemsToInsert)
    );

    if (insertError) {
      console.error('Failed to insert grocery items:', insertError);
      throw new Error('買い物リストの保存に失敗しました');
    }
  }
}
