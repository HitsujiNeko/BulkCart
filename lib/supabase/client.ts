import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';

/**
 * クライアントサイド用 Supabase クライアント
 * 
 * React コンポーネント内、クライアント側の認証フローで使用します。
 * 
 * @example
 * ```tsx
 * 'use client';
 * 
 * import { supabase } from '@/lib/supabase/client';
 * 
 * export function LoginForm() {
 *   const handleLogin = async (email: string, password: string) => {
 *     const { data, error } = await supabase.auth.signInWithPassword({
 *       email,
 *       password,
 *     });
 *   };
 * }
 * ```
 */
export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
