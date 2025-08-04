# 離職リスク予測ダッシュボード - 実装タスク計画書

## プロジェクト概要

**アプリ名**: 離職リスク予測ダッシュボード  
**キャッチコピー**: 「日々の声から、未来の離職をゼロへ。」  
**実装期間**: 8-12週間（3フェーズ）  
**開発者数**: 2-3名想定

---

## 1. 実装フェーズ分け

### Phase 1: MVP基本機能 (4-5週間) - 優先度: 最高

**目標**: 基本的なアンケート・ダッシュボード機能の実装

**主要機能**:

- ユーザー認証・管理システム
- 日次アンケート機能
- 基本スコアリング機能
- 個人ダッシュボード
- 管理者ダッシュボード（基本版）

**完成条件**:

- 社員がアンケートに回答できる
- 個人・管理者が基本的なスコア確認できる
- 基本的なリスクレベル判定が動作する

### Phase 2: 分析・アラート機能 (3-4週間) - 優先度: 高

**目標**: 高度な分析・通知機能の実装

**主要機能**:

- 詳細分析機能（トレンド、比較分析）
- リアルタイムアラートシステム
- レポート生成機能
- 人事ダッシュボード
- 通知システム

**完成条件**:

- アラート機能が正常に動作する
- 詳細なレポート生成が可能
- 人事向け全社分析が利用可能

### Phase 3: 高度な機能 (3-4週間) - 優先度: 中

**目標**: 予測分析・カスタマイゼーション機能

**主要機能**:

- AI予測分析機能
- カスタムレポート機能
- 外部システム連携
- モバイル最適化
- 高度なセキュリティ機能

**完成条件**:

- 予測モデルが稼働
- 外部連携が動作
- 全機能がモバイル対応

---

## 2. アトミックタスク分解

### Phase 1: MVP基本機能

#### 2.1 プロジェクト基盤セットアップ (並列実行可能)

**T001: Next.js プロジェクト初期設定**

- **期間**: 1日
- **担当**: フロントエンド開発者
- **内容**:
  - Next.js 15 + TypeScript設定
  - Tailwind CSS設定
  - ESLint/Prettier設定
  - 基本ディレクトリ構造作成
- **成果物**:
  ```
  src/
  ├── app/
  ├── components/
  ├── lib/
  ├── types/
  └── hooks/
  ```
- **受入基準**: `npm run build` が成功する

**T002: データベース設計・セットアップ**

- **期間**: 1-2日
- **担当**: バックエンド開発者
- **内容**:
  - PostgreSQL接続設定
  - migration ファイル作成
  - 初期スキーマ実装
- **成果物**:
  ```sql
  -- users, questions, surveys, survey_responses, daily_scores テーブル
  ```
- **受入基準**: 全テーブルが正常に作成される

**T003: 認証システム基盤**

- **期間**: 2-3日
- **担当**: フルスタック開発者
- **内容**:
  - NextAuth.js設定
  - JWT実装
  - ロールベース認可
  - ミドルウェア実装
- **成果物**:
  ```typescript
  // lib/auth.ts
  // middleware.ts
  // app/api/auth/[...nextauth]/route.ts
  ```
- **受入基準**: ログイン・ログアウトが動作する

#### 2.2 基本UI実装 (並列実行可能)

**T004: デザインシステム実装**

- **期間**: 2日
- **担当**: フロントエンド開発者
- **依存**: T001
- **内容**:
  - 基本コンポーネント（Button, Input, Card等）
  - カラーパレット・タイポグラフィ
  - レスポンシブブレークポイント
- **成果物**:
  ```typescript
  // components/ui/Button.tsx
  // components/ui/Input.tsx
  // components/ui/Card.tsx
  // lib/utils.ts (cn function)
  ```
- **受入基準**: Storybookまたはサンプルページで確認

**T005: レイアウト・ナビゲーション**

- **期間**: 2日
- **担当**: フロントエンド開発者
- **依存**: T003, T004
- **内容**:
  - RootLayout実装
  - DashboardLayout実装
  - Header・Sidebar コンポーネント
  - ロール別ナビゲーション
- **成果物**:
  ```typescript
  // app/layout.tsx
  // app/(dashboard)/layout.tsx
  // components/layout/Header.tsx
  // components/layout/Sidebar.tsx
  ```
- **受入基準**: 認証状態に応じた表示切り替え

#### 2.3 アンケート機能実装

**T006: アンケート質問管理API**

- **期間**: 1-2日
- **担当**: バックエンド開発者
- **依存**: T002
- **内容**:
  - 質問CRUD API実装
  - 質問データの初期登録
  - バリデーション実装
- **成果物**:
  ```typescript
  // app/api/questions/route.ts
  // app/api/questions/[id]/route.ts
  // lib/validations/question.ts
  ```
- **受入基準**: Postmanでテスト成功

**T007: 日次アンケート回答機能**

- **期間**: 3日
- **担当**: フルスタック開発者
- **依存**: T005, T006
- **内容**:
  - アンケート回答UI実装
  - 回答送信API実装
  - 重複回答防止
  - 回答状況確認
- **成果物**:
  ```typescript
  // app/(dashboard)/survey/page.tsx
  // components/survey/DailySurvey.tsx
  // components/survey/QuestionCard.tsx
  // app/api/survey/route.ts
  ```
