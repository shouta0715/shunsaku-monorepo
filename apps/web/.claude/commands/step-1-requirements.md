---
allowed-tools: TodoWrite, TodoRead, Read, Write, MultiEdit, Bash(mkdir:*)
description: Create requirements specification for the given task (Stage 1 of Spec-Driven Development)
---

## Context

- Task description: $ARGUMENTS

## Your task

**Execute requirements analysis**. Create clear, accurate requirements.

### 1. Setup

- Create `.tmp` directory if it doesn't exist

### 2. Requirements Analysis

**Extract and document**:

- **Core problem definition**: What specific business/technical problem are we solving?
- **Explicit functional requirements**: What the system must do (stated requirements)
- **Implicit functional requirements**: What the system should do (unstated but expected)
- **Non-functional requirements**: Performance, security, usability, maintainability expectations
- **Integration requirements**: How this fits with existing systems
- **Component requirements**: Identify which `@package/ui` components can be leveraged
- **Data requirements**: Specify what data/APIs are needed and plan for mock data during development
- **Edge cases and error scenarios**: What could go wrong and how to handle it
- **Success criteria**: Measurable, specific completion conditions
- **Future considerations**: Extensibility and scalability needs

### 3. Create Requirements Document

Create `.tmp/step-1-requirements.md` with the following sections:

```markdown
# 要件定義書 - [タスク名]

作成日: [YYYY-MM-DD]
更新日: [YYYY-MM-DD]
バージョン: 1.0

## 1. 目的

[このタスク/プロジェクトの目的を明確に記述]

## 2. 機能要件

### 2.1 必須機能

- [ ] [機能 1 の詳細説明]
- [ ] [機能 2 の詳細説明]
      ...

### 2.2 オプション機能

- [ ] [将来的に実装可能な機能]
      ...

## 3. 非機能要件

### 3.1 パフォーマンス

- [応答時間、処理速度などの要件]

### 3.2 セキュリティ

- [セキュリティに関する要件]

### 3.3 保守性

- [コードの保守性に関する要件]

### 3.4 互換性

- [既存システムとの互換性要件]

### 3.5 コンポーネント要件

- 使用可能な @package/ui コンポーネント: [一覧]
- カスタムコンポーネントが必要な箇所: [理由とともに記載]

### 3.6 データ要件

- 必要な API エンドポイント: [一覧]
- データベーススキーマ要件: [説明]
- モックデータ仕様: [開発段階で使用するテストデータ]

## 4. 制約事項

### 4.1 技術的制約

- [使用技術、ライブラリの制約]

### 4.2 ビジネス制約

- [納期、予算などの制約]

## 5. 成功基準

### 5.1 完了の定義

- [ ] [明確な完了条件 1]
- [ ] [明確な完了条件 2]
      ...

### 5.2 受け入れテスト

- [ユーザーが満足する条件]

## 6. 想定されるリスク

- [実装上のリスクと対策]

## 7. 今後の検討事項

- [設計フェーズで詳細化すべき事項]
```

### 4. Next Steps

**Automatically proceed to technical design phase**

Execute efficiently while ensuring requirements are clear, measurable, and implementable.
