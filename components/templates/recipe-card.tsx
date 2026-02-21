/**
 * RecipeCardテンプレート
 * 
 * 使用箇所：献立表示、レシピ一覧、レシピ検索結果
 * 
 * カスタマイズ方法：
 * 1. このファイルをコピー: cp components/templates/recipe-card.tsx components/recipe/recipe-card.tsx
 * 2. Props型を調整（必要なプロパティを追加/削除）
 * 3. 表示項目を追加/削除
 * 4. スタイル調整（Tailwind classes）
 * 
 * @example
 * ```tsx
 * import { RecipeCard } from '@/components/recipe/recipe-card';
 * 
 * <RecipeCard
 *   id="1"
 *   name="鶏むね肉のグリル"
 *   description="高たんぱく・低脂質の定番レシピ"
 *   cookingTime={20}
 *   difficulty="easy"
 *   protein={40}
 *   fat={5}
 *   carbs={10}
 *   calories={250}
 *   imageUrl="/images/recipes/chicken-grill.jpg"
 *   onClick={() => router.push('/app/recipes/1')}
 * />
 * ```
 */

'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Clock, Dumbbell } from 'lucide-react';

export interface RecipeCardProps {
  /** レシピID */
  id: string;
  /** レシピ名 */
  name: string;
  /** レシピ説明（オプション） */
  description?: string;
  /** 調理時間（分） */
  cookingTime: number;
  /** 難易度 */
  difficulty: 'easy' | 'medium' | 'hard';
  /** たんぱく質（g） */
  protein: number;
  /** 脂質（g） */
  fat: number;
  /** 炭水化物（g） */
  carbs: number;
  /** カロリー（kcal） */
  calories: number;
  /** 画像URL（オプション） */
  imageUrl?: string;
  /** クリック時のコールバック */
  onClick?: () => void;
}

/**
 * RecipeCard コンポーネント
 * 
 * レシピ情報を表示するカードコンポーネント。
 * デザインシステム準拠（オレンジ×赤）、Responsive対応。
 */
export function RecipeCard({
  id,
  name,
  description,
  cookingTime,
  difficulty,
  protein,
  fat,
  carbs,
  calories,
  imageUrl,
  onClick,
}: RecipeCardProps) {
  // 難易度ラベルの日本語化
  const difficultyLabel = {
    easy: '簡単',
    medium: '普通',
    hard: '難しい',
  }[difficulty];

  // 難易度のカラーバリエーション
  const difficultyColor = {
    easy: 'bg-green-500/10 text-green-700 dark:text-green-400',
    medium: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
    hard: 'bg-red-500/10 text-red-700 dark:text-red-400',
  }[difficulty];

  return (
    <Card 
      data-recipe-id={id}
      className="shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      {/* レシピ画像 */}
      {imageUrl && (
        <div className="relative h-48 w-full bg-secondary/20">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
        </div>
      )}
      
      {/* ヘッダー（レシピ名・説明） */}
      <CardHeader className="bg-secondary/30">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Dumbbell size={20} className="text-primary flex-shrink-0" />
          <span className="truncate">{name}</span>
        </CardTitle>
        {description && (
          <CardDescription className="line-clamp-2">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      
      {/* コンテンツ（調理時間・難易度・P/F/C） */}
      <CardContent className="pt-4 space-y-4">
        {/* 調理時間・難易度バッジ */}
        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock size={14} />
            <span>{cookingTime}分</span>
          </Badge>
          <Badge className={difficultyColor}>
            {difficultyLabel}
          </Badge>
        </div>
        
        {/* P/F/C栄養情報 */}
        <div className="grid grid-cols-4 gap-2 text-sm">
          {/* たんぱく質（Primary Color） */}
          <div className="text-center">
            <div className="font-bold text-primary text-base">{protein}g</div>
            <div className="text-muted-foreground text-xs">P</div>
          </div>
          
          {/* 脂質 */}
          <div className="text-center">
            <div className="font-bold text-base">{fat}g</div>
            <div className="text-muted-foreground text-xs">F</div>
          </div>
          
          {/* 炭水化物 */}
          <div className="text-center">
            <div className="font-bold text-base">{carbs}g</div>
            <div className="text-muted-foreground text-xs">C</div>
          </div>
          
          {/* カロリー */}
          <div className="text-center">
            <div className="font-bold text-base">{calories}</div>
            <div className="text-muted-foreground text-xs">kcal</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
