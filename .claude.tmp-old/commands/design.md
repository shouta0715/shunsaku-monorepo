---
allowed-tools: TodoWrite, TodoRead, Read, Write, MultiEdit, Glob, LS
description: Create detailed design specification based on requirements (Stage 2 of Spec-Driven Development)
---

## Context

- Requirements document: @.tmp/requirements.md

## Your task

### 1. Verify prerequisites

- Check that `.tmp/requirements.md` exists
- If not, inform user to run `/requirements` first

### 2. Analyze requirements

Read and understand the requirements document thoroughly

### 3. Analyze existing project assets

#### 3.1 Check existing components

- Use Glob to find all components in `@package/ui`
- Read key components to understand their interfaces and usage patterns
- Document available UI components for reuse

#### 3.2 Check Tailwind configuration

- Look for `tailwind.config.ts` or `tailwind.config.js`
- If not found, check for Tailwind CSS v4 setup in `app/globals.css`
- Note any custom theme settings, colors, or design tokens

#### 3.3 Check code quality tools configuration

- Read `eslint.config.mjs` to understand linting rules
- Read `prettier.config.mjs` to understand formatting rules
- Run `npm run lint` to verify linting setup
- Document any custom rules or exceptions

### 4. Create Design Document

Create `.tmp/design.md` with the following sections:

````markdown
# 詳細設計書 - [タスク名]

## 1. アーキテクチャ概要

### 1.1 システム構成図

[ASCII 図や Mermaid 図でシステム全体の構成を表現]

### 1.2 技術スタック

- 言語: [使用言語とバージョン]
- フレームワーク: [使用フレームワーク]
- UI ライブラリ: [実際に検出したライブラリを記載]
- スタイリング: [Tailwind CSS 設定を含む]
- 既存コンポーネント: [検出したコンポーネントの概要]
- ツール: [ビルドツール、テストツールなど]

## 2. コンポーネント設計

### 2.1 既存コンポーネントの活用

[プロジェクトで利用可能な既存コンポーネントをリストアップ]

| 既存コンポーネント       | 用途   | 活用方法               |
| ------------------------ | ------ | ---------------------- |
| [検出したコンポーネント] | [用途] | [この設計での活用方法] |

### 2.2 新規コンポーネント一覧

| コンポーネント名 | 責務         | 依存関係                 | 既存コンポーネントの活用     |
| ---------------- | ------------ | ------------------------ | ---------------------------- |
| [Component A]    | [責務の説明] | [依存するコンポーネント] | [活用する既存コンポーネント] |

### 2.3 各コンポーネントの詳細

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

## 10. UI/UX 設計

### 10.1 デザインシステムの活用

- 既存の Tailwind 設定に従ったスタイリング
- 既存コンポーネントのデザインパターンとの一貫性
- カスタムテーマやデザイントークンの活用

### 10.2 レスポンシブデザイン

- Tailwind のレスポンシブユーティリティの活用方針
- ブレークポイントの設定

## 11. コーディング規約

### 11.1 必須ツールの使用

- **ESLint**: 全コードが`npm run lint`をパスすること
- **Prettier**: 全ファイルが Prettier でフォーマットされていること
- **Tailwind CSS**: ユーティリティクラスのみ使用、インラインスタイルは禁止

### 11.2 コード品質チェック

- 各機能実装後に必ず実行:
  - `npm run lint` (エラーが 0 件であること)
  - `npm run build` (ビルドが成功すること)
  - Prettier によるフォーマット確認

## 12. 実装上の注意事項

- 既存コンポーネントを最大限活用し、重複実装を避ける
- Tailwind の設定に従い、一貫性のあるスタイリングを維持
- **必須**: ESLint/Prettier/Tailwind の規約に 100%準拠
- [その他の注意点]

```

### 5. Update TODO
Use TodoWrite to add "詳細設計の完了とレビュー" as a task

### 6. Present to user
Show the created design document and ask for:
- Technical feedback
- Architecture approval
- Permission to proceed to task breakdown

## Important Notes
- Design should be implementable and testable
- Consider maintainability and extensibility
- Include concrete interface definitions where possible
- Address all requirements from the requirements document
- **MUST analyze and utilize existing components in @package/ui/**
- **MUST follow existing Tailwind CSS configuration and design patterns**
- **Avoid reinventing the wheel - use existing UI components where possible**
- **MUST ensure all code passes ESLint and Prettier checks**
- **MUST use only Tailwind utility classes for styling**
```

think hard
