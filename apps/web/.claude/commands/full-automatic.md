---
description: "Specification-Driven Development Complete Workflow - 要件分析から実装計画まで一括実行"
version: "2.0.0"
author: ["AnijaaaPan", "shouta0715"]
created: "2025-01-28"
updated: "2025-01-28"
category: "workflow"
tags:
  [
    "sdd",
    "automation",
    "full-workflow",
    "requirements",
    "design",
    "tasks",
    "claude-code",
    "best-practices",
  ]
stage: "all"
duration: "7-10 minutes"
output: "Complete specification set"
optimized_for: "Claude Code Best Practices"
---

# 🚀 仕様駆動開発 完全自動ワークフロー

**要件分析から実装計画まで、4段階の仕様駆動開発プロセスを自動実行します。**

Claude Codeのベストプラクティスに基づき、ユーザーの要求を包括的な開発仕様書に変換し、即座に実装可能な状態まで準備します。新機能開発やプロジェクト立ち上げ時に最適化されたワークフローです。

## 🎯 Claude Code ベストプラクティス適用

- **並列処理最適化**: 独立操作の同時実行で効率性を最大化
- **段階的詳細化**: 段階的なプロンプトテンプレートによる品質向上
- **コンテキスト管理**: `/clear`コマンドによる適切なコンテキスト保持
- **エラーハンドリング**: 包括的な問題対応とロールバック戦略

## 📝 使用法

```bash
# 企業レベルの認証システム
/full-automatic "JWT認証、RBAC認可、パスワードリセット、2FA、管理者ダッシュボード、監査ログを含む企業ユーザー管理システム"

# ECプラットフォーム
/full-automatic "商品カタログ、高度な検索フィルター、ショッピングカート、決済ゲートウェイ統合、在庫管理機能を持つECプラットフォーム"

# リアルタイム通信アプリ
/full-automatic "WebSocket接続、ファイル共有、プッシュ通知、マルチチャンネル対応、プレゼンス表示機能を持つリアルタイムチャットアプリケーション"
```

## 📋 入力要件

### 必須引数

- **Task Description**: `$ARGUMENTS` - 実装したい機能や要求の詳細な説明
  - ✅ **Good**: "JWT認証、パスワードリセット、役割ベースアクセス制御、2段階認証、管理者ダッシュボード、監査ログ機能を含むユーザー管理システム"
  - ❌ **Bad**: "ログインシステム"
  - 🎯 **Best**: 「特定の技術スタック、パフォーマンス要件、セキュリティ要件を明示した詳細な説明」

### 前提条件

- 作業ディレクトリ: プロジェクトルート
- 出力場所: `.tmp/` ディレクトリ（自動作成）
- 権限: ファイル読み書き、ディレクトリ作成

## 🚀 実行フロー

### Stage 1: 📋 Requirements Analysis

> **Duration**: 2-3 minutes | **Output**: `.tmp/step-1-requirements.md`

**実行内容:**

1. `.tmp` ディレクトリの作成（存在しない場合）
2. ユーザー要求の詳細分析
3. 機能要件・非機能要件の抽出
4. ステークホルダーとスコープの定義
5. 成功基準とリスクの特定

**成功判定:**

- ✅ 機能要件が明確に定義されている
- ✅ 非機能要件（性能、セキュリティ等）が含まれている
- ✅ 測定可能な成功基準が設定されている
- ✅ @package/ui の活用方針が明記されている

### Stage 2: 🏗️ Technical Design

> **Duration**: 3-4 minutes | **Output**: `.tmp/step-2-design.md`

**実行内容:**

1. 要件書の詳細読み込み
2. システムアーキテクチャの設計
3. コンポーネント構造の定義
4. API設計とデータモデル作成
5. セキュリティ・パフォーマンス対策の計画

**成功判定:**

- ✅ コンポーネントアーキテクチャが明確
- ✅ データフローが文書化されている
- ✅ 外部連携ポイントが特定済み
- ✅ Mermaid図での可視化が完了

### Stage 3: 📝 Task Planning

> **Duration**: 2-3 minutes | **Output**: `.tmp/step-3-tasks.md` + TodoList

**実行内容:**

1. 設計書からの実装単位抽出
2. アトミックなタスクへの分解
3. 依存関係の明確化と優先順位付け
4. 工数見積もりと並列実行計画
5. TodoWriteへの主要タスク登録

**成功判定:**

- ✅ タスクがアトミックでテスト可能
- ✅ 依存関係が明確にマッピング済み
- ✅ 現実的な時間見積もりが完了
- ✅ TodoListが実装準備完了状態

