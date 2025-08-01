---
allowed-tools: TodoWrite, Read, Write, MultiEdit, Bash(find:*), Bash(ls:*)
description: Step 5 全設計書を基に実装可能なタスクに分解し、優先順位・依存関係を整理
---

## Context

- Specification document: Will be detected from project directory
- Requirements: Will be detected from project directory
- System design: Will be detected from project directory
- UI design: Will be detected from project directory

## Your task

### 1. Detect project directory and verify prerequisites

**Step 1: Determine current project context**

```bash
pwd
```

**Step 2: Apply project detection logic (same as previous steps)**

```bash
# Get absolute path and normalize
REALPATH=$(realpath .)
echo "Current absolute path: $REALPATH"
```

- If current directory path contains `/apps/[project-name]` → Set PROJECT_DIR to `apps/[project-name]`
- If current directory path contains `/packages/[package-name]` → Set PROJECT_DIR to `packages/[package-name]`
- If current directory basename is an app name under apps/ → Set PROJECT_DIR to `apps/[basename]`
- If current directory basename is a package name under packages/ → Set PROJECT_DIR to `packages/[basename]`
- If in monorepo root, analyze task description:
  - Web application features → Set PROJECT_DIR to `apps/web`
  - Shared UI components → Set PROJECT_DIR to `packages/ui`
  - If unclear, default to `apps/web`

**Step 3: Verify all prerequisite documents exist**

- Check that `$PROJECT_DIR/.tmp/step-1-specification.md` exists (Step 1: 仕様書作成)
- Check that `$PROJECT_DIR/.tmp/step-2-requirements.md` exists (Step 2: 要件定義書作成)
- Check that `$PROJECT_DIR/.tmp/step-3-system-design.md` exists (Step 3: システム設計作成)
- Check that `$PROJECT_DIR/.tmp/step-4-ui-design.md` exists (Step 4: デザイン設計作成)
- If any are missing, inform user to complete previous steps first
- Confirm project context: "Creating task division for project: `$PROJECT_DIR`"

### 2. Analyze all design documents

Read and understand all design documents thoroughly to identify all implementation tasks:

- Business requirements from specification
- Functional requirements
- System architecture and technical design
- UI/UX design and component structure

### 3. Create Task List Document

**Use the Write tool to create `$PROJECT_DIR/.tmp/step-5-task-division.md` with the following content:**

```markdown
# タスクリスト - [機能/改善名]

## 概要

- 総タスク数: [数]
- 推定作業時間: [時間/日数]
- 優先度: [高/中/低]

## タスク一覧

### Phase 1: 準備・調査

#### Task 1.1: [タスク名]

- [ ] [具体的な作業項目 1]
- [ ] [具体的な作業項目 2]
- [ ] [具体的な作業項目 3]
- [ ] `pnpm lint` を実行しエラーが 0 件であることを確認
- [ ] Prettier でフォーマットを実行
- **完了条件**: [明確な完了条件] + コード品質チェックがパス
- **依存**: [依存するタスク または なし]
- **推定時間**: [時間]

#### Task 1.2: [タスク名]

- [ ] [具体的な作業項目 1]
- [ ] [具体的な作業項目 2]
- [ ] `pnpm lint` を実行しエラーが 0 件であることを確認
- [ ] Prettier でフォーマットを実行
- **完了条件**: [明確な完了条件] + コード品質チェックがパス
- **依存**: [依存するタスク]
- **推定時間**: [時間]

### Phase 2: 実装

#### Task 2.1: [機能名]の実装

- [ ] [実装項目 1]
- [ ] [実装項目 2]
- [ ] [実装項目 3]
- [ ] Tailwind CSS のユーティリティクラスのみを使用してスタイリング
- [ ] `pnpm lint` を実行しエラーが 0 件であることを確認
- [ ] Prettier でフォーマットを実行
- [ ] `pnpm build` を実行しビルドが成功することを確認
- **完了条件**: [明確な完了条件] + 全コード品質チェックがパス
- **依存**: [依存するタスク]
- **推定時間**: [時間]

#### Task 2.2: [機能名]の実装

- [ ] [実装項目 1]
- [ ] [実装項目 2]
- [ ] Tailwind CSS のユーティリティクラスのみを使用してスタイリング
- [ ] `pnpm lint` を実行しエラーが 0 件であることを確認
- [ ] Prettier でフォーマットを実行
- [ ] `pnpm build` を実行しビルドが成功することを確認
- **完了条件**: [明確な完了条件] + 全コード品質チェックがパス
- **依存**: [依存するタスク]
- **推定時間**: [時間]

### Phase 3: 検証・テスト

#### Task 3.1: [検証項目]

- [ ] [テスト項目 1]
- [ ] [テスト項目 2]
- [ ] [テスト項目 3]
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

## 品質チェックプロセス

### 各タスクで必須のチェック項目

1. **ESLint**: `pnpm lint` でエラーが 0 件
2. **Prettier**: 全ファイルがフォーマット済み
3. **Tailwind CSS**: ユーティリティクラスのみ使用
4. **Build**: `pnpm build` がエラーなく完了

### 品質チェック失敗時の対応

- ESLint エラー: 必ず修正してからタスクを完了とする
- Prettier フォーマット: 自動修正を適用
- Tailwind クラス: カスタム CSS をユーティリティクラスに置換
- ビルドエラー: エラーを修正してからタスク完了

## 注意事項

- 各タスクはコミット単位で完結させる
- **必須**: タスク完了時は品質チェックを実行
- 不明点は実装前に確認する
- **必須**: ESLint/Prettier/Tailwind の規約に 100%準拠
```

### 4. Register tasks in TodoWrite

Extract main tasks (Phase level or important tasks) and register them using TodoWrite tool with appropriate priorities

### 5. Create implementation guide

Add a section at the end of step-5-task-division.md:

```markdown
## 実装開始ガイド

1. このタスクリストに従って順次実装を進めてください
2. 各タスクの開始時に TodoWrite で in_progress に更新
3. 完了時は completed に更新
4. 問題発生時は速やかに報告してください
```

### 6. Present to user

Show the task breakdown and:

- Explain the implementation order
- Highlight any critical paths
- Ask for approval to begin implementation

## Important Notes

- Tasks should be commit-sized (completable in 1-4 hours)
- Include clear completion criteria for each task
- Consider parallel execution opportunities
- Include testing tasks throughout, not just at the end
- **MUST include code quality checks (ESLint, Prettier, Tailwind) for EVERY task**
- **All tasks must pass `pnpm lint` with 0 errors before completion**
- **All code must be formatted with Prettier**
- **Only Tailwind utility classes allowed for styling**
- **Consider monorepo structure: distinguish between shared UI components (../../packages/ui) and app-specific components (current app)**
- **Use pnpm as the package manager for all commands and documentation**
