---
allowed-tools: TodoWrite, Read, Write, MultiEdit, Bash(find:*), Bash(ls:*), Bash(grep:*)
description: Step 4: コンポーネント設計・デザインシステム・レイアウトを含むUI/UX設計書を作成
---

## Context

- Specification document: @.tmp/step-1-specification.md
- Requirements document: @.tmp/step-2-requirements.md
- System design document: @.tmp/step-3-system-design.md

## Your task

### 1. Verify prerequisites

- Check that `.tmp/step-1-specification.md`, `.tmp/step-2-requirements.md`, and `.tmp/step-3-system-design.md` exist
- If not, inform user to complete previous steps first

### 2. Analyze requirements and system design

Read and understand all previous documents to align UI design with system architecture

### 3. Analyze existing UI assets

#### 3.1 Check existing components

- Check `packages/ui/src/` for shared UI components
- Check `apps/**/src/` for application-specific components
- Read key components to understand their interfaces and usage patterns
- Document available UI components for reuse in monorepo structure

#### 3.2 Check Tailwind configuration

- Look for `tailwind.config.ts` or `tailwind.config.js` in apps/\*\*/
- Check for Tailwind CSS v4 setup in `apps/**/src/app/globals.css`
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

| 既存コンポーネント       | 用途   | 活用方法               | パッケージ  |
| ------------------------ | ------ | ---------------------- | ----------- |
| [検出したコンポーネント] | [用途] | [この設計での活用方法] | packages/ui |

### 2.2 新規コンポーネント一覧

| コンポーネント名 | 責務      | 既存コンポーネントの活用     | 配置場所                 |
| ---------------- | --------- | ---------------------------- | ------------------------ |
| [Component A]    | [UI 責務] | [活用する既存コンポーネント] | packages/ui or apps/\*\* |

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

### 10.1 共有コンポーネント (packages/ui)

- 汎用的で再利用可能なコンポーネント
- デザインシステムの基盤となるコンポーネント

### 10.2 アプリ固有コンポーネント (apps/\*\*)

- 特定のアプリケーションに特化したコンポーネント
- ビジネスロジックを含むコンポーネント

```

### 5. Update TODO

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
- **MUST use only Tailwind utility classes for styling**
- **MUST follow existing Tailwind CSS configuration and design patterns**
- **Consider monorepo structure for component placement**
```
