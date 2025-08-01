---
allowed-tools: TodoWrite, Read, Write, MultiEdit, Bash(mkdir:*)
description: Step 4 UI/UX設計とコンポーネントアーキテクチャを作成（ディレクトリ自動作成）
---

## Context

- Task description: $ARGUMENTS
- Working directory: Current app directory (auto-detected)
- Specification document: @.tmp/step-1-specification.md
- Requirements document: @.tmp/step-2-requirements.md
- System design document: @.tmp/step-3-system-design.md

## Your task

### 1. Setup and verify prerequisites

- **Execute**: `mkdir -p .tmp` to create the temporary directory if it doesn't exist
- Check that `.tmp/step-1-specification.md` exists
- Check that `.tmp/step-2-requirements.md` exists
- Check that `.tmp/step-3-system-design.md` exists
- If any missing, inform user to complete previous steps first

```bash
mkdir -p .tmp
```

### 2. Analyze requirements and system design

Read and understand all previous documents to align UI design with system architecture

### 3. Analyze existing UI assets

#### 3.1 Check existing components

- Use file_search to find components in `packages/ui/src/`
- Use read_file to read key components to understand their interfaces and usage patterns
- Document available UI components for reuse in monorepo structure

#### 3.2 Check Tailwind configuration

- Look for `tailwind.config.ts` or `tailwind.config.js` in current app
- Check for Tailwind CSS v4 setup in `src/app/globals.css`
- Note any custom theme settings, colors, or design tokens

### 4. Create UI Design Document

**Use the Write tool to create `.tmp/step-4-ui-design.md` with the following content:**

````markdown
# UI/UX 設計書 - [タスク名]

## 1. デザインシステム

### 1.1 デザイン原則

- [デザイン原則 1]
- [デザイン原則 2]
- [デザイン原則 3]

### 1.2 ブランドガイドライン

- カラーパレット
- タイポグラフィ
- アイコンスタイル

### 1.3 Tailwind CSS v4 設定

```javascript
// postcss.config.mjs - Tailwind CSS v4 構成
const config = {
  plugins: ["@tailwindcss/postcss"],
};

export default config;
```

```css
/* src/app/globals.css - Tailwind CSS v4 スタイル */
@import "tailwindcss";

/* カスタムCSS変数やテーマ設定 */
:root {
  --color-primary: theme(colors.blue.500);
  --color-secondary: theme(colors.gray.500);
}
```
````

## 2. コンポーネント設計

### 2.1 コンポーネント選択の絶対優先順位 (重要)

**基本方針**: `@package/ui` を最優先で使用し、無い場合のみ新規作成

#### 必須チェックフロー

1. **第1優先**: `@package/ui` の既存コンポーネント
   - 必ず `packages/ui/src/index.ts` で全28コンポーネントカテゴリを確認
   - 機能的に近いコンポーネントがあれば必ず使用
   - 20+ color variants や各種 options を活用してカスタマイズ

2. **第2優先**: 既存コンポーネントの組み合わせ
   - 複数の `@package/ui` コンポーネントを組み合わせ
   - Composition pattern で複雑なUIを構築

3. **第3優先**: 新規コンポーネント作成 (最終手段のみ)
   - `@package/ui` で実現不可能な場合のみ
   - アプリ固有: `apps/web/src/components/`
   - 汎用的: `packages/ui/src/` への追加を検討

### 2.2 既存コンポーネントの活用

**実装前の必須確認事項**:

- `packages/ui/src/index.ts` の全コンポーネントを把握済みか？
- 機能要求に対して `@package/ui` で実現可能か検討済みか？
- 新規作成は本当に必要最小限か？

#### 利用可能な共有 UI コンポーネント (@package/ui)

##### 基本要素 (Basic Elements)

