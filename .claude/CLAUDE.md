# Guidelines

This document defines the project's rules, objectives, and progress management methods. Please proceed with the project according to the following content.

## Top-Level Rules

- To maximize efficiency, **if you need to execute multiple independent processes, invoke those tools concurrently, not sequentially**.
- **You must think exclusively in English**. However, you are required to **respond in Japanese**.
- To understand how to use a library, **always use the Contex7 MCP** to retrieve the latest information.
- For temporary notes for design, create a markdown in `.tmp` and save it.
- **After using Write or Edit tools, ALWAYS verify the actual file contents using the Read tool**, regardless of what the system-reminder says. The system-reminder may incorrectly show "(no content)" even when the file has been successfully written.
- Please respond critically and without pandering to my opinions, but please don't be forceful in your criticism.

## Programming Rules

- Avoid hard-coding values unless absolutely necessary.
- Do not use `any` or `unknown` types in TypeScript.
- You must not use a TypeScript `class` unless it is absolutely necessary (e.g., extending the `Error` class for custom error handling that requires `instanceof` checks).

## Development Style - Specification-Driven Development

### Overview

When receiving development tasks, please follow the 4-stage workflow below. This ensures requirement clarification, structured design, and efficient implementation.

### 4-Stage Workflow

#### Stage 1: Requirements

- Analyze user requests and convert them into clear functional requirements
- Document requirements in `.tmp/step-1-requirements.md`
- Use `/step-1-requirements` command for detailed template

#### Stage 2: Design

- Create technical design based on requirements
- Document design in `.tmp/step-2-design.md`
- Use `/step-2-design` command for detailed template

#### Stage 3: Task List

- Break down design into implementable units
- Document in `.tmp/step-3-tasks.md`
- Use `/step-3-tasks` command for detailed template
- Manage major tasks with TodoWrite tool

#### Stage 4: Implementation

- Implement according to task list
- For each task:
  - Update task to in_progress using TodoWrite
  - Execute implementation and testing
  - Run lint and typecheck
  - Update task to completed using TodoWrite

### Workflow Commands

- `/full-automatic` - Start the complete specification-driven development workflow
- `/step-1-requirements` - Execute Stage 1: Requirements only
- `/step-2-design` - Execute Stage 2: Design only (requires requirements)
- `/step-3-tasks` - Execute Stage 3: Task breakdown only (requires design)

### Important Notes

- Each stage depends on the deliverables of the previous stage
- Each stage automatically proceeds to the next with comprehensive progress reporting
- Always use this workflow for complex tasks or new feature development
- Simple fixes or clear bug fixes can be implemented directly

## Claude 4 Best Practices Integration

### Core Principles

- Use parallel execution for independent operations
- Be specific about desired outcomes
- Use thinking capabilities for complex reasoning
- Provide clear context and motivation

### Development Standards

- Analyze thoroughly in early stages
- Build quality considerations into every task
- Design for scalability and maintainability

### Optimization Guidelines

- Check @package/ui for existing components [[memory:4951752]]
- Use TodoWrite for task management
- Provide progress summaries
- Ensure deliverables are actionable
