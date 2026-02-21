# AI 実装ワークフロー

**目的**: AI が BulkCart のコードを実装する際に、ドキュメントを正しく参照し、仕様に準拠したコードを生成するための手順書

---

## 📋 実装前の準備

### Step 1: タスク確認
- [task.prompt.md](../.github/task.prompt.md) で該当 Phase のタスク内容を確認
- 例: **Phase 4.3 献立表示画面実装**
  - user_profile 読み込み
  - 献立生成ボタン（ローディング状態付き）
  - 週次献立の表示（カレンダー形式 or リスト）
  - 各日の meal_slot（昼/夜/間食）表示
  - レシピ詳細への遷移リンク

### Step 2: 関連ドキュメントの特定
該当 Phase に関連するドキュメントを [copilot-instructions.md](../.github/copilot-instructions.md#📚-参考ドキュメント) から特定

**Phase 4.3 の場合**:
- ✅ [デザインシステム](ui-design/design-system.md) - カラー、ボタン、カードスタイル
- ✅ [ワイヤーフレーム](ui-design/wireframes.md) - 献立画面のレイアウト
- ✅ [API仕様書](api-specification.md) - 献立取得 API (`GET /api/plan/current`)
- ✅ [データベース設計](database-design.md) - meal_plans, meal_slots テーブル
- ✅ [PRD](prd.md) - 週次献立の要件（7日×2-3食）

---

## 🔍 実装手順（Phase 4.3 献立表示画面の例）

### Step 1: ドキュメント読み込み

```bash
# AI が実行するコマンド（内部処理）
read_file("docs/ui-design/wireframes.md", startLine=60, endLine=120)  # 献立画面のワイヤーフレーム
read_file("docs/ui-design/design-system.md", startLine=50, endLine=150) # カラーパレット・ボタンスタイル
read_file("docs/api-specification.md", startLine=200, endLine=280)     # GET /api/plan/current の仕様
```

### Step 2: ワイヤーフレーム確認

**docs/ui-design/wireframes.md より**:
```
### 週次献立画面

+-------------------------------------------+
|  📅 今週の献立 (2/17-2/23)        [生成] |
+-------------------------------------------+
| 月 2/17  | 昼: 鶏むねグリル (P40 F10 C30) |
|          | 夜: サーモン丼   (P35 F20 C60) |
+-------------------------------------------+
| 火 2/18  | 昼: 豚ロース焼き (P38 F12 C25) |
|          | 夜: ブロッコリー炒め (P30 F8 C40) |
+-------------------------------------------+
```

### Step 3: デザインシステム確認

**docs/ui-design/design-system.md より**:
- **Primary Color**: `hsl(25, 95%, 53%)` (オレンジ #FF7A1A)
- **献立生成ボタン**: `bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg px-8 py-3`
- **レシピカード**: `shadow-md hover:shadow-lg transition-shadow`

### Step 4: API 仕様確認

**docs/api-specification.md より**:
```typescript
// GET /api/plan/current
Response: {
  id: string;
  user_id: string;
  week_start_date: string; // ISO 8601
  meal_slots: {
    id: string;
    date: string;
    slot_type: 'lunch' | 'dinner' | 'snack';
    recipe: {
      id: string;
      name: string;
      protein_per_serving: number;
      fat_per_serving: number;
      carbs_per_serving: number;
    };
  }[];
}
```

### Step 5: コード生成

上記ドキュメントに基づいて実装：

```typescript
// app/(app)/plan/current/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Loader2 } from 'lucide-react';

export default function CurrentPlanPage() {
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlan();
  }, []);

  const fetchPlan = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/plan/current');
      if (res.ok) {
        const data = await res.json();
        setPlan(data);
      }
    } catch (error) {
      console.error('Failed to fetch plan:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ヘッダー: デザインシステムに準拠 */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Calendar className="text-primary" size={32} />
          今週の献立
        </h1>
        {/* Primary Button: デザインシステムのスタイル */}
        <Button 
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg px-8 py-3 h-auto"
          onClick={() => alert('献立生成機能は Phase 5.2 で実装')}
        >
          献立生成
        </Button>
      </div>

      {/* 献立カード: ワイヤーフレームに準拠 */}
      {plan ? (
        <div className="space-y-4">
          {groupByDate(plan.meal_slots).map(({ date, slots }) => (
            <Card key={date} className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="bg-secondary/30">
                <CardTitle>{formatDate(date)}</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-2">
                {slots.map((slot) => (
                  <div key={slot.id} className="flex justify-between items-center">
                    <span className="font-semibold">{getSlotLabel(slot.slot_type)}</span>
                    <span>{slot.recipe.name}</span>
                    <div className="flex gap-2 text-sm text-muted-foreground">
                      <span>P: <strong className="text-primary">{slot.recipe.protein_per_serving}g</strong></span>
                      <span>F: <strong>{slot.recipe.fat_per_serving}g</strong></span>
                      <span>C: <strong>{slot.recipe.carbs_per_serving}g</strong></span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        {/* 空状態: PRDの要件に準拠 */}
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground mb-4">献立がまだ生成されていません</p>
            <Button 
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              onClick={() => alert('献立生成機能は Phase 5.2 で実装')}
            >
              献立を生成する
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ヘルパー関数
function groupByDate(slots: any[]) {
  // ... 実装
}

function formatDate(date: string) {
  // ... 実装
}

function getSlotLabel(type: string) {
  const labels = { lunch: '昼食', dinner: '夕食', snack: '間食' };
  return labels[type] || type;
}
```

### Step 6: コーディング規約チェック

**[copilot-instructions.md](../.github/copilot-instructions.md) より**:
- ✅ `'use client'` ディレクティブ（クライアントコンポーネント）
- ✅ Tailwind CSS のみ使用（CSS Modules 不使用）
- ✅ TypeScript strict mode（any 型は最小限）
- ✅ shadcn/ui コンポーネント使用
- ✅ デザインシステムのカラー（`bg-primary`, `text-primary`）
- ✅ エラーハンドリング（try-catch）

---

## ✅ 実装後の確認

### 1. TypeScript エラーチェック
```bash
get_errors(filePaths=["app/(app)/plan/current/page.tsx"])
```

### 2. デザインシステム準拠確認
- [ ] Primary Color（オレンジ）が使用されている
- [ ] ボタンスタイルが統一されている（`bg-primary hover:bg-primary/90`）
- [ ] カードに影とホバーエフェクトがある（`shadow-md hover:shadow-lg`）

### 3. API 仕様準拠確認
- [ ] Request/Response 型が API 仕様書と一致
- [ ] エラーハンドリングが実装されている

### 4. ワイヤーフレーム準拠確認
- [ ] レイアウトがワイヤーフレームと一致
- [ ] 必須要素（日付、meal_slot、P/F/C 表示）が含まれている

---

## 🚫 よくある失敗パターン

### ❌ ドキュメントを読まずに実装
```typescript
// 悪い例: デザインシステムを無視
<Button className="bg-blue-500">献立生成</Button> // 青ではなくオレンジを使うべき
```

### ❌ API 仕様を無視
```typescript
// 悪い例: レスポンス型が異なる
const data = await res.json(); // { recipes: [...] } を期待（API仕様は { meal_slots: [...] }）
```

### ❌ ワイヤーフレームを無視
```typescript
// 悪い例: レイアウトが異なる
<div className="grid grid-cols-3"> // ワイヤーフレームは縦リスト形式
```

---

## 📝 実装完了チェックリスト

Phase ごとの実装完了時に確認：

- [ ] 関連ドキュメントをすべて読んだ
- [ ] デザインシステムに準拠（カラー、タイポグラフィ、コンポーネント）
- [ ] API 仕様に準拠（Request/Response 型）
- [ ] ワイヤーフレームに準拠（レイアウト、UI要素）
- [ ] PRD の要件を満たしている
- [ ] TypeScript エラーがない
- [ ] コーディング規約に準拠（Tailwind のみ、any 型禁止等）
- [ ] Git コミット・プッシュ完了

---

## 🔗 関連ドキュメント

- [copilot-instructions.md](../.github/copilot-instructions.md) - 常に参照する必須ガイドライン
- [task.prompt.md](../.github/task.prompt.md) - Phase 別タスク一覧
- [docs/ui-design/design-system.md](ui-design/design-system.md) - デザインシステム詳細
- [docs/api-specification.md](api-specification.md) - API 仕様書
- [docs/database-design.md](database-design.md) - データベース設計

---

**Let's build with documentation-driven development! 📚💪**
