/**
 * 買い物リスト画面
 * 
 * 献立から自動生成された買い物リストを表示。
 * カテゴリ別表示、チェックボックス、エクスポート機能。
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GroceryList } from '@/components/grocery/GroceryList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Copy, Share2, Printer, Loader2 } from 'lucide-react';
import type { GroceryList as GroceryListType } from '@/types/models';

interface PageProps {
  params: { id: string };
}

/**
 * 買い物リスト画面
 */
export default function GroceryPage({ params }: PageProps) {
  const router = useRouter();
  const [groceryList, setGroceryList] = useState<GroceryListType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 買い物リストを取得
  useEffect(() => {
    const fetchGroceryList = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/plan/${params.id}/grocery`);

        if (!response.ok) {
          if (response.status === 401) {
            router.push('/login');
            return;
          }
          throw new Error('買い物リストの取得に失敗しました');
        }

        const data = await response.json();
        setGroceryList(data);
      } catch (err) {
        console.error('Failed to fetch grocery list:', err);
        setError(err instanceof Error ? err.message : '買い物リストの取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroceryList();
  }, [params.id, router]);

  // コピー機能
  const handleCopy = async () => {
    if (!groceryList) return;

    try {
      const text = formatGroceryListAsText(groceryList);
      await navigator.clipboard.writeText(text);
      alert('買い物リストをコピーしました！');
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('コピーに失敗しました');
    }
  };

  // LINE共有機能
  const handleShareLine = () => {
    if (!groceryList) return;

    const text = formatGroceryListAsText(groceryList);
    const encodedText = encodeURIComponent(text);
    const lineUrl = `https://line.me/R/msg/text/?${encodedText}`;

    window.open(lineUrl, '_blank');
  };

  // 印刷機能
  const handlePrint = () => {
    window.print();
  };

  // ローディング表示
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  // エラー表示
  if (error || !groceryList) {
    return (
      <div className="container max-w-4xl mx-auto p-6">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-900">エラー</CardTitle>
            <CardDescription className="text-red-700">
              {error || '買い物リストが見つかりません'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft size={16} className="mr-2" />
              戻る
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto p-6">
      {/* ヘッダー */}
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft size={16} className="mr-2" />
          献立に戻る
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">買い物リスト</h1>
        <p className="text-gray-600 mt-2">
          {new Date(groceryList.week_start_date).toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
          の週
        </p>
      </div>

      {/* アクションボタン */}
      <div className="grid grid-cols-3 gap-4 mb-6 print:hidden">
        <Button variant="outline" onClick={handleCopy} className="gap-2">
          <Copy size={16} />
          コピー
        </Button>
        <Button variant="outline" onClick={handleShareLine} className="gap-2">
          <Share2 size={16} />
          LINE送信
        </Button>
        <Button variant="outline" onClick={handlePrint} className="gap-2">
          <Printer size={16} />
          印刷
        </Button>
      </div>

      {/* 合計金額 */}
      {groceryList.total_estimated_price > 0 && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">推定合計</span>
              <span className="text-2xl font-bold text-orange-600">
                約 {groceryList.total_estimated_price.toLocaleString()}円
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 買い物リスト */}
      <GroceryList categories={groceryList.categories} planId={groceryList.plan_id} />

      {/* 印刷用スタイル */}
      <style jsx global>{`
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * 買い物リストをテキスト形式にフォーマット
 */
function formatGroceryListAsText(groceryList: GroceryListType): string {
  const date = new Date(groceryList.week_start_date).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  let text = `【買い物リスト】\n${date}の週\n\n`;

  groceryList.categories.forEach((category) => {
    text += `■ ${category.category_name}\n`;
    category.items.forEach((item) => {
      text += `□ ${item.name} ${item.amount}${item.unit}`;
      if (item.estimated_price !== null) {
        text += ` (約${item.estimated_price}円)`;
      }
      text += '\n';
    });
    text += '\n';
  });

  if (groceryList.total_estimated_price > 0) {
    text += `合計: 約${groceryList.total_estimated_price.toLocaleString()}円`;
  }

  return text;
}
