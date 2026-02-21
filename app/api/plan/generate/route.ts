/**
 * POST /api/plan/generate
 * 
 * 献立生成APIエンドポイント
 * ユーザーIDと週開始日を受け取り、週次献立（7日×2食）を生成
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generatePlan, getWeekStartDate } from '@/lib/planner/generate';
import { z } from 'zod';

// Request スキーマ
const generatePlanSchema = z.object({
  week_start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)').optional(),
});

/**
 * POST /api/plan/generate
 * 
 * ## Request Body
 * ```json
 * {
 *   "week_start_date": "2026-02-24" // オプション、省略時は次の月曜日
 * }
 * ```
 * 
 * ## Response（成功）
 * ```json
 * {
 *   "plan": {
 *     "id": "uuid",
 *     "user_id": "uuid",
 *     "week_start_date": "2026-02-24",
 *     "goal": "bulk",
 *     "items": [
 *       { "day_of_week": 0, "meal_slot": "lunch", "recipe_id": "uuid" },
 *       ...
 *     ],
 *     "total_protein_g": 980.0,
 *     "total_calories": 14560
 *   },
 *   "message": "献立生成完了: 14レシピ（週合計 P: 980.0g, Calories: 14560kcal）"
 * }
 * ```
 * 
 * ## Response（エラー）
 * ```json
 * {
 *   "error": "Unauthorized"
 * }
 * ```
 * 
 * ## エラーコード
 * - 401: 認証エラー（ログインが必要）
 * - 400: バリデーションエラー（リクエスト形式が不正）
 * - 500: サーバーエラー（献立生成失敗）
 */
export async function POST(request: NextRequest) {
  try {
    // 認証チェック
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // リクエストボディのパース
    const body = await request.json();

    // バリデーション
    const parseResult = generatePlanSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: 'Validation Error',
          details: parseResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { week_start_date } = parseResult.data;

    // 週開始日の決定（省略時は次の月曜日）
    const weekStartDate = week_start_date || getWeekStartDate();

    // 献立生成
    const result = await generatePlan({
      user_id: user.id,
      week_start_date: weekStartDate,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Failed to generate plan:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // 制約条件エラーの場合は具体的なメッセージを返す
    if (errorMessage.includes('PLAN_GENERATION_FAILED')) {
      return NextResponse.json(
        {
          error: 'Plan generation failed',
          message: errorMessage,
        },
        { status: 422 }
      );
    }

    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}
