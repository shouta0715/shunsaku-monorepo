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
- **Component Priority**: Always use components from `@package/ui` as the foundation. Only create custom components if the required functionality is not available in the package.
- **Mock Data Strategy**: When implementing features that require databases or APIs, create mock data to ensure functionality works independently before integrating with real data sources.

### Quality Assurance Protocol

After implementing each feature or completing each task, execute the following quality checks in order:

1. `pnpm lint:fix` - Automatically fix linting issues
2. `pnpm format` - Format code according to project standards
3. `pnpm lint` - Verify all linting rules pass; fix any remaining issues
4. `pnpm typecheck` - Ensure TypeScript compilation succeeds; resolve type errors
5. `pnpm build` - Confirm the project builds successfully; address build failures

**Critical**: All quality checks must pass before considering a task complete.

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

**Explicit Instructions**: Always be specific about desired outcomes. Claude 4 responds better to clear, detailed instructions rather than implicit expectations.

**Parallel Tool Execution**: When performing multiple independent operations, invoke all relevant tools simultaneously rather than sequentially. Use this prompt for maximum efficiency:

```
最大の効率を得るために、複数の独立した操作を実行する必要がある場合は、順次ではなく、関連するすべてのツールを同時に呼び出してください。
```

**Enhanced Thinking**: Leverage thinking capabilities for complex multi-step reasoning, especially after tool usage:

```
ツールの結果を受け取った後、その品質を慎重に検討し、次に進む前に最適な次のステップを決定してください。この新しい情報に基づいて計画し、反復するために思考を使用し、最善の次のアクションを取ってください。
```

**Context-Driven Development**: Provide background and motivation for tasks to help Claude understand goals and deliver more targeted solutions.

### Development Standards

- Analyze thoroughly in early stages
- Build quality considerations into every task
- Design for scalability and maintainability

### Optimization Guidelines

**Component Reuse**: Check @package/ui for existing components before creating custom ones [[memory:4951752]]

**File Management**: Minimize creation of temporary files unless necessary for iteration. Clean up temporary files after task completion:

```
反復のために一時的な新しいファイル、スクリプト、またはヘルパーファイルを作成した場合は、タスクの最後にこれらのファイルを削除してクリーンアップしてください。
```

**Frontend Enhancement**: For frontend code generation, use explicit encouragement and detailed modifiers:

```
遠慮せずに、全力を尽くしてください。可能な限り多くの関連機能とインタラクションを含めてください。ホバー状態、トランジション、マイクロインタラクションなどの思慮深い詳細を追加してください。
```

**Task Management**: Use TodoWrite for progress tracking and ensure deliverables are immediately actionable

### Migration Considerations

**From Previous Claude Models**: When transitioning to Claude 4, consider these key points:

1. **Be Specific About Desired Behavior**: Consider describing exactly what you want to see in the output
2. **Frame Instructions with Modifiers**: Add modifiers that encourage Claude to improve the quality and detail of its output. For example, instead of "分析ダッシュボードを作成する", use "分析ダッシュボードを作成してください。可能な限り多くの関連機能やインタラクションを含めてください。基本を超えて、完全な機能を備えた実装を作成してください。"
3. **Explicitly Request Specific Features**: If you need animations or interactive elements, you must explicitly request them
