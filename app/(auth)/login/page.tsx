'use client';

/**
 * ログイン/サインアップページ
 * Supabase Auth（Email/Password）を使用
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Database } from '@/types/database';

type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

type AuthMode = 'login' | 'signup';

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        // サインアップ
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) {
          setError(signUpError.message);
        } else if (data.user) {
          // 既に登録済みの場合
          if (data.user.identities?.length === 0) {
            setMessage('このメールアドレスは既に登録されています');
          } else if (data.session) {
            // セッションが作成された = Email Confirmation OFF = 自動ログイン成功
            setMessage('アカウントを作成しました');
            // オンボーディングへリダイレクト
            router.push('/app/onboarding');
            router.refresh();
          } else {
            // セッションがない = Email Confirmation ON = メール確認が必要
            setMessage(
              '確認メールをお送りしました。メール内のリンクをクリックしてアカウントを有効化してください。'
            );
          }
        }
      } else {
        // ログイン
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          setError('メールアドレスまたはパスワードが正しくありません');
        } else if (data.user) {
          // オンボーディング済みかチェック
          const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('id, goal')
            .eq('id', data.user.id)
            .single<Pick<UserProfile, 'id' | 'goal'>>();

          if (!profileError && profile && profile.goal) {
            // プロフィール設定済み → 献立ページへ
            router.push('/app/plan/current');
          } else {
            // 未設定 → オンボーディングへ
            router.push('/app/onboarding');
          }
          router.refresh();
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('認証処理に失敗しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError(null);
    setMessage(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === 'login' ? 'ログイン' : '新規登録'}</CardTitle>
        <CardDescription>
          {mode === 'login'
            ? 'メールアドレスとパスワードでログイン'
            : 'メールアドレスとパスワードでアカウント作成'}
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {/* エラーメッセージ */}
          {error && (
            <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* 成功メッセージ */}
          {message && (
            <div className="rounded-md bg-green-50 p-4 text-sm text-green-600">
              {message}
            </div>
          )}

          {/* メールアドレス */}
          <div className="space-y-2">
            <Label htmlFor="email">メールアドレス</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@bulkcart.app"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={loading}
            />
          </div>

          {/* パスワード */}
          <div className="space-y-2">
            <Label htmlFor="password">パスワード</Label>
            <Input
              id="password"
              type="password"
              placeholder={mode === 'signup' ? '8文字以上' : 'パスワード'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              disabled={loading}
            />
            {mode === 'signup' && (
              <p className="text-xs text-gray-500">
                ※ 8文字以上のパスワードを設定してください
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          {/* 送信ボタン */}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading
              ? '処理中...'
              : mode === 'login'
                ? 'ログイン'
                : '新規登録'}
          </Button>

          {/* モード切り替え */}
          <div className="text-center text-sm">
            <button
              type="button"
              onClick={toggleMode}
              className="text-blue-600 hover:text-blue-700 hover:underline"
              disabled={loading}
            >
              {mode === 'login'
                ? 'アカウントをお持ちでない方はこちら'
                : 'すでにアカウントをお持ちの方はこちら'}
            </button>
          </div>

          {/* パスワードリセット */}
          {mode === 'login' && (
            <div className="text-center text-sm">
              <Link
                href="/reset-password"
                className="text-gray-600 hover:text-gray-700 hover:underline"
              >
                パスワードを忘れた方
              </Link>
            </div>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
