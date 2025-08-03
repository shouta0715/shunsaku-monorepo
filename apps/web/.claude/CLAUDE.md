# Project Guidelines

プロジェクトの開発標準、方法論、ベストプラクティスを定義します。一貫性のある高品質なコードのため、これらのガイドラインを厳密に遵守してください。

## 🎯 Core Principles

- **並列処理**: 独立した操作を同時実行して効率を最大化
- **コンテキスト管理**: 集中的なコンテキストウィンドウを維持
- **言語ポリシー**: 英語で思考し、日本語で回答
- **ファイル組織**: `.tmp`ディレクトリで一時ドキュメント管理
- **検証プロトコル**: 変更後は必ずファイル内容を確認
- **エラー回復**: 包括的なエラーハンドリングと回復戦略

## 📁 Project Structure

### モノレポ構成

```
shunsaku-monorepo/
├── apps/
│   └── web/                    # メインアプリケーション
│       ├── src/
│       │   ├── app/           # Next.js App Router
│       │   │   ├── layout.tsx # ルートレイアウト
│       │   │   ├── page.tsx   # ホームページ
│       │   │   └── globals.css # グローバルスタイル
│       │   ├── components/    # Reactコンポーネント
│       │   ├── hooks/         # カスタムフック
│       │   ├── lib/           # ユーティリティ・ビジネスロジック
│       │   └── types/         # TypeScript型定義
│       ├── .claude/           # Specification-Driven Development
│       │   ├── CLAUDE.md      # プロジェクトガイドライン
│       │   ├── settings.json  # Claude設定
│       │   └── commands/      # SDD コマンド群
│       ├── .tmp/              # 仕様書生成ディレクトリ
│       ├── public/            # 静的ファイル
│       ├── package.json       # アプリ依存関係
│       ├── tsconfig.json      # TypeScript設定
│       ├── next.config.ts     # Next.js設定
│       └── eslint.config.mjs  # ESLint設定
└── packages/                  # 共有ライブラリ
    ├── ui/                    # UIコンポーネントライブラリ
    ├── eslint-config/         # ESLint共通設定
    ├── prettier-config/       # Prettier共通設定
    └── typescript-config/     # TypeScript共通設定
```

### 開発ディレクトリ

- **`src/app/`**: Next.js 15 App Router（ページ・レイアウト）
- **`src/components/`**: Reactコンポーネント（@package/ui活用）
- **`src/hooks/`**: カスタムフック（状態管理・ユーティリティ）
- **`src/lib/`**: ユーティリティ・ビジネスロジック・API処理
- **`src/types/`**: TypeScript型定義・インターフェース
- **`.claude/`**: 仕様駆動開発環境（コマンド・設定）
- **`.tmp/`**: 自動生成仕様書（requirements・design・tasks）
- **`@package/ui`**: 28種類のUIコンポーネント統合済み

### 重要な設定ファイル

| ファイル              | 役割                 | 説明                         |
| --------------------- | -------------------- | ---------------------------- |
| `package.json`        | 依存関係・スクリプト | 品質保証コマンド追加済み     |
| `tsconfig.json`       | TypeScript設定       | `@/*`パスエイリアス設定      |
| `next.config.ts`      | Next.js設定          | Turbopack・最適化設定        |
| `globals.css`         | グローバルスタイル   | @package/ui・Tailwind統合    |
| `eslint.config.mjs`   | コード品質           | @package/eslint-config使用   |
| `prettier.config.mjs` | フォーマット         | @package/prettier-config使用 |

### Packagesライブラリ

| Package                      | 目的             | 提供機能                    |
| ---------------------------- | ---------------- | --------------------------- |
| `@package/ui`                | UIコンポーネント | 再利用可能コンポーネント    |
| `@package/eslint-config`     | コード品質       | Next.js特化ESLintルール     |
| `@package/prettier-config`   | フォーマット     | Tailwind対応Prettier設定    |
| `@package/typescript-config` | 型チェック       | Next.js最適化TypeScript設定 |

## 💻 Development Standards

### TypeScript Guidelines

- **型安全性**: `any`、`unknown`型を避け、適切な型定義を使用
- **関数型アプローチ**: クラスではなくオブジェクト/関数を優先
- **エラーハンドリング**: 包括的なエラー処理を実装

### Component Development

1. **既存構造活用**: `src/app/layout.tsx`, `page.tsx`を基盤として拡張
2. **@package/ui優先**: カスタムコンポーネント作成前に28種類の既存コンポーネントを確認
3. **正しいディレクトリ構造**: `src/components/`, `src/hooks/`, `src/lib/`, `src/types/`に配置
4. **モックデータ**: 外部統合前にモックデータで機能実装

### Quality Assurance Process

```bash
# Windows環境では && チェーンが使用できないため、個別実行が必要
# 自動修正
pnpm install
pnpm lint:fix
pnpm format

# 検証（順次実行）
pnpm lint
pnpm typecheck
pnpm build
```

## 📋 Specification-Driven Development

### メインページ上書き型ワークフロー (8-11分で実装仕様生成)

**`apps/web/src/app/layout.tsx`・`page.tsx`の直接置換を前提とし、`src/`内正しいディレクトリ構造での仕様駆動開発（README.md自動生成含む）**

```mermaid
graph LR
    A[Requirements<br/>📋 機能要件定義] --> B[Design<br/>🏗️ メインページ置換設計]
    B --> C[Tasks<br/>📝 layout・page上書きタスク]
    C --> D[Implementation<br/>⚡ トップページ統合]
    D --> E[Quality Assurance<br/>🔧 エラー0件・build成功]
    E --> F[Documentation<br/>📖 README.md生成]
```