### Stage 4: ✅ Implementation Ready

> **Total Duration**: 7-10 minutes | **Deliverables**: Complete specification set

**最終出力:**

- 📄 **要件書**: `.tmp/step-1-requirements.md` - ビジネス仕様
- 🏗️ **設計書**: `.tmp/step-2-design.md` - 技術仕様
- 📝 **タスク表**: `.tmp/step-3-tasks.md` - 実装計画
- ✔️ **Todo管理**: 実装追跡準備完了

## ⚡ 実行ガイドライン

### 効率化原則

- **並列処理**: 独立した操作は同時実行で高速化
- **バッチ操作**: ラウンドトリップを最小化してパフォーマンス向上
- **既存活用**: `@package/ui` コンポーネントを最優先で利用
- **モック先行**: 外部依存は初期段階でモック化

### 品質基準

- **完全性**: 各ドキュメントは単独で実行可能
- **測定性**: タスク定義に品質チェックを含める
- **保守性**: テスト容易性と拡張性を考慮した設計
- **一貫性**: プロジェクト全体で統一された記述スタイル

## 🚨 エラーハンドリング

### よくある問題と対処法

| 問題                        | 原因                  | 対処法                             |
| --------------------------- | --------------------- | ---------------------------------- |
| `.tmp` ディレクトリ作成失敗 | 権限不足              | プロジェクトルートで実行、権限確認 |
| 引数が空または不明確        | 説明不足              | 具体的で詳細な要求説明を再入力     |
| ファイル書き込み失敗        | ディスク容量不足      | 容量確認、不要ファイル削除         |
| 既存ファイルの上書き警告    | `.tmp` に既存ファイル | バックアップ後に実行継続           |

### ロールバック手順

問題が発生した場合の復旧方法：

```bash
# 1. 部分的な出力ファイルを削除
rm -rf .tmp/step-*

# 2. コマンドを再実行（より具体的な説明で）
/full-automatic "詳細で明確な要求説明"

# 3. 段階的実行（必要に応じて）
/step-1-requirements "要求説明"
/step-2-design
/step-3-tasks
```

## 🎯 実用例とテンプレート

### 💼 Enterprise Applications

```bash
/full-automatic "Enterprise user management system with JWT authentication, RBAC authorization, password reset, 2FA, admin dashboard, and user portal with audit logging"
```

**Expected Output:**

- 📋 Requirements: Admin/user roles, security specifications, compliance requirements
- 🏗️ Design: Authentication flow, authorization matrix, UI architecture
- 📝 Tasks: Auth implementation → UI development → Security testing

### 🛒 E-commerce Platform

```bash
/full-automatic "E-commerce platform with product catalog, advanced search filters, shopping cart, payment gateway integration, inventory management, and responsive design"
```

### 💬 Real-time Communication

```bash
/full-automatic "Real-time chat application with WebSocket connections, file sharing, push notifications, multi-channel support, presence indicators, and mobile optimization"
```

## 📊 出力品質指標

### Claude Code ベストプラクティス準拠度

- [ ] **並列処理最適化**: 70%以上のタスクが独立実行可能
- [ ] **コンテキスト効率**: 適切なチャンク分割とコンテキスト管理
- [ ] **エラーハンドリング**: 包括的な問題対応手順とロールバック戦略
- [ ] **段階的改善**: フィードバックループによる継続的品質向上

### 要件書の完成度

- [ ] **機能要件**: 具体的なユーザーストーリーと受け入れ基準
- [ ] **非機能要件**: 性能・セキュリティ・UXの定量的指標
- [ ] **成功基準**: 測定可能な数値目標と検証方法
- [ ] **リスク管理**: 特定済みリスクと軽減策

### 設計書の技術精度

- [ ] **アーキテクチャ図**: Mermaidによる正確な可視化
- [ ] **コンポーネント設計**: Props・型定義・テスト戦略
- [ ] **API仕様**: RESTful/GraphQLエンドポイントとスキーマ
- [ ] **パフォーマンス**: Core Web Vitals準拠の最適化戦略

### タスク計画の実装準備度

- [ ] **原子性**: 1-8時間の実装可能単位（理想2-4時間）
- [ ] **依存関係**: クリティカルパス特定と並列実行最適化
- [ ] **品質ゲート**: 各タスクの明確な完了基準とテスト方法
- [ ] **TodoWrite連携**: 即座に実行開始可能な進捗管理システム
