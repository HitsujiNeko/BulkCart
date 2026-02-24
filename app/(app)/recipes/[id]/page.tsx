/**
 * Phase 6.2: レシピ詳細ページ
 * 
 * レシピの詳細情報（材料、調理手順、栄養情報）を表示
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Clock, ChefHat } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { RecipeDetail } from '@/types/models';

/**
 * ページメタデータ生成
 */
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  try {
    const recipe = await fetchRecipeDetail(params.id);
    return {
      title: `${recipe.name} | BulkCart`,
      description: recipe.description || `${recipe.name}のレシピ詳細`,
    };
  } catch {
    return {
      title: 'レシピ詳細 | BulkCart',
    };
  }
}

/**
 * レシピ詳細を取得
 */
async function fetchRecipeDetail(id: string): Promise<RecipeDetail> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const response = await fetch(`${baseUrl}/api/recipes/${id}`, {
    cache: 'no-store', // SSR で常に最新データを取得
  });

  if (!response.ok) {
    throw new Error('Failed to fetch recipe detail');
  }

  return response.json();
}

/**
 * 難易度ラベル
 */
const DIFFICULTY_LABELS: Record<string, string> = {
  easy: '簡単',
  medium: '普通',
  hard: '難しい',
};

/**
 * レシピ詳細ページ
 */
export default async function RecipeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  let recipe: RecipeDetail;

  try {
    recipe = await fetchRecipeDetail(params.id);
  } catch {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ヘッダー */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <Link
            href="/plan/current"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
            献立に戻る
          </Link>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* レシピタイトル */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">{recipe.name}</h1>
          {recipe.description && (
            <p className="text-muted-foreground">{recipe.description}</p>
          )}
          <div className="flex flex-wrap gap-2 items-center">
            <Badge variant="outline" className="gap-1">
              <Clock size={14} />
              {recipe.cooking_time}分
            </Badge>
            <Badge variant="outline" className="gap-1">
              <ChefHat size={14} />
              {DIFFICULTY_LABELS[recipe.difficulty] || recipe.difficulty}
            </Badge>
            {recipe.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* レシピ画像 */}
        {recipe.image_url && (
          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
            <Image
              src={recipe.image_url}
              alt={recipe.name}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* 栄養情報 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">栄養情報（1人前）</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-primary">
                  {recipe.protein_g}g
                </div>
                <div className="text-xs text-muted-foreground">たんぱく質</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-amber-600">
                  {recipe.fat_g}g
                </div>
                <div className="text-xs text-muted-foreground">脂質</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-blue-600">
                  {recipe.carb_g}g
                </div>
                <div className="text-xs text-muted-foreground">炭水化物</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-green-600">
                  {recipe.calories}
                </div>
                <div className="text-xs text-muted-foreground">kcal</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 材料 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">材料</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center py-2 border-b last:border-0"
                >
                  <span className="font-medium text-foreground">
                    {ingredient.name}
                  </span>
                  <span className="text-muted-foreground">
                    {ingredient.amount}
                    {ingredient.unit}
                    {ingredient.notes && (
                      <span className="text-xs ml-2 text-muted-foreground">
                        ({ingredient.notes})
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* 作り方 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">作り方</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              {recipe.steps.map((step) => (
                <li key={step.step} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    {step.step}
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-foreground">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
