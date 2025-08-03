---
allowed-tools: TodoWrite, TodoRead, Read, Write, MultiEdit, Bash(mkdir:*)
description: Start Specification-Driven Development workflow for the given task
---

## Context

- Task requirements: $ARGUMENTS

## Your task

Execute the complete Specification-Driven Development workflow:

### 1. Setup

- Create `.tmp` directory if it doesn't exist

### 2. Stage 1: Requirements Analysis

Execute `/step-1-requirements` command to create detailed requirements specification.

**Output**: `.tmp/step-1-requirements.md`

### 3. Stage 2: Technical Design

Execute `/step-2-design` command to create technical design based on requirements.

**Output**: `.tmp/step-2-design.md`

### 4. Stage 3: Implementation Planning

Execute `/step-3-tasks` command to break down design into implementable tasks.

**Output**: `.tmp/step-3-tasks.md`

## Execution Guidelines

- Use parallel tool calls for independent operations
- Execute efficiently with minimal dependencies
- Prioritize @package/ui components in all design and implementation phases
- Implement mock data strategy for features requiring external data sources
- Ensure quality assurance (lint, format, typecheck, build) is integrated into each stage