| コンポーネント | 用途 & 特徴                                                                 | Props 例                                                                                  |
| -------------- | --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **Button**     | ボタン操作<br/>20+ color variants + outline/plain modes<br/>TouchTarget内蔵 | `color?: "red" \| "blue" \| "green" \| ...`<br/>`outline?: boolean`<br/>`plain?: boolean` |
| **Text**       | テキスト表示コンポーネント                                                  | `<Text>\|パラグラフテキスト</Text>`                                                       |
| **TextLink**   | リンク付きテキスト                                                          | `href: string` (Linkコンポーネントベース)                                                 |
| **Strong**     | 太字テキスト                                                                | `<Strong>強調テキスト</Strong>`                                                           |
| **Code**       | インラインコード                                                            | `<Code>console.log()</Code>`                                                              |
| **Heading**    | 見出し表示 (level 1-6)                                                      | `level?: 1 \| 2 \| 3 \| 4 \| 5 \| 6`                                                      |
| **Subheading** | サブ見出し (level 2 default)                                                | `level?: 1 \| 2 \| 3 \| 4 \| 5 \| 6`                                                      |
| **Link**       | リンク要素 (Headless UI DataInteractive)                                    | `href: string` + `<a>` props                                                              |
| **Divider**    | 区切り線                                                                    | `soft?: boolean` (デフォルト: false)                                                      |

```typescript
// 基本要素のimport例
import {
  Button,
  TouchTarget,
  Text,
  TextLink,
  Strong,
  Code,
  Heading,
  Subheading,
  Link,
  Divider,
} from "@package/ui";
```

##### フォーム (Form Components)

| コンポーネント     | 用途 & 特徴                                                                  | Props 例                                                                                                    |
| ------------------ | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Input**          | テキスト入力<br/>email, number, password, search, tel, text, url, date types | `type?: "email" \| "number" \| "password" \| ...`<br/>`className?: string`                                  |
| **InputGroup**     | アイコン付き入力フィールド                                                   | iconをdata-slot="icon"で配置                                                                                |
| **Textarea**       | 複数行テキスト入力<br/>resizable option                                      | `resizable?: boolean` (デフォルト: true)                                                                    |
| **Select**         | シンプル選択リスト<br/>multiple option                                       | `multiple?: boolean`                                                                                        |
| **Checkbox**       | チェックボックス<br/>20+ color variants<br/>indeterminate support            | `color?: "red" \| "blue" \| "green" \| ...`<br/>`indeterminate?: boolean`                                   |
| **CheckboxGroup**  | チェックボックスグループ                                                     | 複数のCheckboxFieldを包含                                                                                   |
| **CheckboxField**  | Field layout for checkbox                                                    | grid layoutでlabelとcontrolを配置                                                                           |
| **Radio**          | ラジオボタン<br/>20+ color variants                                          | `color?: "red" \| "blue" \| "green" \| ...`                                                                 |
| **RadioGroup**     | ラジオボタングループ                                                         | 複数のRadioFieldを包含                                                                                      |
| **RadioField**     | Field layout for radio                                                       | grid layoutでlabelとcontrolを配置                                                                           |
| **Switch**         | ON/OFF スイッチ<br/>20+ color variants                                       | `color?: "red" \| "blue" \| "green" \| ...`                                                                 |
| **SwitchGroup**    | スイッチグループ                                                             | 複数のSwitchFieldを包含                                                                                     |
| **SwitchField**    | Field layout for switch                                                      | grid layoutでlabelとcontrolを配置                                                                           |
| **Combobox**       | 入力可能選択リスト<br/>filtering support<br/>virtual scrolling               | `options: T[]`<br/>`displayValue: (value: T) => string`<br/>`filter?: (value: T, query: string) => boolean` |
| **ComboboxOption** | Comboboxの選択項目                                                           | カスタムchildrenでレンダリング                                                                              |
| **Listbox**        | 選択リスト (高機能)<br/>virtual scrolling                                    | プレースホルダーとラベル対応                                                                                |
| **ListboxOption**  | Listboxの選択項目                                                            | カスタムchildrenでレンダリング                                                                              |
| **Fieldset**       | フォームグループ                                                             | Headless UI Fieldsetベース                                                                                  |
| **Legend**         | Fieldsetのタイトル                                                           | `<Legend>フォームタイトル</Legend>`                                                                         |
| **FieldGroup**     | フィールドコンテナ                                                           | `space-y-8` styling                                                                                         |
| **Field**          | 個別フィールド                                                               | labelとcontrolの関係性管理                                                                                  |
| **Label**          | フィールドラベル                                                             | `data-slot="label"`                                                                                         |
| **Description**    | フィールド説明                                                               | `data-slot="description"`                                                                                   |
| **ErrorMessage**   | エラーメッセージ                                                             | `data-slot="error"`, 赤色スタイリング                                                                       |