- **受入基準**: 実際に回答送信・保存できる

#### 2.4 スコアリング機能実装

**T008: スコア計算ロジック**

- **期間**: 2-3日
- **担当**: バックエンド開発者
- **依存**: T007
- **内容**:
  - 基本スコア計算実装
  - リスクレベル判定
  - 日次スコア更新バッチ
  - トレンド計算
- **成果物**:
  ```typescript
  // lib/scoring.ts
  // app/api/scores/route.ts
  // scripts/calculate-daily-scores.ts
  ```
- **受入基準**: テストデータで正確な計算結果

**T009: 個人ダッシュボード実装**

- **期間**: 3-4日
- **担当**: フロントエンド開発者
- **依存**: T008
- **内容**:
  - 個人スコア表示
  - スコア推移グラフ
  - レーダーチャート
  - 基本統計表示
- **成果物**:
  ```typescript
  // app/(dashboard)/dashboard/page.tsx
  // components/dashboard/PersonalDashboard.tsx
  // components/charts/ScoreChart.tsx
  // components/charts/RadarChart.tsx
  ```
- **受入基準**: 実データでグラフ正常表示

#### 2.5 管理者機能実装

**T010: 管理者ダッシュボード基本版**

- **期間**: 3-4日
- **担当**: フルスタック開発者
- **依存**: T009
- **内容**:
  - チームメンバー一覧
  - 基本統計表示
  - リスク高メンバー表示
  - 部下のスコア確認
- **成果物**:
  ```typescript
  // app/(dashboard)/dashboard/team/page.tsx
  // components/dashboard/TeamDashboard.tsx
  // components/dashboard/MemberList.tsx
  // app/api/team/stats/route.ts
  ```
- **受入基準**: 管理者権限で部下情報確認可能

### Phase 2: 分析・アラート機能

#### 2.6 詳細分析機能

**T011: 高度な分析API実装**

- **期間**: 3日
- **担当**: バックエンド開発者
- **依存**: T010
- **内容**:
  - 部署別比較分析
  - 時系列トレンド分析
  - 相関分析機能
  - 統計データキャッシュ
- **成果物**:
  ```typescript
  // app/api/analytics/department/route.ts
  // app/api/analytics/trends/route.ts
  // lib/analytics.ts
  // lib/cache.ts
  ```
- **受入基準**: 複雑なクエリが3秒以内で完了

**T012: 詳細分析UI実装**

- **期間**: 4日
- **担当**: フロントエンド開発者
- **依存**: T011
- **内容**:
  - 比較分析チャート
  - フィルタリング機能
  - データエクスポート
  - インタラクティブグラフ
- **成果物**:
  ```typescript
  // components/analytics/ComparisonChart.tsx
  // components/analytics/FilterPanel.tsx
  // components/analytics/ExportButton.tsx
  // hooks/useAnalytics.ts
  ```
- **受入基準**: 各種フィルタ・エクスポートが動作

#### 2.7 アラートシステム

**T013: アラート検知エンジン**

- **期間**: 3-4日
- **担当**: バックエンド開発者
- **依存**: T011
- **内容**:
  - リアルタイムスコア監視
  - アラート条件判定
  - 通知キュー実装
  - バッチ処理設定
- **成果物**:
  ```typescript
  // lib/alert-engine.ts
  // app/api/alerts/route.ts
  // scripts/alert-processor.ts
  ```
- **受入基準**: 条件に応じたアラート自動生成

**T014: 通知システム実装**

- **期間**: 2-3日
- **担当**: フルスタック開発者
- **依存**: T013
- **内容**:
  - メール通知実装
  - アプリ内通知
  - 通知設定管理
  - 通知履歴
- **成果物**:
  ```typescript
  // lib/email.ts
  // components/notifications/NotificationBell.tsx
  // app/api/notifications/route.ts
  ```
- **受入基準**: 実際にメール・アプリ内通知受信

#### 2.8 レポート機能

**T015: レポート生成エンジン**

- **期間**: 3日
- **担当**: バックエンド開発者
- **依存**: T011
- **内容**:
  - 週次・月次レポート生成
  - PDF出力機能
  - レポートテンプレート
  - スケジュール実行
- **成果物**:
  ```typescript
  // lib/report-generator.ts
  // app/api/reports/route.ts
  // templates/report-template.tsx
  ```
- **受入基準**: PDF形式でレポート出力

**T016: 人事ダッシュボード**

- **期間**: 4日
- **担当**: フロントエンド開発者
- **依存**: T015
- **内容**:
  - 全社統計表示
  - 部署別ランキング
  - 予測分析表示
  - カスタムレポート
- **成果物**:
  ```typescript
  // app/(dashboard)/dashboard/admin/page.tsx
  // components/dashboard/AdminDashboard.tsx
  // components/dashboard/CompanyStats.tsx
  ```
- **受入基準**: 人事権限で全社データ確認可能

### Phase 3: 高度な機能

#### 2.9 予測分析機能

**T017: 予測モデル実装**

- **期間**: 5日
- **担当**: データサイエンス開発者
- **依存**: T016
- **内容**:
  - 機械学習モデル実装
  - 離職予測アルゴリズム
  - モデル学習・更新
  - 予測精度評価
- **成果物**:
  ```typescript
  // lib/ml-model.ts
  // scripts/train-model.ts
  // app/api/predictions/route.ts
  ```
