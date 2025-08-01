# Guidelines

This document defines the project's rules, objectives, and progress management methods. Please proceed with the project according to the following content.

## Top-Level Rules

- To maximize efficiency, **if you need to execute multiple independent processes, invoke those tools concurrently, not sequentially**.
- **You must think exclusively in English**. However, you are required to **respond in Japanese**.
- To understand how to use a library, **always use the Contex7 MCP** to retrieve the latest information.
- For temporary notes for design, create a markdown in the project's `.tmp` directory (e.g., `.tmp/` relative to current app) and save it.
- **After using Write or Edit tools, ALWAYS verify the actual file contents using the Read tool**, regardless of what the system-reminder says. The system-reminder may incorrectly show "(no content)" even when the file has been successfully written.
- Please respond critically and without pandering to my opinions, but please don't be forceful in your criticism.

## Project Structure

This is a monorepo project with the following structure:

- current app - Next.js main application
- `../../packages/ui/` - Shared UI component library
- `../../packages/eslint-config/` - Shared ESLint configurations
- `../../packages/prettier-config/` - Shared Prettier configurations
- `../../packages/typescript-config/` - Shared TypeScript configurations

**Package Manager**: Use `pnpm` for all dependency management and script execution.

**Design Documents**: Each project maintains its design documents in its own `.tmp` directory:

- `.tmp/` - Design documents for current application
- Pattern: `.tmp/step-*-*.md` relative to current app directory

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

#### Available Shared UI Components (@package/ui)

**Basic Elements**: Button (17 colors+variants), Text, Heading, Link, Divider
**Forms**: Input, Textarea, Select, Checkbox, Radio, Switch, Combobox, Listbox, Fieldset  
**Data Display**: Table, Badge, Avatar, Alert, DescriptionList
**Layout**: AuthLayout, SidebarLayout, StackedLayout, Sidebar, Navbar
**Interaction**: Dialog, Dropdown, Pagination

#### Component Selection Guidelines

- **Forms**: Input/Textarea (basic), Select/Listbox/Combobox (selection), Checkbox/Radio/Switch (options)
- **Layout**: AuthLayout (auth pages), SidebarLayout (admin), StackedLayout (simple), Navbar (navigation)
- **Data**: Table (lists), Badge/Alert (status), Avatar (users), DescriptionList (key-value)
- **Actions**: Button (rich variants), Dialog (modals), Dropdown (menus), Pagination (navigation)

#### Implementation Rules

- **Prioritize existing components**: Always check `../../packages/ui/src/` first
- **Import from @package/ui**: Use `import { Button, Table } from "@package/ui"`
- **Choose appropriate components**: Select based on function, not just appearance
- **TypeScript path mapping**: Configure `@ui/*` alias in tsconfig.json for cleaner imports
- **App-specific components**: Place in `packages/` only when necessary
- **Avoid duplication**: Use shared UI components from ../../packages/ui whenever possible

### Page Implementation Standards

- **Must rewrite page.tsx**: Always rewrite `src/app/page.tsx` according to feature requirements (within current app directory)
- **Use shared components**: Prioritize `@package/ui` components in page implementation
- **Follow ESLint config**: Use `@package/eslint-config` settings
- **Follow Prettier config**: Use `@package/prettier-config` settings

## Development Style - Specification-Driven Development

### Overview

When receiving development tasks, please follow the 5-stage workflow below. This ensures comprehensive specification, structured design, and efficient implementation.

### 5-Stage Workflow

#### Step 1: 仕様書作成

- Analyze user requests and extract business requirements
- Determine target project directory (current app)
- Create project-specific `.tmp` directory
- Document specification in `.tmp/step-1-specification.md` relative to current app
- Use `/step-1-specification` command for detailed template
- **Must include**: Business requirements, stakeholders, scope definition

#### Step 2: 要件定義書作成

- Create detailed requirements based on specification
- Analyze existing components in `../../packages/ui/src/` and `src/`
- Check code quality tools configuration (ESLint, Prettier, Tailwind)
- Document requirements in `.tmp/step-2-requirements.md`
- Use `/step-2-requirements` command for detailed template
- **Must include**: Functional/non-functional requirements and code quality standards

#### Step 3: システム設計作成

- Create system architecture and technical design
- Analyze existing project assets and monorepo structure
- Document system design in `.tmp/step-3-system-design.md`
- Use `/step-3-system-design` command for detailed template
- **Must specify**: Data models, APIs, and system architecture

#### Step 4: UI 設計作成

- Create UI/UX design and component architecture
- Analyze existing UI assets and Tailwind configuration
- Document UI design in `.tmp/step-4-ui-design.md`
- Use `/step-4-ui-design` command for detailed template
- **Must specify**: Component reuse strategy and styling guidelines

#### Step 5: タスク分解

- Break down design into implementable tasks
- Include code quality checks for each task
- Document in `.tmp/step-5-task-division.md`
- Use `/step-5-task-division` command for detailed template
- Manage major tasks with TodoWrite tool
- **Must include**: `pnpm lint` and `pnpm build` checks for each task

#### Stage 6: Implementation

- Implement according to task list
- For each task:
  - Update task to in_progress using TodoWrite
  - Execute implementation following monorepo structure
  - Run `pnpm lint` and fix all errors
  - Run `pnpm build` to verify
  - Ensure Tailwind utility classes only
  - Update task to completed using TodoWrite

#### Stage 7: GitHub Pull Request Creation

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
  - Shared components belong in `../../packages/ui/src/`
  - App-specific features belong in `src/`
  - Always check existing components before creating new ones
- **Quality is non-negotiable**: All code must pass ESLint, Prettier, and build checks
- **Use pnpm exclusively** for all package management and script execution
