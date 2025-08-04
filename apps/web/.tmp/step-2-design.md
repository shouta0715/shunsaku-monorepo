# 離職リスク予測ダッシュボード - システム設計書

## プロジェクト概要

**アプリ名**: 離職リスク予測ダッシュボード  
**キャッチコピー**: 「日々の声から、未来の離職をゼロへ。」  
**技術スタック**: Next.js 15, React 19, TypeScript, Tailwind CSS, Zustand

---

## 1. システムアーキテクチャ

### 1.1 全体アーキテクチャ

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js)     │───▶│   (API Routes)  │───▶│   (PostgreSQL)  │
│                 │    │                 │    │                 │
│ • React 19      │    │ • Next.js API   │    │ • User Data     │
│ • TypeScript    │    │ • Validation    │    │ • Survey Data   │
│ • Tailwind CSS  │    │ • Auth Logic    │    │ • Analytics     │
│ • Zustand       │    │ • Business Logic│    │ • Logs          │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐             │
         └──────────────▶│   External      │◀────────────┘
                        │   Services      │
                        │                 │
                        │ • Email Service │
                        │ • Push Notif.   │
                        │ • File Storage  │
                        └─────────────────┘
```

### 1.2 Next.js App Router構造

```
src/
├── app/                          # App Router
│   ├── (auth)/                   # 認証グループ
│   │   ├── login/page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/              # ダッシュボードグループ
│   │   ├── dashboard/
│   │   │   ├── page.tsx          # 個人ダッシュボード
│   │   │   ├── team/page.tsx     # チームダッシュボード
│   │   │   └── admin/page.tsx    # 管理者ダッシュボード
│   │   ├── survey/
│   │   │   ├── page.tsx          # アンケート回答
│   │   │   └── history/page.tsx  # 回答履歴
│   │   └── layout.tsx
│   ├── api/                      # API Routes
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── survey/
│   │   │   ├── route.ts          # POST /api/survey
│   │   │   ├── daily/route.ts    # GET /api/survey/daily
│   │   │   └── [id]/route.ts     # GET/PUT/DELETE /api/survey/[id]
│   │   ├── users/
│   │   │   ├── route.ts          # GET /api/users
│   │   │   ├── [id]/route.ts     # GET/PUT /api/users/[id]
│   │   │   └── scores/route.ts   # GET /api/users/scores
│   │   ├── analytics/
│   │   │   ├── personal/route.ts # GET /api/analytics/personal
│   │   │   ├── team/route.ts     # GET /api/analytics/team
│   │   │   └── company/route.ts  # GET /api/analytics/company
│   │   └── alerts/route.ts       # GET/POST /api/alerts
│   ├── globals.css
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/                   # コンポーネント
├── lib/                         # ユーティリティ
├── hooks/                       # カスタムフック
├── store/                       # Zustand store
└── types/                       # TypeScript型定義
```

### 1.3 コンポーネント階層設計

```
RootLayout
├── AuthProvider
├── StoreProvider
└── ThemeProvider
    ├── Header
    │   ├── Navigation
    │   ├── UserMenu
    │   └── NotificationBell
    ├── Sidebar (管理者のみ)
    │   ├── NavigationMenu
    │   └── UserStats
    └── MainContent
        ├── Dashboard
        │   ├── PersonalDashboard
        │   │   ├── ScoreChart
        │   │   ├── RadarChart
        │   │   └── TrendIndicator
        │   ├── TeamDashboard
        │   │   ├── TeamOverview
        │   │   ├── MemberList
        │   │   └── RiskAlerts
        │   └── AdminDashboard
        │       ├── CompanyStats
        │       ├── DepartmentComparison
        │       └── PredictiveAnalytics
        ├── Survey
        │   ├── DailySurvey
        │   ├── QuestionCard
        │   └── ProgressBar
        └── Reports
            ├── ReportGenerator
            ├── ChartComponents
            └── ExportOptions