- **受入基準**: 予測精度80%以上

**T018: 外部システム連携**

- **期間**: 3-4日
- **担当**: バックエンド開発者
- **依存**: T017
- **内容**:
  - 人事システム連携API
  - Slack/Teams連携
  - データ同期機能
  - Webhook実装
- **成果物**:
  ```typescript
  // lib/integrations/hr-system.ts
  // lib/integrations/slack.ts
  // app/api/webhooks/route.ts
  ```
- **受入基準**: 実際のシステム連携動作確認

---

## 3. 技術タスク詳細

### 3.1 データベース実装タスク

```sql
-- T002で実装するスキーマ
CREATE DATABASE employee_satisfaction;

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    manager_id UUID REFERENCES users(id),
    role VARCHAR(20) CHECK (role IN ('employee', 'manager', 'hr', 'admin')) DEFAULT 'employee',
    hire_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 初期データ投入スクリプト
INSERT INTO questions (text, category, weight) VALUES
('今日の業務負荷はどうでしたか？', 'workload', 1.0),
('上司・同僚との関係はどうでしたか？', 'relationships', 1.2),
('今日の達成感はどうでしたか？', 'achievement', 1.0),
('仕事へのモチベーションはどうでしたか？', 'motivation', 1.3),
('明日も頑張ろうと思いますか？', 'future_outlook', 1.1);
```

### 3.2 API実装タスク

```typescript
// T006: 質問管理API実装例
// app/api/questions/route.ts
export async function GET() {
  const questions = await db.query(`
    SELECT * FROM questions 
    WHERE is_active = true 
    ORDER BY created_at ASC
  `);
  return NextResponse.json(questions.rows);
}

// T007: アンケート回答API実装例
// app/api/survey/route.ts
export async function POST(request: NextRequest) {
  const body = await request.json();
  const validatedData = SurveyResponseSchema.parse(body);
  const user = getCurrentUser(request);

  // 重複チェック
  const existingSurvey = await checkExistingSurvey(user.id, new Date());
  if (existingSurvey) {
    return NextResponse.json(
      { error: "Survey already submitted today" },
      { status: 400 },
    );
  }

  // 回答保存
  const survey = await createSurvey(user.id, validatedData.responses);

  // スコア計算
  await calculateDailyScore(user.id, survey.id);

  return NextResponse.json(survey, { status: 201 });
}
```

### 3.3 フロントエンド実装タスク

```typescript
// T004: 基本コンポーネント実装例
// components/ui/Button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        {
          'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500': variant === 'primary',
          'bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-500': variant === 'secondary',
          'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500': variant === 'danger',
        },
        {
          'h-8 px-3 text-sm': size === 'sm',
          'h-10 px-4 text-sm': size === 'md',
          'h-12 px-6 text-base': size === 'lg',
        },
        className
      )}
      disabled={loading}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
}

// T007: アンケート回答コンポーネント実装例
// components/survey/DailySurvey.tsx
export function DailySurvey() {
  const [responses, setResponses] = useState<Record<string, number>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { data: questions, isLoading } = useSWR('/api/questions', fetcher)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const surveyData = {
        responses: Object.entries(responses).map(([questionId, score]) => ({
          questionId,
          score
        }))
      }

      await fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(surveyData)
      })

      toast.success('アンケートを送信しました')
      router.push('/dashboard')
    } catch (error) {
      toast.error('送信に失敗しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) return <SurveySkeleton />

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>今日のアンケート</CardTitle>
        <CardDescription>
          以下の質問にお答えください（5段階評価）
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {questions?.map((question: Question) => (
            <QuestionCard
              key={question.id}
              question={question}
              value={responses[question.id] || 0}
              onChange={(value) =>
                setResponses(prev => ({ ...prev, [question.id]: value }))
              }
            />
          ))}
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            disabled={Object.keys(responses).length !== questions?.length || isSubmitting}
            loading={isSubmitting}
            className="w-full"
          >
            回答を送信
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
```

---

## 4. ファイル構造・コード生成計画

### 4.1 完全ディレクトリ構造

