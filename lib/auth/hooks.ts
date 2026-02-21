'use client';

/**
 * クライアントサイド認証Hooks
 * React ComponentsでSupabase Authの状態を管理
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import type { User, AuthError } from '@supabase/supabase-js';

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  error: AuthError | null;
  signOut: () => Promise<void>;
}

/**
 * 認証状態を管理するHook
 * @returns 認証情報とログアウト関数
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);
  const router = useRouter();

  useEffect(() => {
    // 初回マウント時にセッションをチェック
    const checkSession = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          setError(sessionError);
          setUser(null);
        } else {
          setUser(session?.user ?? null);
        }
      } catch (err) {
        console.error('Failed to check session:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // 認証状態の変更を監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      setLoading(true);
      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        setError(signOutError);
        console.error('Failed to sign out:', signOutError);
      } else {
        setUser(null);
        router.push('/login');
        router.refresh();
      }
    } catch (err) {
      console.error('Failed to sign out:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    signOut,
  };
}

/**
 * 認証が必要なページで使用するHook
 * 未認証の場合は自動的にログインページにリダイレクト
 */
export function useRequireAuth(): UseAuthReturn {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth.loading && !auth.user) {
      router.push('/login');
    }
  }, [auth.loading, auth.user, router]);

  return auth;
}