```

---

## 2. データベース設計

### 2.1 ER図

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Users       │    │    Surveys      │    │   Questions     │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ id (PK)         │    │ id (PK)         │    │ id (PK)         │
│ email           │    │ userId (FK)     │    │ text            │
│ name            │    │ date            │    │ category        │
│ department      │    │ totalScore      │    │ weight          │
│ position        │    │ submittedAt     │    │ isActive        │
│ managerId (FK)  │    │ createdAt       │    │ createdAt       │
│ role            │    │ updatedAt       │    │ updatedAt       │
│ hireDate        │    └─────────────────┘    └─────────────────┘
│ isActive        │             │                       │
│ createdAt       │             │                       │
│ updatedAt       │             ▼                       ▼
└─────────────────┘    ┌─────────────────┐    ┌─────────────────┐
         │              │ SurveyResponses │    │  DailyScores    │
         │              ├─────────────────┤    ├─────────────────┤
         │              │ id (PK)         │    │ id (PK)         │
         │              │ surveyId (FK)   │    │ userId (FK)     │
         │              │ questionId (FK) │    │ date            │
         │              │ score           │    │ totalScore      │
         │              │ createdAt       │    │ riskLevel       │
         │              └─────────────────┘    │ calculatedAt    │
         │                                     └─────────────────┘
         ▼
┌─────────────────┐    ┌─────────────────┐
│     Alerts      │    │    Reports      │
├─────────────────┤    ├─────────────────┤
│ id (PK)         │    │ id (PK)         │
│ userId (FK)     │    │ title           │
│ type            │    │ type            │
│ message         │    │ generatedBy     │
│ isRead          │    │ data            │
│ createdAt       │    │ createdAt       │
└─────────────────┘    └─────────────────┘
```

### 2.2 PostgreSQLスキーマ定義

```sql
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

-- Questions table
CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    text TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    weight DECIMAL(3,2) DEFAULT 1.0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Surveys table
CREATE TABLE surveys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    survey_date DATE NOT NULL,
    total_score DECIMAL(5,2) NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, survey_date)
);

-- Survey Responses table
CREATE TABLE survey_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id UUID NOT NULL REFERENCES surveys(id),
    question_id UUID NOT NULL REFERENCES questions(id),
    score INTEGER CHECK (score BETWEEN 1 AND 5) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Daily Scores table
CREATE TABLE daily_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    score_date DATE NOT NULL,
    total_score DECIMAL(5,2) NOT NULL,
    risk_level VARCHAR(10) CHECK (risk_level IN ('low', 'medium', 'high')) NOT NULL,
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, score_date)
);

-- Alerts table
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    target_user_id UUID REFERENCES users(id),
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reports table
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    type VARCHAR(50) NOT NULL,
    generated_by UUID NOT NULL REFERENCES users(id),
    data JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_department ON users(department);
CREATE INDEX idx_users_manager ON users(manager_id);
CREATE INDEX idx_surveys_user_date ON surveys(user_id, survey_date);
CREATE INDEX idx_daily_scores_user_date ON daily_scores(user_id, score_date);
CREATE INDEX idx_daily_scores_risk ON daily_scores(risk_level);
CREATE INDEX idx_alerts_user_unread ON alerts(user_id, is_read);
```

---

## 3. API設計

### 3.1 RESTful APIエンドポイント

#### 3.1.1 認証関連

```typescript
// POST /api/auth/login
interface LoginRequest {
  email: string;
  password: string;
}
interface LoginResponse {
  user: User;
  token: string;
  expiresAt: string;
}

// POST /api/auth/logout
// GET /api/auth/me
```

#### 3.1.2 アンケート関連

