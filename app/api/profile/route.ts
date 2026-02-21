/**
 * プロフィール作成・更新API
 * POST: プロフィールを作成または更新
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/types/database';

type UserProfileInsert = Database['public']['Tables']['user_profiles']['Insert'];

interface ProfileRequest {
  goal: 'bulk' | 'cut' | 'maintain';
  weight_kg: number;
  training_days_per_week: number;
  cooking_time_per_meal: number;
  budget_level: 'low' | 'medium' | 'high';
  allergies: string[] | null;
  disliked_ingredients: string[] | null;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();

    // 認証チェック
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    // リクエストボディをパース
    const body: ProfileRequest = await request.json();

    // バリデーション
    if (!body.goal || !['bulk', 'cut', 'maintain'].includes(body.goal)) {
      return NextResponse.json(
        { error: '目標を正しく選択してください' },
        { status: 400 }
      );
    }

    if (body.weight_kg < 30 || body.weight_kg > 200) {
      return NextResponse.json(
        { error: '体重は30～200kgの範囲で入力してください' },
        { status: 400 }
      );
    }

    if (
      body.training_days_per_week < 0 ||
      body.training_days_per_week > 7
    ) {
      return NextResponse.json(
        { error: 'トレーニング日数は0～7日の範囲で入力してください' },
        { status: 400 }
      );
    }

    if (
      body.cooking_time_per_meal < 10 ||
      body.cooking_time_per_meal > 120
    ) {
      return NextResponse.json(
        { error: '調理時間は10～120分の範囲で入力してください' },
        { status: 400 }
      );
    }

    // プロフィールを作成または更新（upsert）
    const profileData: UserProfileInsert = {
      id: user.id,
      goal: body.goal,
      weight_kg: body.weight_kg,
      training_days_per_week: body.training_days_per_week,
      cooking_time_per_meal: body.cooking_time_per_meal,
      budget_level: body.budget_level,
      allergies: body.allergies,
      disliked_ingredients: body.disliked_ingredients,
    };

    // Supabase upsert型推論の制限により as any を使用
    const { data: profile, error: upsertError } = await (supabase
      .from('user_profiles')
      .upsert as any)(profileData, {
        onConflict: 'id',
      })
      .select()
      .single();

    if (upsertError) {
      console.error('Failed to upsert profile:', upsertError);
      return NextResponse.json(
        { error: 'プロフィールの保存に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'プロフィールを保存しました',
        profile,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Profile API error:', error);
    return NextResponse.json(
      { error: '内部サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
