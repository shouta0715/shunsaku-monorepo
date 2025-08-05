# やめどき予報 - コンポーネントドキュメント

## 目次

1. [コンポーネント設計原則](#コンポーネント設計原則)
2. [コンポーネント階層](#コンポーネント階層)
3. [UIコンポーネント](#uiコンポーネント)
4. [レイアウトコンポーネント](#レイアウトコンポーネント)
5. [機能コンポーネント](#機能コンポーネント)
6. [スタイリングガイド](#スタイリングガイド)
7. [使用例](#使用例)
8. [ベストプラクティス](#ベストプラクティス)

## コンポーネント設計原則

### 1. Atomic Design

コンポーネントを原子レベルから構築し、再利用性を最大化します。

```
Atoms (原子) → Molecules (分子) → Organisms (有機体) → Templates → Pages
```

### 2. 単一責任の原則

各コンポーネントは1つの明確な責任を持ちます。

### 3. 合成可能性

小さなコンポーネントを組み合わせて複雑なUIを構築します。

### 4. 型安全性

TypeScriptを使用してすべてのPropsを厳密に型定義します。

## コンポーネント階層

```
components/
├── ui/                    # 基本UIコンポーネント（Atoms/Molecules）
│   ├── Alert.tsx         # アラート表示
│   ├── Badge.tsx         # バッジ表示
│   ├── Button.tsx        # ボタン
│   ├── Card.tsx          # カードコンテナ
│   ├── Form.tsx          # フォーム要素
│   ├── Input.tsx         # 入力フィールド
│   ├── Label.tsx         # ラベル
│   ├── LoadingSpinner.tsx # ローディング表示
│   └── Select.tsx        # セレクトボックス
│
├── layout/               # レイアウトコンポーネント（Templates）
│   ├── DashboardLayout.tsx # ダッシュボードレイアウト
│   ├── Header.tsx        # ヘッダー
│   └── Sidebar.tsx       # サイドバー
│
├── survey/               # アンケート機能（Organisms）
│   ├── SurveyForm.tsx    # アンケートフォーム
│   └── SurveyCompleted.tsx # 完了画面
│
└── alerts/               # アラート機能（Organisms）
    ├── AlertBadge.tsx    # アラートバッジ
    └── AlertList.tsx     # アラート一覧
```

## UIコンポーネント

### Button

多様なスタイルとサイズに対応するボタンコンポーネント。

```typescript
interface ButtonProps {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}
```

#### 使用例

```tsx
// デフォルトボタン
<Button onClick={handleClick}>送信</Button>

// バリアント指定
<Button variant="destructive">削除</Button>
<Button variant="outline">キャンセル</Button>

// サイズ指定
<Button size="sm">小さいボタン</Button>
<Button size="lg">大きいボタン</Button>

// アイコンボタン
<Button size="icon">
  <Bell className="h-4 w-4" />
</Button>

// リンクとして使用
<Button variant="link" asChild>
  <a href="/dashboard">ダッシュボードへ</a>
</Button>
```

### Card

コンテンツをグループ化するカードコンポーネント。

```typescript
// カード関連コンポーネント
Card: メインコンテナ;
CardHeader: ヘッダー部分;
CardTitle: タイトル;
CardDescription: 説明文;
CardContent: 本文;
CardFooter: フッター部分;
```

#### 使用例

```tsx
<Card>
  <CardHeader>
    <CardTitle>今日の気分</CardTitle>
    <CardDescription>5段階で評価してください</CardDescription>
  </CardHeader>
  <CardContent>{/* コンテンツ */}</CardContent>
  <CardFooter>
    <Button>送信</Button>
  </CardFooter>
</Card>
```

### Alert

情報・警告・エラーメッセージを表示するアラートコンポーネント。

```typescript
interface AlertProps {
  variant?: "default" | "destructive";
  className?: string;
}
```

#### 使用例

```tsx
// 通常のアラート
<Alert>
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>お知らせ</AlertTitle>
  <AlertDescription>
    本日のアンケートが未回答です。
  </AlertDescription>
</Alert>

// エラーアラート
<Alert variant="destructive">
  <AlertTitle>エラー</AlertTitle>
  <AlertDescription>
    送信に失敗しました。
  </AlertDescription>
</Alert>
```

### Badge

ステータスやカテゴリを表示するバッジコンポーネント。

```typescript
interface BadgeProps {
  variant?: "default" | "secondary" | "destructive" | "outline";
}
```

#### 使用例

```tsx
// リスクレベル表示
<Badge variant="destructive">高リスク</Badge>
<Badge variant="secondary">中リスク</Badge>
<Badge variant="outline">低リスク</Badge>

// カウント表示
<Badge>新着 3件</Badge>
```

### Input

入力フィールドコンポーネント。

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // HTML input要素の全属性を継承
}
```

#### 使用例

```tsx
// 基本的な使用
<Input type="email" placeholder="メールアドレス" />

// ラベル付き
<div className="space-y-2">
  <Label htmlFor="email">メールアドレス</Label>
  <Input id="email" type="email" />
</div>

// エラー状態
<Input className="border-red-500" aria-invalid="true" />
```

### LoadingSpinner

ローディング状態を表示するスピナーコンポーネント。

```typescript
interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}
```

#### 使用例

```tsx
// ローディング表示
{isLoading && <LoadingSpinner />}

// サイズ指定
<LoadingSpinner size="sm" />
<LoadingSpinner size="lg" />

// ボタン内での使用
<Button disabled={isLoading}>
  {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
  送信
</Button>
```

## レイアウトコンポーネント

### DashboardLayout

ダッシュボード全体のレイアウトを管理するコンポーネント。

```typescript
interface DashboardLayoutProps {
  children: React.ReactNode;
}
```

#### 機能

- ヘッダーとサイドバーの表示
- 認証チェック
- レスポンシブ対応
- アニメーション付きページ遷移

#### 使用例

```tsx
// app/(dashboard)/layout.tsx
export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
```

### Header

アプリケーションヘッダーコンポーネント。

#### 機能

- ロゴ表示
- ナビゲーションメニュー（モバイル対応）
- ユーザー情報表示
- アラート通知バッジ
- ログアウト機能

### Sidebar

サイドバーナビゲーションコンポーネント。

#### 機能

- ロール別メニュー表示
- アクティブページハイライト
- アイコン付きナビゲーション
- 折りたたみ対応（デスクトップ）

## 機能コンポーネント

### SurveyForm

アンケート回答フォームコンポーネント。

```typescript
interface SurveyFormProps {
  questions: Question[];
  onSubmit: (responses: SurveyResponse[]) => Promise<void>;
}
```

#### 機能

- 5段階評価（天気アイコン）
- 回答進捗表示
- バリデーション
- 送信状態管理
- アニメーション付き遷移

#### 使用例

```tsx
<SurveyForm
  questions={questions}
  onSubmit={async (responses) => {
    await submitSurvey(responses);
    router.push("/survey/completed");
  }}
/>
```

### AlertList

アラート一覧表示コンポーネント。

```typescript
interface AlertListProps {
  alerts: Alert[];
  onMarkAsRead?: (alertId: string) => void;
}
```

#### 機能

- アラートタイプ別アイコン表示
- 未読/既読状態管理
- フィルタリング機能
- 一括既読機能

### AlertBadge

アラート通知バッジコンポーネント。

```typescript
interface AlertBadgeProps {
  count: number;
  variant?: "default" | "destructive";
}
```

## スタイリングガイド

### Tailwind CSS使用規則

1. **ユーティリティファースト**

   ```tsx
   // Good
   <div className="flex items-center space-x-4 p-4">

   // Avoid
   <div style={{ display: 'flex', alignItems: 'center' }}>
   ```

2. **レスポンシブデザイン**

   ```tsx
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
   ```

3. **ダークモード対応**
   ```tsx
   <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
   ```

### カラーパレット

```css
/* 天気状態の色 */
--weather-storm: #6b7280; /* 嵐 - グレー */
--weather-rain: #3b82f6; /* 雨 - ブルー */
--weather-cloudy: #f59e0b; /* 曇り - オレンジ */
--weather-sunny: #eab308; /* 晴れ - イエロー */
--weather-clear: #10b981; /* 快晴 - グリーン */

/* リスクレベルの色 */
--risk-high: #ef4444; /* 高リスク - レッド */
--risk-medium: #f59e0b; /* 中リスク - オレンジ */
--risk-low: #10b981; /* 低リスク - グリーン */
```

### アニメーション

Framer Motionを使用した滑らかなアニメーション。

```tsx
import { motion } from 'framer-motion'

// フェードイン
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
>
  コンテンツ
</motion.div>

// スライドイン
<motion.div
  initial={{ x: -20, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ duration: 0.3 }}
>
  コンテンツ
</motion.div>
```

## 使用例

### ダッシュボードカード

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Badge } from "@/components/ui";
import { TrendingUp } from "lucide-react";

function RiskLevelCard({ score, trend }: { score: number; trend: string }) {
  const riskLevel = getRiskLevel(score);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>リスクレベル</CardTitle>
        <Badge variant={riskLevel === "high" ? "destructive" : "outline"}>
          {riskLevel}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <span className="text-3xl font-bold">{score.toFixed(1)}</span>
          {trend === "up" && <TrendingUp className="h-4 w-4 text-green-500" />}
        </div>
        <p className="text-muted-foreground mt-2 text-sm">
          先週比 {trend === "up" ? "+" : "-"}0.3ポイント
        </p>
      </CardContent>
    </Card>
  );
}
```

### フォームコンポーネント

```tsx
import { Button, Input, Label } from "@/components/ui";
import { useState } from "react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">メールアドレス</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">パスワード</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <Button type="submit" className="w-full">
        ログイン
      </Button>
    </form>
  );
}
```

## ベストプラクティス

### 1. コンポーネントの分割

- 100行を超えるコンポーネントは分割を検討
- ロジックとUIを分離（カスタムフック使用）
- 再利用可能な部分を抽出

### 2. Props設計

```typescript
// Good - 明確で型安全
interface UserCardProps {
  user: User;
  onEdit?: (userId: string) => void;
  isEditable?: boolean;
}

// Avoid - 曖昧で型安全でない
interface UserCardProps {
  data: any;
  callback?: Function;
  options?: any;
}
```

### 3. エラーハンドリング

```tsx
function DataDisplay({ data }: { data?: Data }) {
  if (!data) {
    return <EmptyState message="データがありません" />;
  }

  return (
    <ErrorBoundary fallback={<ErrorMessage />}>
      {/* データ表示 */}
    </ErrorBoundary>
  );
}
```

### 4. アクセシビリティ

- 適切なARIAラベル使用
- キーボードナビゲーション対応
- スクリーンリーダー対応
- 十分なカラーコントラスト

### 5. パフォーマンス

- `React.memo`で不要な再レンダリング防止
- 大きなリストは仮想化
- 画像は`next/image`使用
- 動的インポートで遅延読み込み

### 6. テスト

```tsx
// コンポーネントテストの例
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/Button";

describe("Button", () => {
  it("renders with text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("handles click events", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    screen.getByText("Click me").click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```
