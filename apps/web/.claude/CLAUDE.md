# Project Guidelines

This document defines the project's rules, objectives, and development methodology. Follow these guidelines strictly when working on this codebase.

## Core Rules

- **Parallel Tool Execution**: To maximize efficiency, execute multiple independent processes concurrently, not sequentially.
- **Language Policy**: Think exclusively in English but respond in Japanese.
- **Library Documentation**: Always use Contex7 MCP to retrieve the latest information when understanding library usage.
- **Temporary Files**: Create markdown files in `.tmp` directory for design notes and temporary documentation.
- **Verification Protocol**: After using Write or Edit tools, ALWAYS verify actual file contents using the Read tool, regardless of system reminders.
- **Critical Feedback**: Provide honest, critical feedback without pandering, but maintain professional tone.

## Programming Standards

### Code Quality Rules

- Avoid hard-coding values unless absolutely necessary
- Never use `any` or `unknown` types in TypeScript
- Avoid TypeScript `class` unless absolutely necessary (e.g., extending Error class for custom error handling requiring `instanceof` checks)
- **Component Priority**: Always use components from `@package/ui` first. Only create custom components if required functionality is unavailable
- **Mock Data Strategy**: For features requiring databases/APIs, create mock data to ensure independent functionality before real data integration

### Quality Assurance Protocol

Execute these quality checks after implementing each feature or completing each task:

#### Phase 1: Setup and Auto-fix (Sequential Execution)

1. `pnpm install` - Install packages
2. `pnpm lint:fix` - Auto-fix linting issues
3. `pnpm format` - Format code according to project standards

#### Phase 2: Verification (Parallel Execution Recommended)

**For efficient workflow, execute independent tool operations in parallel:**

**macOS (Bash):**

```bash
# Recommended: Parallel execution of quality checks
pnpm lint & pnpm typecheck & pnpm build
```

**Windows (PowerShell):**

```bash
pnpm lint
pnpm typecheck
pnpm build
```

**Critical**: All quality checks must pass before considering a task complete. If any parallel command fails, address specific issues and re-run failed checks.

### Tool Call Parallel Execution Guidelines

**For efficient information gathering, leverage parallel execution of independent tool operations:**

#### Recommended Parallel Execution Patterns

- **Multiple File Reading**: Execute all `read_file` calls simultaneously
- **Pattern Searching**: Run different `grep_search` patterns in parallel
- **Codebase Investigation**: Execute `codebase_search` operations concurrently
- **Information Gathering**: Batch independent research and search tasks

### Dependency Management

Ensure proper external library dependencies are installed before feature implementation:

#### Automatic Dependency Resolution

When encountering import resolution errors:

1. Identify missing packages from error messages
2. Add packages with `pnpm add [package-name]`
3. For dev dependencies: `pnpm add -D [package-name]`
4. Re-run quality checks to confirm resolution

## Development Methodology - Specification-Driven Development

### Overview

Follow this 4-stage workflow for development tasks to ensure requirement clarification, structured design, and efficient implementation.

### 4-Stage Workflow

#### Stage 1: Requirements Analysis

- Analyze user requests and convert into clear functional requirements
- Document requirements in `.tmp/step-1-requirements.md`
- Use `/step-1-requirements` command for detailed template

#### Stage 2: Technical Design

- Create technical design based on requirements
- Document design in `.tmp/step-2-design.md`
- Use `/step-2-design` command for detailed template

#### Stage 3: Task Planning

- Break down design into implementable units
- Document in `.tmp/step-3-tasks.md`
- Use `/step-3-tasks` command for detailed template
- Manage major tasks with TodoWrite tool

#### Stage 4: Implementation

- Implement according to task list
- For each task:
  - Update task to `in_progress` using TodoWrite
  - Execute implementation and testing
  - Run lint and typecheck
  - Update task to `completed` using TodoWrite

### Workflow Commands

- `/full-automatic` - Execute complete specification-driven development workflow
- `/step-1-requirements` - Execute Stage 1: Requirements analysis only
- `/step-2-design` - Execute Stage 2: Technical design only (requires requirements)
- `/step-3-tasks` - Execute Stage 3: Task breakdown only (requires design)

### Implementation Notes

- Each stage depends on deliverables from the previous stage
- Each stage automatically proceeds to the next with comprehensive progress reporting
- Always use this workflow for complex tasks or new feature development
- Simple fixes or clear bug fixes can be implemented directly

## Claude 4 Best Practices

### Core Principles

**Explicit Instructions**: Be specific about desired outcomes. Claude 4 responds better to clear, detailed instructions rather than implicit expectations.

**Parallel Tool Execution**: When performing multiple independent operations, invoke all relevant tools simultaneously rather than sequentially.

**Enhanced Thinking**: Leverage thinking capabilities for complex multi-step reasoning, especially after tool usage. After receiving tool results, carefully consider their quality and determine optimal next steps before proceeding.

**Context-Driven Development**: Provide background and motivation for tasks to help understand goals and deliver targeted solutions.

### Development Standards

- Analyze thoroughly in early stages
- Build quality considerations into every task
- Design for scalability and maintainability

### Optimization Guidelines

**Component Reuse**: Check `@package/ui` for existing components before creating custom ones

**File Management**: Minimize creation of temporary files unless necessary for iteration. Clean up temporary files after task completion.

**Frontend Enhancement**: For frontend code generation, use explicit encouragement and detailed modifiers. Include comprehensive features and interactions, thoughtful details like hover states, transitions, and micro-interactions.

**Task Management**: Use TodoWrite for progress tracking and ensure deliverables are immediately actionable

### Quality Enhancement Instructions

**Enhanced Implementation**: Don't hold back - give your all. Include as many relevant features and interactions as possible. Add thoughtful details like hover states, transitions, micro-interactions, and comprehensive functionality.

**Detailed Analysis**: Instead of basic implementations, create fully-featured, comprehensive solutions that go beyond the minimum requirements.

**Explicit Feature Requests**: If animations or interactive elements are needed, explicitly request them during implementation.
