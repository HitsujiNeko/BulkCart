/**
 * サーバーサイド認証ヘルパー関数
 * API Routes と Server Components で使用
 */

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

/**
 * 現在のユーザー情報を取得
 * @returns ユーザー情報（未認証の場合は null）
 */
export async function getUser(): Promise<User | null> {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error('Failed to get user:', error);
      return null;
    }

    return user;
  } catch (error) {
    console.error('Failed to get user:', error);
    return null;
  }
}

/**
 * 認証が必要なページで使用
 * 未認証の場合はログインページにリダイレクト
 * @returns ユーザー情報
 */
export async function requireAuth(): Promise<User> {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  return user;
}

/**
 * 認証済みユーザーがアクセスした場合にリダイレクト
 * （ログイン/サインアップページで使用）
 * @param redirectTo リダイレクト先（デフォルト: /app/plan/current）
 */
export async function redirectIfAuthenticated(
  redirectTo: string = '/app/plan/current'
): Promise<void> {
  const user = await getUser();

  if (user) {
    redirect(redirectTo);
  }
}

/**
 * ユーザーのプロフィール情報を取得
 * @param userId ユーザーID
 * @returns プロフィール情報
 */
export async function getUserProfile(userId: string) {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Failed to get user profile:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Failed to get user profile:', error);
    return null;
  }
}
