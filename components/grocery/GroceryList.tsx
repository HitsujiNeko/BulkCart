/**
 * 買い物リストコンポーネント
 * 
 * カテゴリ別に食材を表示し、チェックボックスで購入済みをマーク。
 * localStorage でチェック状態を永続化。
 */

'use client';

import { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import type { GroceryCategory } from '@/types/models';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface GroceryListProps {
  categories: GroceryCategory[];
  planId: string;
}

export function GroceryList({ categories, planId }: GroceryListProps) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(categories.map((c) => c.category))
  );

  // localStorageからチェック状態を復元
  useEffect(() => {
    const storageKey = `grocery-checked-${planId}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCheckedItems(new Set(parsed));
      } catch (e) {
        console.error('Failed to parse checked items:', e);
      }
    }
  }, [planId]);

  // チェック状態をlocalStorageに保存
  const toggleCheck = (ingredientId: string) => {
    setCheckedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(ingredientId)) {
        newSet.delete(ingredientId);
      } else {
        newSet.add(ingredientId);
      }

      // localStorage に保存
      const storageKey = `grocery-checked-${planId}`;
      localStorage.setItem(storageKey, JSON.stringify(Array.from(newSet)));

      return newSet;
    });
  };

  // カテゴリの開閉切り替え
  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  // すべてのカテゴリが空の場合
  if (categories.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12">
        買い物リストに食材がありません
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {categories.map((category) => {
        const isExpanded = expandedCategories.has(category.category);
        const checkedCount = category.items.filter((item) =>
          checkedItems.has(item.ingredient_id)
        ).length;
        const totalCount = category.items.length;

        return (
          <div key={category.category} className="border rounded-lg overflow-hidden">
            {/* カテゴリヘッダー */}
            <button
              onClick={() => toggleCategory(category.category)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getCategoryIcon(category.category)}</span>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">
                    {category.category_name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {checkedCount}/{totalCount} 完了
                  </p>
                </div>
              </div>
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {/* 食材リスト */}
            {isExpanded && (
              <div className="divide-y">
                {category.items.map((item) => {
                  const isChecked = checkedItems.has(item.ingredient_id);
                  return (
                    <label
                      key={item.ingredient_id}
                      className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                        isChecked ? 'bg-gray-50' : ''
                      }`}
                    >
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() => toggleCheck(item.ingredient_id)}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <div
                          className={`font-medium ${
                            isChecked ? 'line-through text-gray-400' : 'text-gray-900'
                          }`}
                        >
                          {item.name}
                        </div>
                        <div
                          className={`text-sm ${
                            isChecked ? 'text-gray-300' : 'text-gray-500'
                          }`}
                        >
                          {item.amount} {item.unit}
                          {item.estimated_price !== null &&
                            ` • 約 ${item.estimated_price}円`}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/**
 * カテゴリアイコンを取得
 */
function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    meat: '🥩',
    fish: '🐟',
    egg_dairy: '🥚',
    vegetable: '🥬',
    grain: '🌾',
    seasoning: '🧂',
    other: '📦',
  };
  return icons[category] || '📦';
}