```
src/
├── app/                                    # Next.js App Router
│   ├── (auth)/                            # 認証関連グループ
│   │   ├── login/
│   │   │   └── page.tsx                   # ログインページ
│   │   ├── register/
│   │   │   └── page.tsx                   # 登録ページ
│   │   └── layout.tsx                     # 認証レイアウト
│   │
│   ├── (dashboard)/                       # ダッシュボードグループ
│   │   ├── dashboard/
│   │   │   ├── page.tsx                   # 個人ダッシュボード
│   │   │   ├── team/
│   │   │   │   └── page.tsx               # チームダッシュボード
│   │   │   └── admin/
│   │   │       └── page.tsx               # 管理者ダッシュボード
│   │   │
│   │   ├── survey/
│   │   │   ├── page.tsx                   # 日次アンケート
│   │   │   └── history/
│   │   │       └── page.tsx               # 回答履歴
│   │   │
│   │   ├── analytics/
│   │   │   ├── page.tsx                   # 分析ページ
│   │   │   └── reports/
│   │   │       └── page.tsx               # レポート一覧
│   │   │
│   │   ├── settings/
│   │   │   ├── page.tsx                   # 設定ページ
│   │   │   └── profile/
│   │   │       └── page.tsx               # プロフィール設定
│   │   │
│   │   └── layout.tsx                     # ダッシュボードレイアウト
│   │
│   ├── api/                               # API Routes
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts               # NextAuth設定
│   │   │
│   │   ├── users/
│   │   │   ├── route.ts                   # GET/POST /api/users
│   │   │   ├── [id]/
│   │   │   │   └── route.ts               # GET/PUT/DELETE /api/users/[id]
│   │   │   └── profile/
│   │   │       └── route.ts               # GET/PUT /api/users/profile
│   │   │
│   │   ├── questions/
│   │   │   ├── route.ts                   # GET/POST /api/questions
│   │   │   └── [id]/
│   │   │       └── route.ts               # GET/PUT/DELETE /api/questions/[id]
│   │   │
│   │   ├── survey/
│   │   │   ├── route.ts                   # POST /api/survey
│   │   │   ├── daily/
│   │   │   │   └── route.ts               # GET /api/survey/daily
│   │   │   └── history/
│   │   │       └── route.ts               # GET /api/survey/history
│   │   │
│   │   ├── scores/
│   │   │   ├── route.ts                   # GET /api/scores
│   │   │   ├── personal/
│   │   │   │   └── route.ts               # GET /api/scores/personal
│   │   │   └── calculate/
│   │   │       └── route.ts               # POST /api/scores/calculate
│   │   │
│   │   ├── analytics/
│   │   │   ├── personal/
│   │   │   │   └── route.ts               # GET /api/analytics/personal
│   │   │   ├── team/
│   │   │   │   └── route.ts               # GET /api/analytics/team
│   │   │   ├── company/
│   │   │   │   └── route.ts               # GET /api/analytics/company
│   │   │   └── trends/
│   │   │       └── route.ts               # GET /api/analytics/trends
│   │   │
│   │   ├── alerts/
│   │   │   ├── route.ts                   # GET/POST /api/alerts
│   │   │   └── [id]/
│   │   │       └── route.ts               # PUT /api/alerts/[id]
│   │   │
│   │   ├── reports/
│   │   │   ├── route.ts                   # GET/POST /api/reports
│   │   │   └── generate/
│   │   │       └── route.ts               # POST /api/reports/generate
│   │   │
│   │   └── notifications/
│   │       ├── route.ts                   # GET /api/notifications
│   │       └── mark-read/
│   │           └── route.ts               # POST /api/notifications/mark-read
│   │
│   ├── globals.css                        # グローバルCSS
│   ├── layout.tsx                         # ルートレイアウト
│   └── page.tsx                           # ホームページ
│
├── components/                            # Reactコンポーネント
│   ├── ui/                               # 基本UIコンポーネント
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Dialog.tsx
│   │   ├── Select.tsx
│   │   ├── Textarea.tsx
│   │   ├── Badge.tsx
│   │   ├── Alert.tsx
│   │   ├── Skeleton.tsx
│   │   └── index.ts                       # エクスポート
│   │
│   ├── layout/                           # レイアウトコンポーネント
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Navigation.tsx
│   │   ├── UserMenu.tsx
│   │   └── Footer.tsx
│   │
│   ├── auth/                             # 認証コンポーネント
│   │   ├── LoginForm.tsx
│   │   ├── AuthProvider.tsx
│   │   └── ProtectedRoute.tsx
│   │
│   ├── survey/                           # アンケートコンポーネント
│   │   ├── DailySurvey.tsx
│   │   ├── QuestionCard.tsx
│   │   ├── SurveyHistory.tsx
│   │   └── ProgressBar.tsx
│   │
│   ├── dashboard/                        # ダッシュボードコンポーネント
│   │   ├── PersonalDashboard.tsx
│   │   ├── TeamDashboard.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── ScoreCard.tsx
│   │   ├── MemberList.tsx
│   │   └── CompanyStats.tsx
│   │
│   ├── charts/                           # チャートコンポーネント
│   │   ├── ScoreChart.tsx
│   │   ├── RadarChart.tsx
│   │   ├── TrendChart.tsx
│   │   └── ComparisonChart.tsx
│   │
│   ├── analytics/                        # 分析コンポーネント
│   │   ├── AnalyticsView.tsx
│   │   ├── FilterPanel.tsx
│   │   ├── ExportButton.tsx
│   │   └── ReportGenerator.tsx
│   │
│   ├── alerts/                           # アラートコンポーネント
│   │   ├── AlertList.tsx
│   │   ├── AlertItem.tsx
│   │   └── NotificationBell.tsx
│   │
│   └── common/                           # 共通コンポーネント
│       ├── LoadingSpinner.tsx
│       ├── ErrorBoundary.tsx
│       ├── DataTable.tsx
│       └── Pagination.tsx
│
├── lib/                                  # ユーティリティ・設定
│   ├── auth.ts                          # 認証関連
│   ├── database.ts                      # データベース接続
│   ├── validations/                     # Zodスキーマ
│   │   ├── auth.ts
│   │   ├── survey.ts
│   │   ├── user.ts
│   │   └── index.ts
│   ├── scoring.ts                       # スコア計算ロジック
│   ├── analytics.ts                     # 分析ロジック
│   ├── cache.ts                         # キャッシュ管理
│   ├── email.ts                         # メール送信
│   ├── encryption.ts                    # 暗号化
│   ├── monitoring.ts                    # モニタリング
│   ├── alert-engine.ts                  # アラートエンジン
│   ├── report-generator.ts              # レポート生成
│   ├── ml-model.ts                      # 機械学習モデル
│   ├── integrations/                    # 外部連携
│   │   ├── hr-system.ts
│   │   ├── slack.ts
│   │   └── teams.ts
│   └── utils.ts                         # 汎用ユーティリティ
│
├── hooks/                               # カスタムフック
│   ├── useAuth.ts
│   ├── useSurvey.ts
│   ├── useAnalytics.ts
│   ├── useScores.ts
│   ├── useAlerts.ts
│   ├── useReports.ts
│   └── useLocalStorage.ts
│
├── store/                               # Zustand状態管理
│   ├── authStore.ts
│   ├── surveyStore.ts
│   ├── analyticsStore.ts
│   ├── alertStore.ts
│   └── index.ts
│
├── types/                               # TypeScript型定義
│   ├── auth.ts
│   ├── user.ts
│   ├── survey.ts
│   ├── analytics.ts
│   ├── alert.ts
│   ├── report.ts
│   ├── api.ts
│   └── index.ts
│
├── styles/                              # スタイル
│   ├── globals.css
│   └── components.css
│
├── scripts/                             # ユーティリティスクリプト
│   ├── calculate-daily-scores.ts
│   ├── alert-processor.ts
│   ├── train-model.ts
│   └── migrate.ts
│
└── __tests__/                           # テスト
    ├── components/
    ├── api/
    ├── lib/
    ├── hooks/
    └── __mocks__/
```

