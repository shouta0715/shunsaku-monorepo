---
allowed-tools: TodoWrite, TodoRead, Read, Write, MultiEdit, Bash(mkdir:*), Bash(git:*), Bash(pnpm lint:*), Bash(pnpm build:*), Bash(pnpm format:*)
description: 6段階仕様駆動開発ワークフローを自動実行（仕様書→要件定義→システム設計→UI設計→タスク分解→実装＋品質チェック）
---

## Context

- Task requirements: $ARGUMENTS
- Working directory: Current app directory (auto-detected)

## Your task

Execute the complete Specification-Driven Development workflow:

### 1. Setup

- **Execute**: `mkdir -p .tmp` to create the temporary directory for design documents
- Create a new feature branch based on the task

```bash
mkdir -p .tmp
```

### 2. Stage 1: 仕様書作成

Execute `/step-1-specification` command to create business specification in current directory.

**MUST include business requirements and project scope**
**Creates: `.tmp/step-1-specification.md` in current app directory**

**Present specification to user for approval before proceeding**

### 3. Stage 2: 要件定義

Execute `/step-2-requirements` command to create detailed requirements specification.

**MUST include code quality requirements (ESLint, Prettier, Tailwind CSS)**
**MUST create/update README.md and .claude/CLAUDE.md in current directory**
**Creates: `.tmp/step-2-requirements.md` in current app directory**

**Present requirements to user for approval before proceeding**

### 4. Stage 3: システム設計

Execute `/step-3-system-design` command to create technical design based on requirements.

**MUST analyze existing architecture and technical assets in current app**
**MUST define data models, APIs, and system architecture**
**Creates: `.tmp/step-3-system-design.md` in current app directory**

**Present system design to user for approval before proceeding**

### 5. Stage 4: UI 設計

Execute `/step-4-ui-design` command to create UI/UX design and component architecture.

**MUST analyze existing components in packages/ui/src/ and current app src/**
**MUST check Tailwind configuration and design patterns in current app**
**Creates: `.tmp/step-4-ui-design.md` in current app directory**

**Present UI design to user for approval before proceeding**

### 6. Stage 5: タスク分解

Execute `/step-5-task-division` command to break down design into implementable tasks.

**MUST include quality checks for each task:**

- ESLint: `pnpm lint` (0 errors)
- Prettier formatting
- Tailwind utility classes only
- Build verification: `pnpm build`
  **Creates: `.tmp/step-5-task-division.md` in current app directory**

**Present task list to user for approval before proceeding**

### 6. Stage 6: Implementation Execution

**Execute each task from the task division with integrated quality checks:**

For EVERY task:

1. **Mark task as in_progress** using TodoWrite tool
2. **Execute implementation** following the monorepo structure and existing patterns
3. **Run quality checks**:
   ```bash
   # Step 1: Format all files
   pnpm format
   # Step 2: Auto-fix ESLint errors
   pnpm lint:fix
   # Step 3: Check for remaining ESLint errors
   pnpm lint
   ```

   - **If lint errors found**: Fix all errors before proceeding
   - **If lint passes**: Continue to build check
4. **Run build verification**:
   ```bash
   pnpm build
   ```

   - **If build fails**: Fix all issues before proceeding
   - **If build passes**: Mark task as completed
5. **Mark task as completed** using TodoWrite tool
6. **Proceed to next task** only after ALL checks pass

**CRITICAL**: Never mark a task as completed unless `pnpm format`, `pnpm lint:fix`, `pnpm lint` (0 errors), and `pnpm build` all pass successfully.

### 7. Quality Assurance Process

For EVERY implementation step:

1. Write code following existing patterns
2. Use only Tailwind utility classes for styling (v4 configuration)
3. Run `pnpm format` to format with Prettier
4. Run `pnpm lint:fix` to auto-fix ESLint errors
5. Run `pnpm lint` and ensure 0 errors
6. Run `pnpm build` to verify
7. Only mark task as complete when ALL checks pass

### 8. Implementation guidance

**重要な実装方針:**

1. **Page.tsx 書き直し**: `src/app/page.tsx`を機能に応じて完全に書き直す
2. **適切なコンポーネント選択**: 機能に応じて`@package/ui`から最適なコンポーネントを選択

   ```typescript
   // レイアウト
   import {
     AuthLayout,
     SidebarLayout,
     StackedLayout,
     Sidebar,
     Navbar,
   } from "@package/ui";

   // フォーム
   import {
     Input,
     Textarea,
     Select,
     Checkbox,
     Radio,
     Switch,
     Combobox,
     Listbox,
     Fieldset,
     Field,
     Label,
     Description,
     ErrorMessage,
   } from "@package/ui";

   // データ表示
   import {
     Table,
     Badge,
     Alert,
     Avatar,
     DescriptionList,
     Text,
     Strong,
     Code,
     Heading,
   } from "@package/ui";

   // インタラクション
   import {
     Button,
     Dialog,
     Dropdown,
     Pagination,
     Link,
     Divider,
   } from "@package/ui";
   ```

3. **設定ファイル参照**:
   - ESLint: `@package/eslint-config` (base, next, react, typescript)
   - Prettier: `@package/prettier-config` (base, tailwind)
   - TypeScript: `@package/typescript-config` (base, nextjs, react)
   - Tailwind CSS: v4 with @tailwindcss/postcss plugin

### 8. Stage 7: GitHub Pull Request Creation

After all tasks are completed and quality checks pass, execute `/github-pull-request` command to:

- Create appropriate feature branch
- Generate structured commits with conventional commit messages
- Create comprehensive PR with proper title and description
- Include quality assurance checklist
- Technical change summary

### 10. Report completion

Summarize what was created across all stages:

- Stage 1: Business specification document
- Stage 2: Detailed requirements with quality standards
- Stage 3: System architecture and technical design
- Stage 4: UI/UX design and component architecture
- Stage 5: Implementation task breakdown with quality checks
- Stage 6: Complete implementation with integrated testing
- Stage 7: GitHub PR creation with proper documentation

Report that the full implementation has been completed with all quality checks passed.

## Important Notes

- Each stage output should be detailed and actionable
- Wait for user confirmation between stages
- Focus on clarity and completeness in documentation
- Consider edge cases and error scenarios in each stage
- **MUST enforce ESLint, Prettier, and Tailwind CSS standards throughout**
- **All code must pass quality checks before proceeding**
- **Consider monorepo structure: distinguish between shared UI components (packages/ui) and app-specific components (apps/web)**
- **Use pnpm as the package manager for all commands and documentation**

## Available Commands

- `/full-automatic` - Execute complete 5-stage workflow
- `/step-1-specification` - Step 1: 仕様書作成 only
- `/step-2-requirements` - Step 2: 要件定義書作成 only
- `/step-3-system-design` - Step 3: システム設計作成 only
- `/step-4-ui-design` - Step 4: デザイン設計作成 only
- `/step-5-task-division` - Step 5: タスク分解 only
- `/github-pull-request` - GitHub PR creation with proper branching and documentation
