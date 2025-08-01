---
allowed-tools: TodoWrite, Read, Write, MultiEdit, Bash(mkdir:*), Bash(ls:*), Bash(find:*)
description: Step 2 機能要件・非機能要件・制約事項を詳細化した要件定義書を作成
---

## Context

- Task description: $ARGUMENTS
- Specification document: @.tmp/step-1-specification.md

## Your task

### 1. Verify prerequisites

- Check that `.tmp/step-1-specification.md` exists
- If not, inform user to run `/step-1-specification` first

### 2. Analyze specification

Read and understand the specification document thoroughly

### 3. Analyze existing project assets

#### 3.1 Check existing components

- Use Glob to find all components in `src/components/`
- Read key components to understand their interfaces and usage patterns
- Document available UI components for reuse

#### 3.2 Check Tailwind configuration

- Look for `tailwind.config.ts` or `tailwind.config.js`
- If not found, check for Tailwind CSS v4 setup in `app/globals.css`
- Note any custom theme settings, colors, or design tokens

#### 3.3 Check code quality tools configuration

- Read `eslint.config.mjs` to understand linting rules
- Read `prettier.config.mjs` to understand formatting rules
- Run `npm run lint` to verify linting setup
- Document any custom rules or exceptions

### 4. Create Requirements Document

Create `.tmp/step-2-requirements.md` with the following sections:

```markdown
# 要件定義書 - [タスク名]

## 1. 目的

[このタスク/プロジェクトの目的を明確に記述]

## 2. 機能要件

### 2.1 必須機能

- [ ] [機能 1 の詳細説明]
- [ ] [機能 2 の詳細説明]
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

### 3.4 コード品質基準

- **ESLint**: `@package/eslint-config`の設定に 100%準拠すること
- **Prettier**: `@package/prettier-config`を使用してフォーマットされていること
- **Tailwind CSS**: Tailwind のユーティリティクラスのみを使用し、カスタム CSS は最小限に抑えること

### 3.5 コンポーネント使用基準

- **共有コンポーネント**: `@package/ui`からの import を優先使用
- **適切なコンポーネント選択**: 機能に最適なコンポーネントを選択すること
  - レイアウト: AuthLayout, SidebarLayout, StackedLayout から選択
  - フォーム: Input, Textarea, Select, Checkbox, Radio, Switch, Fieldset から適切に選択
  - データ表示: Table, Badge, Alert, Avatar, DescriptionList から選択
  - インタラクション: Button (17 色 variants), Dialog, Dropdown, Pagination から選択
- **Page 実装**: `apps/web/src/app/page.tsx`を機能に応じて書き直すこと
- **TypeScript 設定**: tsconfig.json で`@ui`エイリアスの設定を推奨

### 3.6 互換性

- [既存システムとの互換性要件]

## 4. 制約事項

### 4.1 技術的制約

- [使用技術、ライブラリの制約]
- **必須**: ESLint、Prettier、Tailwind CSS の設定に従うこと
- **必須**: `pnpm lint`と`pnpm build`がエラーなく実行できること

### 4.2 ビジネス制約

- [納期、予算などの制約]

## 5. 成功基準

### 5.1 完了の定義

- [ ] [明確な完了条件 1]
- [ ] [明確な完了条件 2]
      ...

### 5.2 受け入れテスト

- [ユーザーが満足する条件]

## 6. 想定されるリスク

- [実装上のリスクと対策]

## 7. 今後の検討事項

- [設計フェーズで詳細化すべき事項]
```

### 4. Create TODO entry

Use TodoWrite to add "要件定義の完了とレビュー" as a task

### 5. Create project documentation

#### 5.1 Create/Update README.md

**Use the Write tool to create or update `README.md` with the following content:**

````markdown
# [プロジェクト名]

## 概要

[要件定義から抽出したプロジェクトの目的と概要]

## 技術スタック

- フレームワーク: [検出したフレームワーク]
- 言語: [使用言語とバージョン]
- スタイリング: Tailwind CSS v4
- 品質管理: ESLint, Prettier
- [その他の主要ライブラリ]

## セットアップ

```bash
# 依存関係のインストール (monorepoルートで実行)
pnpm install

# 開発サーバーの起動
pnpm dev

# ビルド
pnpm build

# 品質チェック
pnpm lint

# 特定のアプリケーション/パッケージで作業する場合
cd apps/**  # または該当するパッケージ
pnpm dev    # アプリケーション固有のコマンド
```
````

## 開発ガイドライン

### コード品質基準

- ESLint: `pnpm lint` でエラー 0 件
- Prettier: 全コードがフォーマット済み
- Tailwind CSS: ユーティリティクラスのみ使用

### monorepo 構造

- `apps/**/` - Next.js アプリケーション
- `packages/ui/` - 共有 UI コンポーネント
- `packages/eslint-config/` - ESLint 設定
- `packages/prettier-config/` - Prettier 設定
- `packages/typescript-config/` - TypeScript 設定

### コンポーネント

[../../packages/ui/src/内の利用可能なコンポーネント一覧]

## 機能一覧

[要件定義から抽出した機能リスト]

## ライセンス

[ライセンス情報]

````

#### 5.2 Create/Update CLAUDE.md

**First create the .claude directory if it doesn't exist:**
```bash
mkdir -p .claude
```

**Then use the Write tool to create or update `.claude/CLAUDE.md` with the following content:**

```markdown
# プロジェクトガイドライン

## プロジェクト概要

[要件定義からの概要]

## 開発ルール

### 必須事項

- ESLint 設定に 100%準拠
- Prettier でフォーマット
- Tailwind CSS ユーティリティクラスのみ使用
- 既存コンポーネントを最大限活用

### コーディング規約

- TypeScript の any タイプ禁止
- ハードコーディング最小化
- [プロジェクト固有のルール]

### ワークフロー

1. 仕様書作成 → 要件定義 → システム設計 → デザイン設計 → タスク分解 → 実装
2. 各タスク完了時に品質チェック実行
3. コミット前に lint/build 確認

### monorepo 構造

- `apps/**/` - メインアプリケーション (Next.js)
- `packages/ui/` - 共有 UI コンポーネントライブラリ
- `packages/*-config/` - 共有設定パッケージ

### 利用可能なコンポーネント

[../../packages/ui/src/の一覧と用途]

### よく使うコマンド

- `pnpm dev` - 開発サーバー起動
- `pnpm lint` - ESLint チェック
- `pnpm build` - ビルド
````

### 6. Present to user

Show the created requirements document and ask for:

- Confirmation of understanding
- Any missing requirements
- Approval to proceed to system design phase
- Review of generated README.md and CLAUDE.md

## Important Notes

- Be thorough in identifying implicit requirements
- Consider both current needs and future extensibility
- Use clear, unambiguous language
- Include measurable success criteria
- **MUST include code quality requirements (ESLint, Prettier, Tailwind CSS)**
- **All code must pass linting and formatting checks**
- **MUST generate/update README.md and CLAUDE.md based on requirements**
- **Documentation should serve as project memory for future Claude Code sessions**
- **Consider monorepo structure: analyze whether changes affect current app, ../../packages/ui, or other components**
- **Use pnpm as the package manager for all commands and documentation**