### 4.2 TypeScript型定義

```typescript
// types/index.ts - 中央集約型定義
export interface User {
  id: string;
  email: string;
  name: string;
  department: string;
  position: string;
  managerId?: string;
  role: UserRole;
  hireDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = "employee" | "manager" | "hr" | "admin";

export interface Question {
  id: string;
  text: string;
  category: string;
  weight: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Survey {
  id: string;
  userId: string;
  surveyDate: Date;
  totalScore: number;
  submittedAt: Date;
  responses: SurveyResponse[];
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  questionId: string;
  score: number;
  createdAt: Date;
}

export interface DailyScore {
  id: string;
  userId: string;
  scoreDate: Date;
  totalScore: number;
  riskLevel: RiskLevel;
  calculatedAt: Date;
  categoryScores: CategoryScore[];
}

export type RiskLevel = "low" | "medium" | "high";

export interface CategoryScore {
  category: string;
  score: number;
  weight: number;
}

export interface Alert {
  id: string;
  userId: string;
  targetUserId?: string;
  type: AlertType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export type AlertType = "high_risk" | "score_drop" | "no_response" | "system";

export interface PersonalAnalytics {
  currentScore: number;
  riskLevel: RiskLevel;
  scoreHistory: ScorePoint[];
  categoryScores: CategoryScore[];
  trends: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  comparisonData: ComparisonData;
}

export interface ScorePoint {
  date: string;
  score: number;
  riskLevel: RiskLevel;
}

export interface TeamAnalytics {
  teamStats: {
    averageScore: number;
    riskDistribution: RiskDistribution;
    responseRate: number;
  };
  members: TeamMemberSummary[];
  trends: TeamTrend[];
  departmentComparison: DepartmentComparison[];
}

export interface RiskDistribution {
  low: number;
  medium: number;
  high: number;
}

export interface TeamMemberSummary {
  id: string;
  name: string;
  position: string;
  currentScore: number;
  riskLevel: RiskLevel;
  trend: number;
  lastResponseDate: Date;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// フォーム関連の型
export interface LoginFormData {
  email: string;
  password: string;
}

export interface SurveyFormData {
  responses: {
    questionId: string;
    score: number;
  }[];
}

export interface ProfileFormData {
  name: string;
  department: string;
  position: string;
}
```

---

## 5. テスト戦略

### 5.1 ユニットテスト計画

**テストフレームワーク**: Jest + Testing Library

```typescript
// __tests__/lib/scoring.test.ts
import { calculateRiskLevel, calculateScore } from '@/lib/scoring'

describe('Scoring Logic', () => {
  describe('calculateScore', () => {
    it('should calculate weighted average correctly', () => {
      const responses = [
        { questionId: 'q1', score: 4, weight: 1.0 },
        { questionId: 'q2', score: 3, weight: 1.2 },
        { questionId: 'q3', score: 5, weight: 0.8 }
      ]

      const result = calculateScore(responses)
      expect(result).toBeCloseTo(3.87) // 期待値計算
    })
  })

  describe('calculateRiskLevel', () => {
    it('should return high risk for low scores', () => {
      expect(calculateRiskLevel([50, 55, 45])).toBe('high')
    })

    it('should return low risk for high scores', () => {
      expect(calculateRiskLevel([85, 90, 88])).toBe('low')
    })
  })
})

// __tests__/components/survey/QuestionCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { QuestionCard } from '@/components/survey/QuestionCard'

describe('QuestionCard', () => {
  const mockQuestion = {
    id: 'q1',
    text: 'テスト質問',
    category: 'test',
    weight: 1.0,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  it('renders question text correctly', () => {
    render(
      <QuestionCard
        question={mockQuestion}
        value={3}
        onChange={() => {}}
      />
    )

    expect(screen.getByText('テスト質問')).toBeInTheDocument()
  })

  it('calls onChange when score is selected', () => {
    const mockOnChange = jest.fn()

    render(
      <QuestionCard
        question={mockQuestion}
        value={0}
        onChange={mockOnChange}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: '4' }))
    expect(mockOnChange).toHaveBeenCalledWith(4)
  })
})
```

