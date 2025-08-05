# やめどき予報 - 開発ガイド

## 目次

1. [開発環境セットアップ](#開発環境セットアップ)
2. [プロジェクト構成](#プロジェクト構成)
3. [開発ワークフロー](#開発ワークフロー)
4. [コーディング規約](#コーディング規約)
5. [テスト戦略](#テスト戦略)
6. [デバッグ方法](#デバッグ方法)
7. [パフォーマンスチューニング](#パフォーマンスチューニング)
8. [トラブルシューティング](#トラブルシューティング)

## 開発環境セットアップ

### 必要な環境

- **Node.js**: 20.x以上
- **npm**: 10.x以上
- **Git**: 2.x以上
- **エディタ**: VS Code推奨

### 推奨VS Code拡張機能

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "ms-vscode.vscode-typescript-next",
    "christian-kohler.path-intellisense",
    "formulahendry.auto-rename-tag",
    "steoates.autoimport"
  ]
}
```

### 初期セットアップ

```bash
# 1. リポジトリをクローン
git clone https://github.com/your-org/shunsaku-monorepo.git
cd shunsaku-monorepo/apps/web

# 2. 依存関係をインストール
npm install

# 3. 環境変数を設定
cp .env.example .env.local

# 4. 開発サーバーを起動
npm run dev
```

### 環境変数設定

`.env.local`ファイルを作成し、以下の環境変数を設定します：

```env
# アプリケーション設定
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=やめどき予報

# 認証設定（将来実装）
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
JWT_SECRET=your-jwt-secret-here

# データベース（将来実装）
DATABASE_URL=postgresql://user:password@localhost:5432/yamefoki

# 外部サービス（将来実装）
RESEND_API_KEY=your-resend-api-key
SLACK_WEBHOOK_URL=your-slack-webhook-url
```

## プロジェクト構成

### モノレポ構造

```
shunsaku-monorepo/
├── apps/
│   └── web/                    # Webアプリケーション
│       ├── src/                # ソースコード
│       ├── public/             # 静的ファイル
│       ├── docs/               # ドキュメント
│       └── package.json        # 依存関係
├── packages/                   # 共有パッケージ（将来）
└── package.json               # ルートパッケージ
```

### ソースコード構成

```
src/
├── app/                       # Next.js App Router
├── components/                # Reactコンポーネント
├── lib/                      # ユーティリティ
├── types/                    # TypeScript型定義
├── styles/                   # グローバルスタイル
└── hooks/                    # カスタムフック（将来）
```

## 開発ワークフロー

### 1. ブランチ戦略

```bash
main                          # 本番環境
├── develop                   # 開発統合
├── feature/xxx-description   # 機能開発
├── bugfix/xxx-description    # バグ修正
└── hotfix/xxx-description    # 緊急修正
```

### 2. 開発フロー

```bash
# 1. developから新しいブランチを作成
git checkout develop
git pull origin develop
git checkout -b feature/add-notification-system

# 2. 開発作業
# コーディング...

# 3. コミット（conventional commits形式）
git add .
git commit -m "feat: 通知システムを追加"

# 4. テスト実行
npm run test
npm run lint
npm run type-check

# 5. プッシュ
git push origin feature/add-notification-system

# 6. Pull Request作成
# GitHub上でPRを作成し、レビューを依頼
```

### 3. コミットメッセージ規約

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type一覧:**

- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメント変更
- `style`: コードスタイル変更
- `refactor`: リファクタリング
- `perf`: パフォーマンス改善
- `test`: テスト追加・修正
- `chore`: ビルドプロセスや補助ツールの変更

**例:**

```bash
feat(survey): 回答履歴グラフを追加

- Chart.jsを使用して履歴を可視化
- 過去30日間のデータを表示
- レスポンシブ対応

Closes #123
```

## コーディング規約

### TypeScript規約

```typescript
// 1. インターフェース名は大文字開始
interface UserProfile {
  id: string;
  name: string;
  email: string;
}

// 2. 型エイリアスは大文字開始
type RiskLevel = "low" | "medium" | "high";

// 3. 列挙型は大文字開始、値は大文字
enum UserRole {
  EMPLOYEE = "employee",
  MANAGER = "manager",
  HR = "hr",
  ADMIN = "admin",
}

// 4. 関数は明示的な戻り値型を指定
function calculateRiskScore(responses: number[]): number {
  return responses.reduce((a, b) => a + b, 0) / responses.length;
}

// 5. constアサーションを活用
const WEATHER_CONDITIONS = {
  STORM: "嵐",
  RAIN: "雨",
  CLOUDY: "曇り",
  SUNNY: "晴れ",
  CLEAR: "快晴",
} as const;

// 6. オプショナルチェイニングとNullish Coalescing
const userName = user?.name ?? "ゲスト";
```

### React/Next.js規約

```tsx
// 1. 関数コンポーネントを使用
export function UserCard({ user }: { user: User }) {
  return <div>{user.name}</div>;
}

// 2. カスタムフックは'use'で開始
function useUserData(userId: string) {
  // フック実装
}

// 3. イベントハンドラは'handle'で開始
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  // 処理
};

// 4. 条件付きレンダリング
{
  isLoading ? (
    <LoadingSpinner />
  ) : error ? (
    <ErrorMessage error={error} />
  ) : (
    <DataDisplay data={data} />
  );
}

// 5. map使用時は必ずkey指定
{
  items.map((item) => <ItemCard key={item.id} item={item} />);
}
```

### Tailwind CSS規約

```tsx
// 1. クラス名の順序
// レイアウト → サイズ → 間隔 → 背景 → ボーダー → テキスト → その他
<div className="flex items-center w-full p-4 bg-white border rounded-lg text-gray-900 shadow-md">

// 2. レスポンシブデザイン（モバイルファースト）
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

// 3. ダークモード対応
<div className="bg-white dark:bg-gray-900">

// 4. カスタムクラスは最小限に
// styles/globals.css
@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700;
  }
}
```

## テスト戦略

### テストの種類

1. **ユニットテスト**: 個別の関数・コンポーネント
2. **統合テスト**: APIとの連携
3. **E2Eテスト**: ユーザーシナリオ

### テストファイル構成

```
src/
├── components/
│   ├── Button.tsx
│   └── Button.test.tsx      # コンポーネントテスト
├── lib/
│   ├── utils.ts
│   └── utils.test.ts        # ユーティリティテスト
└── __tests__/
    ├── integration/         # 統合テスト
    └── e2e/                # E2Eテスト
```

### テスト実行

```bash
# すべてのテスト実行
npm run test

# ウォッチモード
npm run test:watch

# カバレッジ付き
npm run test:coverage

# E2Eテスト
npm run test:e2e
```

### テスト記述例

```typescript
// コンポーネントテスト
import { render, screen, fireEvent } from '@testing-library/react'
import { SurveyForm } from '@/components/survey/SurveyForm'

describe('SurveyForm', () => {
  it('すべての質問に回答後、送信ボタンが有効になる', () => {
    const mockSubmit = jest.fn()
    render(<SurveyForm onSubmit={mockSubmit} />)

    // 各質問に回答
    const questions = screen.getAllByRole('radiogroup')
    questions.forEach((question) => {
      const option = question.querySelector('input[value="4"]')
      fireEvent.click(option!)
    })

    // 送信ボタンが有効になっているか確認
    const submitButton = screen.getByText('送信')
    expect(submitButton).not.toBeDisabled()
  })
})

// ユーティリティテスト
import { calculateRiskLevel } from '@/lib/utils'

describe('calculateRiskLevel', () => {
  it('スコアが2.5未満の場合、高リスクを返す', () => {
    expect(calculateRiskLevel(2.3)).toBe('high')
  })

  it('スコアが4.0以上の場合、低リスクを返す', () => {
    expect(calculateRiskLevel(4.2)).toBe('low')
  })
})
```

## デバッグ方法

### 1. React Developer Tools

```tsx
// コンポーネントの状態を確認
// Chrome/Firefox拡張機能をインストール
```

### 2. console.logの活用

```typescript
// 開発環境のみでログ出力
if (process.env.NODE_ENV === "development") {
  console.log("Debug info:", { userId, responses });
}

// より高度なログ
console.table(data);
console.time("API Call");
// API呼び出し
console.timeEnd("API Call");
```

### 3. Next.jsデバッグ設定

`.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug",
      "type": "node",
      "request": "launch",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "port": 9229,
      "env": {
        "NODE_OPTIONS": "--inspect"
      }
    }
  ]
}
```

### 4. ネットワークデバッグ

```typescript
// APIリクエストのインターセプト
export async function fetchWithLog(url: string, options?: RequestInit) {
  console.log(`Fetching: ${url}`);
  const start = performance.now();

  try {
    const response = await fetch(url, options);
    const duration = performance.now() - start;
    console.log(`Success: ${url} (${duration.toFixed(2)}ms)`);
    return response;
  } catch (error) {
    console.error(`Error: ${url}`, error);
    throw error;
  }
}
```

## パフォーマンスチューニング

### 1. バンドルサイズ分析

```bash
# バンドル分析
npm run analyze

