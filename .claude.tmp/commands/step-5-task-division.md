---
allowed-tools: TodoWrite, TodoRead, Read, Write, MultiEdit, Bash(mkdir:*)
description: Step 5 設計を実装可能なタスクに分解（ディレクトリ自動作成）
---

## Context

- Task description: $ARGUMENTS
- Working directory: Current app directory (auto-detected)
- Specification document: @.tmp/step-1-specification.md
- Requirements document: @.tmp/step-2-requirements.md
- System design document: @.tmp/step-3-system-design.md
- UI design document: @.tmp/step-4-ui-design.md

## Your task

### 1. Setup and verify prerequisites

- **Execute**: `mkdir -p .tmp` to create the temporary directory if it doesn't exist
- Check that `.tmp/step-1-specification.md` exists
- Check that `.tmp/step-2-requirements.md` exists
- Check that `.tmp/step-3-system-design.md` exists
- Check that `.tmp/step-4-ui-design.md` exists
- If any missing, inform user to complete previous steps first

```bash
mkdir -p .tmp
```

### 2. Analyze all design documents

Read and understand the design thoroughly to identify all implementation tasks

### 3. Create Task List Document

**Use the Write tool to create `.tmp/step-5-task-division.md` with the following content:**

````markdown
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
- [ ] **コンポーネント選択チェック** (必須):
  1. `packages/ui/src/index.ts` で全コンポーネントを確認
  2. `@package/ui` で実現可能か検討
  3. 無い場合のみ新規作成を検討
- [ ] **品質チェックプロセス実行** (以下の手順を必ず実行):
  1. `pnpm format` で全ファイルフォーマット実行
  2. `pnpm lint:fix` で ESLint の Error 自動修正
  3. `pnpm lint` で Error 確認 → 0 件でなければ修正後、手順 3 を再実行
  4. `pnpm build` がエラーなく完了することを確認
  5. 全チェックパス後、次のタスクに進む
- **完了条件**: [明確な完了条件] + **全品質チェックが 0 エラーで完了**
- **依存**: [依存するタスク または なし]
- **推定時間**: [時間]

#### Task 1.2: [タスク名]

- [ ] [具体的な作業項目 1]
- [ ] [具体的な作業項目 2]
- [ ] **品質チェックプロセス実行** (以下の手順を必ず実行):
  1. `pnpm format` で全ファイルフォーマット実行
  2. `pnpm lint:fix` で ESLint の Error 自動修正
  3. `pnpm lint` で Error 確認 → 0 件でなければ修正後、手順 3 を再実行
  4. `pnpm build` がエラーなく完了することを確認
  5. 全チェックパス後、次のタスクに進む
- **完了条件**: [明確な完了条件] + **全品質チェックが 0 エラーで完了**
- **依存**: [依存するタスク]
- **推定時間**: [時間]

### Phase 2: 実装

#### 実装時の絶対ルール (全タスク共通)

**コンポーネント使用優先順位**:

1. **第1優先**: `@package/ui` の既存コンポーネントを使用
2. **第2優先**: `@package/ui` に無い場合のみ新規作成
3. **禁止**: 既存コンポーネントを確認せずに新規作成

**必須手順**:

- 全ての実装タスクで `packages/ui/src/index.ts` を最初に確認
- `import { Button, Table, ... } from "@package/ui"` を最優先で使用
- 新規コンポーネント作成前に必ず再確認

#### Task 2.1: [機能名]の実装

- [ ] **コンポーネント選択チェック** (必須最初手順):
  1. `packages/ui/src/index.ts` で全コンポーネントを確認
  2. 必要なコンポーネントが `@package/ui` で実現可能か検訍
  3. 無い場合のみ `apps/web/src/components/` で新規作成
