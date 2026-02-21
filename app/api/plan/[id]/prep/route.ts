/**
 * 作り置き段取りタイムライン取得 API
 * 
 * GET /api/plan/[id]/prep
 * 
 * 献立IDから作り置き段取りタイムラインを生成して返す。
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generatePrepTimeline } from '@/lib/planner/prep';
import type { Database } from '@/types/database';

/**
 * GET /api/plan/[id]/prep
 * 
 * 献立から生成された作り置き段取りタイムラインを取得
 * 
 * @param _request Next.js Request (unused)
 * @param params { id: string } - 献立ID
 * @returns PrepTimeline JSON
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. 認証確認
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const planId = params.id;

    // 2. 献立の所有権確認（RLS で保護されているが、念のため確認）
    const { data: plan, error: planError } = await supabase
      .from('plans')
      .select('id, user_id')
      .eq('id', planId)
      .single();

    if (planError || !plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    type PlanWithUserId = Pick<Database['public']['Tables']['plans']['Row'], 'id' | 'user_id'>;
    if ((plan as PlanWithUserId).user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 3. 作り置き段取りタイムライン生成
    const prepTimeline = await generatePrepTimeline(planId);

    return NextResponse.json(prepTimeline, { status: 200 });
  } catch (error) {
    console.error('Failed to generate prep timeline:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message:
          error instanceof Error ? error.message : '作り置き段取りの生成に失敗しました',
      },
      { status: 500 }
    );
  }
}