# 未使用の依存関係確認
npx depcheck
```

### 2. 画像最適化

```tsx
import Image from "next/image";

// Next.js Image最適化を使用
<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority // LCPに重要な画像
  placeholder="blur" // ぼかしプレースホルダー
  blurDataURL="..." // base64エンコードされた画像
/>;
```

### 3. コード分割

```tsx
// 動的インポート
const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
  loading: () => <LoadingSpinner />,
  ssr: false, // クライアントサイドのみ
});

// 条件付き読み込み
if (userRole === "admin") {
  const AdminModule = await import("./AdminModule");
  // 管理者機能を使用
}
```

### 4. メモ化

```tsx
// React.memo
const ExpensiveComponent = React.memo(
  ({ data }) => {
    return <div>{/* 重い処理 */}</div>;
  },
  (prevProps, nextProps) => {
    // カスタム比較ロジック
    return prevProps.data.id === nextProps.data.id;
  },
);

// useMemo
const expensiveValue = useMemo(() => {
  return calculateExpensiveValue(data);
}, [data]);

// useCallback
const handleClick = useCallback(() => {
  // 処理
}, [dependency]);
```

## トラブルシューティング

### よくある問題と解決方法

#### 1. TypeScriptエラー

```bash
# 型定義の再生成
npm run generate:types