```typescript
// GET /api/survey/daily - 今日のアンケート取得
interface DailySurveyResponse {
  surveyId?: string;
  questions: Question[];
  hasSubmitted: boolean;
  submittedAt?: string;
}

// POST /api/survey - アンケート回答送信
interface SurveySubmissionRequest {
  responses: {
    questionId: string;
    score: number;
  }[];
}

// GET /api/survey/history - 回答履歴
interface SurveyHistoryResponse {
  surveys: Survey[];
  pagination: PaginationInfo;
}
```

#### 3.1.3 分析・統計関連

```typescript
// GET /api/analytics/personal - 個人分析データ
interface PersonalAnalyticsResponse {
  currentScore: number;
  riskLevel: "low" | "medium" | "high";
  scoreHistory: ScorePoint[];
  categoryScores: CategoryScore[];
  trends: {
    daily: number;
    weekly: number;
    monthly: number;
  };
}

// GET /api/analytics/team - チーム分析データ
interface TeamAnalyticsResponse {
  teamStats: {
    averageScore: number;
    riskDistribution: RiskDistribution;
    responseRate: number;
  };
  members: TeamMemberSummary[];
  trends: TeamTrend[];
}

// GET /api/analytics/company - 全社分析データ
interface CompanyAnalyticsResponse {
  companyStats: CompanyStats;
  departmentComparison: DepartmentStats[];
  riskPrediction: RiskPrediction[];
}
```

### 3.2 認証・認可フロー

```typescript
// JWT Token構造
interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

// 認可ミドルウェア
function requireAuth(roles: UserRole[] = []) {
  return async (req: NextRequest) => {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const payload = verifyJWT(token);
      if (roles.length > 0 && !roles.includes(payload.role)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      req.user = payload;
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
  };
}
```

### 3.3 リアルタイム通信設計

```typescript
// Server-Sent Events for real-time updates
// GET /api/stream/alerts
export async function GET(request: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      const user = getCurrentUser(request);

      // アラート監視の設定
      const alertWatcher = subscribeToAlerts(user.id, (alert) => {
        controller.enqueue(`data: ${JSON.stringify(alert)}\n\n`);
      });

      // スコア更新監視
      const scoreWatcher = subscribeToScoreUpdates(user.id, (update) => {
        controller.enqueue(`data: ${JSON.stringify(update)}\n\n`);
      });

      return () => {
        alertWatcher.unsubscribe();
        scoreWatcher.unsubscribe();
      };
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
```

---

## 4. フロントエンド設計

### 4.1 状態管理（Zustand）

```typescript
// stores/authStore.ts
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  updateProfile: (data: ProfileUpdate) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,

  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    set({ user: response.user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, isAuthenticated: false });
  },

  updateProfile: async (data) => {
    const response = await api.put("/users/profile", data);
    set({ user: response.user });
  },
}));

// stores/surveyStore.ts
interface SurveyState {
  currentSurvey: Survey | null;
  isLoading: boolean;
  hasSubmittedToday: boolean;
  fetchDailySurvey: () => Promise<void>;
  submitSurvey: (responses: SurveyResponse[]) => Promise<void>;
}

// stores/analyticsStore.ts
interface AnalyticsState {
  personalData: PersonalAnalytics | null;
  teamData: TeamAnalytics | null;
  companyData: CompanyAnalytics | null;
  fetchPersonalAnalytics: () => Promise<void>;
  fetchTeamAnalytics: () => Promise<void>;
  fetchCompanyAnalytics: () => Promise<void>;
}
```

### 4.2 コンポーネント設計

```typescript
// components/ui/Chart.tsx
interface ChartProps {
  data: ChartData[];
  type: "line" | "bar" | "radar";
  height: number;
  showLegend?: boolean;
  onDataPointClick?: (point: ChartData) => void;
}

// components/dashboard/ScoreCard.tsx
interface ScoreCardProps {
  score: number;
  trend: number;
  riskLevel: RiskLevel;
  period: string;
  onClick?: () => void;
}

// components/survey/QuestionCard.tsx
interface QuestionCardProps {
  question: Question;
  value: number;
  onChange: (value: number) => void;
  isRequired?: boolean;
}

// components/alerts/AlertList.tsx
interface AlertListProps {
  alerts: Alert[];
  onMarkAsRead: (alertId: string) => void;
  onAction: (alert: Alert) => void;
}
```