### 開発コンテキスト

- **ベースプロジェクト**: `apps/web` (Next.js 15 + @package/ui)
- **実装方法**: **メインページ上書き型** - `src/app/layout.tsx`・`page.tsx`を直接置換
- **ディレクトリ構造**: `src/components/`, `src/hooks/`, `src/lib/`, `src/types/`に適切配置
- **既存活用**: `@package/ui`コンポーネント、Geistフォント、既存スタイリング
- **出力先**: トップページ（/）への機能統合
- **最終成果物**: 完全実装 + 包括的README.md

### Available Commands

| Command                | Description                                            | Output                            |
| ---------------------- | ------------------------------------------------------ | --------------------------------- |
| `/full-automatic`      | メインページ上書き型仕様書一括生成                     | 完全実装仕様セット                |
| `/step-1-requirements` | 機能要件定義（src/app/layout.tsx・page.tsx上書き前提） | `.tmp/step-1-requirements.md`     |
| `/step-2-design`       | メインページ置換設計（@package/ui活用・src/内構造）    | `.tmp/step-2-design.md`           |
| `/step-3-tasks`        | 実装タスク分解（トップページ統合・src/内構造）         | `.tmp/step-3-tasks.md` + TodoList |

### 開発フロー

```bash
# メインページ上書き型実装
/full-automatic "apps/webのトップページを[機能名]に置換: [詳細説明]"
```

### エラーハンドリング

```bash
# ロールバック手順
rm -rf .tmp/step-*
/full-automatic "apps/webのトップページ置換: [詳細説明]"
```

## 🚀 Best Practices

### メインページ上書き型パターン

- **直接置換**: `src/app/layout.tsx`・`page.tsx`を機能専用ページに完全上書き
- **正しいディレクトリ構造**: `src/components/`, `src/hooks/`, `src/lib/`, `src/types/`に適切配置
- **既存基盤継承**: Geistフォント・スタイリング・メタデータ設定を活用
- **@package/ui最大活用**: 28種類のコンポーネント優先、カスタム作成は最小限
- **App Router最適化**: ルートページ（/）での最高パフォーマンス実現
- **並列実行**: Promise.all()で独立操作を同時実行
- **型安全性**: 適切なinterface定義とTypeScript活用

### メインページ上書き型実装構造

```typescript
// 上書き後のディレクトリ構造（apps/web/src/）
src/
├── app/
│   ├── layout.tsx      // 機能専用レイアウト（Geistフォント継承・メタデータ更新）
│   ├── page.tsx        // 機能メインページ（@package/ui活用・完全置換）
│   ├── globals.css     // グローバルスタイル（@package/ui・Tailwind）
│   └── favicon.ico     // ファビコン
├── components/         // 機能固有コンポーネント（@package/ui活用）
├── hooks/             // カスタムフック（状態管理・ユーティリティ）
├── lib/               // ユーティリティ・ビジネスロジック
└── types/             // TypeScript型定義
```

### 自動README生成

- **実装完了後**: 全機能を反映した包括的ドキュメント作成
- **品質保証**: セットアップ・使用方法・開発ガイド・Windows対応
- **SDD統合**: 仕様駆動開発ワークフローの完全説明

### TodoWrite Task Management

- 同時に`in_progress`のタスクは1つのみ
- 完了後は即座にステータス更新
- 具体的で実行可能なタスク名を使用

### エラーハンドリング・品質保証

- **エラー優先修正**: lint・typeエラーが発生した場合は次のタスクに進まず修正優先
- **各タスク品質確認**: 実装完了時に `pnpm lint` `pnpm typecheck` でエラー0件確認
- **最終品質保証**: 全実装完了後の完全品質チェック（エラー0件・build成功まで）
- **エラーループ**: エラーが解決するまで修正→チェック→修正を繰り返し

### Performance & Error Handling

- コード分割、遅延読み込み、バンドル最適化
- 包括的なエラーハンドリング（型別処理）

## 📦 Dependency Management

### パッケージ追加手順

1. **package.json直接編集** - 依存関係を手動追加
2. **pnpm install実行** - パッケージをインストール
3. **@package/ui優先確認** - 既存コンポーネントで代替可能か検討

> **Windows環境での注意**: PowerShellでは `pnpm add package && pnpm install` のような && チェーンが使用できません。各コマンドを個別に実行してください。

## 🎨 UI/UX Guidelines

- **レスポンシブ**: モバイルファースト
- **アクセシビリティ**: WCAG 2.1準拠
- **パフォーマンス**: 3秒以下の読み込み時間
- **一貫性**: デザインシステムトークンを使用

## 🔧 Debugging & Troubleshooting

### Common Issues & Solutions

| Issue          | Solution                                 |
| -------------- | ---------------------------------------- |
| Type errors    | tsconfig.json確認、インポート検証        |
| Build failures | キャッシュクリア、依存関係再インストール |
| Lint errors    | `pnpm lint:fix`実行                      |

### Debug Commands

```bash
# Windows PowerShellでは && チェーンが使用できないため、個別のコマンドとして実行
# キャッシュクリア & 再インストール
pnpm store prune
pnpm install

# 完全品質チェック
pnpm install
pnpm lint:fix
pnpm format
pnpm lint
pnpm typecheck
pnpm build
```

---

**Quality over quantity. 保守しやすい高品質なコードを心がける。**