### 5.2 統合テスト計画

```typescript
// __tests__/api/survey.integration.test.ts
import { createMocks } from "node-mocks-http";
import handler from "@/app/api/survey/route";

describe("/api/survey integration", () => {
  beforeEach(async () => {
    // テストデータベースセットアップ
    await setupTestDatabase();
  });

  afterEach(async () => {
    // テストデータクリーンアップ
    await cleanupTestDatabase();
  });

  it("should create survey and calculate score", async () => {
    const { req, res } = createMocks({
      method: "POST",
      headers: {
        authorization: "Bearer valid-test-token",
      },
      body: {
        responses: [
          { questionId: "q1", score: 4 },
          { questionId: "q2", score: 3 },
          { questionId: "q3", score: 5 },
        ],
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);

    const responseData = JSON.parse(res._getData());
    expect(responseData.totalScore).toBeGreaterThan(0);

    // データベースに保存されているか確認
    const savedSurvey = await getSurveyFromDB(responseData.id);
    expect(savedSurvey).toBeTruthy();
  });
});
```

### 5.3 E2Eテスト計画

**テストフレームワーク**: Playwright

```typescript
// __tests__/e2e/survey-flow.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Survey Flow", () => {
  test.beforeEach(async ({ page }) => {
    // ログイン
    await page.goto("/login");
    await page.fill("[data-testid=email]", "test@example.com");
    await page.fill("[data-testid=password]", "password123");
    await page.click("[data-testid=login-button]");

    await expect(page).toHaveURL("/dashboard");
  });

  test("should complete daily survey", async ({ page }) => {
    // アンケートページに移動
    await page.click("[data-testid=survey-link]");
    await expect(page).toHaveURL("/survey");

    // 全質問に回答
    const questions = await page.locator("[data-testid=question]").count();

    for (let i = 0; i < questions; i++) {
      await page.click(`[data-testid=question-${i}] [data-score="4"]`);
    }

    // 送信
    await page.click("[data-testid=submit-button]");

    // 成功メッセージ確認
    await expect(page.locator("[data-testid=success-message]")).toBeVisible();

    // ダッシュボードリダイレクト確認
    await expect(page).toHaveURL("/dashboard");

    // スコアが表示されているか確認
    await expect(page.locator("[data-testid=current-score]")).toBeVisible();
  });

  test("should prevent duplicate submission", async ({ page }) => {
    // 既に回答済みの状態でアンケートページにアクセス
    await page.goto("/survey");

    // 既に回答済みメッセージが表示される
    await expect(
      page.locator("text=今日のアンケートは既に回答済みです"),
    ).toBeVisible();
  });
});
```

---

## 6. 品質保証プロセス

### 6.1 コードレビューチェックリスト

**機能実装レビュー**:

- [ ] 要件通りの機能が実装されている
- [ ] エラーハンドリングが適切
- [ ] バリデーションが実装されている
- [ ] セキュリティ対策が考慮されている

**コード品質レビュー**:

- [ ] TypeScript型定義が適切
- [ ] ESLint/Prettierルールに準拠
- [ ] コメントが適切に記載されている
- [ ] テストが実装されている

**パフォーマンスレビュー**:

- [ ] データベースクエリが最適化されている
- [ ] 不要なre-renderがない
- [ ] 画像・アセットが最適化されている
- [ ] キャッシュが適切に利用されている

### 6.2 自動品質チェック

```json
// package.json scripts
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "pre-commit": "npm run lint && npm run type-check && npm run test",
    "pre-push": "npm run build && npm run test:e2e"
  }
}

// .github/workflows/quality.yml
name: Quality Check

on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test:coverage
      - run: npm run build

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
```

---

## 7. デプロイメント計画

### 7.1 環境設定

**環境分離**:

- **Development**: ローカル開発環境
- **Staging**: テスト・デモ環境（本番データのコピー）
- **Production**: 本番環境

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    JWT_SECRET: process.env.JWT_SECRET,
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
  experimental: {
    serverComponentsExternalPackages: ['bcrypt'],
  },
}

module.exports = nextConfig