### 4.3 ルーティング設計

```typescript
// app/layout.tsx - Root Layout
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="font-sans">
        <AuthProvider>
          <StoreProvider>
            <ThemeProvider>
              {children}
              <Toaster />
            </ThemeProvider>
          </StoreProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

// app/(dashboard)/layout.tsx - Dashboard Layout
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
```

---

## 5. セキュリティ設計

### 5.1 認証・認可機構

```typescript
// lib/auth.ts
export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }

  static async verifyPassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  static generateJWT(payload: JWTPayload): string {
    return jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "24h",
      issuer: "employee-satisfaction-dashboard",
    });
  }

  static verifyJWT(token: string): JWTPayload {
    return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
  }
}

// ミドルウェア
export function withAuth(handler: NextApiHandler, roles?: UserRole[]) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) throw new Error("No token provided");

      const payload = AuthService.verifyJWT(token);
      if (roles && !roles.includes(payload.role)) {
        throw new Error("Insufficient permissions");
      }

      req.user = payload;
      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  };
}
```

### 5.2 データ暗号化

```typescript
// lib/encryption.ts
export class EncryptionService {
  private static algorithm = "aes-256-gcm";
  private static key = Buffer.from(process.env.ENCRYPTION_KEY!, "hex");

  static encrypt(text: string): { encrypted: string; iv: string; tag: string } {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(this.algorithm, this.key);
    cipher.setAAD(Buffer.from("additional-data"));

    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    const tag = cipher.getAuthTag();

    return {
      encrypted,
      iv: iv.toString("hex"),
      tag: tag.toString("hex"),
    };
  }

  static decrypt(encryptedData: {
    encrypted: string;
    iv: string;
    tag: string;
  }): string {
    const decipher = crypto.createDecipher(this.algorithm, this.key);
    decipher.setAAD(Buffer.from("additional-data"));
    decipher.setAuthTag(Buffer.from(encryptedData.tag, "hex"));

    let decrypted = decipher.update(encryptedData.encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  }
}
```

### 5.3 入力検証・サニタイゼーション

```typescript
// lib/validation.ts
import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(128),
});

export const SurveyResponseSchema = z.object({
  responses: z
    .array(
      z.object({
        questionId: z.string().uuid(),
        score: z.number().int().min(1).max(5),
      }),
    )
    .min(1)
    .max(10),
});

export const UserProfileSchema = z.object({
  name: z.string().min(1).max(100),
  department: z.string().min(1).max(100),
  position: z.string().min(1).max(100),
});

// 使用例
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = SurveyResponseSchema.parse(body);

    // 処理続行
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 },
      );
    }
    throw error;
  }
}
```

---

## 6. パフォーマンス設計

### 6.1 キャッシュ戦略

```typescript
// lib/cache.ts
export class CacheService {
  private static redis = new Redis(process.env.REDIS_URL!);

  static async get<T>(key: string): Promise<T | null> {
    const cached = await this.redis.get(key);
    return cached ? JSON.parse(cached) : null;
  }

  static async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    await this.redis.setex(key, ttl, JSON.stringify(value));
  }

  static async invalidate(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }
}

// 使用例
export async function GET(request: NextRequest) {
  const userId = getCurrentUser(request).id;
  const cacheKey = `analytics:personal:${userId}`;

  let data = await CacheService.get(cacheKey);

  if (!data) {
    data = await generatePersonalAnalytics(userId);
    await CacheService.set(cacheKey, data, 1800); // 30分キャッシュ
  }

  return NextResponse.json(data);
}
```

### 6.2 データベース最適化

