import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BulkCart - 筋トレ民向け献立・買い物自動化アプリ',
  description:
    '増量・減量・維持の目標に合わせて、週次献立を自動生成。買い物リストと作り置き段取りで、筋トレ飯の継続を最大化します。',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
