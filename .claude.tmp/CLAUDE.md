# Guidelines

This document defines the project's rules, objectives, and progress management methods. Please proceed with the project according to the following content.

## Top-Level Rules

- To maximize efficiency, **if you need to execute multiple independent processes, invoke those tools concurrently, not sequentially**.
- **You must think exclusively in English**. However, you are required to **respond in Japanese**.
- To understand how to use a library, **always use the Contex7 MCP** to retrieve the latest information.
- For temporary notes for design, create a markdown in the project's `.tmp` directory (e.g., `.tmp/` relative to current app) and save it.
- **After using Write or Edit tools, ALWAYS verify the actual file contents using the Read tool**, regardless of what the system-reminder says. The system-reminder may incorrectly show "(no content)" even when the file has been successfully written.
- Please respond critically and without pandering to my opinions, but please don't be forceful in your criticism.

## Project Structure

This is a monorepo project with the following structure:

- `apps/web/` - Next.js 15.4.4 main application (React 19.1.0)
- `packages/ui/` - Shared UI component library (Headless UI v2.2.0 based)
- `packages/eslint-config/` - Shared ESLint configurations (base, next, react, typescript)
- `packages/prettier-config/` - Shared Prettier configurations (base, tailwind)
- `packages/typescript-config/` - Shared TypeScript configurations (base, nextjs, react)

**Package Manager**: Use `pnpm 10.7.1` for all dependency management and script execution.
**Build Tool**: Turbo for monorepo build orchestration.

**Design Documents**: Each application maintains its design documents in its own `.tmp` directory:

- `apps/web/.tmp/` - Design documents for web application
- Pattern: `.tmp/step-*-*.md` relative to current app directory
- All commands operate on current working directory's `.tmp/` folder

## Programming Rules

- Avoid hard-coding values unless absolutely necessary.
- Do not use `any` or `unknown` types in TypeScript.
- You must not use a TypeScript `class` unless it is absolutely necessary (e.g., extending the `Error` class for custom error handling that requires `instanceof` checks).

## Code Quality Standards

### Required Tools and Standards

- **ESLint**: All code must pass `pnpm lint` with 0 errors (use `pnpm lint:fix` for auto-fixing)
- **Prettier**: All files must be formatted with `pnpm format`
- **Tailwind CSS v4**: Use only Tailwind utility classes for styling, configured with @tailwindcss/postcss
- **TypeScript**: All code must pass `pnpm typecheck` without errors
- **Build**: All code must pass `pnpm build` without errors

### Quality Check Process

For every code change:

1. Write code following existing patterns
2. Use only Tailwind CSS v4 utility classes for styling
3. Run `pnpm format` to format with Prettier
4. Run `pnpm lint:fix` to auto-fix ESLint errors
5. Run `pnpm lint` and ensure 0 errors
6. Run `pnpm typecheck` to verify TypeScript
7. Run `pnpm build` to verify build
8. Only commit when ALL checks pass

### Component Usage

#### Available Shared UI Components (@package/ui)

**ベース**: Headless UI v2.2.0 + Tailwind CSS v4 スタイリング

**Basic Elements**:

- **Button, TouchTarget**: 20+ color variants + outline/plain modes
- **Text, TextLink, Strong, Code**: テキスト表示コンポーネント
- **Heading, Subheading**: 見出し (level 1-6 対応)
- **Link**: Headless UI DataInteractive ベース
- **Divider**: 区切り線 (soft option)

**Forms**:

- **Input, InputGroup**: テキスト入力 (email, number, password, search, tel, text, url, date types)
- **Textarea**: 複数行入力 (resizable option)
- **Select**: シンプル選択リスト
- **Checkbox, CheckboxGroup, CheckboxField**: 20+ color variants + indeterminate
- **Radio, RadioGroup, RadioField**: 20+ color variants
- **Switch, SwitchGroup, SwitchField**: 20+ color variants
- **Combobox, ComboboxOption**: 入力可能選択 + filtering + virtual scrolling
- **Listbox, ListboxOption**: 高機能選択リスト + virtual scrolling
- **Fieldset, Legend, FieldGroup, Field, Label, Description, ErrorMessage**: フォーム構造化

**Data Display**:

- **Table, TableHead, TableBody, TableRow, TableHeader, TableCell**: bleed/dense/grid/striped options
- **Badge, BadgeButton**: 20+ color variants + TouchTarget
- **Avatar, AvatarButton**: src/initials/square support + TouchTarget
- **Alert, AlertTitle, AlertDescription, AlertBody, AlertActions**: モーダル通知 (Dialogベース)
- **DescriptionList, DescriptionTerm, DescriptionDetails**: キーバリュー表示

**Layout**:

- **AuthLayout**: 認証画面用センターレイアウト
- **SidebarLayout**: サイドバー付きレイアウト (mobile responsive)
- **StackedLayout**: 縦積みレイアウト (mobile responsive)
- **Sidebar**: サイドバーナビゲーション + Header/Body/Footer/Section/Item/Heading/Label/Divider/Spacer
- **Navbar**: ナビゲーションバー + Section/Item/Label/Divider/Spacer

**Interaction**:

- **Dialog, DialogTitle, DialogDescription, DialogBody, DialogActions**: モーダル (backdrop blur)
- **Dropdown**: メニューシステム + Button/Menu/Item/Section/Header/Heading/Divider/Label/Description/Shortcut
- **Pagination**: ページネーション + Previous/Next/List/Page/Gap

```typescript
// 基本的なimportパターン
import {
  Button,
  Text,
  Heading,
  Input,
  Table,
  Dialog,
  Badge,
} from "@package/ui";
```

#### Component Selection Guidelines

**フォーム実装時**:

- 基本入力: `Input` (text, email, password等), `Textarea` (複数行)
- 選択操作: `Select` (シンプル), `Listbox` (高機能), `Combobox` (検索可能)
- オプション: `Checkbox` (複数選択), `Radio` (単一選択), `Switch` (ON/OFF)
- 構造化: `Fieldset` + `Field` + `Label` + `Description` + `ErrorMessage`

**レイアウト選択**:

- **認証画面**: `AuthLayout` (センターデザイン)
- **管理画面**: `SidebarLayout` + `Sidebar` (サイドナビ)
- **シンプル画面**: `StackedLayout` + `Navbar` (トップナビ)

**データ表示時**:

- **リスト表示**: `Table` (bleed/dense/grid/striped)
- **ステータス**: `Badge` (20+ colors), `Alert` (モーダル)
- **ユーザー**: `Avatar` (src/initials/square)
- **キーバリュー**: `DescriptionList`

**インタラクション**:

- **アクション**: `Button` (20+ colors + outline/plain)
- **メニュー**: `Dropdown` + subcomponents
- **モーダル**: `Dialog` + subcomponents
- **ナビゲーション**: `Pagination` + subcomponents

#### Implementation Rules - Component Priority (必須遵守)

**絶対優先順位**:

1. **第1優先**: `@package/ui` の既存コンポーネントを使用
2. **第2優先**: `@package/ui` に無い場合のみ新規作成
3. **禁止**: 既存コンポーネントを確認せずに新規作成

**必須手順**:

- **Always check first**: `packages/ui/src/index.ts` で全28コンポーネントカテゴリを確認
- **Import from @package/ui**: Use `import { Button, Table } from "@package/ui"`
- **Choose wisely**: 機能的に近いコンポーネントがあれば必ず使用
- **Utilize options**: 20+ color variants や各種 options でカスタマイズ
- **App-specific only when necessary**: `apps/web/src/` は最終手段のみ
- **Consider sharing**: 汎用性がある場合は `packages/ui/` への追加を検討
- **TypeScript configuration**: Use @package/typescript-config as base, extend as needed

### Page Implementation Standards

- **Must rewrite page.tsx**: Always rewrite `apps/web/src/app/page.tsx` according to feature requirements
- **Mandatory component check**: `packages/ui/src/index.ts` を最初に確認してから実装開始
- **Use shared components FIRST**: `@package/ui` components を絶対優先で使用
- **Only when unavailable**: `@package/ui` に無い場合のみ新規コンポーネント作成
- **Follow ESLint config**: Use `@package/eslint-config` settings (base, next, react, typescript)
- **Follow Prettier config**: Use `@package/prettier-config` settings (base, tailwind)
- **Follow TypeScript config**: Use `@package/typescript-config` settings (base, nextjs, react)

## Development Style - Specification-Driven Development

### Overview

When receiving development tasks, please follow the 5-stage workflow below. This ensures comprehensive specification, structured design, and efficient implementation.

### 5-Stage Workflow

#### Step 1: 仕様書作成

- Analyze user requests and extract business requirements
- Work in current app directory (auto-detected)
- Create `.tmp` directory in current location
- Document specification in `.tmp/step-1-specification.md` relative to current directory
- Use `/step-1-specification` command for detailed template
- **Must include**: Business requirements, stakeholders, scope definition

#### Step 2: 要件定義書作成

- Create detailed requirements based on specification
- Analyze existing components in `packages/ui/src/` and current app's `src/`
- Check code quality tools configuration (ESLint, Prettier, TypeScript, Tailwind CSS v4)
- Document requirements in `.tmp/step-2-requirements.md` relative to current directory
- Use `/step-2-requirements` command for detailed template
- **Must include**: Functional/non-functional requirements and code quality standards

#### Step 3: システム設計作成

- Create system architecture and technical design
- Analyze existing project assets and monorepo structure
- Document system design in `.tmp/step-3-system-design.md` relative to current directory
- Use `/step-3-system-design` command for detailed template
- **Must specify**: Data models, APIs, and system architecture