```sql
-- クエリ最適化例
-- 1. 個人スコア推移取得（インデックス活用）
EXPLAIN ANALYZE
SELECT
    score_date,
    total_score,
    risk_level
FROM daily_scores
WHERE user_id = $1
  AND score_date >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY score_date DESC;

-- 2. 部署別統計（集約最適化）
EXPLAIN ANALYZE
SELECT
    u.department,
    AVG(ds.total_score) as avg_score,
    COUNT(CASE WHEN ds.risk_level = 'high' THEN 1 END) as high_risk_count
FROM users u
JOIN daily_scores ds ON u.id = ds.user_id
WHERE ds.score_date >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY u.department
ORDER BY avg_score DESC;

-- 3. マテリアライズドビュー（重い集計処理）
CREATE MATERIALIZED VIEW department_weekly_stats AS
SELECT
    u.department,
    DATE_TRUNC('week', ds.score_date) as week_start,
    AVG(ds.total_score) as avg_score,
    COUNT(*) as response_count,
    COUNT(CASE WHEN ds.risk_level = 'high' THEN 1 END) as high_risk_count
FROM users u
JOIN daily_scores ds ON u.id = ds.user_id
WHERE u.is_active = true
GROUP BY u.department, DATE_TRUNC('week', ds.score_date);

-- 定期更新
REFRESH MATERIALIZED VIEW CONCURRENTLY department_weekly_stats;
```

---

## 7. 技術スタック詳細

### 7.1 フロントエンド構成

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5.3.0",
    "tailwindcss": "^4.0.0",
    "zustand": "^4.4.0",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",
    "@hookform/resolvers": "^3.3.0",
    "recharts": "^2.8.0",
    "date-fns": "^2.30.0",
    "lucide-react": "^0.294.0",
    "@headlessui/react": "^1.7.0",
    "framer-motion": "^10.16.0",
    "react-hot-toast": "^2.4.0"
  },
  "devDependencies": {
    "@types/node": "^20.9.0",
    "eslint": "^8.54.0",
    "eslint-config-next": "^15.0.0",
    "@typescript-eslint/eslint-plugin": "^6.12.0",
    "@typescript-eslint/parser": "^6.12.0",
    "prettier": "^3.1.0",
    "prettier-plugin-tailwindcss": "^0.5.7",
    "@testing-library/react": "^14.1.0",
    "@testing-library/jest-dom": "^6.1.0",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0"
  }
}
```

### 7.2 バックエンド・インフラ構成

```typescript
// lib/database.ts
import { Pool } from "pg";

export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// lib/email.ts
import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendAlertEmail(to: string, alert: Alert) {
  await resend.emails.send({
    from: "alerts@company.com",
    to,
    subject: alert.title,
    html: generateAlertEmailHTML(alert),
  });
}
```

### 7.3 テスト戦略

```typescript
// __tests__/components/ScoreCard.test.tsx
import { render, screen } from '@testing-library/react'
import { ScoreCard } from '@/components/dashboard/ScoreCard'

describe('ScoreCard', () => {
  it('displays score and risk level correctly', () => {
    render(
      <ScoreCard
        score={75}
        trend={5}
        riskLevel="medium"
        period="7 days"
      />
    )

    expect(screen.getByText('75')).toBeInTheDocument()
    expect(screen.getByText('medium')).toBeInTheDocument()
  })
})

// __tests__/api/survey.test.ts
import { POST } from '@/app/api/survey/route'
import { createMocks } from 'node-mocks-http'

describe('/api/survey', () => {
  it('creates survey response successfully', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        responses: [
          { questionId: 'q1', score: 4 },
          { questionId: 'q2', score: 3 }
        ]
      }
    })

    await POST(req)

    expect(res._getStatusCode()).toBe(201)
  })
})
```

---

## 8. デプロイメント・インフラ設計

### 8.1 CI/CDパイプライン

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"

      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v4
      - uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: "--prod"
```

