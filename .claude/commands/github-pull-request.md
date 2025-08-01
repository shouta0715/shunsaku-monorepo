---
allowed-tools: TodoWrite, Read, Write, MultiEdit, Bash(git:*), Bash(find:*), Bash(ls:*), Bash(gh:*)
description: 実装完了後に適切なブランチ名・コミット・PRタイトル・説明文を自動生成してプルリクエストを作成
---

## Context

- Implementation details: $ARGUMENTS (optional, if specific implementation details need to be specified)

## Your task

### 1. Analyze implementation status

#### 1.1 Detect project directory and check design documents

**Step 1: Determine current project context**

```bash
pwd
```

**Step 2: Apply project detection logic (same as other steps)**

- If current path contains `apps/[project-name]/` → Set PROJECT_DIR to `apps/[project-name]`
- If current path contains `packages/[package-name]/` → Set PROJECT_DIR to `packages/[package-name]`
- If in monorepo root, look for existing `.tmp` directories:
  ```bash
  find . -name ".tmp" -type d -path "*/apps/*" -o -path "*/packages/*"
  ```
- If only one project with `.tmp` found → Use that project
- If multiple projects found → Ask user to specify target project
- If no projects found → Inform user to run specification workflow first

**Step 3: Read design documents from detected project**

- Read `$PROJECT_DIR/.tmp/step-1-specification.md` (仕様書)
- Read `$PROJECT_DIR/.tmp/step-2-requirements.md` (要件定義書)
- Read `$PROJECT_DIR/.tmp/step-3-system-design.md` (システム設計書)
- Read `$PROJECT_DIR/.tmp/step-4-ui-design.md` (UI/UX 設計書)
- Read `$PROJECT_DIR/.tmp/step-5-task-division.md` (タスクリスト)

**Step 4: Confirm project context**

Inform user: "Creating PR for project: `$PROJECT_DIR`"

#### 1.2 Check current implementation

- Run `git status` to see current changes
- Run `git diff --name-only` to list modified files
- Analyze changed files to understand implementation scope
- Check if implementation matches the planned tasks

### 2. Generate branch information

#### 2.1 Determine branch type

Based on the implementation, choose appropriate branch prefix:

- `feature/` - 新機能の追加
- `fix/` - バグ修正
- `refactor/` - リファクタリング
- `chore/` - 設定変更・ツール更新
- `docs/` - ドキュメント更新のみ

#### 2.2 Create branch name

Format: `{type}/{brief-description-in-kebab-case}`
Example: `feature/user-authentication`, `fix/login-validation-error`

### 3. Quality assurance check

#### 3.1 Run mandatory checks

- `pnpm lint` - ESLint エラーが 0 件であることを確認
- `pnpm build` - ビルドが成功することを確認
- Code formatting with Prettier

#### 3.2 Verify implementation

- All planned tasks from task division are completed
- Code follows established patterns and conventions
- Tailwind CSS utility classes only (no custom CSS)

### 4. Create structured commits

#### 4.1 Analyze changes for logical grouping

Group changes by:

- Setup/configuration changes
- Core feature implementation
- UI/UX implementation
- Tests and documentation
- Bug fixes or refinements

#### 4.2 Generate commit messages

Use conventional commit format:

```
{type}({scope}): {description}

{optional body}

{optional footer}
```

Types: `feat`, `fix`, `refactor`, `style`, `docs`, `test`, `chore`

Examples:

- `feat(auth): add user authentication system`
- `feat(ui): implement responsive login form with Tailwind CSS`
- `fix(validation): resolve email format validation issue`
- `docs(readme): update setup instructions for new auth flow`

### 5. Create branch and commits

#### 5.1 Create feature branch

```bash
git checkout -b {generated-branch-name}
```

#### 5.2 Stage and commit changes

For each logical group:

```bash
git add {related-files}
git commit -m "{conventional-commit-message}"
```

### 6. Generate PR information

#### 6.1 Create PR title

Format: `{Type}: {Brief description of the main feature/fix}`

- Keep under 72 characters
- Start with capital letter
- No period at the end
- Use imperative mood

Examples:

- `feat: Add user authentication with email/password login`
- `fix: Resolve login form validation errors`
- `refactor: Improve component structure for better maintainability`

#### 6.2 Create PR description

