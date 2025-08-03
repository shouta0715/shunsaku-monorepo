---
allowed-tools: TodoWrite, TodoRead, Read, Write, MultiEdit
description: Create detailed design specification based on requirements (Stage 2 of Spec-Driven Development)
---

## Context

- Requirements document: @.tmp/step-1-requirements.md

## Your task

**Execute technical design**. Transform requirements into implementable specifications.

### 1. Prerequisites

- Check that `.tmp/step-1-requirements.md` exists
- Research existing codebase patterns and identify reusable components from `@package/ui` [[memory:4951752]]

### 2. Design Analysis

- Read requirements document and map to technical components
- Consider scalability, performance, security implications

### 3. Architectural Design

Create `.tmp/step-2-design.md` with the following sections:

````markdown
# 詳細設計書 - [タスク名]

作成日: [YYYY-MM-DD]
更新日: [YYYY-MM-DD]
バージョン: 1.0
基盤要件: @.tmp/step-1-requirements.md

## 1. アーキテクチャ概要

### 1.1 システム構成図

[ASCII 図や Mermaid 図でシステム全体の構成を表現]

### 1.2 技術スタック

- 言語: [使用言語とバージョン]
- フレームワーク: [使用フレームワーク]
- ライブラリ: [主要ライブラリ一覧]
- ツール: [ビルドツール、テストツールなど]

## 2. コンポーネント設計

### 2.1 コンポーネント一覧

| コンポーネント名 | 責務         | 依存関係                 |
| ---------------- | ------------ | ------------------------ |
| [Component A]    | [責務の説明] | [依存するコンポーネント] |

### 2.2 各コンポーネントの詳細

#### [Component A]

- **目的**: [このコンポーネントの目的]
- **公開インターフェース**:
  ```typescript
  interface ComponentA {
    method1(param: Type): ReturnType;
  }
  ```
````

- **内部実装方針**: [実装のアプローチ]

## 3. データフロー

### 3.1 データフロー図

[データの流れを示す図]

### 3.2 データ変換

- 入力データ形式: [形式の説明]
- 処理過程: [変換ロジック]
- 出力データ形式: [形式の説明]

## 4. API インターフェース

### 4.1 内部 API

[モジュール間のインターフェース定義]

### 4.2 外部 API

[外部システムとの連携インターフェース]

## 5. エラーハンドリング

### 5.1 エラー分類

- [エラータイプ 1]: [対処方法]
- [エラータイプ 2]: [対処方法]

### 5.2 エラー通知

[エラーの通知方法とログ戦略]

## 6. セキュリティ設計

### 6.1 認証・認可

[必要に応じて記載]

### 6.2 データ保護

[機密データの扱い方]

## 7. テスト戦略

### 7.1 単体テスト

- カバレッジ目標: [%]
- テストフレームワーク: [使用ツール]

### 7.2 統合テスト

[統合テストのアプローチ]

## 8. パフォーマンス最適化

### 8.1 想定される負荷

[パフォーマンス要件]

### 8.2 最適化方針

[最適化のアプローチ]

## 9. デプロイメント

### 9.1 デプロイ構成

[本番環境へのデプロイ方法]

### 9.2 設定管理

[環境変数、設定ファイルの管理]

## 10. 実装上の注意事項

- [注意点 1]
- [注意点 2]

```

### 4. Next Steps

**Automatically proceed to implementation planning phase**

Execute efficiently while ensuring design is scalable, maintainable, and secure.
```
