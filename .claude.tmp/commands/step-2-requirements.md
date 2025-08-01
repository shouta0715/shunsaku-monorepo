---
allowed-tools: TodoWrite, Read, Write, MultiEdit, Bash(mkdir:*), Bash(ls:*), Bash(find:*), Bash(pnpm lint:*), Bash(pnpm format:*)
description: Step 2 機能要件・非機能要件・制約事項を詳細化した要件定義書を作成（ディレクトリ自動作成）
---

## Context

- Task description: $ARGUMENTS
- Working directory: Current app directory (auto-detected)
- Specification document: @.tmp/step-1-specification.md

## Your task

### 1. Setup and verify prerequisites

- **Execute**: `mkdir -p .tmp` to create the temporary directory if it doesn't exist
- Check that `.tmp/step-1-specification.md` exists
- If specification doesn't exist, inform user to run `/step-1-specification` first

```bash
mkdir -p .tmp
```

### 2. Analyze specification

Read and understand the specification document thoroughly

### 3. Analyze existing project assets

#### 3.1 Check existing components

- Use Glob to find all components in `src/components/`
- Read key components to understand their interfaces and usage patterns
- Document available UI components for reuse

#### 3.2 Check Tailwind configuration

- Check `postcss.config.mjs` for Tailwind CSS v4 (@tailwindcss/postcss) setup
- Read `src/app/globals.css` for Tailwind imports and custom CSS variables
- Check `@package/prettier-config/tailwind` for Tailwind-aware Prettier settings
- Note any custom theme settings, colors, or design tokens

#### 3.3 Check code quality tools configuration

- Read `eslint.config.mjs` and check `@package/eslint-config` usage:
  - `@package/eslint-config/base` - Core ESLint rules
  - `@package/eslint-config/typescript` - TypeScript-specific rules
  - `@package/eslint-config/react` - React and JSX rules
  - `@package/eslint-config/next` - Next.js specific rules
- Read `prettier.config.mjs` and check `@package/prettier-config` usage:
  - `@package/prettier-config/base` - Base Prettier settings
  - `@package/prettier-config/tailwind` - Tailwind CSS class sorting
- Read `tsconfig.json` and check `@package/typescript-config` usage:
  - `@package/typescript-config/base` - Base TypeScript config
  - `@package/typescript-config/nextjs` - Next.js specific config
- Run `pnpm lint` to verify linting setup
- Document any custom rules or exceptions

### 4. Create Requirements Document

**Use the Write tool to create `.tmp/step-2-requirements.md` with the following content:**

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

#### コンポーネント選択優先順位 (重要)

1. **第1優先**: `@package/ui` からの既存コンポーネントを使用
2. **第2優先**: `@package/ui` に無い場合のみ、新規作成
3. **第3優先**: 必要に応じて `@package/ui` に新コンポーネントを追加

#### 実装時のチェックフロー

**必須手順**:

1. `packages/ui/src/index.ts` で利用可能コンポーネントを全て確認
2. 機能的に適合するコンポーネントがあるか検証
3. 無い場合のみ `apps/web/src/` で新規作成を検討
4. 汎用性がある場合は `packages/ui/` への追加を検討

- **適切なコンポーネント選択**: 機能に最適なコンポーネントを選択すること

#### 利用可能なコンポーネント詳細

**基本要素**:

- `Text, TextLink, Strong, Code` - テキスト表示
- `Heading, Subheading` - 見出し (level 1-6)
- `Link` - リンク要素
- `Divider` - 区切り線 (soft オプション)

**レイアウト**:

- `AuthLayout` - 認証画面レイアウト
- `SidebarLayout` - サイドバー付きレイアウト
- `StackedLayout` - 縦積みレイアウト
- `Sidebar, SidebarHeader, SidebarBody, SidebarFooter, SidebarSection, SidebarItem, SidebarLabel` - サイドバー要素
- `Navbar, NavbarSection, NavbarItem, NavbarDivider, NavbarSpacer, NavbarLabel` - ナビゲーション要素

**フォーム**:

- `Input, InputGroup` - テキスト入力 (email, number, password, search, tel, text, url, date types)
- `Textarea` - 複数行テキスト入力 (resizable option)
- `Select` - 選択リスト
- `Checkbox, CheckboxGroup, CheckboxField` - チェックボックス (豊富なcolor variants)
- `Radio, RadioGroup, RadioField` - ラジオボタン (豊富なcolor variants)
- `Switch, SwitchGroup, SwitchField` - ON/OFF スイッチ (豊富なcolor variants)
- `Combobox, ComboboxOption, ComboboxLabel, ComboboxDescription` - 入力可能選択リスト
- `Listbox, ListboxOption, ListboxLabel, ListboxDescription` - 選択リスト (高機能)
- `Fieldset, Legend, FieldGroup, Field, Label, Description, ErrorMessage` - フォームグループ

**データ表示**:

- `Table, TableHead, TableBody, TableRow, TableHeader, TableCell` - テーブル表示 (bleed, dense, grid, striped options)
- `Badge, BadgeButton` - バッジ・ラベル (豊富なcolor variants)
- `Alert, AlertTitle, AlertDescription, AlertBody, AlertActions` - 通知・警告表示
- `Avatar, AvatarButton` - アバター画像 (square option, initials support)
- `DescriptionList, DescriptionTerm, DescriptionDetails` - 説明リスト

