---
allowed-tools: TodoWrite, TodoRead, Read, Write, MultiEdit
description: Break down design into implementable tasks (Stage 3 of Spec-Driven Development)
---

## Context

- Requirements: @.tmp/step-1-requirements.md
- Design document: @.tmp/step-2-design.md

## Your task

**Execute task breakdown**. Transform technical design into manageable implementation units.

### 1. Prerequisites

- Check that `.tmp/step-1-requirements.md` and `.tmp/step-2-design.md` exist

### 2. Task Analysis

- Read design document and map to implementation tasks
- Identify dependencies and parallel execution opportunities
- Plan @package/ui component usage for each task
- Design mock data strategy for features requiring external data

### 3. Optimized Task Breakdown

Create `.tmp/step-3-tasks.md` with the following structure:

```markdown
# タスクリスト - [タスク名]

作成日: [YYYY-MM-DD]
更新日: [YYYY-MM-DD]
バージョン: 1.0
基盤要件: @.tmp/step-1-requirements.md
基盤設計: @.tmp/step-2-design.md

## 概要

- 総タスク数: [数]
- 推定作業時間: [時間/日数]
- 優先度: [高/中/低]

## タスク一覧

### Phase 1: 準備・調査

#### Task 1.1: [タスク名]

- [ ] [具体的な作業項目 1]
- [ ] [具体的な作業項目 2]
- **完了条件**: [明確な完了条件]
- **依存**: [依存するタスク または なし]
- **推定時間**: [時間]

#### Task 1.2: [タスク名]

- [ ] [具体的な作業項目 1]
- [ ] [具体的な作業項目 2]
- **完了条件**: [明確な完了条件]
- **依存**: [依存するタスク]
- **推定時間**: [時間]

### Phase 2: 実装

#### Task 2.1: [機能名]の実装

- [ ] [実装項目 1]
- [ ] [実装項目 2]
- [ ] @package/ui コンポーネントの選定と実装
- [ ] モックデータの作成（必要に応じて）
- [ ] 品質チェック実行（lint:fix, format, lint, typecheck, build）
- **完了条件**: [明確な完了条件] + 全品質チェックがパス
- **依存**: [依存するタスク]
- **推定時間**: [時間]

#### Task 2.2: [機能名]の実装

- [ ] [実装項目 1]
- [ ] [実装項目 2]
- **完了条件**: [明確な完了条件]
- **依存**: [依存するタスク]
- **推定時間**: [時間]

### Phase 3: 検証・テスト

#### Task 3.1: [検証項目]

- [ ] [テスト項目 1]
- [ ] [テスト項目 2]
- **完了条件**: [明確な完了条件]
- **依存**: [依存するタスク]
- **推定時間**: [時間]

### Phase 4: 仕上げ

#### Task 4.1: [仕上げ項目]

- [ ] [仕上げ作業 1]
- [ ] [仕上げ作業 2]
- **完了条件**: [明確な完了条件]
- **依存**: [依存するタスク]
- **推定時間**: [時間]

## 実装順序

1. Phase 1 から順次実行
2. 並行実行可能なタスクは並行で実行
3. 依存関係を考慮した実装順序

## リスクと対策

- [特定されたリスク]: [対策方法]

## 注意事項

- 各タスクはコミット単位で完結させる
- タスク完了時は必要に応じて品質チェックを実行
- 不明点は実装前に確認する
```

### 4. Task Registration

Register key tasks using TodoWrite tool

### 5. Implementation Guide

Add implementation guide to tasks.md:

```markdown
## 実装開始ガイド

### 基本方針

1. 並列実行可能なタスクは同時に実行
2. 各タスク開始時に TodoWrite で in_progress に更新
3. 完了時は completed に更新

### コンポーネント使用方針

1. まず @package/ui で利用可能なコンポーネントを確認
2. 必要な機能が見つからない場合のみカスタムコンポーネントを作成
3. カスタムコンポーネントは @package/ui の設計パターンに従う

### データ実装方針

1. 外部 API/データベースが必要な機能はまずモックデータで実装
2. モックデータで動作確認後、実際のデータソースに接続
3. エラーハンドリングも含めてモックで検証

### 品質保証プロセス

各タスク完了時に以下を順次実行：

1. `pnpm lint:fix` - 自動修正
2. `pnpm format` - コード整形
3. `pnpm lint` - リント確認（エラーがあれば修正）
4. `pnpm typecheck` - 型チェック（エラーがあれば修正）
5. `pnpm build` - ビルド確認（エラーがあれば修正）

**重要**: 全ての品質チェックがパスするまでタスクは完了とみなさない
```

### 6. Completion

**Ready to begin implementation** with clear, commit-sized tasks and parallel execution.