#### Step 4: UI 設計作成

- Create UI/UX design and component architecture
- Analyze existing UI assets and Tailwind configuration in current app
- Document UI design in `.tmp/step-4-ui-design.md` relative to current directory
- Use `/step-4-ui-design` command for detailed template
- **Must specify**: Component reuse strategy and styling guidelines

#### Step 5: タスク分解

- Break down design into implementable tasks
- Include code quality checks for each task
- Document in `.tmp/step-5-task-division.md` relative to current directory
- Use `/step-5-task-division` command for detailed template
- Manage major tasks with TodoWrite tool
- **Must include**: `pnpm lint` and `pnpm build` checks for each task

#### Stage 6: Implementation

- Implement according to task list
- For each task:
  - Update task to in_progress using TodoWrite
  - Execute implementation following monorepo structure
  - Run `pnpm lint` and fix all errors
  - Run `pnpm build` to verify
  - Ensure Tailwind utility classes only
  - Update task to completed using TodoWrite

#### Stage 7: GitHub Pull Request Creation

- Execute `/github-pull-request` command after implementation completion
- Automatically generates:
  - Appropriate branch name based on implementation type
  - Structured commits with conventional commit messages
  - Comprehensive PR title and description
  - Quality assurance checklist
  - Technical change summary

### Workflow Commands

- `/full-automatic` - Start the complete 5-stage specification-driven development workflow
- `/step-1-specification` - Execute Step 1: 仕様書作成 only
- `/step-2-requirements` - Execute Step 2: 要件定義書作成 only (requires specification)
- `/step-3-system-design` - Execute Step 3: システム設計作成 only (requires requirements)
- `/step-4-ui-design` - Execute Step 4: デザイン設計作成 only (requires system design)
- `/step-5-task-division` - Execute Step 5: タスク分解 only (requires all designs)
- `/github-pull-request` - Execute GitHub PR creation with proper branching, commits, and description (requires completed implementation)

### Important Notes

- Each stage depends on the deliverables of the previous stage
- Please obtain user confirmation before proceeding to the next stage
- Always use this workflow for complex tasks or new feature development
- Simple fixes or clear bug fixes can be implemented directly
- **Monorepo considerations**:
  - Shared components belong in `packages/ui/src/`
  - App-specific features belong in `apps/web/src/`
  - Always check existing components before creating new ones
  - Use workspace:\* protocol for internal dependencies
- **Quality is non-negotiable**: All code must pass ESLint, Prettier, TypeScript, and build checks
- **Use pnpm 10.7.1 exclusively** for all package management and script execution
- **Tailwind CSS v4**: Use @tailwindcss/postcss plugin configuration

## Package Configurations

### ESLint Configs (@package/eslint-config)

- `base`: Core rules + turbo plugin + prettier integration
- `typescript`: TypeScript strict rules + import sorting + unused imports
- `react`: React + JSX + a11y rules + prop sorting
- `next`: Next.js specific rules + core web vitals

### Prettier Configs (@package/prettier-config)

- `base`: Core formatting (LF, 80 chars, trailing commas, double quotes)
- `tailwind`: Tailwind class sorting with prettier-plugin-tailwindcss

### TypeScript Configs (@package/typescript-config)

- `base`: Strict TypeScript + ES2022 target + NodeNext modules
- `nextjs`: Next.js optimized (Bundler resolution, JSX preserve, noEmit)
- `react`: React optimized configuration

## よく使うコマンド

### Development Commands

- `pnpm dev` - 開発サーバー起動
- `pnpm format` - Prettier整形 (@package/prettier-config/tailwind)
- `pnpm lint:fix` - ESLint自動修正 (@package/eslint-config/next)
- `pnpm lint` - ESLint チェック (0 errors required)
- `pnpm typecheck` - TypeScriptチェック (@package/typescript-config/nextjs)
- `pnpm build` - Next.js ビルド検証

### Monorepo Commands

- `pnpm install` (root) - 全パッケージ依存関係インストール
- `pnpm build` (root) - Turbo最適化ビルド
- `pnpm lint` (root) - 全パッケージlintチェック
- `cd packages/ui && pnpm build` - UIコンポーネントビルド

### Quality Gates (各タスク完了時必須)

```bash
pnpm format && pnpm lint:fix && pnpm lint && pnpm typecheck && pnpm build
```

## Component Color System

**20+ variants across components**:
`"red" | "orange" | "amber" | "yellow" | "lime" | "green" | "emerald" | "teal" | "cyan" | "sky" | "blue" | "indigo" | "violet" | "purple" | "fuchsia" | "pink" | "rose" | "zinc" | "dark/zinc" | "light" | "dark/white" | "dark" | "white"`