**インタラクション**:

- `Button, TouchTarget` - ボタン操作 (豊富なcolor variants, outline, plain options)
- `Dialog, DialogTitle, DialogDescription, DialogBody, DialogActions` - モーダル表示
- `Dropdown, DropdownButton, DropdownMenu, DropdownItem, DropdownSection, DropdownHeader, DropdownHeading, DropdownDivider, DropdownLabel, DropdownDescription, DropdownShortcut` - ドロップダウンメニュー
- `Pagination, PaginationPrevious, PaginationNext, PaginationList, PaginationPage, PaginationGap` - ページネーション

#### 実装指針

- **Page 実装**: `apps/web/src/app/page.tsx`を機能に応じて書き直すこと
- **TypeScript 設定**: @package/typescript-config を基盤とし、必要に応じてパスエイリアス設定
- **基本 import**: `import { Button, Table, Input, Dialog } from "@package/ui"`

#### コンポーネント作成ガイドライン

**新規コンポーネントが必要な場合**:

1. **アプリ固有**: `apps/web/src/components/` に作成
   - 特定ビジネスロジックを含むコンポーネント
   - 再利用性が低いコンポーネント
2. **汎用性あり**: `packages/ui/src/` への追加を検討
   - 他のアプリでも使える汎用的なコンポーネント
   - Headless UI ベースのコンポーネント

### 3.6 互換性

- [既存システムとの互換性要件]

## 4. 制約事項

### 4.1 技術的制約

- **Framework**: Next.js 15.4.4 + React 19.1.0
- **UI Library**: Headless UI v2.2.0 ベースの @package/ui コンポーネント
- **Styling**: Tailwind CSS v4 (@tailwindcss/postcss) ユーティリティクラスのみ
- **Package Manager**: pnpm 10.7.1 (workspace 対応)
- **Build Tool**: Turbo によるmonorepo最適化
- **必須**: ESLint (@package/eslint-config)、Prettier (@package/prettier-config)、TypeScript (@package/typescript-config) の設定に従うこと
- **必須**: `pnpm format`、`pnpm lint:fix`、`pnpm lint`（0 エラー）、`pnpm build`、`pnpm typecheck`がエラーなく実行できること

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
pnpm format     # Prettier整形
pnpm lint:fix   # ESLint自動修正
pnpm lint       # ESLintチェック
pnpm typecheck  # TypeScriptチェック

# 特定のアプリケーション/パッケージで作業する場合
cd apps/web    # webアプリケーション
pnpm dev       # アプリケーション固有のコマンド
```
````

## 開発ガイドライン

### コード品質基準

- Prettier: `pnpm format` で自動整形
- ESLint: `pnpm lint:fix` で自動修正後、`pnpm lint` でエラー 0 件
- Tailwind CSS v4: ユーティリティクラスのみ使用
- TypeScript: `pnpm typecheck` でエラー 0 件

### monorepo 構造

- `apps/web/` - Next.js 15.4.4 アプリケーション (React 19.1.0)
- `packages/ui/` - 共有 UI コンポーネントライブラリ (Headless UI ベース)
- `packages/eslint-config/` - ESLint 設定 (base, next, react, typescript)
- `packages/prettier-config/` - Prettier 設定 (base, tailwind)
- `packages/typescript-config/` - TypeScript 設定 (base, nextjs, react)

### コンポーネント

**利用可能なコンポーネント**:

- **基本**: Alert, Avatar, Badge, Button, Text, Heading, Link, Divider
- **フォーム**: Input, Textarea, Select, Checkbox, Radio, Switch, Combobox, Listbox, Fieldset
- **レイアウト**: AuthLayout, SidebarLayout, StackedLayout, Sidebar, Navbar
- **データ**: Table, DescriptionList, Pagination
- **オーバーレイ**: Dialog, Dropdown

## 機能一覧

[要件定義から抽出した機能リスト]

## ライセンス

[ライセンス情報]

````

#### 5.2 Create/Update CLAUDE.md

**First create the .claude directory if it doesn't exist:**
```bash
mkdir -p .claude
mkdir -p .claude/commands
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

- `apps/web/` - メインアプリケーション (Next.js 15.4.4 + React 19.1.0)
- `packages/ui/` - 共有 UI コンポーネントライブラリ (Headless UI v2.2.0 ベース)
- `packages/eslint-config/` - ESLint 設定パッケージ
- `packages/prettier-config/` - Prettier 設定パッケージ
- `packages/typescript-config/` - TypeScript 設定パッケージ

### 利用可能なコンポーネント

**主要コンポーネント**:
- Button: 多彩なカラーバリアントとサイズ
- Input/Textarea: フォーム入力要素
- Table: データ表示テーブル
- Dialog: モーダルダイアログ
- Sidebar/Navbar: ナビゲーション要素
- Alert/Badge: 状態表示要素

### よく使うコマンド

- `pnpm dev` - 開発サーバー起動
- `pnpm format` - Prettier整形
- `pnpm lint:fix` - ESLint自動修正
- `pnpm lint` - ESLint チェック
- `pnpm build` - ビルド
- `pnpm typecheck` - TypeScriptチェック
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
- **Consider monorepo structure: analyze whether changes affect apps/web, packages/ui, or other packages**
- **Use pnpm as the package manager for all commands and documentation**