// 環境変数テンプレート (.env.example)
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/employee_satisfaction
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
JWT_SECRET=your-jwt-secret
ENCRYPTION_KEY=32-character-hex-key
RESEND_API_KEY=your-resend-api-key
REDIS_URL=redis://localhost:6379
```

### 7.2 CI/CDパイプライン

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run linting
        run: npm run lint

      - name: Run type check
        run: npm run type-check

      - name: Run unit tests
        run: npm run test:coverage
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db

      - name: Build application
        run: npm run build

      - name: Run E2E tests
        run: npm run test:e2e
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Vercel
        uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: "--prod"

      - name: Run database migrations
        run: npm run migrate
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}

      - name: Notify deployment
        uses: 8398a7/action-slack@v3
        with:
          status: success
          text: "Deployment completed successfully!"
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

---

## 8. 実装順序・依存関係

### 8.1 実装スケジュール（12週間）

```mermaid
gantt
    title 離職リスク予測ダッシュボード実装スケジュール
    dateFormat  YYYY-MM-DD
    section Phase 1 - MVP
    プロジェクト基盤     :t001, 2025-08-04, 1d
    データベースセットアップ :t002, 2025-08-04, 2d
    認証システム        :t003, after t001, 3d
    デザインシステム     :t004, after t001, 2d
    レイアウト実装      :t005, after t003 t004, 2d
    アンケート質問API   :t006, after t002, 2d
    アンケート回答機能   :t007, after t005 t006, 3d
    スコア計算ロジック   :t008, after t007, 3d
    個人ダッシュボード   :t009, after t008, 4d
    管理者ダッシュボード :t010, after t009, 4d

    section Phase 2 - 分析機能
    高度分析API        :t011, after t010, 3d
    詳細分析UI         :t012, after t011, 4d
    アラート検知エンジン :t013, after t011, 4d
    通知システム       :t014, after t013, 3d
    レポート生成       :t015, after t011, 3d
    人事ダッシュボード  :t016, after t015, 4d

    section Phase 3 - 高度機能
    予測モデル         :t017, after t016, 5d
    外部システム連携    :t018, after t017, 4d
```

### 8.2 並列実行可能タスク

**Week 1 並列実行**:

- T001: Next.js プロジェクト初期設定
- T002: データベース設計・セットアップ
- T004: デザインシステム実装（T001完了後）

**Week 2-3 並列実行**:

- T006: アンケート質問管理API（T002完了後）
- T005: レイアウト・ナビゲーション（T003, T004完了後）

**Week 8-9 並列実行**:

- T011: 高度な分析API実装
- T013: アラート検知エンジン（T011と並列可能）

**Week 11-12 並列実行**:

- T017: 予測モデル実装
- T018: 外部システム連携（一部T017と並列可能）

### 8.3 クリティカルパス

**ブロッカータスク（他のタスクの前提条件）**:

1. T001: プロジェクト基盤 → 全フロントエンドタスク
2. T002: データベース → 全APIタスク
3. T003: 認証システム → 全保護されたページ・API
4. T008: スコア計算 → 全分析機能

**リスク管理**:

- T003の認証実装が遅延した場合 → シンプルな認証から開始
- T008のスコア計算が複雑な場合 → 基本版から段階的実装
- T017の予測モデルが困難な場合 → 統計ベース分析に変更

---

## 9. README自動生成指示

### 9.1 README生成要件

実装完了後、以下の内容を含む包括的なREADME.mdを自動生成してください:

````markdown
# 離職リスク予測ダッシュボード

> 「日々の声から、未来の離職をゼロへ。」

社員の日々の満足度を可視化し、離職リスクを早期発見する次世代HRダッシュボード

## ✨ 主要機能

- 📊 **日次アンケート**: 5問5択の簡単回答で満足度をスコア化
- 📈 **リアルタイム分析**: 個人・チーム・全社の満足度推移を可視化
- ⚠️ **アラート機能**: 離職リスク高の社員を自動検知・通知
- 📋 **レポート生成**: 週次・月次の詳細分析レポート
- 🔮 **予測分析**: AIによる離職リスク予測モデル

## 🚀 クイックスタート

### 前提条件

- Node.js 20.x以上
- PostgreSQL 15.x以上
- Redis (オプション、キャッシュ用)

### インストール・起動

```bash
# 1. リポジトリクローン
git clone <repository-url>
cd employee-satisfaction-dashboard

# 2. 依存関係インストール
npm install

# 3. 環境変数設定
cp .env.example .env.local
# 必要な環境変数を設定

# 4. データベースセットアップ
npm run db:setup
npm run db:migrate
npm run db:seed

# 5. 開発サーバー起動
npm run dev
```
````

### 初期ユーザー作成

```bash
# 管理者ユーザー作成
npm run create-admin

# テストデータ生成
npm run generate-test-data
```

## 🏗️ 技術スタック

### フロントエンド

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4.x
- **State Management**: Zustand 4.x
- **Charts**: Recharts 2.x
- **Forms**: React Hook Form + Zod

### バックエンド

- **Runtime**: Node.js 20.x
- **Database**: PostgreSQL 15.x
- **ORM**: Native SQL with pg
- **Authentication**: NextAuth.js
- **Validation**: Zod 3.x
- **Email**: Resend

### 開発・デプロイ

- **Build Tool**: Next.js built-in
- **Testing**: Jest + Testing Library + Playwright
- **Linting**: ESLint + Prettier
- **CI/CD**: GitHub Actions
- **Hosting**: Vercel

## 📁 プロジェクト構造

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 認証ページ
│   ├── (dashboard)/       # ダッシュボードページ
│   └── api/               # API Routes
├── components/            # Reactコンポーネント
│   ├── ui/               # 基本UIコンポーネント
│   ├── dashboard/        # ダッシュボード専用
│   └── survey/           # アンケート専用
├── lib/                  # ユーティリティ・設定
├── hooks/               # カスタムReactフック
├── store/               # Zustand状態管理
└── types/               # TypeScript型定義
```

## 🔌 API仕様

### 認証

- `POST /api/auth/login` - ログイン
- `POST /api/auth/logout` - ログアウト
- `GET /api/auth/me` - 現在のユーザー情報