# キャッシュクリア
rm -rf .next
npm run build
```

#### 2. スタイルが適用されない

```tsx
// Tailwind CSSのパージ対象確認
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  // ...
};
```

#### 3. ホットリロードが効かない

```bash
# node_modulesとキャッシュをクリア
rm -rf node_modules .next
npm install
npm run dev
```

#### 4. ビルドエラー

```bash
# 詳細なエラーログ
npm run build -- --debug

# 型チェックのみ
npm run type-check
```

### デバッグチェックリスト

- [ ] 環境変数が正しく設定されているか
- [ ] 依存関係が最新か（`npm outdated`）
- [ ] TypeScriptエラーがないか（`npm run type-check`）
- [ ] ESLintエラーがないか（`npm run lint`）
- [ ] テストが通るか（`npm run test`）
- [ ] ビルドが成功するか（`npm run build`）

### パフォーマンスチェックリスト

- [ ] 不要な再レンダリングがないか（React DevTools）
- [ ] バンドルサイズが適切か（`npm run analyze`）
- [ ] 画像が最適化されているか
- [ ] 遅延読み込みが適切に設定されているか
- [ ] APIリクエストが最適化されているか

## 開発に役立つコマンド

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# 本番サーバー起動
npm run start

# リント実行
npm run lint
npm run lint:fix

# 型チェック
npm run type-check

# フォーマット
npm run format

# テスト
npm run test
npm run test:watch
npm run test:coverage

# バンドル分析
npm run analyze

# 依存関係更新チェック
npm outdated

# セキュリティ監査
npm audit
npm audit fix
```