```markdown
## 概要

[仕様書から抽出した主要な目的と背景]

## 変更内容

### 主要な機能

- [ ] [実装した主要機能 1]
- [ ] [実装した主要機能 2]
- [ ] [実装した主要機能 3]

### 技術的変更

- **新規追加したファイル**:
  - `{file1}` - {purpose}
  - `{file2}` - {purpose}
- **変更したファイル**:
  - `{file1}` - {changes}
  - `{file2}` - {changes}

### UI/UX 変更

- [UI/UX の変更点の説明]
- [レスポンシブ対応の詳細]
- [アクセシビリティ考慮事項]

## 品質チェック

- [ ] `pnpm lint` エラー 0 件
- [ ] `pnpm build` 成功
- [ ] Prettier フォーマット済み
- [ ] Tailwind CSS ユーティリティクラスのみ使用
- [ ] 既存コンポーネントの活用
- [ ] レスポンシブデザイン対応
- [ ] 型安全性の確保

## テスト

- [ ] [主要機能のテスト項目 1]
- [ ] [主要機能のテスト項目 2]
- [ ] [エラーハンドリングのテスト]
- [ ] [レスポンシブ表示のテスト]

## スクリーンショット（UI 変更がある場合）

### Before

[変更前のスクリーンショット（該当する場合）]

### After

[変更後のスクリーンショット]

## 関連 Issue/PR

- Related to: [関連する Issue 番号]
- Depends on: [依存する PR（該当する場合）]

## 追加情報

- **Breaking Changes**: [破壊的変更がある場合の詳細]
- **Migration Guide**: [移行が必要な場合のガイド]
- **Performance Impact**: [パフォーマンスへの影響]

## レビューポイント

- [ ] [レビューで特に確認してほしい点 1]
- [ ] [レビューで特に確認してほしい点 2]
- [ ] [設計や実装の判断理由の確認]
```

### 7. Create PR document

**Use the Write tool to create `$PROJECT_DIR/.tmp/github-pull-request.md` with the following content:**

```markdown
# GitHub Pull Request 情報

## Branch Information

- **Branch Name**: `{generated-branch-name}`
- **Base Branch**: `main` (or `develop`)
- **Branch Type**: `{feature/fix/refactor/etc}`

## Commit Information

{List of generated commits with messages}

## Pull Request Details

- **Title**: `{generated-title}`
- **Labels**: `{suggested-labels}` (e.g., feature, frontend, backend)
- **Assignees**: `{current-user}`
- **Reviewers**: `{suggested-reviewers}`

## Generated PR Description

{Complete PR description as generated above}

## Git Commands Executed

{Log of git commands that were run}

## Execution Summary

This document contains the complete information for the automatically created PR:

- Branch name and commit history
- PR title and description
- Applied labels, assignees, and reviewers
- GitHub PR URL and status
```

### 8. Execute git operations

#### 8.1 Create and switch to branch

- Create feature branch with generated name
- Switch to the new branch

#### 8.2 Commit changes

- Execute the planned commits in logical order
- Verify each commit with appropriate message

### 9. Push to GitHub and create PR

#### 9.1 Push branch to GitHub

```bash
git push origin {generated-branch-name}
```

#### 9.2 Create Pull Request using GitHub CLI

```bash
gh pr create \
  --title "{generated-pr-title}" \
  --body "{generated-pr-description}" \
  --base main \
  --head {generated-branch-name}
```

#### 9.3 Set PR metadata

```bash
# Add labels
gh pr edit {pr-number} --add-label "{suggested-labels}"

# Add assignees
gh pr edit {pr-number} --add-assignee "{current-user}"

# Add reviewers
gh pr edit {pr-number} --add-reviewer "{suggested-reviewers}"
```

### 10. Verify PR creation

- Confirm PR was created successfully
- Display PR URL
- Verify all metadata is correctly set

### 11. Provide summary and next steps

Show user:

- Created branch name and rationale
- List of commits created
- **GitHub PR URL and number**
- Confirmation of applied labels, assignees, and reviewers
- Instructions for any manual follow-up if needed

## Important Notes

- **Quality First**: Never create PR until all quality checks pass
- **Conventional Commits**: Follow conventional commit standards for clear history
- **Atomic Commits**: Each commit should represent one logical change
- **Clear Description**: PR description should be comprehensive for reviewers
- **Monorepo Awareness**: Consider impact on shared components vs app-specific changes
- **Documentation**: Include any necessary documentation updates
- **Breaking Changes**: Clearly document any breaking changes
- **Performance**: Note any performance implications
- **Security**: Highlight security considerations if applicable

## Prerequisites

- Implementation should be complete and tested
- All planned tasks from step-5-task-division should be finished
- Code should pass all quality checks
- Working directory should be clean except for intended changes
- **GitHub CLI (gh) must be installed and authenticated**
- Repository must be connected to a GitHub remote origin
