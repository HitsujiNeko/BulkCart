/**
 * BulkCart シードデータ投入スクリプト
 * 
 * ## 使い方
 * ```bash
 * npm run db:seed
 * ```
 * 
 * ## 実行内容
 * 1. docs/seed-data/ingredients.csv を読み込み → ingredients テーブルに投入
 * 2. docs/seed-data/recipes.csv を読み込み → recipes テーブルに投入
 * 
 * ## 前提条件
 * - マイグレーション (20260221_create_recipes_tables.sql) が実行済み
 * - Supabase_URL と SUPABASE_SERVICE_ROLE_KEY が .env.local に設定済み
 */

import { createClient } from '@supabase/supabase-js';
import { readFile } from 'fs/promises';
import { join } from 'path';

// Service Role Key を使用（RLS をバイパス）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ 環境変数が設定されていません');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
  console.error('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceRoleKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

/**
 * CSV を JavaScript オブジェクトの配列にパース
 */
function parseCSV(csvText: string): Record<string, string>[] {
  const lines = csvText.trim().split('\n');
  if (lines.length === 0) {
    throw new Error('CSV ファイルが空です');
  }
  const headerLine = lines[0];
  if (!headerLine) {
    throw new Error('CSV ヘッダー行がありません');
  }
  const headers = headerLine.split(',');

  return lines.slice(1).map((line) => {
    // CSV の各行を解析（ダブルクォートで囲まれた値を考慮）
    const values: string[] = [];
    let currentValue = '';
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue.trim());

    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header.trim()] = values[index] || '';
    });

    return row;
  });
}

/**
 * JSON 配列文字列を JavaScript 配列にパース
 */
function parseJSONArray(str: string): string[] {
  try {
    // CSV 内でダブルクォートがエスケープされている場合を処理
    const cleaned = str.replace(/^"(.*)"$/, '$1').replace(/""/g, '"');
    return JSON.parse(cleaned);
  } catch (error) {
    console.warn('JSON パースエラー:', str, error);
    return [];
  }
}

/**
 * 食材データを投入
 */
async function seedIngredients() {
  console.log('\n📦 食材データ投入開始...');

  try {
    const csvPath = join(process.cwd(), 'docs', 'seed-data', 'ingredients.csv');
    const csvText = await readFile(csvPath, 'utf-8');
    const rows = parseCSV(csvText);

    console.log(`   読み込み: ${rows.length} 件`);

    const ingredients = rows.map((row) => ({
      name: row.name || '',
      aliases: parseJSONArray(row.aliases || '[]'),
      category: row.category || 'other',
      unit: row.unit || 'g',
      avg_price_per_unit: row.avg_price_per_unit ? parseInt(row.avg_price_per_unit, 10) : null,
    }));

    // 既存データを削除（開発環境のみ）
    const { error: deleteError } = await supabase.from('ingredients').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (deleteError && deleteError.code !== 'PGRST116') {
      // PGRST116: テーブルが空の場合のエラー（無視）
      console.warn('   既存データ削除エラー:', deleteError.message);
    }

    // バッチインサート
    const { data, error } = await supabase.from('ingredients').insert(ingredients).select();

    if (error) {
      console.error('❌ 食材データ投入エラー:', error);
      throw error;
    }

    console.log(`✅ 食材データ投入完了: ${data?.length || 0} 件`);
  } catch (error) {
    console.error('❌ 食材データ処理エラー:', error);
    throw error;
  }
}

/**
 * レシピデータを投入
 */
async function seedRecipes() {
  console.log('\n🍳 レシピデータ投入開始...');

  try {
    const csvPath = join(process.cwd(), 'docs', 'seed-data', 'recipes.csv');
    const csvText = await readFile(csvPath, 'utf-8');
    const rows = parseCSV(csvText);

    console.log(`   読み込み: ${rows.length} 件`);

    const recipes = rows.map((row) => ({
      name: row.name || '',
      description: row.description || null,
      cooking_time: parseInt(row.cooking_time || '30', 10),
      difficulty: (row.difficulty as 'easy' | 'medium' | 'hard') || 'easy',
      protein_g: parseFloat(row.protein_g || '0'),
      fat_g: parseFloat(row.fat_g || '0'),
      carb_g: parseFloat(row.carb_g || '0'),
      calories: parseInt(row.calories || '0', 10),
      tags: parseJSONArray(row.tags || '[]'),
      steps: [], // Phase 5.1では空配列（Phase 5.2で手順追加予定）
      image_url: row.image_url || null,
    }));

    // 既存データを削除（開発環境のみ）
    const { error: deleteError } = await supabase.from('recipes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (deleteError && deleteError.code !== 'PGRST116') {
      console.warn('   既存データ削除エラー:', deleteError.message);
    }

    // バッチインサート
    const { data, error } = await supabase.from('recipes').insert(recipes).select();

    if (error) {
      console.error('❌ レシピデータ投入エラー:', error);
      throw error;
    }

    console.log(`✅ レシピデータ投入完了: ${data?.length || 0} 件`);

    // サンプル表示
    if (data && data.length > 0) {
      console.log('\n📋 サンプルレシピ (最初の3件):');
      data.slice(0, 3).forEach((recipe, index) => {
        console.log(`   ${index + 1}. ${recipe.name} (P:${recipe.protein_g}g F:${recipe.fat_g}g C:${recipe.carb_g}g)`);
      });
    }
  } catch (error) {
    console.error('❌ レシピデータ処理エラー:', error);
    throw error;
  }
}

/**
 * メイン処理
 */
async function main() {
  console.log('🚀 BulkCart シードデータ投入開始');
  console.log('================================================');

  try {
    await seedIngredients();
    await seedRecipes();

    console.log('\n================================================');
    console.log('✅ すべてのシードデータ投入が完了しました！');
    console.log('\n📊 統計:');
    
    const { count: ingredientsCount } = await supabase
      .from('ingredients')
      .select('*', { count: 'exact', head: true });
    
    const { count: recipesCount } = await supabase
      .from('recipes')
      .select('*', { count: 'exact', head: true });

    console.log(`   - 食材: ${ingredientsCount} 件`);
    console.log(`   - レシピ: ${recipesCount} 件`);

    process.exit(0);
  } catch (error) {
    console.error('\n❌ シードデータ投入に失敗しました');
    console.error(error);
    process.exit(1);
  }
}

main();
