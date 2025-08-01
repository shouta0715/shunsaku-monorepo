---
allowed-tools: TodoWrite, Read, Write, MultiEdit, Bash(mkdir:*), Bash(ls:*), Bash(find:*)
description: Step 1 ビジネス要件・スコープ・ステークホルダーを整理した仕様書を作成
---

## Context

- Task description: $ARGUMENTS

## Your task

### 1. Detect project directory and setup

**Step 1: Determine current project context**

```bash
pwd
```

**Step 2: Apply project detection logic**

```bash
# Get absolute path and normalize
REALPATH=$(realpath .)
echo "Current absolute path: $REALPATH"
```

- If current directory path contains `/apps/[project-name]` → Set PROJECT_DIR to `apps/[project-name]`
- If current directory path contains `/packages/[package-name]` → Set PROJECT_DIR to `packages/[package-name]`
- If current directory basename is an app name under apps/ → Set PROJECT_DIR to `apps/[basename]`
- If current directory basename is a package name under packages/ → Set PROJECT_DIR to `packages/[basename]`
- If in monorepo root, analyze task description:
  - Web application features → Set PROJECT_DIR to `apps/web`
  - Shared UI components → Set PROJECT_DIR to `packages/ui`
  - If unclear, default to `apps/web`

**Step 3: Create .tmp directory**

```bash
mkdir -p $PROJECT_DIR/.tmp
```

**Step 4: Confirm project context**

Inform user: "Creating specification for project: `$PROJECT_DIR`"

### 2. Analyze the user's request

Carefully analyze the provided task description and extract:

- The high-level goals and objectives
- Stakeholder requirements
- Business context and constraints
- Success metrics and KPIs

### 3. Create Specification Document

**Use the Write tool to create `$PROJECT_DIR/.tmp/step-1-specification.md` with the following content:**

```markdown
# 仕様書 - [プロジェクト/機能名]

## 1. プロジェクト概要

### 1.1 目的と背景

[なぜこのプロジェクトが必要なのか]

### 1.2 ビジネス価値

[このプロジェクトが提供するビジネス価値]

### 1.3 スコープ

- **含まれるもの**: [プロジェクトに含まれる範囲]
- **含まれないもの**: [プロジェクトに含まれない範囲]

## 2. ステークホルダー

### 2.1 関係者

| 役割   | 名前/部署 | 責任       |
| ------ | --------- | ---------- |
| [役割] | [名前]    | [責任範囲] |

### 2.2 利用者

- **主要ユーザー**: [メインターゲット]
- **副次ユーザー**: [サブターゲット]

## 3. ビジネス要件

### 3.1 目標

- [目標 1]
- [目標 2]
- [目標 3]

### 3.2 成功指標

| 指標   | 現在値 | 目標値 | 測定方法   |
| ------ | ------ | ------ | ---------- |
| [KPI1] | [現在] | [目標] | [測定方法] |

### 3.3 制約条件

- **予算**: [予算制約]
- **期限**: [納期制約]
- **リソース**: [人的・技術的制約]

## 4. 前提条件と依存関係

### 4.1 前提条件

- [前提条件 1]
- [前提条件 2]

### 4.2 外部依存関係

- [依存システム/サービス]

## 5. リスクと対策

| リスク     | 影響度     | 発生確率   | 対策       |
| ---------- | ---------- | ---------- | ---------- |
| [リスク 1] | [高/中/低] | [高/中/低] | [対策内容] |

## 6. 次のステップ

- [ ] 仕様書レビューと承認
- [ ] 要件定義書作成 (Step 2)
```

### 4. Create TODO entry

Use TodoWrite to add "仕様書の完了とレビュー" as a task

### 5. Present to user

Show the created specification document and ask for:

- Business requirements confirmation
- Stakeholder validation
- Approval to proceed to requirements phase

## Important Notes

- Focus on business value and high-level objectives
- Avoid technical implementation details at this stage
- Ensure clear scope definition
- Consider monorepo structure for project placement
- Document should serve as foundation for all subsequent phases
