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
│       │   └── app/           # Next.js App Router
│       │       ├── layout.tsx # ルートレイアウト
│       │       ├── page.tsx   # ホームページ
│       │       └── globals.css # グローバルスタイル
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
3. **モックデータ**: 外部統合前にモックデータで機能実装

### Quality Assurance Process

```bash
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

### 既存プロジェクト拡張ワークフロー (7-10分で実装仕様生成)

**`apps/web/src`ディレクトリ内での開発を前提とした仕様駆動開発**

```mermaid
graph LR
    A[Requirements<br/>📋 機能要件定義] --> B[Design<br/>🏗️ src内実装設計]
    B --> C[Tasks<br/>📝 実装タスク分解]
    C --> D[Implementation<br/>⚡ src/app内開発]
```

### 開発コンテキスト

- **ベースプロジェクト**: `apps/web` (Next.js 15 + @package/ui)
- **実装場所**: `src/app/` ディレクトリ内
- **既存活用**: `layout.tsx`, `page.tsx`, `@package/ui`コンポーネント
- **出力先**: 機能別ページ・コンポーネント・API Routes

### Available Commands

| Command                | Description                          | Output                            |
| ---------------------- | ------------------------------------ | --------------------------------- |
| `/full-automatic`      | 既存プロジェクト拡張仕様書一括生成   | 完全実装仕様セット                |
| `/step-1-requirements` | 機能要件定義（既存UI活用前提）       | `.tmp/step-1-requirements.md`     |
| `/step-2-design`       | src/app内実装設計（@package/ui活用） | `.tmp/step-2-design.md`           |
| `/step-3-tasks`        | 実装タスク分解（既存構造拡張）       | `.tmp/step-3-tasks.md` + TodoList |

### 開発フロー

```bash
# 既存プロジェクトに機能追加
/full-automatic "既存apps/webプロジェクトに[機能名]を追加: [詳細説明]"
```

### エラーハンドリング

```bash
# ロールバック手順
rm -rf .tmp/step-*
/full-automatic "既存apps/webプロジェクトへの機能追加: [詳細説明]"
```

## 🚀 Best Practices

### 既存プロジェクト拡張パターン

- **既存レイアウト活用**: `src/app/layout.tsx`のGeistフォント・スタイル基盤を継承
- **@package/ui最大活用**: 28種類のコンポーネント優先、カスタム作成は最小限
- **App Router構造**: `src/app/`内でのNext.js 15 App Router活用
- **並列実行**: Promise.all()で独立操作を同時実行
- **型安全性**: 適切なinterface定義とTypeScript活用

### 現在の実装構造

```typescript
// 実際のディレクトリ構造（apps/web/src/app/）
src/app/
├── layout.tsx          // ルートレイアウト（Geistフォント・基本スタイル）
├── page.tsx           // ホームページ（@package/ui統合済み）
├── globals.css        // グローバルスタイル（@package/ui・Tailwind）
└── favicon.ico        // ファビコン
```

### TodoWrite Task Management

- 同時に`in_progress`のタスクは1つのみ
- 完了後は即座にステータス更新
- 具体的で実行可能なタスク名を使用

### Performance & Error Handling

- コード分割、遅延読み込み、バンドル最適化
- 包括的なエラーハンドリング（型別処理）

## 📦 Dependency Management

### パッケージ追加手順

1. **package.json直接編集** - 依存関係を手動追加
2. **pnpm install実行** - パッケージをインストール
3. **@package/ui優先確認** - 既存コンポーネントで代替可能か検討

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
