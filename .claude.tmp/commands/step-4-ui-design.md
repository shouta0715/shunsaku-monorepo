---
allowed-tools: TodoWrite, Read, Write, MultiEdit
description: Step 4 UI/UX設計とコンポーネントアーキテクチャを作成
---

## Context

- Task description: $ARGUMENTS
- Specification document: @.tmp/step-1-specification.md
- Requirements document: @.tmp/step-2-requirements.md
- System design document: @.tmp/step-3-system-design.md

## Your task

### 1. Verify prerequisites

- Check that `.tmp/step-1-specification.md` exists
- Check that `.tmp/step-2-requirements.md` exists
- Check that `.tmp/step-3-system-design.md` exists
- If any missing, inform user to complete previous steps first

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

Create `.tmp/step-4-ui-design.md` with the following sections:

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

### 1.3 Tailwind CSS 設定

```typescript
// tailwind.config.ts での設定例
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#...",
          500: "#...",
          900: "#...",
        },
      },
    },
  },
};
```
````

## 2. コンポーネント設計

### 2.1 既存コンポーネントの活用

[プロジェクトで利用可能な既存コンポーネントをリストアップ]

#### 利用可能な共有 UI コンポーネント (@package/ui)

##### 基本要素 (Basic Elements)

| コンポーネント | 用途                                        | import 例                                                    |
| -------------- | ------------------------------------------- | ------------------------------------------------------------ |
| Button         | ボタン操作 (17 色 variants + outline/plain) | `import { Button } from "@package/ui"`                       |
| Text           | テキスト表示, Strong, Code, TextLink        | `import { Text, Strong, Code, TextLink } from "@package/ui"` |
| Heading        | 見出し表示                                  | `import { Heading } from "@package/ui"`                      |
| Link           | リンク要素                                  | `import { Link } from "@package/ui"`                         |
| Divider        | 区切り線                                    | `import { Divider } from "@package/ui"`                      |

##### フォーム (Form Components)

| コンポーネント | 用途                | import 例                                |
| -------------- | ------------------- | ---------------------------------------- |
| Input          | テキスト入力        | `import { Input } from "@package/ui"`    |
| Textarea       | 複数行テキスト入力  | `import { Textarea } from "@package/ui"` |
| Select         | 選択リスト          | `import { Select } from "@package/ui"`   |
| Checkbox       | チェックボックス    | `import { Checkbox } from "@package/ui"` |
| Radio          | ラジオボタン        | `import { Radio } from "@package/ui"`    |
| Switch         | ON/OFF スイッチ     | `import { Switch } from "@package/ui"`   |
| Combobox       | 入力可能選択リスト  | `import { Combobox } from "@package/ui"` |
| Listbox        | 選択リスト (高機能) | `import { Listbox } from "@package/ui"`  |
| Fieldset       | フォームグループ    | `import { Fieldset } from "@package/ui"` |

##### データ表示 (Data Display)

| コンポーネント  | 用途           | import 例                                       |
| --------------- | -------------- | ----------------------------------------------- |
| Table           | テーブル表示   | `import { Table } from "@package/ui"`           |
| Badge           | バッジ・ラベル | `import { Badge } from "@package/ui"`           |
| Avatar          | アバター画像   | `import { Avatar } from "@package/ui"`          |
| Alert           | 通知・警告表示 | `import { Alert } from "@package/ui"`           |
| DescriptionList | 説明リスト     | `import { DescriptionList } from "@package/ui"` |

##### レイアウト (Layout)

| コンポーネント | 用途                     | import 例                                     |
| -------------- | ------------------------ | --------------------------------------------- |
| AuthLayout     | 認証画面レイアウト       | `import { AuthLayout } from "@package/ui"`    |
| SidebarLayout  | サイドバー付きレイアウト | `import { SidebarLayout } from "@package/ui"` |
| StackedLayout  | 縦積みレイアウト         | `import { StackedLayout } from "@package/ui"` |
| Sidebar        | サイドバー               | `import { Sidebar } from "@package/ui"`       |
| Navbar         | ナビゲーションバー       | `import { Navbar } from "@package/ui"`        |

##### オーバーレイ・ナビゲーション

| コンポーネント | 用途                   | import 例                                  |
| -------------- | ---------------------- | ------------------------------------------ |
| Dialog         | モーダル表示           | `import { Dialog } from "@package/ui"`     |
| Dropdown       | ドロップダウンメニュー | `import { Dropdown } from "@package/ui"`   |
| Pagination     | ページネーション       | `import { Pagination } from "@package/ui"` |

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

**注意**: TypeScript の path mapping で`@ui/*`として参照する場合は、tsconfig.json に以下を追加：

```json
{
  "compilerOptions": {
    "paths": {
      "@ui/*": ["../../packages/ui/src/*"],
      "@ui": ["../../packages/ui/src/index.ts"]
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

### 10.1 共有コンポーネント (../../packages/ui)

- 汎用的で再利用可能なコンポーネント
- デザインシステムの基盤となるコンポーネント

### 10.2 アプリ固有コンポーネント (src/)

- 特定のアプリケーションに特化したコンポーネント
- ビジネスロジックを含むコンポーネント

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
- Leverage existing components from ../../packages/ui/src/
- Follow Tailwind CSS utility-first approach
- Ensure responsive design principles
- Consider accessibility requirements
- **MUST use only Tailwind utility classes for styling**
- **MUST follow existing Tailwind CSS configuration and design patterns**
- **Consider monorepo structure for component placement**
```
