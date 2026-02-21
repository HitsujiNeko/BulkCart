import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * ログアウトAPI
 * GET /api/auth/signout でログアウト → /login へリダイレクト
 */
export async function GET(request: NextRequest) {
  const supabase = createClient();
  await supabase.auth.signOut();
  
  const origin = request.nextUrl.origin;
  return NextResponse.redirect(new URL('/login', origin));
}