### アンケート

- `GET /api/survey/daily` - 今日のアンケート取得
- `POST /api/survey` - アンケート回答送信
- `GET /api/survey/history` - 回答履歴

### 分析・統計

- `GET /api/analytics/personal` - 個人分析データ
- `GET /api/analytics/team` - チーム分析データ
- `GET /api/analytics/company` - 全社分析データ

### アラート・通知

- `GET /api/alerts` - アラート一覧
- `POST /api/alerts` - アラート作成
- `PUT /api/alerts/[id]` - アラート更新

詳細なAPI仕様は [API Documentation](./docs/api.md) を参照してください。

## 🧪 テスト

### ユニットテスト

```bash
npm run test                # 一回実行
npm run test:watch         # ウォッチモード
npm run test:coverage      # カバレッジ付き
```

### E2Eテスト

```bash
npm run test:e2e           # E2Eテスト実行
npm run test:e2e:ui        # UIモードで実行
```

## 🚀 デプロイメント

### Vercelデプロイ

```bash
# Vercel CLIインストール
npm i -g vercel

# プロジェクトデプロイ
vercel

# 本番デプロイ
vercel --prod
```

### 環境変数設定

本番環境では以下の環境変数が必要です:

```bash
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
JWT_SECRET=...
ENCRYPTION_KEY=...
RESEND_API_KEY=...
```

## 🔧 開発ワークフロー

### ブランチ戦略

- `main` - 本番環境
- `develop` - 開発環境
- `feature/*` - 機能開発
- `hotfix/*` - 緊急修正

### コミット規約

```bash
feat: 新機能追加
fix: バグ修正
docs: ドキュメント更新
style: フォーマット修正
refactor: リファクタリング
test: テスト追加・修正
chore: その他の変更
```

### Pull Request

1. feature/xxx ブランチで開発
2. テスト・lint通過確認
3. develop ブランチにPR作成
4. コードレビュー後マージ

## 📊 監視・メトリクス

### パフォーマンス監視

- **Vercel Analytics**: ページパフォーマンス
- **Sentry**: エラー監視
- **DataDog**: インフラ監視

### ビジネスメトリクス

- 日次回答率: 90%以上
- システム稼働率: 99.9%以上
- ユーザー満足度: 4.0/5.0以上

## 🤝 コントリビューション

1. このリポジトリをfork
2. feature/xxx ブランチを作成
3. 変更をコミット
4. テストを実行・通過確認
5. Pull Requestを作成

詳細は [CONTRIBUTING.md](./CONTRIBUTING.md) を参照してください。

## 📄 ライセンス

このプロジェクトは [MIT License](./LICENSE) の下で公開されています。

## 📞 サポート

- **Issue報告**: GitHub Issues
- **質問・相談**: GitHub Discussions
- **緊急時**: support@company.com

---

**Made with ❤️ by HRTech Team**

````

### 9.2 README生成実行手順

```bash
# README生成タスク（最終段階で実行）
npm run generate-readme

# または手動で以下を実行:
node scripts/generate-readme.js
````

---

## 10. 品質保証・完成基準

### 10.1 フェーズ完成基準

**Phase 1 完成基準**:

- [ ] ユーザーログイン・ログアウトが動作
- [ ] 日次アンケート回答・送信が可能
- [ ] 個人ダッシュボードでスコア確認可能
- [ ] 管理者ダッシュボードでチーム状況確認可能
- [ ] 基本的なリスクレベル判定が動作
- [ ] レスポンシブデザイン対応
- [ ] lint・typecheck エラー0件
- [ ] ユニットテストカバレッジ80%以上

**Phase 2 完成基準**:

- [ ] アラート機能が正常動作
- [ ] 週次・月次レポート生成可能
- [ ] メール・アプリ内通知が送信される
- [ ] 詳細分析（比較・トレンド）が利用可能
- [ ] 人事ダッシュボードで全社データ確認可能
- [ ] パフォーマンス要件達成（3秒以内）

**Phase 3 完成基準**:

- [ ] 予測分析機能が稼働
- [ ] 外部システム連携が動作
- [ ] モバイル端末で全機能利用可能
- [ ] セキュリティ監査パス
- [ ] E2Eテストカバレッジ90%以上
- [ ] 本番デプロイ・稼働確認完了

### 10.2 最終品質保証チェック

**機能品質**:

- [ ] 全要件機能が実装・動作確認済み
- [ ] エラーハンドリングが適切
- [ ] バリデーションが完全
- [ ] セキュリティ対策実装済み

**パフォーマンス品質**:

- [ ] ページ読み込み3秒以内
- [ ] 1,000同時接続対応確認
- [ ] データベースクエリ最適化
- [ ] 画像・アセット最適化

**コード品質**:

- [ ] TypeScript厳格モード通過
- [ ] ESLint・Prettier準拠
- [ ] テストカバレッジ90%以上
- [ ] ドキュメント完備

**運用品質**:

- [ ] CI/CDパイプライン動作確認
- [ ] モニタリング設定完了
- [ ] バックアップ・復旧手順確認
- [ ] セキュリティ監査完了

---

**文書作成日**: 2025-08-04  
**作成者**: Claude Code Task Planning  
**バージョン**: 1.0  
**想定実装期間**: 8-12週間  
**品質保証レベル**: エンタープライズグレード
