---
allowed-tools: TodoWrite, TodoRead, Read, Write, MultiEdit
description: Create detailed design specification based on requirements (Stage 2 of Spec-Driven Development)
---

## Context

- Requirements document: @.tmp/step-1-requirements.md

## Your task

**Execute comprehensive technical design with architectural excellence**. Transform requirements into implementable, scalable technical specifications.

### 1. Prerequisites and Context Gathering

**Parallel execution**: When checking prerequisites and gathering context, invoke multiple tools simultaneously for maximum efficiency.

- Check that `.tmp/step-1-requirements.md` exists
- If not, inform user to run `/step-1-requirements` first
- Research existing codebase patterns and architectural decisions
- Identify reusable components from the `@package/ui` library [[memory:4951752]]
- Gather information about the current tech stack and constraints

### 2. Strategic Requirements Analysis

**Deep analysis approach**: Use thinking capabilities to thoroughly understand requirements before designing.

**Comprehensive analysis process**:

- Read and deeply understand the requirements document
- Identify architectural implications of each requirement
- Map requirements to technical components and interfaces
- Consider scalability and performance implications
- Plan for error handling and edge cases
- Evaluate security and compliance requirements

### 3. Architectural Design Excellence

Create `.tmp/step-2-design.md` with the following sections:

````markdown
# 詳細設計書 - [タスク名]

## 1. アーキテクチャ概要

### 1.1 システム構成図

[ASCII図やMermaid図でシステム全体の構成を表現]

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

## 4. APIインターフェース

### 4.1 内部API

[モジュール間のインターフェース定義]

### 4.2 外部API

[外部システムとの連携インターフェース]

## 5. エラーハンドリング

### 5.1 エラー分類

- [エラータイプ1]: [対処方法]
- [エラータイプ2]: [対処方法]

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

- [注意点1]
- [注意点2]

```

### 4. Design Validation and Quality Assurance

**Comprehensive validation process**:
- Verify design addresses all requirements from the requirements document
- Ensure architectural consistency and scalability
- Validate component interfaces and data flow integrity
- Check for potential performance bottlenecks
- Review security implications and mitigation strategies
- Confirm maintainability and extensibility

Use TodoWrite to add "詳細設計の完了とレビュー" as a task

### 5. Strategic Presentation and Validation

**Present comprehensive technical design**:
- Show the complete design document with clear architectural vision
- Explain key technical decisions and their rationale
- Highlight how the design addresses scalability and maintainability
- Point out innovative solutions and architectural patterns used
- Identify potential risks and mitigation strategies

**Request specific technical validation**:
- Confirmation that the architecture meets all requirements
- Validation of technical approach and technology choices
- Agreement on component interfaces and data flow design
- Review of performance and security considerations
- **Explicit approval to proceed to implementation planning phase**

## Design Excellence Standards

**Architectural Integrity**: Every component should have a clear purpose and well-defined boundaries.

**Scalability Focus**: Design for growth - consider how the system will evolve and scale.

**Maintainability Priority**: Code should be readable, testable, and modifiable by future developers.

**Performance Consideration**: Identify potential bottlenecks and optimization opportunities early.

**Security by Design**: Build security considerations into the architecture from the start.

**Reusability Optimization**: Leverage existing components and create reusable patterns where appropriate.

think hard and execute with excellence - create architecture that stands the test of time
```
