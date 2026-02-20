# BulkCart GitHub Labels 定義

このドキュメントは GitHub Issues/PRs で使用するラベルの定義と運用ルールを記述します。

---

## 📊 Priority Labels（優先度）

| Label | 色 | 説明 | 対応期限 |
|-------|-----|------|---------|
| `priority:critical` | `#d73a4a` (赤) | **緊急**: MVP に必須、ブロッキング要素 | 24時間以内 |
| `priority:high` | `#ff9800` (オレンジ) | **高**: MVP に必須、他タスクに影響 | 3日以内 |
| `priority:medium` | `#ffd600` (黄) | **中**: MVP に含まれるが後回し可能 | 1週間以内 |
| `priority:low` | `#00bfa5` (緑) | **低**: MVP 後の機能拡張 | 2週間以上 |

### 優先度判断基準

**Critical**: 
- 認証基盤（ユーザーがログインできない）
- 献立生成エンジン（コア機能が動作しない）
- DB マイグレーション（データ損失リスク）

**High**:
- オンボーディング（ユーザー体験に直結）
- 買い物リスト生成（主要機能）
- レイアウト実装（全ページに影響）

**Medium**:
- 作り置き段取り（便利だが必須ではない）
- レシピ詳細ページ（閲覧頻度低め）
- エラーハンドリング UI（改善要素）

**Low**:
- 分析ツール導入（ローンチ後でも可）
- パフォーマンス最適化（段階的改善）
- 法務文書（β版では簡易版）

---

## 🏷️ Type Labels（タスク種別）

| Label | 色 | 説明 |
|-------|-----|------|
| `feature` | `#0e8a16` (緑) | 新機能追加 |
| `bug` | `#d73a4a` (赤) | バグ修正 |
| `enhancement` | `#a2eeef` (水色) | 既存機能の改善 |
| `setup` | `#7057ff` (紫) | 環境構築・設定 |
| `backend` | `#1d76db` (青) | バックエンド開発 |
| `frontend` | `#fbca04` (黄) | フロントエンド開発 |
| `database` | `#006b75` (ティール) | DB スキーマ変更 |
| `test` | `#bfd4f2` (薄青) | テストコード作成 |
| `docs` | `#fef2c0` (クリーム) | ドキュメント更新 |
| `performance` | `#ff6f00` (ディープオレンジ) | パフォーマンス改善 |
| `analytics` | `#5319e7` (紫) | 分析・計測 |
| `monitoring` | `#e99695` (ピンク) | 監視・ログ |
| `legal` | `#c5def5` (薄青) | 法務文書 |
| `deployment` | `#0052cc` (紺) | デプロイ関連 |

---

## 📦 Phase Labels（開発フェーズ）

| Label | 色 | 説明 | 期間 |
|-------|-----|------|------|
| `phase:1` | `#ededed` (グレー) | 要件定義と計画 | Week 1（完了） |
| `phase:2` | `#ededed` (グレー) | 設計・アーキテクチャ | Week 1-2（完了） |
| `phase:3` | `#c2e0c6` (ライトグリーン) | 開発環境・インフラ構築 | Week 2 |
| `phase:4` | `#bfdadc` (ライトブルー) | フロントエンド基盤開発 | Week 3-4 |
| `phase:5` | `#bfdadc` (ライトブルー) | バックエンド・ロジック開発 | Week 3-5 |
| `phase:6` | `#f9d0c4` (ライトオレンジ) | UI 完成 | Week 4-5 |
| `phase:7` | `#d4c5f9` (ライトパープル) | 計測・分析セットアップ | Week 5 |
| `phase:8` | `#fef2c0` (クリーム) | MVP 完成・テスト | Week 5-6 |
| `phase:9` | `#c5def5` (ライトブルー) | β ローンチ準備 | Week 6-7 |
| `phase:10` | `#f9d0c4` (ライトオレンジ) | 有料化準備 | Week 7 |
| `phase:11` | `#d4c5f9` (ライトパープル) | 本番デプロイ・ローンチ | Week 8 |

---

## 🚀 Status Labels（進捗状況）

| Label | 色 | 説明 |
|-------|-----|------|
| `status:todo` | `#ffffff` (白) | 未着手 |
| `status:in-progress` | `#0052cc` (青) | 作業中 |
| `status:review` | `#ff9800` (オレンジ) | レビュー待ち |
| `status:blocked` | `#d73a4a` (赤) | ブロック中（他タスク待ち） |
| `status:done` | `#0e8a16` (緑) | 完了 |

---

## 🎯 Special Labels（特殊ラベル）

| Label | 色 | 説明 |
|-------|-----|------|
| `good first issue` | `#7057ff` (紫) | 初心者向けタスク |
| `help wanted` | `#008672` (ティール) | 外部協力者募集 |
| `breaking change` | `#d73a4a` (赤) | 破壊的変更を含む |
| `security` | `#ff0000` (赤) | セキュリティ関連 |
| `dependencies` | `#0366d6` (青) | 依存関係更新 |
| `question` | `#d876e3` (ピンク) | 質問・議論 |
| `duplicate` | `#cfd3d7` (グレー) | 重複 Issue |
| `wontfix` | `#ffffff` (白) | 対応しない |

