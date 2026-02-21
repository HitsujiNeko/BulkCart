'use client';

/**
 * オンボーディング画面
 * 3ステップのマルチステップフォームでユーザープロフィールを収集
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRequireAuth } from '@/lib/auth/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type Goal = 'bulk' | 'cut' | 'maintain';
type BudgetLevel = 'low' | 'medium' | 'high';

interface OnboardingData {
  goal: Goal | null;
  weight_kg: number;
  training_days_per_week: number;
  cooking_time_per_meal: number;
  budget_level: BudgetLevel;
  allergies: string;
  disliked_ingredients: string;
}

export default function OnboardingPage() {
  const { user, loading: authLoading } = useRequireAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [data, setData] = useState<OnboardingData>({
    goal: null,
    weight_kg: 70,
    training_days_per_week: 4,
    cooking_time_per_meal: 30,
    budget_level: 'medium',
    allergies: '',
    disliked_ingredients: '',
  });

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    // バリデーション
    if (step === 1 && !data.goal) {
      setError('目標を選択してください');
      return;
    }
    if (step === 2) {
      if (data.weight_kg < 30 || data.weight_kg > 200) {
        setError('体重は30～200kgの範囲で入力してください');
        return;
      }
      if (data.training_days_per_week < 0 || data.training_days_per_week > 7) {
        setError('トレーニング日数は0～7日の範囲で入力してください');
        return;
      }
      if (
        data.cooking_time_per_meal < 10 ||
        data.cooking_time_per_meal > 120
      ) {
        setError('調理時間は10～120分の範囲で入力してください');
        return;
      }
    }

    setError(null);
    setStep(step + 1);
  };

  const handleBack = () => {
    setError(null);
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      // アレルギーと苦手食材を配列に変換
      const allergiesArray = data.allergies
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item.length > 0);

      const dislikedArray = data.disliked_ingredients
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item.length > 0);

      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goal: data.goal,
          weight_kg: data.weight_kg,
          training_days_per_week: data.training_days_per_week,
          cooking_time_per_meal: data.cooking_time_per_meal,
          budget_level: data.budget_level,
          allergies: allergiesArray.length > 0 ? allergiesArray : null,
          disliked_ingredients: dislikedArray.length > 0 ? dislikedArray : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'プロフィールの保存に失敗しました');
      }

      // 成功 → 献立ページへ
      router.push('/app/plan/current');
      router.refresh();
    } catch (err) {
      console.error('Failed to save profile:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'プロフィールの保存に失敗しました'
      );
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* ヘッダー */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">初期設定</h1>
          <p className="mt-2 text-sm text-gray-600">
            あなたに最適な献立を作成するための情報を入力してください
          </p>
        </div>

        {/* プログレスバー */}
        <div className="mb-8">
          <div className="mb-2 flex justify-between text-sm text-gray-600">
            <span>ステップ {step} / {totalSteps}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} />
        </div>

        <Card>
          {/* Step 1: 目標選択 */}
          {step === 1 && (
            <>
              <CardHeader>
                <CardTitle>あなたの目標は？</CardTitle>
                <CardDescription>
                  目標に合わせて最適な栄養バランスの献立を作成します
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {error && (
                  <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <RadioGroup
                  value={data.goal || ''}
                  onValueChange={(value) =>
                    setData({ ...data, goal: value as Goal })
                  }
                >
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50">
                      <RadioGroupItem value="bulk" id="bulk" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="bulk" className="font-semibold">
                          増量（バルクアップ）
                        </Label>
                        <p className="text-sm text-gray-600">
                          筋肉量を増やしたい。高たんぱく・高炭水化物の献立を作成します。
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50">
                      <RadioGroupItem value="cut" id="cut" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="cut" className="font-semibold">
                          減量（カット）
                        </Label>
                        <p className="text-sm text-gray-600">
                          体脂肪を落としたい。高たんぱく・低脂質の献立を作成します。
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50">
                      <RadioGroupItem
                        value="maintain"
                        id="maintain"
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <Label htmlFor="maintain" className="font-semibold">
                          維持
                        </Label>
                        <p className="text-sm text-gray-600">
                          現状維持。バランスの取れた献立を作成します。
                        </p>
                      </div>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </>
          )}

          {/* Step 2: 体重・トレーニング情報 */}
          {step === 2 && (
            <>
              <CardHeader>
                <CardTitle>あなたの情報</CardTitle>
                <CardDescription>
                  必要なカロリーとタンパク質量を計算します
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {error && (
                  <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">
                    {error}
                  </div>
                )}

                {/* 体重 */}
                <div className="space-y-2">
                  <Label htmlFor="weight">体重（kg）</Label>
                  <Input
                    id="weight"
                    type="number"
                    min="30"
                    max="200"
                    value={data.weight_kg}
                    onChange={(e) =>
                      setData({ ...data, weight_kg: Number(e.target.value) })
                    }
                    required
                  />
                  <p className="text-xs text-gray-500">
                    タンパク質量の目安：体重×2g/日
                  </p>
                </div>

                {/* トレーニング日数 */}
                <div className="space-y-2">
                  <Label htmlFor="training-days">週のトレーニング日数</Label>
                  <Select
                    value={data.training_days_per_week.toString()}
                    onValueChange={(value) =>
                      setData({
                        ...data,
                        training_days_per_week: Number(value),
                      })
                    }
                  >
                    <SelectTrigger id="training-days">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 1, 2, 3, 4, 5, 6, 7].map((days) => (
                        <SelectItem key={days} value={days.toString()}>
                          {days}日
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 調理時間 */}
                <div className="space-y-2">
                  <Label htmlFor="cooking-time">1食あたりの調理時間（分）</Label>
                  <Select
                    value={data.cooking_time_per_meal.toString()}
                    onValueChange={(value) =>
                      setData({
                        ...data,
                        cooking_time_per_meal: Number(value),
                      })
                    }
                  >
                    <SelectTrigger id="cooking-time">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10分</SelectItem>
                      <SelectItem value="20">20分</SelectItem>
                      <SelectItem value="30">30分</SelectItem>
                      <SelectItem value="45">45分</SelectItem>
                      <SelectItem value="60">60分</SelectItem>
                      <SelectItem value="90">90分</SelectItem>
                      <SelectItem value="120">120分</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </>
          )}

          {/* Step 3: 予算・アレルギー */}
          {step === 3 && (
            <>
              <CardHeader>
                <CardTitle>食材の好み・制限</CardTitle>
                <CardDescription>
                  アレルギーや苦手な食材があれば教えてください
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {error && (
                  <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">
                    {error}
                  </div>
                )}

                {/* 予算感 */}
                <div className="space-y-2">
                  <Label htmlFor="budget">食費の予算感</Label>
                  <Select
                    value={data.budget_level}
                    onValueChange={(value) =>
                      setData({ ...data, budget_level: value as BudgetLevel })
                    }
                  >
                    <SelectTrigger id="budget">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">
                        節約重視（鶏むね・卵・豆腐中心）
                      </SelectItem>
                      <SelectItem value="medium">
                        バランス重視（幅広い食材）
                      </SelectItem>
                      <SelectItem value="high">
                        品質重視（牛肉・魚など高品質食材も）
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* アレルギー */}
                <div className="space-y-2">
                  <Label htmlFor="allergies">
                    アレルギー（複数の場合はカンマ区切り）
                  </Label>
                  <Input
                    id="allergies"
                    type="text"
                    placeholder="例: 卵, 乳製品, えび"
                    value={data.allergies}
                    onChange={(e) =>
                      setData({ ...data, allergies: e.target.value })
                    }
                  />
                  <p className="text-xs text-gray-500">
                    ※ 該当する食材を含むレシピは除外されます
                  </p>
                </div>

                {/* 苦手食材 */}
                <div className="space-y-2">
                  <Label htmlFor="disliked">
                    苦手な食材（複数の場合はカンマ区切り）
                  </Label>
                  <Textarea
                    id="disliked"
                    placeholder="例: セロリ, パクチー, レバー"
                    value={data.disliked_ingredients}
                    onChange={(e) =>
                      setData({
                        ...data,
                        disliked_ingredients: e.target.value,
                      })
                    }
                    rows={3}
                  />
                  <p className="text-xs text-gray-500">
                    ※ 該当する食材を含むレシピは除外されます
                  </p>
                </div>
              </CardContent>
            </>
          )}

          {/* フッター（ナビゲーションボタン） */}
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1 || loading}
            >
              戻る
            </Button>

            {step < totalSteps ? (
              <Button onClick={handleNext} disabled={loading}>
                次へ
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? '保存中...' : '完了'}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
