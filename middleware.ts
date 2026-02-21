/**
 * Next.js Middleware
 * 認証が必要なルートを保護
 */

import { createMiddlewareClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Supabase クライアント作成
  const { supabase, response } = createMiddlewareClient(request);

  // セッションをチェック
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // /app/* へのアクセスは認証が必要
  if (request.nextUrl.pathname.startsWith('/app')) {
    if (!user) {
      // 未認証の場合はログインページにリダイレクト
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // 認証ページ（/login, /signup）へのアクセス
  if (
    user &&
    (request.nextUrl.pathname === '/login' ||
      request.nextUrl.pathname === '/signup')
  ) {
    // 認証済みの場合は献立ページにリダイレクト
    return NextResponse.redirect(new URL('/app/plan/current', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