```typescript
// フォームコンポーネントのimport例
import {
  Input,
  InputGroup,
  Textarea,
  Select,
  Checkbox,
  CheckboxGroup,
  CheckboxField,
  Radio,
  RadioGroup,
  RadioField,
  Switch,
  SwitchGroup,
  SwitchField,
  Combobox,
  ComboboxOption,
  Listbox,
  ListboxOption,
  Fieldset,
  Legend,
  FieldGroup,
  Field,
  Label,
  Description,
  ErrorMessage,
} from "@package/ui";
```

##### データ表示 (Data Display)

| コンポーネント         | 用途 & 特徴                                          | Props 例                                                                                 |
| ---------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| **Table**              | テーブル表示<br/>bleed, dense, grid, striped options | `bleed?: boolean`<br/>`dense?: boolean`<br/>`grid?: boolean`<br/>`striped?: boolean`     |
| **TableHead**          | テーブルヘッダー                                     | `<thead>` element                                                                        |
| **TableBody**          | テーブルボディ                                       | `<tbody>` element                                                                        |
| **TableRow**           | テーブル行<br/>clickable with href                   | `href?: string`<br/>`target?: string`<br/>`title?: string`                               |
| **TableHeader**        | テーブルヘッダーセル                                 | `<th>` element                                                                           |
| **TableCell**          | テーブルデータセル                                   | `<td>` element                                                                           |
| **Badge**              | バッジ・ラベル<br/>20+ color variants                | `color?: "red" \| "blue" \| "green" \| ...` (デフォルト: "zinc")                         |
| **BadgeButton**        | クリッカブルバッジ                                   | href or button props + TouchTarget                                                       |
| **Avatar**             | アバター画像<br/>src, initials, square support       | `src?: string \| null`<br/>`square?: boolean`<br/>`initials?: string`<br/>`alt?: string` |
| **AvatarButton**       | クリッカブルアバター                                 | href or button props + TouchTarget                                                       |
| **Alert**              | モーダル通知・警告表示<br/>Dialog based              | `size?: "xs" \| "sm" \| "md" \| "lg" \| "xl" \| "2xl" \| "3xl" \| "4xl" \| "5xl"`        |
| **AlertTitle**         | Alertのタイトル                                      | DialogTitle based                                                                        |
| **AlertDescription**   | Alertの説明                                          | Text component based                                                                     |
| **AlertBody**          | Alertのコンテンツ                                    | `<div>` container                                                                        |
| **AlertActions**       | Alertのアクションボタン                              | flex layout for buttons                                                                  |
| **DescriptionList**    | 説明リスト<br/>grid layout                           | responsive grid (1 col → 2 cols)                                                         |
| **DescriptionTerm**    | 説明リストのターム                                   | `<dt>` element                                                                           |
| **DescriptionDetails** | 説明リストの詳細                                     | `<dd>` element                                                                           |

```typescript
// データ表示コンポーネントのimport例
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
  Badge,
  BadgeButton,
  Avatar,
  AvatarButton,
  Alert,
  AlertTitle,
  AlertDescription,
  AlertBody,
  AlertActions,
  DescriptionList,
  DescriptionTerm,
  DescriptionDetails,
} from "@package/ui";
```

##### レイアウト (Layout)

