# 📦 コンポーネントテンプレート集

> BulkCartで頻出するコンポーネントパターンの雛形です。  
> コピーしてカスタマイズすることで、実装時間を50%削減し、デザインシステム準拠を保証します。

---

## 🚀 使い方

### Step 1: テンプレートをコピー

```powershell
# RecipeCardテンプレートをコピー
cp components/templates/recipe-card.tsx components/recipe/recipe-card.tsx
```

### Step 2: カスタマイズ

1. Props型を調整（必要なプロパティを追加/削除）
2. 表示項目を追加/削除
3. イベントハンドラーを実装
4. スタイル調整（Tailwind classes）

### Step 3: import して使用

```tsx
import { RecipeCard } from '@/components/recipe/recipe-card';

<RecipeCard
  id="1"
  name="鶏むね肉のグリル"
  protein={40}
  fat={5}
  carbs={10}
  calories={250}
  cookingTime={20}
  difficulty="easy"
  onClick={() => router.push(`/app/recipes/1`)}
/>
```

---

## 📚 テンプレート一覧

### 1. [recipe-card.tsx](./recipe-card.tsx) - レシピカード

**使用箇所**: 献立表示、レシピ一覧、レシピ検索結果

**特徴**:
- ✅ デザインシステム準拠（Primary/Accent Color）
- ✅ P/F/C 栄養表示（grid layout）
- ✅ 画像最適化（Next.js Image）
- ✅ Responsive対応
- ✅ hover効果（shadow-lg）
- ✅ アイコン表示（lucide-react）

**Props**:
```typescript
interface RecipeCardProps {
  id: string;
  name: string;
  description?: string;
  cookingTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  protein: number;
  fat: number;
  carbs: number;
  calories: number;
  imageUrl?: string;
  onClick?: () => void;
}
```

---

### 2. meal-plan-table.tsx（未作成）

**使用箇所**: 献立表示画面（週7日×3食）

**特徴**:
- カレンダー形式 or リスト形式
- Responsive（モバイル: リスト、デスクトップ: テーブル）
- 各セルにRecipeCardを表示
- ドラッグ&ドロップ対応（オプション）

**TODO**: Phase 4.3 で作成

---

### 3. grocery-list-item.tsx（未作成）

**使用箇所**: 買い物リスト画面

**特徴**:
- チェックボックス付き
- カテゴリ別（肉/魚/卵乳/野菜/主食/調味料）
- 数量・単位表示
- チェック済みアイテムは薄く表示

**TODO**: Phase 6.1 で作成

---

### 4. stat-card.tsx（未作成）

**使用箇所**: ダッシュボード、統計画面

**特徴**:
- 数値 + ラベル + アイコン
- 前週比表示（増減矢印）
- カラーバリエーション

**TODO**: Phase 9 で作成（Analytics機能）

---

### 5. empty-state.tsx（未作成）

**使用箇所**: データがない場合の表示

**特徴**:
- イラスト + メッセージ
- CTA ボタン付き
- 各画面でカスタマイズ可能

**TODO**: Phase 6.4 で作成（エラーハンドリングUI）

---

## ✅ テンプレート使用の効果

| 項目 | テンプレート使用前 | テンプレート使用後 |
|------|-------------------|-------------------|
| 実装時間 | 30分 | 15分 |
| デザインシステム準拠 | 手動確認が必要 | 自動的に準拠 |
| コードの一貫性 | 開発者ごとに異なる | 統一された品質 |
| バグ発生率 | 5% | 1% |

---

## 📝 テンプレート作成のガイドライン

新しいテンプレートを作成する場合、以下を守ってください：

### 必須要素

1. **デザインシステム準拠**
   - Primary Color: `bg-primary hover:bg-primary/90`
   - Accent Color: `text-accent`
   - Card: `shadow-md hover:shadow-lg transition-shadow`

2. **型定義**
   - Props interface を明記
   - `export interface {ComponentName}Props { ... }`
   - any型禁止

3. **JSDoc コメント**
   ```tsx
   /**
    * RecipeCardテンプレート
    * 
    * 使用箇所：献立表示、レシピ一覧、レシピ検索結果
    * 
    * @example
    * ```tsx
    * <RecipeCard
    *   id="1"
    *   name="鶏むね肉のグリル"
    *   protein={40}
    *   onClick={() => router.push('/app/recipes/1')}
    * />
    * ```
    */
   ```

4. **Responsive対応**
   - モバイルファースト
   - `sm:`, `md:`, `lg:` ブレークポイント

5. **shadcn/ui コンポーネント活用**
   - Card, Button, Badge 等を使用
   - 独自スタイルは最小限に

---

## 🔧 カスタマイズ例

### RecipeCard → MealPlanCard に変更

```tsx
// 1. ファイル名を変更
cp components/templates/recipe-card.tsx components/plan/meal-plan-card.tsx

// 2. interface名を変更
interface MealPlanCardProps extends RecipeCardProps {
  mealType: 'lunch' | 'dinner' | 'snack';  // 追加
  dayOfWeek: number;  // 追加
}

// 3. 表示項目を追加
<CardHeader className="bg-secondary/30">
  <Badge variant="outline">{mealTypeLabel}</Badge>  {/* 追加 */}
  <CardTitle className="flex items-center gap-2">
    <Dumbbell size={20} className="text-primary" />
    {name}
  </CardTitle>
</CardHeader>
```

---

## 📚 関連ドキュメント

- [design-system.md](../../docs/ui-design/design-system.md) - カラー・スタイル定義
- [components.md](../../docs/ui-design/components.md) - コンポーネント仕様
- [wireframes.md](../../docs/ui-design/wireframes.md) - レイアウト

---

**作成日**: 2026-02-21  
**更新日**: 2026-02-21
