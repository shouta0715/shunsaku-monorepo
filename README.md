# Shunsaku Monorepo

Claude Code を使用した仕様駆動開発（Specification-Driven Development）のための monorepo プロジェクトです。5 段階のワークフローにより、仕様書作成から GitHub PR 作成まで完全自動化された開発プロセスを提供します。

## 🎯 プロジェクト概要

このリポジトリは、Claude Code の強力な機能を活用して開発効率を最大化するための monorepo 構造プロジェクトです。仕様書作成から実装、PR 作成まで一貫したワークフローで高品質なソフトウェア開発を実現します。

## 🏗️ Monorepo 構造

```
shunsaku-monorepo/
├── apps/
│   └── web/                    # Next.js メインアプリケーション
├── packages/
│   ├── ui/                     # 共有UIコンポーネントライブラリ
│   ├── eslint-config/          # 共有ESLint設定
│   ├── prettier-config/        # 共有Prettier設定
│   └── typescript-config/      # 共有TypeScript設定
└── .claude/
    ├── commands/               # Claude Codeワークフローコマンド
    ├── settings.json          # Claude Code設定
    └── CLAUDE.md              # プロジェクトガイドライン
```

## 🚀 セットアップ

### 前提条件

- Node.js 18.0 以上
- pnpm 8.0 以上
- Claude Code IDE 拡張機能
- GitHub CLI (gh) - PR 自動作成用

### インストール

```bash
# リポジトリのクローン
git clone <repository-url>
cd shunsaku-monorepo

# 依存関係のインストール
pnpm install

# GitHub CLI認証（PR自動作成用）
gh auth login

# 開発サーバーの起動
pnpm dev

# ビルド
pnpm build

# 品質チェック
pnpm lint
```

## 📋 5 段階仕様駆動開発ワークフロー

### 完全自動実行

```bash
/full-automatic [タスク説明]
```

### 個別ステップ実行

```bash
/step-1-specification [タスク説明]  # 仕様書作成
/step-2-requirements              # 要件定義書作成
/step-3-system-design             # システム設計作成
/step-4-ui-design                 # UI/UX設計作成
/step-5-task-division             # タスク分解
/github-pull-request              # GitHub PR作成
```

### 各ステップの詳細

| ステップ    | 説明                                           | 出力ファイル                   |
| ----------- | ---------------------------------------------- | ------------------------------ |
| **Step 1**  | ビジネス要件・スコープ・ステークホルダーを整理 | `.tmp/step-1-specification.md` |
| **Step 2**  | 機能要件・非機能要件・制約事項を詳細化         | `.tmp/step-2-requirements.md`  |
| **Step 3**  | アーキテクチャ・API・データ設計を作成          | `.tmp/step-3-system-design.md` |
| **Step 4**  | コンポーネント設計・デザインシステムを作成     | `.tmp/step-4-ui-design.md`     |
| **Step 5**  | 実装可能なタスクに分解・優先順位整理           | `.tmp/step-5-task-division.md` |
| **PR 作成** | ブランチ・コミット・PR 説明文を自動生成        | `.tmp/github-pull-request.md`  |

## 🛠️ 技術スタック

### フロントエンド

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: 共有コンポーネントライブラリ

### 開発ツール

- **Package Manager**: pnpm
- **Code Quality**: ESLint + Prettier
- **Build Tool**: Turbo
- **Development Environment**: Claude Code

### 品質管理

- **Linting**: ESLint（エラー 0 件必須）
- **Formatting**: Prettier（自動フォーマット）
- **Styling**: Tailwind CSS ユーティリティクラスのみ
- **Build Check**: `pnpm build` 成功必須

## 📁 開発ガイドライン

### コード品質基準

すべてのコードは以下の基準を満たす必要があります：

```bash
# 必須チェック項目
pnpm lint     # エラー0件
pnpm build    # ビルド成功
# Prettier自動フォーマット
# Tailwind CSSユーティリティクラスのみ使用
```

### Monorepo 構成

- **`apps/web/`**: Next.js メインアプリケーション
- **`packages/ui/`**: 共有 UI コンポーネント（再利用可能）
- **`packages/*-config/`**: 共有設定パッケージ

### 開発フロー

1. **仕様策定**: `/full-automatic` または個別ステップ実行
2. **実装**: タスクリストに従って開発
3. **品質チェック**: ESLint、Prettier、ビルド確認
4. **PR 作成**: `/github-pull-request` で自動生成

## 🎨 利用可能な UI コンポーネント

`packages/ui/src/` に含まれる共有コンポーネント：

- `alert.tsx` - アラート表示
- `button.tsx` - ボタンコンポーネント
- `input.tsx` - 入力フィールド
- `dialog.tsx` - モーダルダイアログ
- `navbar.tsx` - ナビゲーションバー
- その他多数...

## 🔧 よく使うコマンド

```bash
# 開発環境
pnpm dev                    # 開発サーバー起動
pnpm build                  # プロダクションビルド
pnpm lint                   # ESLintチェック
pnpm lint:fix              # ESLint自動修正

# 特定のアプリケーション
cd apps/web
pnpm dev                    # webアプリのみ起動

# 特定のパッケージ
cd packages/ui
pnpm build                  # UIライブラリビルド
```

## 📖 Claude Code ワークフロー

詳細なワークフロー情報は `.claude/CLAUDE.md` を参照してください。

### 主要機能

- **自動仕様書生成**: ビジネス要件の整理・文書化
- **設計の自動化**: システム・UI 設計の構造化
- **タスク分解**: 実装可能な単位への自動分割
- **品質保証**: ESLint・Prettier・Tailwind CSS 基準の強制
- **PR 自動化**: ブランチ・コミット・説明文の自動生成

## 🤝 コントリビューション

1. 新機能やバグ修正は必ず 5 段階ワークフローを使用
2. 品質チェック（lint・build）をすべてパス
3. `/github-pull-request` で PR 作成
4. コードレビュー後にマージ

## 📄 ライセンス

MIT License

## 🔗 関連リンク

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Claude Code Documentation](https://docs.claude.ai)
- [pnpm Documentation](https://pnpm.io/)
