/**
 * レシピ詳細取得 API
 * 
 * GET /api/recipes/[id]
 * 
 * レシピIDから詳細情報を取得（食材・手順含む）
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { RecipeDetail, RecipeIngredient, RecipeStep } from '@/types/models';
import type { Database } from '@/types/database';

type RecipeRow = Database['public']['Tables']['recipes']['Row'];

/**
 * GET /api/recipes/[id]
 * 
 * レシピ詳細を取得（認証不要のパブリックAPI）
 * 
 * @param request Next.js Request
 * @param params { id: string } - レシピID
 * @returns RecipeDetail JSON
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const recipeId = params.id;

    // 1. レシピ基本情報を取得
    const { data: recipeData, error: recipeError } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', recipeId)
      .single();

    if (recipeError || !recipeData) {
      return NextResponse.json(
        { error: 'Recipe not found' },
        { status: 404 }
      );
    }

    // 型アサーション
    const recipe = recipeData as RecipeRow;

    // 2. 食材情報を取得（recipe_ingredients + ingredients の JOIN）
    const { data: ingredientsData, error: ingredientsError } = await supabase
      .from('recipe_ingredients')
      .select(`
        ingredient_id,
        amount,
        unit,
        notes,
        ingredients (
          name
        )
      `)
      .eq('recipe_id', recipeId);

    if (ingredientsError) {
      console.error('Failed to fetch ingredients:', ingredientsError);
      return NextResponse.json(
        { error: 'Failed to fetch recipe ingredients' },
        { status: 500 }
      );
    }

    // 3. 食材データを整形
    const ingredients: RecipeIngredient[] = (ingredientsData || []).map((item: any) => ({
      ingredient_id: item.ingredient_id,
      name: item.ingredients?.name || 'Unknown',
      amount: item.amount,
      unit: item.unit,
      notes: item.notes,
    }));

    // 4. 調理手順を整形（recipes.steps はJSON配列として保存されている想定）
    const rawSteps = recipe.steps as unknown;
    const steps: RecipeStep[] = Array.isArray(rawSteps)
      ? rawSteps.map((stepText: string, index: number) => ({
          step: index + 1,
          text: stepText,
        }))
      : [];

    // 5. レシピ詳細を構築
    const recipeDetail: RecipeDetail = {
      id: recipe.id,
      name: recipe.name,
      description: (recipe as RecipeRow & { description?: string }).description || null,
      cooking_time: recipe.cooking_time,
      difficulty: recipe.difficulty,
      protein_g: recipe.protein_g,
      fat_g: recipe.fat_g,
      carb_g: recipe.carb_g,
      calories: recipe.calories,
      tags: recipe.tags || [],
      image_url: recipe.image_url,
      ingredients,
      steps,
      created_at: recipe.created_at,
    };

    return NextResponse.json(recipeDetail, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch recipe detail:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message:
          error instanceof Error ? error.message : 'レシピ詳細の取得に失敗しました',
      },
      { status: 500 }
    );
  }
}
