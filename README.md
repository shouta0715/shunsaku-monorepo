# Shunsaku Monorepo

Claude Code を使用した仕様駆動開発（Specification-Driven Development）のための monorepo プロジェクトです。3 段階のワークフローにより、要件分析から実装タスク分解まで完全自動化された開発プロセスを提供します。

## 🎯 プロジェクト概要

このリポジトリは、Claude Code の強力な機能を活用して開発効率を最大化するための monorepo 構造プロジェクトです。要件分析・技術設計・タスク分解の 3 段階ワークフローで、品質の高いソフトウェア開発を実現します。

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

## 📋 3 段階仕様駆動開発ワークフロー

### 完全自動実行

```bash
/full-automatic [タスク説明]
```

### 個別ステップ実行

```bash
/step-1-requirements [タスク説明]  # 要件分析
/step-2-design                    # 技術設計
/step-3-tasks                     # タスク分解
```

### 各ステップの詳細

| ステップ   | 説明                                             | 出力ファイル                  |
| ---------- | ------------------------------------------------ | ----------------------------- |
| **Step 1** | 要件分析・機能/非機能要件・制約事項を整理        | `.tmp/step-1-requirements.md` |
| **Step 2** | アーキテクチャ・API・UI/UX 設計を統合作成        | `.tmp/step-2-design.md`       |
| **Step 3** | 実装可能なタスクに分解・優先順位・依存関係を整理 | `.tmp/step-3-tasks.md`        |

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
- **Type Checking**: TypeScript（厳格モード）
- **Build Check**: `pnpm build` 成功必須
- **MCP Tools**: Context7 を使用した最新ライブラリ情報取得

## 📁 開発ガイドライン

### コード品質基準

すべてのコードは以下の基準を満たす必要があります：

#### Phase 1: 自動修正（順次実行）

```bash
pnpm install    # 依存関係インストール
pnpm lint:fix   # ESLint 自動修正
pnpm format     # Prettier フォーマット
```

#### Phase 2: 検証（並列実行） - Windows 最適化

**推奨方法 (全 OS 対応・確実性重視):**

```bash
# 順次実行 - 確実に動作
pnpm lint
pnpm typecheck
pnpm build
```

**並列実行 (上級者向け):**

```bash
# macOS/Linux:
pnpm lint & pnpm typecheck & pnpm build

# Windows PowerShell:
pnpm lint; pnpm typecheck; pnpm build
```

#### 完了基準

- ✅ ESLint エラー 0 件
- ✅ TypeScript エラー 0 件
- ✅ ビルド成功
- ✅ テスト成功（該当する場合）

### TypeScript 開発規約

```typescript
// ❌ 避けるべき
const data: any = fetchData();
const result: unknown = processData();
class UserService {} // 必要でない限りクラスは避ける

// ✅ 推奨
const data: UserData = fetchData();
const result: ProcessedResult = processData();
const userService = {}; // オブジェクト/関数を使用
```

### コンポーネント開発方針

1. **優先順位**: 常に `@package/ui` を最初に確認
2. **カスタムコンポーネント**: 必要な場合のみ作成
3. **モックデータ**: 外部統合前にモックデータで機能実装

### Monorepo 構成

- **`apps/web/`**: Next.js メインアプリケーション
- **`packages/ui/`**: 共有 UI コンポーネント（再利用可能）
- **`packages/*-config/`**: 共有設定パッケージ

### 開発フロー

1. **仕様策定**: `/full-automatic` または個別ステップ実行
2. **実装**: タスクリストに従って開発（TodoWrite 活用）
3. **品質チェック**: ESLint、TypeScript、ビルド確認
4. **コードレビュー**: GitHub PR 作成・レビュー

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

- **要件分析の自動化**: ユーザーニーズの整理・文書化
- **技術設計の統合**: システム・UI 設計の一体的作成
- **タスク分解**: 実装可能な単位への自動分割・依存関係整理
- **品質保証**: ESLint・TypeScript・Prettier 基準の強制
- **並列処理**: 独立操作の同時実行による効率化

### 設定・権限管理

Claude Code の設定は `.claude/settings.json` で管理されています：

- **許可操作**: ファイル操作、Git 操作、pnpm コマンド、TodoWrite
- **制限操作**: システム操作、破壊的操作、機密ファイルアクセス
- **MCP ツール**: Context7 による最新ライブラリ情報取得

### ベストプラクティス

#### 並列処理の活用

```javascript
// ✅ 効率的: 並列実行
Promise.all([
  readFile("config.json"),
  readFile("data.json"),
  searchPattern("TODO"),
]);

// ❌ 非効率: 順次実行
await readFile("config.json");
await readFile("data.json");
await searchPattern("TODO");
```

#### エラーハンドリング

```typescript
// ✅ 包括的エラーハンドリング
try {
  const data = await fetchData();
  return processData(data);
} catch (error) {
  if (error instanceof NetworkError) {
    return handleNetworkError(error);
  }
  if (error instanceof ValidationError) {
    return handleValidationError(error);
  }
  throw new UnexpectedError("予期しないエラーが発生しました", { cause: error });
}
```

## 🤝 コントリビューション

1. 新機能やバグ修正は必ず 3 段階ワークフローを使用
2. 品質チェック（lint・typecheck・build）をすべてパス
3. TodoWrite でタスク管理・進捗追跡
4. GitHub PR 作成・コードレビュー後にマージ

## 📄 ライセンス

MIT License

## 🔗 関連リンク

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Claude Code Documentation](https://docs.claude.ai)
- [pnpm Documentation](https://pnpm.io/)
