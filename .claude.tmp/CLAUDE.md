# Guidelines

This document defines the project's rules, objectives, and progress management methods. Please proceed with the project according to the following content.

## Top-Level Rules

- To maximize efficiency, **if you need to execute multiple independent processes, invoke those tools concurrently, not sequentially**.
- **You must think exclusively in English**. However, you are required to **respond in Japanese**.
- To understand how to use a library, **always use the Contex7 MCP** to retrieve the latest information.
- For temporary notes for design, create a markdown in the project's `.tmp` directory (e.g., `apps/web/.tmp/` or `packages/ui/.tmp/`) and save it.
- **After using Write or Edit tools, ALWAYS verify the actual file contents using the Read tool**, regardless of what the system-reminder says. The system-reminder may incorrectly show "(no content)" even when the file has been successfully written.
- Please respond critically and without pandering to my opinions, but please don't be forceful in your criticism.

## Project Structure

This is a monorepo project with the following structure:

- `apps/**/` - Next.js main application
- `packages/ui/` - Shared UI component library
- `packages/eslint-config/` - Shared ESLint configurations
- `packages/prettier-config/` - Shared Prettier configurations
- `packages/typescript-config/` - Shared TypeScript configurations

**Package Manager**: Use `pnpm` for all dependency management and script execution.

**Design Documents**: Each project maintains its design documents in its own `.tmp` directory:

- `apps/web/.tmp/` - Design documents for web application
- `packages/ui/.tmp/` - Design documents for UI library changes
- Pattern: `[project-dir]/.tmp/step-*-*.md` where [project-dir] is auto-detected

## Programming Rules

- Avoid hard-coding values unless absolutely necessary.
- Do not use `any` or `unknown` types in TypeScript.
- You must not use a TypeScript `class` unless it is absolutely necessary (e.g., extending the `Error` class for custom error handling that requires `instanceof` checks).

## Code Quality Standards

### Required Tools and Standards

- **ESLint**: All code must pass `pnpm lint` with 0 errors
- **Prettier**: All files must be formatted with Prettier
- **Tailwind CSS**: Use only Tailwind utility classes for styling, no custom CSS
- **Build**: All code must pass `pnpm build` without errors

### Quality Check Process

For every code change:

1. Write code following existing patterns
2. Use only Tailwind utility classes for styling
3. Run `pnpm lint` and fix all errors
4. Format with Prettier
5. Run `pnpm build` to verify
6. Only commit when ALL checks pass

### Component Usage

- **Prioritize existing components**: Check `packages/ui/src/` for reusable components
- **App-specific components**: Place in `apps/**/src/components/` only when necessary
- **Avoid duplication**: Use shared UI components from packages/ui whenever possible

## Development Style - Specification-Driven Development

### Overview

When receiving development tasks, please follow the 5-stage workflow below. This ensures comprehensive specification, structured design, and efficient implementation.

### 5-Stage Workflow

#### Step 1: 仕様書作成

- Analyze user requests and extract business requirements
- Determine target project directory (apps/**, packages/**)
- Create project-specific `.tmp` directory
- Document specification in `[project-dir]/.tmp/step-1-specification.md` where [project-dir] is detected from current context
- Use `/step-1-specification` command for detailed template
- **Must include**: Business requirements, stakeholders, scope definition

#### Stage 2: Design

- Create technical design based on requirements
- Analyze existing components in `packages/ui/src/` and `apps/**/src/`
- Check Tailwind configuration and shared design patterns
- Document design in `[project-dir]/.tmp/step-3-system-design.md` and `[project-dir]/.tmp/step-4-ui-design.md`
- Use `/design` command for detailed template
- **Must specify**: Component reuse strategy and monorepo placement

#### Stage 3: Task List

- Break down design into implementable units
- Include code quality checks for each task
- Document in `[project-dir]/.tmp/step-5-task-division.md`
- Use `/tasks` command for detailed template
- Manage major tasks with TodoWrite tool
- **Must include**: `pnpm lint` and `pnpm build` checks for each task

#### Stage 4: Implementation

- Implement according to task list
- For each task:
  - Update task to in_progress using TodoWrite
  - Execute implementation following monorepo structure
  - Run `pnpm lint` and fix all errors
  - Run `pnpm build` to verify
  - Ensure Tailwind utility classes only
  - Update task to completed using TodoWrite

#### Stage 5: GitHub Pull Request Creation

- Execute `/github-pull-request` command after implementation completion
- Automatically generates:
  - Appropriate branch name based on implementation type
  - Structured commits with conventional commit messages
  - Comprehensive PR title and description
  - Quality assurance checklist
  - Technical change summary

### Workflow Commands

- `/full-automatic` - Start the complete 5-stage specification-driven development workflow
- `/step-1-specification` - Execute Step 1: 仕様書作成 only
- `/step-2-requirements` - Execute Step 2: 要件定義書作成 only (requires specification)
- `/step-3-system-design` - Execute Step 3: システム設計作成 only (requires requirements)
- `/step-4-ui-design` - Execute Step 4: デザイン設計作成 only (requires system design)
- `/step-5-task-division` - Execute Step 5: タスク分解 only (requires all designs)
- `/github-pull-request` - Execute GitHub PR creation with proper branching, commits, and description (requires completed implementation)

### Important Notes

- Each stage depends on the deliverables of the previous stage
- Please obtain user confirmation before proceeding to the next stage
- Always use this workflow for complex tasks or new feature development
- Simple fixes or clear bug fixes can be implemented directly
- **Monorepo considerations**:
  - Shared components belong in `packages/ui/src/`
  - App-specific features belong in `apps/**/src/`
  - Always check existing components before creating new ones
- **Quality is non-negotiable**: All code must pass ESLint, Prettier, and build checks
- **Use pnpm exclusively** for all package management and script execution
