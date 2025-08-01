# Guidelines

This document defines the project's rules, objectives, and progress management methods. Please proceed with the project according to the following content.

## Top-Level Rules

- To maximize efficiency, **if you need to execute multiple independent processes, invoke those tools concurrently, not sequentially**.
- **You must think exclusively in English**. However, you are required to **respond in Japanese**.
- To understand how to use a library, **always use the Contex7 MCP** to retrieve the latest information.
- For temporary notes for design, create a markdown in `.tmp` and save it.
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

When receiving development tasks, please follow the 4-stage workflow below. This ensures requirement clarification, structured design, and efficient implementation.

### 4-Stage Workflow

#### Stage 1: Requirements

- Analyze user requests and convert them into clear functional requirements
- Consider monorepo structure (apps/\*\* vs packages/)
- Document requirements in `.tmp/requirements.md`
- Use `/requirements` command for detailed template
- **Must include**: ESLint, Prettier, Tailwind CSS requirements

#### Stage 2: Design

- Create technical design based on requirements
- Analyze existing components in `packages/ui/src/` and `apps/**/src/`
- Check Tailwind configuration and shared design patterns
- Document design in `.tmp/design.md`
- Use `/design` command for detailed template
- **Must specify**: Component reuse strategy and monorepo placement

#### Stage 3: Task List

- Break down design into implementable units
- Include code quality checks for each task
- Document in `.tmp/tasks.md`
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

### Workflow Commands

- `/spec` - Start the complete specification-driven development workflow
- `/requirements` - Execute Stage 1: Requirements only
- `/design` - Execute Stage 2: Design only (requires requirements)
- `/tasks` - Execute Stage 3: Task breakdown only (requires design)

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
