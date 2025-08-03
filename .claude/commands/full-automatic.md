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

**Provide requirements summary**

### 3. Stage 2: Technical Design

Execute `/step-2-design` command to create technical design based on requirements.

**Output**: `.tmp/step-2-design.md`

**Provide design summary**

### 4. Stage 3: Implementation Planning

Execute `/step-3-tasks` command to break down design into implementable tasks.

**Output**: `.tmp/step-3-tasks.md`

**Provide task breakdown summary**

### 5. Final Summary

Provide a detailed final summary including:

- Complete deliverables created and their locations
- Key architectural decisions and rationale
- Implementation readiness assessment
- Recommended next steps for immediate development start
- Summary of the entire workflow completion

## Execution Guidelines

- Use parallel tool calls for independent operations
- Provide clear summaries between stages
- Execute efficiently with minimal dependencies