- [ ] [実装項目 1] - `@package/ui` を最優先使用
- [ ] [実装項目 2] - `@package/ui` を最優先使用
- [ ] [実装項目 3] - `@package/ui` を最優先使用
- [ ] Tailwind CSS v4 のユーティリティクラスのみを使用してスタイリング
- [ ] **品質チェックプロセス実行** (以下の手順を必ず実行):
  1. `pnpm format` で全ファイルフォーマット実行
  2. `pnpm lint:fix` で ESLint の Error 自動修正
  3. `pnpm lint` で Error 確認 → 0 件でなければ修正後、手順 3 を再実行
  4. `pnpm build` がエラーなく完了することを確認
  5. 全チェックパス後、次のタスクに進む
- **完了条件**: [明確な完了条件] + 全コード品質チェックがパス
- **依存**: [依存するタスク]
- **推定時間**: [時間]

#### Task 2.2: [機能名]の実装

- [ ] [実装項目 1]
- [ ] [実装項目 2]
- [ ] Tailwind CSS v4 のユーティリティクラスのみを使用してスタイリング
- [ ] **品質チェックプロセス実行** (以下の手順を必ず実行):
  1. `pnpm format` で全ファイルフォーマット実行
  2. `pnpm lint:fix` で ESLint の Error 自動修正
  3. `pnpm lint` で Error 確認 → 0 件でなければ修正後、手順 3 を再実行
  4. `pnpm build` がエラーなく完了することを確認
  5. 全チェックパス後、次のタスクに進む
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

### 🔥 **必須**: タスク完了時の品質チェックフロー

**各タスク完了時に以下の手順を必ず実行してください:**

```bash
# 手順1: 全ファイルフォーマット
pnpm format

# 手順2: ESLintエラー自動修正
pnpm lint:fix

# 手順3: ESLintエラーチェック
pnpm lint
```
````

**⚠️ 重要**: 手順 3 でエラーが 0 件でない場合:

1. エラー内容を確認し、手動で修正
2. 修正後、再度 `pnpm lint` を実行
3. エラーが 0 件になるまで修正を繰り返す

```bash
# 手順4: ビルドテスト
pnpm build
```

**⚠️ 重要**: ビルドエラーが発生した場合:

1. エラー内容を確認し、手動で修正
2. 修正後、再度 `pnpm build` を実行
3. エラーなく完了するまで修正を繰り返す

**手順 5: 次のタスクに進む** (全チェックが 0 エラーで完了後のみ)

### 品質チェック失敗時の対応ルール

- **ESLint エラー**: 必ず 0 件になるまで修正（タスク完了不可）
- **Prettier**: 自動修正が適用される
- **Tailwind CSS**: ユーティリティクラスのみ使用
- **ビルドエラー**: 必ずエラーなく完了するまで修正（タスク完了不可）

## 注意事項

- 各タスクはコミット単位で完結させる
- **🔥 必須**: タスク完了時は必ず品質チェックフローを実行
- **🔥 必須**: ESLint/Prettier/Build が 0 エラーで完了するまで次のタスクに進まない
- 不明点は実装前に確認する
- **必須**: ESLint/Prettier/Tailwind の規約に 100%準拠
- **禁止**: 品質チェックをスキップしての次タスク進行

````

### 4. Register tasks in TodoWrite

Extract main tasks (Phase level or important tasks) and register them using TodoWrite tool with appropriate priorities

### 5. Create implementation guide

Add a section at the end of tasks.md:

```markdown
## 実装開始ガイド

1. このタスクリストに従って順次実装を進めてください
2. 各タスクの開始時に TodoWrite で in_progress に更新
3. **必須**: タスク完了前に品質チェックフローを実行
   - `pnpm format` → `pnpm lint:fix` → `pnpm lint` (0エラーまで繰り返し) → `pnpm build`
4. 全品質チェックが0エラーで完了後、TodoWrite で completed に更新
5. 問題発生時は速やかに報告してください
````

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
- **🔥 CRITICAL**: 品質チェックフローを各タスクで必須実行
- **🔥 CRITICAL**: `pnpm lint` が 0 エラーになるまで次のタスクに進まない
- **🔥 CRITICAL**: `pnpm build` がエラーなく完了するまで次のタスクに進まない
- **All code must be formatted with Prettier via `pnpm format`**
- **Only Tailwind utility classes allowed for styling**
- **No exceptions to the quality check process**