### 8.2 環境設定

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["bcrypt"],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  images: {
    domains: ["res.cloudinary.com"],
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,POST,PUT,DELETE,OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type,Authorization",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

### 8.3 モニタリング設定

```typescript
// lib/monitoring.ts
import { NextRequest } from "next/server";

export function withMonitoring(handler: Function) {
  return async (request: NextRequest) => {
    const start = Date.now();

    try {
      const response = await handler(request);

      // メトリクス送信
      await sendMetrics({
        method: request.method,
        path: request.nextUrl.pathname,
        status: response.status,
        duration: Date.now() - start,
      });

      return response;
    } catch (error) {
      // エラーログ送信
      await logError(error, {
        method: request.method,
        path: request.nextUrl.pathname,
        userAgent: request.headers.get("user-agent"),
      });

      throw error;
    }
  };
}
```

---

## 9. セキュリティ対策詳細

### 9.1 CSRF対策

```typescript
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // CSRF トークン検証
  if (request.method !== "GET") {
    const csrfToken = request.headers.get("x-csrf-token");
    const sessionToken = request.cookies.get("session")?.value;

    if (!csrfToken || !verifyCSRFToken(csrfToken, sessionToken)) {
      return NextResponse.json(
        { error: "Invalid CSRF token" },
        { status: 403 },
      );
    }
  }

  return NextResponse.next();
}
```

### 9.2 レート制限

```typescript
// lib/rateLimit.ts
import { LRUCache } from "lru-cache";

type Options = {
  uniqueTokenPerInterval?: number;
  interval?: number;
};

export default function rateLimit(options: Options = {}) {
  const tokenCache = new LRUCache({
    max: options.uniqueTokenPerInterval || 500,
    ttl: options.interval || 60000,
  });

  return {
    check: (limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const tokenCount = (tokenCache.get(token) as number[]) || [0];
        if (tokenCount[0] === 0) {
          tokenCache.set(token, tokenCount);
        }
        tokenCount[0] += 1;

        const currentUsage = tokenCount[0];
        const isRateLimited = currentUsage >= limit;

        if (isRateLimited) {
          reject(new Error("Rate limit exceeded"));
        } else {
          resolve();
        }
      }),
  };
}
```

---

## 10. パフォーマンス最適化

### 10.1 画像最適化

```typescript
// next.config.js
module.exports = {
  images: {
    formats: ['image/webp', 'image/avif'],
    domains: ['res.cloudinary.com'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
}

// components/OptimizedImage.tsx
import Image from 'next/image'

interface OptimizedImageProps {
  src: string
  alt: string
  width: number
  height: number
  priority?: boolean
}

export function OptimizedImage({ src, alt, width, height, priority = false }: OptimizedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      loading={priority ? 'eager' : 'lazy'}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
      className="rounded-lg"
    />
  )
}
```

### 10.2 コード分割・遅延読み込み

```typescript
// 動的インポート
import dynamic from 'next/dynamic'

const AnalyticsChart = dynamic(
  () => import('@/components/analytics/Chart'),
  {
    loading: () => <ChartSkeleton />,
    ssr: false
  }
)

const AdminDashboard = dynamic(
  () => import('@/components/dashboard/AdminDashboard'),
  {
    loading: () => <div>Loading admin dashboard...</div>
  }
)

// React.lazy with Suspense
import { Suspense, lazy } from 'react'

const ReportGenerator = lazy(() => import('@/components/reports/ReportGenerator'))

export function ReportsPage() {
  return (
    <div>
      <h1>Reports</h1>
      <Suspense fallback={<ReportGeneratorSkeleton />}>
        <ReportGenerator />
      </Suspense>
    </div>
  )
}
```

---

**文書作成日**: 2025-08-04  
**作成者**: Claude Code System Design  
**バージョン**: 1.0