| コンポーネント     | 用途 & 特徴                                    | Props 例                                                                                 |
| ------------------ | ---------------------------------------------- | ---------------------------------------------------------------------------------------- |
| **AuthLayout**     | 認証画面レイアウト<br/>centered design         | `children: React.ReactNode`                                                              |
| **SidebarLayout**  | サイドバー付きレイアウト<br/>mobile responsive | `navbar: React.ReactNode`<br/>`sidebar: React.ReactNode`<br/>`children: React.ReactNode` |
| **StackedLayout**  | 縦積みレイアウト<br/>mobile responsive         | `navbar: React.ReactNode`<br/>`sidebar: React.ReactNode`<br/>`children: React.ReactNode` |
| **Sidebar**        | サイドバーナビゲーション                       | `<nav>` element                                                                          |
| **SidebarHeader**  | サイドバーヘッダー                             | ロゴやタイトル用                                                                         |
| **SidebarBody**    | サイドバーメインコンテンツ                     | flex-1 で自動拡張                                                                        |
| **SidebarFooter**  | サイドバーフッター                             | ユーザー情報や設定用                                                                     |
| **SidebarSection** | サイドバーセクション                           | メニューグループ化                                                                       |
| **SidebarItem**    | サイドバーメニューアイテム                     | `current?: boolean`<br/>href or button props                                             |
| **SidebarHeading** | サイドバーセクション見出し                     | `<h3>` element                                                                           |
| **SidebarLabel**   | サイドバーアイテムラベル                       | `data-slot="label"`                                                                      |
| **SidebarDivider** | サイドバー区切り線                             | `<hr>` element                                                                           |
| **SidebarSpacer**  | サイドバースペーサー                           | flex-1 で空白作成                                                                        |
| **Navbar**         | ナビゲーションバー                             | `<nav>` element                                                                          |
| **NavbarSection**  | ナビバーセクション                             | flex layout section                                                                      |
| **NavbarItem**     | ナビバーメニューアイテム                       | `current?: boolean`<br/>href or button props                                             |
| **NavbarLabel**    | ナビバーアイテムラベル                         | `data-slot="label"`                                                                      |
| **NavbarDivider**  | ナビバー区切り線                               | vertical divider                                                                         |
| **NavbarSpacer**   | ナビバースペーサー                             | flex-1 で空白作成                                                                        |

```typescript
// レイアウトコンポーネントのimport例
import {
  AuthLayout,
  SidebarLayout,
  StackedLayout,
  Sidebar,
  SidebarHeader,
  SidebarBody,
  SidebarFooter,
  SidebarSection,
  SidebarItem,
  SidebarHeading,
  SidebarLabel,
  SidebarDivider,
  SidebarSpacer,
  Navbar,
  NavbarSection,
  NavbarItem,
  NavbarLabel,
  NavbarDivider,
  NavbarSpacer,
} from "@package/ui";
```

##### オーバーレイ・ナビゲーション

