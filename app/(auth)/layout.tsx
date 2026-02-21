import type { Metadata } from 'next';
import { redirectIfAuthenticated } from '@/lib/auth/server';

export const metadata: Metadata = {
  title: 'ログイン | BulkCart',
  description: '筋トレ民向け献立・買い物自動化アプリ',
};

/**
 * 認証ページ用レイアウト
 * ログイン/サインアップページで使用
 */
export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 認証済みユーザーは献立ページにリダイレクト
  await redirectIfAuthenticated();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* ロゴ */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900">BulkCart</h1>
          <p className="mt-2 text-sm text-gray-600">
            筋トレ民向け献立・買い物自動化アプリ
          </p>
        </div>

        {/* 認証フォーム */}
        {children}
      </div>
    </div>
  );
}
