---
allowed-tools: TodoWrite, TodoRead, Read, Write, MultiEdit
description: Break down design into implementable tasks (Stage 3 of Spec-Driven Development)
---

## Context

- Requirements: @.tmp/step-1-requirements.md
- Design document: @.tmp/step-2-design.md

## Your task

**Execute optimal task breakdown for maximum implementation efficiency**. Transform technical design into manageable, parallel-executable implementation units.

### 1. Prerequisites and Comprehensive Analysis

**Parallel execution**: When verifying prerequisites and gathering context, invoke multiple tools simultaneously for maximum efficiency.

- Check that both `.tmp/step-1-requirements.md` and `.tmp/step-2-design.md` exist
- If not, inform user to complete previous stages first
- Research existing codebase for similar implementation patterns
- Identify potential parallel execution opportunities in the implementation
- Analyze dependencies and critical path for optimal sequencing

### 2. Strategic Design Analysis

**Deep analysis approach**: Use thinking capabilities to thoroughly understand design implications before creating tasks.

**Comprehensive task identification process**:

- Read and deeply understand the design document
- Map design components to implementation tasks
- Identify task dependencies and critical path
- Consider parallel execution opportunities
- Plan for testing integration throughout development
- Account for documentation and quality assurance tasks

### 3. Optimized Task Breakdown

Create `.tmp/step-3-tasks.md` with the following structure:

```markdown
# タスクリスト - [機能/改善名]

## 概要

- 総タスク数: [数]
- 推定作業時間: [時間/日数]
- 優先度: [高/中/低]

## タスク一覧

### Phase 1: 準備・調査

#### Task 1.1: [タスク名]

- [ ] [具体的な作業項目1]
- [ ] [具体的な作業項目2]
- [ ] [具体的な作業項目3]
- **完了条件**: [明確な完了条件]
- **依存**: [依存するタスク または なし]
- **推定時間**: [時間]

#### Task 1.2: [タスク名]

- [ ] [具体的な作業項目1]
- [ ] [具体的な作業項目2]
- **完了条件**: [明確な完了条件]
- **依存**: [依存するタスク]
- **推定時間**: [時間]

### Phase 2: 実装

#### Task 2.1: [機能名]の実装

- [ ] [実装項目1]
- [ ] [実装項目2]
- [ ] [実装項目3]
- **完了条件**: [明確な完了条件]
- **依存**: [依存するタスク]
- **推定時間**: [時間]

#### Task 2.2: [機能名]の実装

- [ ] [実装項目1]
- [ ] [実装項目2]
- **完了条件**: [明確な完了条件]
- **依存**: [依存するタスク]
- **推定時間**: [時間]

### Phase 3: 検証・テスト

#### Task 3.1: [検証項目]

- [ ] [テスト項目1]
- [ ] [テスト項目2]
- [ ] [テスト項目3]
- **完了条件**: [明確な完了条件]
- **依存**: [依存するタスク]
- **推定時間**: [時間]

### Phase 4: 仕上げ

#### Task 4.1: [仕上げ項目]

- [ ] [仕上げ作業1]
- [ ] [仕上げ作業2]
- **完了条件**: [明確な完了条件]
- **依存**: [依存するタスク]
- **推定時間**: [時間]

## 実装順序

1. Phase 1から順次実行
2. 並行実行可能なタスクは並行で実行
3. 依存関係を考慮した実装順序

## リスクと対策

- [特定されたリスク]: [対策方法]

## 注意事項

- 各タスクはコミット単位で完結させる
- タスク完了時は必要に応じて品質チェックを実行
- 不明点は実装前に確認する
```

### 4. Task Registration and Management Optimization

**Strategic task management**:

- Extract main tasks (Phase level or critical tasks) for TodoWrite registration
- Prioritize tasks based on dependencies and business value
- Identify tasks that can be executed in parallel for maximum efficiency
- Set realistic time estimates based on complexity and dependencies

Register key tasks using TodoWrite tool with appropriate priorities and dependencies

### 5. Implementation Excellence Guide

Add a comprehensive implementation guide at the end of tasks.md:

```markdown
## 実装開始ガイド

### 効率的な実装戦略

1. **並列実行の最大化**: 依存関係のないタスクは同時に実行する
2. **段階的な検証**: 各フェーズ完了時に品質チェックを実行
3. **継続的テスト**: 実装と並行してテストを実行
4. **プロアクティブなコミュニケーション**: 問題を早期に特定し報告

### タスク管理プロトコル

1. このタスクリストに従って戦略的に実装を進める
2. 各タスクの開始時にTodoWriteでin_progressに更新
3. 完了時はcompletedに更新（検証済みの状態で）
4. 並列実行可能なタスクは同時に開始
5. 問題発生時は速やかに報告し、影響範囲を評価

### 品質保証基準

- 各タスクは完全にテスト済みの状態で完了
- コードレビューとリファクタリングを継続的に実行
- パフォーマンスとセキュリティを考慮した実装
```

### 6. Strategic Presentation and Validation

**Present comprehensive implementation strategy**:

- Show the complete task breakdown with clear execution plan
- Explain the optimal implementation order and parallel execution opportunities
- Highlight critical paths and potential bottlenecks
- Demonstrate how tasks align with requirements and design
- Point out risk mitigation strategies and quality assurance measures

**Request strategic validation**:

- Confirmation of task breakdown completeness and accuracy
- Validation of implementation order and parallel execution plan
- Agreement on time estimates and resource allocation
- Review of risk mitigation and quality assurance approach
- **Explicit approval to begin implementation with this plan**

## Implementation Excellence Standards

**Efficiency Optimization**: Maximize parallel execution and minimize sequential dependencies.

**Quality Integration**: Build testing and quality assurance into every task, not as an afterthought.

**Commit-sized Tasks**: Each task should be completable in 1-4 hours with clear, verifiable outcomes.

**Proactive Communication**: Identify and communicate issues early to prevent cascade effects.

**Continuous Validation**: Verify each task meets requirements and maintains system integrity.

**Documentation Excellence**: Maintain clear, actionable documentation throughout implementation.

think hard and execute with excellence - maximize implementation efficiency and quality