| コンポーネント          | 用途 & 特徴                                  | Props 例                                                                          |
| ----------------------- | -------------------------------------------- | --------------------------------------------------------------------------------- |
| **Dialog**              | モーダル表示<br/>backdrop blur & transitions | `size?: "xs" \| "sm" \| "md" \| "lg" \| "xl" \| "2xl" \| "3xl" \| "4xl" \| "5xl"` |
| **DialogTitle**         | ダイアログタイトル                           | Headless UI DialogTitle                                                           |
| **DialogDescription**   | ダイアログ説明                               | Text component based                                                              |
| **DialogBody**          | ダイアログコンテンツ                         | `<div>` container                                                                 |
| **DialogActions**       | ダイアログアクションボタン                   | flex layout for buttons                                                           |
| **Dropdown**            | ドロップダウンメニュー<br/>Headless UI Menu  | Headless UI Menu wrapper                                                          |
| **DropdownButton**      | ドロップダウントリガー                       | Button component またはカスタム要素                                               |
| **DropdownMenu**        | ドロップダウンメニューコンテナ               | backdrop blur & subgrid support                                                   |
| **DropdownItem**        | ドロップダウンメニューアイテム               | href or button props                                                              |
| **DropdownSection**     | ドロップダウンセクション                     | メニューグループ化                                                                |
| **DropdownHeader**      | ドロップダウンヘッダー                       | セクションヘッダー                                                                |
| **DropdownHeading**     | ドロップダウン見出し                         | セクションタイトル                                                                |
| **DropdownDivider**     | ドロップダウン区切り線                       | horizontal divider                                                                |
| **DropdownLabel**       | ドロップダウンアイテムラベル                 | `data-slot="label"`                                                               |
| **DropdownDescription** | ドロップダウンアイテム説明                   | secondary text                                                                    |
| **DropdownShortcut**    | ドロップダウンショートカット                 | `keys: string \| string[]`                                                        |
| **Pagination**          | ページネーション<br/>accessible navigation   | `aria-label?: string`                                                             |
| **PaginationPrevious**  | 前ページボタン                               | `href?: string \| null`                                                           |
| **PaginationNext**      | 次ページボタン                               | `href?: string \| null`                                                           |
| **PaginationList**      | ページ番号リスト                             | `<span>` container                                                                |
| **PaginationPage**      | ページ番号リンク                             | `href: string`<br/>`current?: boolean`                                            |
| **PaginationGap**       | ページ番号の省略                             | `children?: React.ReactNode` (デフォルト: …)                                      |

```typescript
// オーバーレイ・ナビゲーションコンポーネントのimport例
import {
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogActions,
  Dropdown,
  DropdownButton,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
  DropdownHeader,
  DropdownHeading,
  DropdownDivider,
  DropdownLabel,
  DropdownDescription,
  DropdownShortcut,
  Pagination,
  PaginationPrevious,
  PaginationNext,
  PaginationList,
  PaginationPage,
  PaginationGap,
} from "@package/ui";
```

#### コンポーネント選択指針

**フォーム実装時:**

- 基本入力: `Input`, `Textarea`
- 選択操作: `Select` (シンプル), `Listbox` (高機能), `Combobox` (検索可能)
- 複数選択: `Checkbox`, `Radio`, `Switch`
- グループ化: `Fieldset`

**データ表示時:**

- リスト表示: `Table`, `DescriptionList`
- 状態表示: `Badge`, `Alert`, `Avatar`
- テキスト表示: `Text`, `Strong`, `Code`, `TextLink`

**レイアウト選択:**

- 認証画面: `AuthLayout`
- 管理画面: `SidebarLayout` + `Sidebar`
- シンプル画面: `StackedLayout`
- ナビゲーション: `Navbar`

**インタラクション:**

- アクション: `Button` (色・形状豊富)
- メニュー: `Dropdown`
- モーダル: `Dialog`
- ナビゲーション: `Pagination`

**注意**:

- デフォルトでは `@package/ui` から import
- TypeScript の設定は `@package/typescript-config` で管理
- カスタムパスエイリアスが必要な場合は tsconfig.json で設定

```json
// 例: カスタムパスエイリアス
{
  "extends": "@package/typescript-config/nextjs.json",
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@ui/*": ["../packages/ui/src/*"]
    }
  }
}
```

### 2.2 新規コンポーネント一覧

| コンポーネント名 | 責務      | 既存コンポーネントの活用     | 配置場所                  |
| ---------------- | --------- | ---------------------------- | ------------------------- |
| [Component A]    | [UI 責務] | [活用する既存コンポーネント] | ../../packages/ui or src/ |

### 2.3 各コンポーネントの詳細

#### [Component A]

- **目的**: [このコンポーネントの UI/UX 目的]
- **Props Interface**:
  ```typescript
  interface ComponentAProps {
    variant?: "primary" | "secondary";
    size?: "sm" | "md" | "lg";
    children: React.ReactNode;
  }
  ```
