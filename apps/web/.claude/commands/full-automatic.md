---
allowed-tools: TodoWrite, TodoRead, Read, Write, MultiEdit, Bash(mkdir:*)
description: Execute complete Specification-Driven Development workflow
---

# Full Automatic Workflow

Execute the complete 4-stage Specification-Driven Development process.

## 📋 Prerequisites

- Task description: `$ARGUMENTS`
- Working directory: Current project root
- Output location: `.tmp/` directory

## 🚀 Workflow Execution

### Stage 1: Requirements Analysis

Create comprehensive requirements specification from user input.

**Actions:**

1. Create `.tmp` directory if needed
2. Analyze user requirements
3. Generate `.tmp/step-1-requirements.md`

**Success Criteria:**

- Clear functional requirements
- Non-functional requirements defined
- Success metrics established

### Stage 2: Technical Design

Transform requirements into technical architecture.

**Actions:**

1. Read requirements document
2. Design technical solution
3. Generate `.tmp/step-2-design.md`

**Success Criteria:**

- Component architecture defined
- Data flow documented
- Integration points identified

### Stage 3: Task Planning

Break down design into executable tasks.

**Actions:**

1. Read design document
2. Create task breakdown
3. Generate `.tmp/step-3-tasks.md`
4. Register tasks in TodoWrite

**Success Criteria:**

- Tasks are atomic and testable
- Dependencies clearly mapped
- Time estimates provided

### Stage 4: Implementation Ready

Prepare for implementation phase.

**Final Outputs:**

- Requirements: `.tmp/step-1-requirements.md`
- Design: `.tmp/step-2-design.md`
- Tasks: `.tmp/step-3-tasks.md`
- Todo list populated and ready

## 💡 Execution Guidelines

### Efficiency Principles

- Execute independent operations in parallel
- Minimize round trips with batch operations
- Use existing components from `@package/ui`

### Quality Standards

- Each document must be complete and actionable
- Include quality checks in task definitions
- Design for testability and maintainability

### Best Practices

- Mock external dependencies initially
- Design API contracts early
- Consider error handling from the start
- Plan for accessibility and i18n

## 🎯 Command Usage

```bash
/full-automatic "Create a user authentication system with email/password login"
```

This will generate:

1. Requirements document with auth specifications
2. Technical design with component architecture
3. Task list with implementation steps
4. Populated todo list ready for development
