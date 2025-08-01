---
allowed-tools: TodoWrite, Read, Write, MultiEdit
description: Step 5 設計を実装可能なタスクに分解
---

## Context

- Task description: $ARGUMENTS
- Specification document: @.tmp/step-1-specification.md
- Requirements document: @.tmp/step-2-requirements.md
- System design document: @.tmp/step-3-system-design.md
- UI design document: @.tmp/step-4-ui-design.md

## Your task

### 1. Verify prerequisites

- Check that `.tmp/step-1-specification.md` exists
- Check that `.tmp/step-2-requirements.md` exists
- Check that `.tmp/step-3-system-design.md` exists
- Check that `.tmp/step-4-ui-design.md` exists
- If any missing, inform user to complete previous steps first

### 2. Analyze all design documents

Read and understand all design documents thoroughly to identify all implementation tasks:

- Business requirements from specification
- Functional requirements
- System architecture and technical design
- UI/UX design and component structure

### 3. Create Task List Document

Create `.tmp/step-5-task-division.md` with the following sections:

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

#### Task 2.1: Page.tsx の書き直し

- [ ] `src/app/page.tsx`を機能要件に基づいて完全に書き直す（現在のアプリディレクトリ内）
- [ ] **適切なコンポーネント選択**: 機能に応じて以下から選択
  - [ ] レイアウト: `AuthLayout` / `SidebarLayout` / `StackedLayout`
  - [ ] ナビゲーション: `Navbar`, `Sidebar`
  - [ ] ボタン・アクション: `Button` (17 色 variants 選択)
  - [ ] テキスト表示: `Heading`, `Text`, `Strong`, `Code`, `TextLink`
  - [ ] フォーム: `Input`, `Textarea`, `Select`, `Checkbox`, `Radio`, `Switch`, `Fieldset`
  - [ ] データ表示: `Table`, `Badge`, `Alert`, `Avatar`, `DescriptionList`
  - [ ] インタラクション: `Dialog`, `Dropdown`, `Pagination`
- [ ] TypeScript の path mapping 設定（tsconfig.json で`@ui`エイリアス）
- [ ] レスポンシブデザインの実装（Tailwind CSS utility classes 使用）
- [ ] `pnpm lint` を実行しエラーが 0 件であることを確認
- [ ] Prettier でフォーマットを実行
- [ ] `pnpm build` を実行しビルドが成功することを確認
- **完了条件**: page.tsx が新機能に対応し、機能に適した共有コンポーネントを適切に選択・活用している + 全コード品質チェックがパス
- **依存**: なし（最優先タスク）
- **推定時間**: 2-4 時間

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

### 4. Create TODO entry

Use TodoWrite to add "タスク分解の完了とレビュー" as a task

### 5. Present to user

Show the created task division document and ask for:

- Task breakdown confirmation
- Implementation order approval
- Permission to begin implementation

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