- **デザイン仕様**:
  - ベースクラス: `bg-white border rounded-lg`
  - バリアント: `primary: bg-blue-500`, `secondary: bg-gray-200`
  - レスポンシブ: `sm:text-sm md:text-base lg:text-lg`

## 3. レイアウト設計

### 3.1 画面構成

```
┌─────────────────────────────────┐
│           Header                │
├─────────────────────────────────┤
│ Sidebar │      Main Content     │
│         │                       │
│         │                       │
├─────────────────────────────────┤
│           Footer                │
└─────────────────────────────────┘
```

### 3.2 レスポンシブ戦略

- **Mobile (< 768px)**: スタックレイアウト
- **Tablet (768px - 1024px)**: 2 カラムレイアウト
- **Desktop (> 1024px)**: 3 カラムレイアウト

### 3.3 グリッドシステム

[Tailwind Grid の活用方針]

## 4. ユーザーインターフェース

### 4.1 ナビゲーション設計

- メインナビゲーション
- ブレッドクラム
- ページネーション

### 4.2 フォーム設計

- 入力フィールド仕様
- バリデーション表示
- エラーハンドリング

### 4.3 フィードバック要素

- ローディング状態
- 成功/エラーメッセージ
- 確認ダイアログ

## 5. インタラクション設計

### 5.1 マイクロインタラクション

[Tailwind CSS Transition を使用したアニメーション]

### 5.2 状態管理

- ホバー状態
- フォーカス状態
- アクティブ状態
- 無効状態

## 6. アクセシビリティ

### 6.1 WCAG 準拠

- カラーコントラスト比
- キーボードナビゲーション
- スクリーンリーダー対応

### 6.2 セマンティク HTML

[適切な HTML 要素の使用指針]

## 7. パフォーマンス最適化

### 7.1 CSS 最適化

- Tailwind CSS Purging
- Critical CSS
- 遅延読み込み

### 7.2 画像最適化

- Next.js Image コンポーネント活用
- レスポンシブ画像
- WebP 対応

## 8. テーマとカスタマイゼーション

### 8.1 ダークモード対応

[Tailwind CSS Dark Mode 設定]

### 8.2 カスタムテーマ

[動的テーマ切り替え実装方針]

## 9. コーディング規約

### 9.1 必須ツールの使用

- **ESLint**: 全コードが`pnpm lint`をパスすること
- **Prettier**: 全ファイルが Prettier でフォーマットされていること
- **Tailwind CSS**: ユーティリティクラスのみ使用、カスタム CSS は禁止

### 9.2 コンポーネント命名規則

[ファイル名とコンポーネント名の規則]

## 10. monorepo 配置戦略

### 10.1 共有コンポーネント (packages/ui/)

- **汎用的で再利用可能なコンポーネント**
- **Headless UI v2.2.0 ベースの高機能コンポーネント**
- **デザインシステムの基盤となるコンポーネント**
- **Tailwind CSS v4 でスタイリング済み**

### 10.2 アプリ固有コンポーネント (apps/web/src/)

- **特定のアプリケーションに特化したコンポーネント**
- **ビジネスロジックを含むコンポーネント**
- **共有コンポーネントを組み合わせた複合コンポーネント**
- **ページレベルのコンポーネント (page.tsx, layout.tsx)**

```

### 5. Create TODO entry

Use TodoWrite to add "UI/UX設計の完了とレビュー" as a task

### 6. Present to user

Show the created UI design document and ask for:

- Design system approval
- Component architecture feedback
- Permission to proceed to task breakdown phase

## Important Notes

- Focus on UI/UX and visual design aspects
- Leverage existing components from packages/ui/src/
- Follow Tailwind CSS utility-first approach
- Ensure responsive design principles
- Consider accessibility requirements
- **MUST use only Tailwind CSS v4 utility classes for styling**
- **MUST follow existing Tailwind CSS v4 configuration (@tailwindcss/postcss)**
- **MUST leverage Headless UI v2.2.0 based components from packages/ui/**
- **Consider monorepo structure for component placement (packages/ui vs apps/web/src)**
```
