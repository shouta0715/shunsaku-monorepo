---
description: "要件分析から実装計画まで一括実行"
version: "2.0.0"
duration: "7-10 minutes"
output: "Complete specification set"
---

# 🚀 仕様駆動開発 完全自動ワークフロー

**既存apps/webプロジェクトのメインページ上書きを前提とし、要件分析→layout.tsx・page.tsx置換設計→タスク計画を自動実行して完全仕様書を生成します。**

## 📝 使用法

```bash
/full-automatic "詳細で明確な要求説明"
```

**引数**: 実装したい機能の詳細説明（具体的で詳細であるほど高品質な出力）

## 🚀 実行フロー (8-11分)

### Stage 1: 📋 Requirements (2-3分)

- ユーザー要求を機能・非機能要件に分解
- **出力**: `.tmp/step-1-requirements.md`

### Stage 2: 🏗️ Design (3-4分)

- 要件をシステムアーキテクチャ・API設計に変換
- **出力**: `.tmp/step-2-design.md`

### Stage 3: 📝 Tasks (2-3分)

- 設計をアトミックタスクに分解し実装計画を作成
- **出力**: `.tmp/step-3-tasks.md` + TodoList

### Stage 4: 📖 README Generation (1分)

- 品質保証完了後に包括的なプロジェクトREADMEを自動生成
- **出力**: `apps/web/README.md` - 完全なプロジェクトドキュメント

**最終成果物**: エラー0件・build成功確認済みの完全仕様書セット + プロジェクトREADME

## 🔧 品質保証プロセス

### 実装時のエラーハンドリング

- **各タスク完了時**: lint・typecheck でエラー0件確認
- **エラー発生時**: 修正完了まで次のタスクに進行禁止
- **品質ゲート**: フェーズ完了時の必須品質確認

### 最終品質保証 (Windows対応)

```bash
# 全実装完了後の必須実行
pnpm install
pnpm lint:fix
pnpm format
pnpm lint      # エラー0件まで修正
pnpm typecheck # エラー0件まで修正
pnpm build     # 成功まで修正
```

## 🚨 エラーハンドリング

### ロールバック手順

```bash
# ファイル削除して再実行
rm -rf .tmp/step-*
/full-automatic "詳細で明確な要求説明"
```

## 📊 品質指標

- **並列実行率**: 70%以上のタスクが独立実行可能
- **完全性**: 機能・非機能要件、アーキテクチャ、実装計画が包括的
- **実装準備度**: 即座に開発開始可能な詳細レベル
- **ドキュメント完全性**: README.md自動生成で包括的プロジェクト文書化

> **README生成詳細**: 具体的なテンプレート・チェックリスト・生成手順は [step-3-tasks.md](./step-3-tasks.md#readme自動生成指示) を参照
