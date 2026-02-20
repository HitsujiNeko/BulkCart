import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { Database } from '@/types/database';
import type { NextRequest } from 'next/server';

/**
 * サーバーサイド用 Supabase クライアント
 * 
 * API Routes、Server Components、Server Actions で使用します。
 * Cookie ベースの認証を処理します。
 * 
 * @example
 * ```tsx
 * import { createClient } from '@/lib/supabase/server';
 * 
 * export default async function Page() {
 *   const supabase = createClient();
 *   const { data: { user } } = await supabase.auth.getUser();
 *   
 *   if (!user) {
 *     redirect('/login');
 *   }
 *   
 *   return <div>Welcome {user.email}</div>;
 * }
 * ```
 * 
 * @example API Route
 * ```tsx
 * import { createClient } from '@/lib/supabase/server';
 * import { NextRequest, NextResponse } from 'next/server';
 * 
 * export async function GET(request: NextRequest) {
 *   const supabase = createClient();
 *   const { data, error } = await supabase
 *     .from('recipes')
 *     .select('*')
 *     .limit(10);
 *   
 *   return NextResponse.json({ data, error });
 * }
 * ```
 */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

/**
 * ミドルウェアでの Supabase クライアント作成
 * 
 * middleware.ts で認証チェックに使用します。
 * 
 * @example
 * ```tsx
 * import { createMiddlewareClient } from '@/lib/supabase/server';
 * import { NextResponse } from 'next/server';
 * import type { NextRequest } from 'next/server';
 * 
 * export async function middleware(request: NextRequest) {
 *   const { supabase, response } = createMiddlewareClient(request);
 *   const { data: { user } } = await supabase.auth.getUser();
 *   
 *   if (!user && request.nextUrl.pathname.startsWith('/app')) {
 *     return NextResponse.redirect(new URL('/login', request.url));
 *   }
 *   
 *   return response;
 * }
 * ```
 */

export function createMiddlewareClient(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  return { supabase, response };
}
