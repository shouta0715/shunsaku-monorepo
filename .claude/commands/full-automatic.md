---
allowed-tools: TodoWrite, Read, Write, MultiEdit, Bash(mkdir:*), Bash(git:*)
description: 5段階仕様駆動開発ワークフローを自動実行（仕様書→要件定義→システム設計→UI設計→タスク分解）
---

## Context

- Task requirements: $ARGUMENTS

## Your task

Execute the complete 5-Stage Specification-Driven Development workflow:

### 0. Setup and Project Detection

**Step 1: Determine target project directory**

Execute the following to detect current project context:

```bash
pwd
```

**Step 2: Apply project detection logic**

- If current directory contains `apps/[project-name]/` → Set target to `apps/[project-name]`
- If current directory contains `packages/[package-name]/` → Set target to `packages/[package-name]`
- If in monorepo root, analyze task description to determine target:
  - Web application features → `apps/web`
  - Shared UI components → `packages/ui`
  - If unclear, default to `apps/web`

**Step 3: Create project-specific .tmp directory**

```bash
mkdir -p [detected-project-dir]/.tmp
```

**Step 4: Set working context**

From this point forward, all design documents will be created in `[detected-project-dir]/.tmp/` where `[detected-project-dir]` is the path determined in Steps 1-2.

**Step 5: Create feature branch**

- Create a new feature branch based on the task

### Step 1: 仕様書作成

**Execute the following steps from `/step-1-specification` command:**

1. Determine project directory (already done in Setup)
2. Analyze the user's request and extract business requirements
3. **Use Write tool to create the specification document in `$PROJECT_DIR/.tmp/step-1-specification.md`**
4. Create TODO entry for specification review
5. Present to user for approval

**MUST include business requirements and project scope**

**Present specification to user for approval before proceeding**

### Step 2: 要件定義書作成

**Execute the following steps from `/step-2-requirements` command:**

1. Verify prerequisites (specification document exists)
2. Analyze user request and specification document
3. **Use Write tool to create requirements document in `$PROJECT_DIR/.tmp/step-2-requirements.md`**
4. **Use Write tool to create/update `$PROJECT_DIR/README.md`**
5. **Use Write tool to create/update `$PROJECT_DIR/.claude/CLAUDE.md`**
6. Create TODO entry and present to user

**MUST include code quality requirements (ESLint, Prettier, Tailwind CSS)**
**MUST reference specification document from Step 1**

**Present requirements to user for approval before proceeding**

### Step 3: システム設計作成

**Execute the following steps from `/step-3-system-design` command:**

1. Verify prerequisites (specification and requirements documents exist)
2. Analyze existing project assets and architecture
3. **Use Write tool to create system design document in `$PROJECT_DIR/.tmp/step-3-system-design.md`**
4. Create TODO entry and present to user

**MUST analyze existing architecture and technical assets**
**MUST define data models, APIs, and system architecture**
**MUST include security and performance considerations**

**Present system design to user for approval before proceeding**

### Step 4: デザイン設計作成

**Execute the following steps from `/step-4-ui-design` command:**

1. Verify prerequisites (all previous documents exist)
2. Analyze existing UI assets and Tailwind configuration
3. **Use Write tool to create UI design document in `$PROJECT_DIR/.tmp/step-4-ui-design.md`**
4. Create TODO entry and present to user

**MUST analyze existing components in packages/ui/src/ and apps/**/src/\*\*
**MUST check Tailwind configuration and design patterns**
**MUST define component architecture and styling guidelines**

**Present UI design to user for approval before proceeding**

### Step 5: タスク分解

**Execute the following steps from `/step-5-task-division` command:**

1. Verify prerequisites (all design documents exist)
2. Analyze all design documents thoroughly
3. **Use Write tool to create task division document in `$PROJECT_DIR/.tmp/step-5-task-division.md`**
4. Register main tasks using TodoWrite tool
5. Present to user for approval

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

- Create appropriate feature b\\\c\
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
