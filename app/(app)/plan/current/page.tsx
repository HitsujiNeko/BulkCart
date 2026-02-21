/**
 * Phase 4.3: 献立表示画面
 * 
 * 週次献立を表示する画面。
 * Phase 5.2（献立生成エンジン実装）まで、空状態とモックデータで表示。
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RecipeCard } from '@/components/recipe/recipe-card';
import { CalendarDays, ShoppingCart, ClipboardList, RefreshCw, Dumbbell, Loader2 } from 'lucide-react';
import type { Plan } from '@/types/models';

/**
 * 曜日ラベル
 */
const DAY_LABELS = ['月', '火', '水', '木', '金', '土', '日'];

/**
 * 食事スロットラベル
 */
const MEAL_SLOT_LABELS = {
  lunch: '昼',
  dinner: '夜',
  snack: '間食',
} as const;

/**
 * 空状態コンポーネント
 */
function EmptyState({ onGenerate, isGenerating }: { onGenerate: () => void; isGenerating: boolean }) {
  return (
    <Card className="shadow-lg">
      <CardContent className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <CalendarDays size={40} className="text-primary" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-foreground">
            献立がまだ生成されていません
          </h3>
          <p className="text-muted-foreground max-w-md">
            「献立を生成」ボタンを押すと、あなたの目標に合わせた週次献立が自動で作成されます。
          </p>
        </div>
        
        <Button size="lg" onClick={onGenerate} disabled={isGenerating} className="gap-2">
          {isGenerating ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              生成中...
            </>
          ) : (
            <>
              <Dumbbell size={20} />
              献立を生成
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

/**
 * 献立表示ページ
 */
export default function PlanCurrentPage() {
  const router = useRouter();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 献立データ取得
  useEffect(() => {
    fetchCurrentPlan();
  }, []);

  async function fetchCurrentPlan() {
    try {
      setIsLoading(true);
      setError(null);

      // TODO: 実装予定 - GET /api/plan/current で今週の献立を取得
      // 現在はプランなしとして扱う
      setPlan(null);
    } catch (err) {
      console.error('Failed to fetch plan:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }

  // 献立生成
  async function handleGeneratePlan() {
    try {
      setIsGenerating(true);
      setError(null);

      const response = await fetch('/api/plan/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate plan');
      }

      const result = await response.json();
      await fetchCurrentPlan(); // 生成後に再取得
      
      // 成功メッセージ表示（オプション）
      console.log(result.message);
    } catch (err) {
      console.error('Failed to generate plan:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsGenerating(false);
    }
  }

  // 曜日ごとに献立をグループ化
  const itemsByDay = plan ? (
    Array.from({ length: 7 }, (_, dayIndex) => ({
      dayIndex,
      items: plan.items.filter((item) => item.day_of_week === dayIndex),
    }))
  ) : [];

  // 目標ラベル
  const goalLabel = plan ? (
    { bulk: '増量', cut: '減量', maintain: '維持' }[plan.goal]
  ) : '';

  // 1日あたりのたんぱく質目標
  const dailyProtein = plan?.total_protein_g ? Math.floor(plan.total_protein_g / 7) : 0;

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      {/* ヘッダーサマリー */}
      <div className="bg-primary/5 border-b border-primary/10 p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* タイトル */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <CalendarDays size={28} className="text-primary" />
              今週の献立
            </h1>
            
            {/* 再生成ボタン */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleGeneratePlan}
              disabled={isGenerating}
              className="gap-2"
            >
              {isGenerating ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <RefreshCw size={16} />
              )}
              再生成
            </Button>
          </div>
          
          {/* 目標サマリー */}
          {plan && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm space-y-2">
              <div className="flex items-center gap-4 flex-wrap text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">目標:</span>
                  <span className="font-bold text-primary">{goalLabel}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">たんぱく質:</span>
                  <span className="font-bold text-primary">{dailyProtein}g/日</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">作り置き:</span>
                  <span className="font-medium">日曜 60分</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        {/* エラー表示 */}
        {error && (
          <Card className="border-red-500 bg-red-50 dark:bg-red-950">
            <CardContent className="py-4">
              <p className="text-red-700 dark:text-red-300 text-sm">
                エラー: {error}
              </p>
            </CardContent>
          </Card>
        )}

        {/* ローディング */}
        {isLoading ? (
          <Card className="shadow-lg">
            <CardContent className="flex items-center justify-center py-16">
              <Loader2 size={40} className="animate-spin text-primary" />
            </CardContent>
          </Card>
        ) : !plan ? (
          <EmptyState onGenerate={handleGeneratePlan} isGenerating={isGenerating} />
        ) : (
          <>
            {/* 各曜日の献立 */}
            <div className="space-y-6">
              {itemsByDay.map(({ dayIndex, items }) => (
                <div key={dayIndex} className="space-y-3">
                  {/* 日付ヘッダー */}
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-bold text-lg">
                        {DAY_LABELS[dayIndex]}
                      </span>
                    </div>
                    <div>
                      <h2 className="font-bold text-lg">
                        2月 {18 + dayIndex} 日（{DAY_LABELS[dayIndex]}）
                      </h2>
                      {items.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                          献立なし
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 食事スロット */}
                  <div className="grid md:grid-cols-2 gap-4 pl-14">
                    {items.map((item) => (
                      <div key={item.id} className="space-y-2">
                        <div className="text-sm font-medium text-muted-foreground">
                          {MEAL_SLOT_LABELS[item.meal_slot]}
                        </div>
                        <RecipeCard
                          id={item.recipe.id}
                          name={item.recipe.name}
                          description={item.recipe.description}
                          cookingTime={item.recipe.cooking_time}
                          difficulty={item.recipe.difficulty}
                          protein={item.recipe.protein_g}
                          fat={item.recipe.fat_g}
                          carbs={item.recipe.carb_g}
                          calories={item.recipe.calories}
                          imageUrl={item.recipe.image_url}
                          onClick={() => {
                            // Phase 6.2でレシピ詳細ページに遷移
                            console.log('レシピ詳細へ：', item.recipe.id);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* アクションボタン */}
            <div className="grid md:grid-cols-2 gap-4 pt-6">
              <Button
                variant="outline"
                size="lg"
                onClick={() => router.push(`/plan/${plan.id}/grocery`)}
                className="gap-2"
              >
                <ShoppingCart size={20} />
                買い物リストを見る
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={() => router.push(`/plan/${plan.id}/prep`)}
                className="gap-2"
              >
                <ClipboardList size={20} />
                段取りを見る
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
