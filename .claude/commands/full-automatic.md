---
allowed-tools: TodoWrite, Read, Write, MultiEdit, Bash(mkdir:*), Bash(git:*)
description: 5段階仕様駆動開発ワークフローを自動実行（仕様書→要件定義→システム設計→UI設計→タスク分解）
---

## Context

- Task requirements: $ARGUMENTS

## Your task

Execute the complete 5-Stage Specification-Driven Development workflow:

### 0. Setup

- Determine the target project directory (apps/**, packages/**)
- Create `{project_dir}/.tmp` directory if it doesn't exist
- Analyze monorepo structure to understand the current project context
- Create a new feature branch based on the task

### Step 1: 仕様書作成

Execute `/step-1-specification` command to create initial specification document.

**MUST include business requirements and project scope**

**Present specification to user for approval before proceeding**

### Step 2: 要件定義書作成

Execute `/step-2-requirements` command to create detailed requirements specification.

**MUST include code quality requirements (ESLint, Prettier, Tailwind CSS)**
**MUST reference specification document from Step 1**

**Present requirements to user for approval before proceeding**

### Step 3: システム設計作成

Execute `/step-3-system-design` command to create technical system design.

**MUST analyze existing architecture and technical assets**
**MUST define data models, APIs, and system architecture**
**MUST include security and performance considerations**

**Present system design to user for approval before proceeding**

### Step 4: デザイン設計作成

Execute `/step-4-ui-design` command to create UI/UX design specification.

**MUST analyze existing components in packages/ui/src/ and apps/**/src/\*\*
**MUST check Tailwind configuration and design patterns**
**MUST define component architecture and styling guidelines**

**Present UI design to user for approval before proceeding**

### Step 5: タスク分解

Execute `/step-5-task-division` command to break down all designs into implementable tasks.

**MUST include quality checks for each task:**

- ESLint: `pnpm lint` (0 errors)
- Prettier formatting
- Tailwind utility classes only
- Build verification: `pnpm build`

**Present task list to user for approval before proceeding**

### 6. Quality Assurance Process

For EVERY implementation step:

1. Write code following existing patterns
2. Use only Tailwind utility classes for styling
3. Run `pnpm lint` and fix all errors
4. Format with Prettier
5. Run `pnpm build` to verify
6. Only mark task as complete when ALL checks pass

### 7. Implementation guidance

Inform user that they can now proceed with implementation using the generated specification documents, following the task breakdown from Step 5.

### 8. Post-implementation: GitHub PR creation

After implementation is complete, recommend using `/github-pull-request` command to:

- Create appropriate feature branch
- Generate structured commits with conventional commit messages
- Create comprehensive PR with proper title and description
- Include quality assurance checklist

### 9. Report completion

Summarize what was created across all 5 stages and the recommended next steps for implementation and PR creation.

## Important Notes

- Each stage output should be detailed and actionable
- Wait for user confirmation between stages
- Focus on clarity and completeness in documentation
- Consider edge cases and error scenarios in each stage
- **MUST enforce ESLint, Prettier, and Tailwind CSS standards throughout**
- **All code must pass quality checks before proceeding**
- **Consider monorepo structure: distinguish between shared UI components (packages/ui) and app-specific components (apps/**)\*\*
- **Use pnpm as the package manager for all commands and documentation**

## Available Commands

- `/full-automatic` - Execute complete 5-stage workflow
- `/step-1-specification` - Step 1: 仕様書作成 only
- `/step-2-requirements` - Step 2: 要件定義書作成 only
- `/step-3-system-design` - Step 3: システム設計作成 only
- `/step-4-ui-design` - Step 4: デザイン設計作成 only
- `/step-5-task-division` - Step 5: タスク分解 only
- `/github-pull-request` - GitHub PR creation with proper branching and documentation
