---
allowed-tools: TodoWrite, TodoRead, Read, Write, MultiEdit, Bash(mkdir:*)
description: Create requirements specification for the given task (Stage 1 of Spec-Driven Development)
---

## Context

- Task description: $ARGUMENTS

## Your task

**Execute requirements analysis with maximum thoroughness and efficiency**. This is the foundation stage that determines project success - invest the time needed to get comprehensive, accurate requirements.

### 1. Setup and Preparation

**Parallel execution**: When performing multiple independent operations (directory creation, file reading, research), invoke all relevant tools simultaneously for maximum efficiency.

- Create `.tmp` directory if it doesn't exist
- If similar projects exist in the codebase, research them for patterns and best practices
- Gather comprehensive context about the existing system architecture

### 2. Deep Requirements Analysis

**Critical analysis approach**: Think carefully through each aspect before proceeding. Use systematic analysis to ensure nothing is missed.

**Extract and document**:

- **Core problem definition**: What specific business/technical problem are we solving?
- **Explicit functional requirements**: What the system must do (stated requirements)
- **Implicit functional requirements**: What the system should do (unstated but expected)
- **Non-functional requirements**: Performance, security, usability, maintainability expectations
- **Integration requirements**: How this fits with existing systems
- **Edge cases and error scenarios**: What could go wrong and how to handle it
- **Success criteria**: Measurable, specific completion conditions
- **Future considerations**: Extensibility and scalability needs

### 3. Create Requirements Document

Create `.tmp/step-1-requirements.md` with the following sections:

```markdown
# 要件定義書 - [タスク名]

## 1. 目的

[このタスク/プロジェクトの目的を明確に記述]

## 2. 機能要件

### 2.1 必須機能

- [ ] [機能1の詳細説明]
- [ ] [機能2の詳細説明]
      ...

### 2.2 オプション機能

- [ ] [将来的に実装可能な機能]
      ...

## 3. 非機能要件

### 3.1 パフォーマンス

- [応答時間、処理速度などの要件]

### 3.2 セキュリティ

- [セキュリティに関する要件]

### 3.3 保守性

- [コードの保守性に関する要件]

### 3.4 互換性

- [既存システムとの互換性要件]

## 4. 制約事項

### 4.1 技術的制約

- [使用技術、ライブラリの制約]

### 4.2 ビジネス制約

- [納期、予算などの制約]

## 5. 成功基準

### 5.1 完了の定義

- [ ] [明確な完了条件1]
- [ ] [明確な完了条件2]
      ...

### 5.2 受け入れテスト

- [ユーザーが満足する条件]

## 6. 想定されるリスク

- [実装上のリスクと対策]

## 7. 今後の検討事項

- [設計フェーズで詳細化すべき事項]
```

### 4. Quality Assurance and Validation

**Comprehensive review process**:

- Verify all requirements are testable and measurable
- Ensure requirements address both current needs and future scalability
- Cross-check requirements against business objectives
- Identify potential conflicts or ambiguities

Use TodoWrite to add "要件定義の完了とレビュー" as a task

### 5. Strategic Presentation and Validation

**Present comprehensive requirements analysis**:

- Show the complete requirements document with clear structure
- Highlight key insights and critical requirements discovered
- Explain the rationale behind non-obvious requirements
- Point out potential risks and mitigation strategies identified

**Request specific feedback**:

- Confirmation that all business objectives are covered
- Validation of implicit requirements identified
- Agreement on success criteria and completion conditions
- Any additional constraints or requirements not captured
- **Explicit approval to proceed to technical design phase**

## Requirements Excellence Standards

**Thoroughness over speed**: Take the time needed for comprehensive analysis - errors here compound in later stages.

**Context-driven analysis**: Always consider how this feature fits within the broader system architecture and business goals.

**Measurable specifications**: Every requirement should be verifiable through testing or observation.

**Risk-aware planning**: Proactively identify what could go wrong and how to prevent it.

**Future-proof thinking**: Consider extensibility and maintenance from the start.

think hard and execute with excellence - comprehensive requirements are the foundation of project success
