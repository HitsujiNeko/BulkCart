/**
 * 買い物リスト取得 API
 * 
 * GET /api/plan/[id]/grocery
 * 
 * 献立ID から買い物リストを生成して返す。
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateGroceryList } from '@/lib/planner/grocery';
import type { Database } from '@/types/database';

/**
 * GET /api/plan/[id]/grocery
 * 
 * 献立から生成された買い物リストを取得
 * 
 * @param request Next.js Request
 * @param params { id: string } - 献立ID
 * @returns GroceryList JSON
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

    // 3. 買い物リスト生成
    const groceryList = await generateGroceryList(planId);

    return NextResponse.json(groceryList, { status: 200 });
  } catch (error) {
    console.error('Failed to generate grocery list:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message:
          error instanceof Error ? error.message : '買い物リストの生成に失敗しました',
      },
      { status: 500 }
    );
  }
}
