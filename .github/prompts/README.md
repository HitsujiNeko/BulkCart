# 🤖 GitHub Copilot プロンプトテンプレート集

> **BulkCart 専用のAI駆動開発プロンプト集**  
> コピー&ペーストして使用するか、GitHub Copilot Chat で `@workspace .github/prompts/{file}.md` として参照してください。

---

## 📚 テンプレート一覧

### 1. [implementation.md](./implementation.md) - 実装系プロンプト
- Phase実装（画面、API、ビジネスロジック）
- 新規コンポーネント作成
- API エンドポイント作成
- lib/ のロジック実装

### 2. [debugging.md](./debugging.md) - デバッグ系プロンプト
- エラー調査・修正
- TypeScript 型エラー解決
- パフォーマンス改善
- Supabase RLS エラー

### 3. [refactoring.md](./refactoring.md) - リファクタリング系プロンプト
- コードの整理・最適化
- 重複コードの統合
- 型定義の改善
- パフォーマンス最適化

### 4. [testing.md](./testing.md) - テスト作成系プロンプト
- Unit Test (Vitest)
- E2E Test (Playwright)
- API テスト
- コンポーネントテスト

### 5. [documentation.md](./documentation.md) - ドキュメント作成系（未作成）
- README 更新
- API ドキュメント生成
- JSDoc コメント追加

---

## 🚀 使い方

### 方法1: コピー&ペースト（推奨）

1. 該当するテンプレートファイルを開く
2. 使いたいプロンプトをコピー
3. `{変数}` を実際の値に置き換え
4. GitHub Copilot Chat で実行

**例**：
```
Phase 4.3の献立表示画面を実装して。

実装前に以下のドキュメントを確認：
- docs/ui-design/wireframes.md（レイアウト）
- docs/ui-design/design-system.md（デザイン）
- docs/api-specification.md（API仕様）

実装後にチェックリストで検証。
```

---

### 方法2: @workspace で参照

GitHub Copilot Chat で以下のように指示：

```
@workspace .github/prompts/implementation.md を参照して、Phase 4.3の献立表示画面を実装して
```

---

## ✅ テンプレート使用の効果

- ✅ **ドキュメント参照漏れ防止** - wireframes, design-system, api-specification を明示的に指示
- ✅ **仕様準拠の実装** - 毎回同じ品質のプロンプトを使用
- ✅ **時間短縮** - プロンプト作成が 30秒 → 5秒
- ✅ **チーム開発時の均一化** - 誰が書いても同じ品質のコード

---

## 📝 カスタマイズ方法

プロジェクト固有の要件がある場合、テンプレートを編集してください。

**例：新しいテンプレート追加**

```markdown
## データベースマイグレーション作成

```
{テーブル名} テーブルのマイグレーションを作成して。

要件：
- カラム: {カラムリスト}
- RLS ポリシー: ユーザー認証必須
- インデックス: {対象カラム}

参照: docs/database-design.md
```
```

---

## 🔗 関連ドキュメント

- [copilot-instructions.md](../copilot-instructions.md) - コーディング規約・アーキテクチャ原則
- [ai-implementation-workflow.md](../../docs/ai-implementation-workflow.md) - AI実装手順の詳細

---

**作成日**: 2026-02-21  
**更新日**: 2026-02-21