---

## 📝 ラベル運用ルール

### Issue 作成時

1. **必須ラベル**:
   - Priority Label（1つ）
   - Type Label（1つ以上）
   - Phase Label（1つ）

2. **推奨ラベル**:
   - Status Label（初期は `status:todo`）

3. **例**:
   ```
   Title: [FEATURE] 献立表示画面実装
   Labels: priority:high, feature, frontend, phase:4, status:todo
   ```

### PR 作成時

1. **必須ラベル**:
   - Type Label
   - Phase Label
   - Status Label（初期は `status:review`）

2. **関連 Issue とリンク**:
   ```
   Closes #6
   ```

### ラベル更新タイミング

| タイミング | 更新内容 |
|----------|---------|
| **作業開始時** | `status:todo` → `status:in-progress` |
| **PR 作成時** | `status:in-progress` → `status:review` |
| **ブロック発生時** | 現在の status → `status:blocked` |
| **マージ時** | `status:review` → `status:done` |

---

## 🔍 GitHub Projects 連携

### Board 構成

```
Column 1: Backlog (status:todo)
Column 2: In Progress (status:in-progress)
Column 3: Review (status:review)
Column 4: Blocked (status:blocked)
Column 5: Done (status:done)
```

### Automation Rules

- **Issue 作成時**: Backlog に自動追加
- **status:in-progress ラベル追加時**: In Progress に移動
- **PR 作成時**: Review に移動
- **PR マージ時**: Done に移動

---

## 📊 Label 統計（週次レビュー用）

### KPI

1. **Velocity**: 週あたりの `status:done` Issue 数
2. **Blocked Rate**: `status:blocked` Issue の割合
3. **Priority Adherence**: `priority:critical` の 24時間以内完了率

### レポート例

```markdown
## Week 2 Sprint Review

- **Completed Issues**: 8件
- **Blocked Issues**: 1件（#3: Supabase 設定待ち）
- **Critical Issues**: 2件（すべて24時間以内完了 ✅）
- **High Issues**: 5件（1件が期限超過 ⚠️）
```

---

## 🛠️ GitHub Label 設定コマンド

以下のコマンドで一括作成可能（GitHub CLI 使用）:

```bash
# Priority Labels
gh label create "priority:critical" --color d73a4a --description "緊急: MVP必須、ブロッキング"
gh label create "priority:high" --color ff9800 --description "高: MVP必須、他タスク影響"
gh label create "priority:medium" --color ffd600 --description "中: MVP含む、後回し可"
gh label create "priority:low" --color 00bfa5 --description "低: MVP後の拡張"

# Type Labels
gh label create "feature" --color 0e8a16 --description "新機能追加"
gh label create "bug" --color d73a4a --description "バグ修正"
gh label create "enhancement" --color a2eeef --description "既存機能改善"
gh label create "setup" --color 7057ff --description "環境構築"
gh label create "backend" --color 1d76db --description "バックエンド"
gh label create "frontend" --color fbca04 --description "フロントエンド"
gh label create "database" --color 006b75 --description "DB変更"
gh label create "test" --color bfd4f2 --description "テスト"
gh label create "docs" --color fef2c0 --description "ドキュメント"
gh label create "performance" --color ff6f00 --description "パフォーマンス"
gh label create "analytics" --color 5319e7 --description "分析"
gh label create "monitoring" --color e99695 --description "監視"
gh label create "legal" --color c5def5 --description "法務"
gh label create "deployment" --color 0052cc --description "デプロイ"

# Phase Labels
gh label create "phase:3" --color c2e0c6 --description "Week 2: 開発環境構築"
gh label create "phase:4" --color bfdadc --description "Week 3-4: フロントエンド基盤"
gh label create "phase:5" --color bfdadc --description "Week 3-5: バックエンド"
gh label create "phase:6" --color f9d0c4 --description "Week 4-5: UI完成"
gh label create "phase:7" --color d4c5f9 --description "Week 5: 計測"
gh label create "phase:8" --color fef2c0 --description "Week 5-6: テスト"
gh label create "phase:9" --color c5def5 --description "Week 6-7: βローンチ"
gh label create "phase:10" --color f9d0c4 --description "Week 7: 有料化"
gh label create "phase:11" --color d4c5f9 --description "Week 8: 本番"

# Status Labels
gh label create "status:todo" --color ffffff --description "未着手"
gh label create "status:in-progress" --color 0052cc --description "作業中"
gh label create "status:review" --color ff9800 --description "レビュー待ち"
gh label create "status:blocked" --color d73a4a --description "ブロック中"
gh label create "status:done" --color 0e8a16 --description "完了"

# Special Labels
gh label create "good first issue" --color 7057ff --description "初心者向け"
gh label create "help wanted" --color 008672 --description "協力者募集"
gh label create "breaking change" --color d73a4a --description "破壊的変更"
gh label create "security" --color ff0000 --description "セキュリティ"
gh label create "dependencies" --color 0366d6 --description "依存関係"
gh label create "question" --color d876e3 --description "質問"
gh label create "duplicate" --color cfd3d7 --description "重複"
gh label create "wontfix" --color ffffff --description "対応しない"
```

---

**最終更新**: 2026年2月20日
