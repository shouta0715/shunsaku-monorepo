# やめどき予報 - API仕様書

## 目次

1. [API概要](#api概要)
2. [認証](#認証)
3. [エンドポイント一覧](#エンドポイント一覧)
4. [アンケートAPI](#アンケートapi)
5. [スコアリングAPI](#スコアリングapi)
6. [分析API](#分析api)
7. [アラートAPI](#アラートapi)
8. [エラーハンドリング](#エラーハンドリング)
9. [レート制限](#レート制限)
10. [今後の実装予定](#今後の実装予定)

## API概要

### ベースURL

```
開発環境: http://localhost:3000/api
本番環境: https://yamefoki.example.com/api
```

### 現在の実装状況

現在はすべてモックAPIとして実装されています。実際のデータベース連携は今後実装予定です。

### レスポンス形式

すべてのAPIレスポンスはJSON形式で返されます。

```typescript
// 成功レスポンス
{
  "success": true,
  "data": { ... }
}

// エラーレスポンス
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "エラーメッセージ"
  }
}
```

## 認証

### 現在の認証方式（モック）

セッション情報はlocalStorageに保存され、APIリクエスト時に自動的に含まれます。

```typescript
// セッション情報
{
  "userId": "usr_1",
  "name": "田中 太郎",
  "email": "tanaka@example.com",
  "role": "employee",
  "department": "営業部"
}
```

### 認証が必要なエンドポイント

すべてのAPI（`/api/mock/*`）は認証が必要です。

## エンドポイント一覧

| メソッド         | エンドポイント               | 説明               | 認証 |
| ---------------- | ---------------------------- | ------------------ | ---- |
| **アンケート**   |
| GET              | `/api/mock/survey/questions` | アンケート質問取得 | ✓    |
| GET              | `/api/mock/survey/status`    | 本日の回答状況     | ✓    |
| POST             | `/api/mock/survey/submit`    | アンケート回答送信 | ✓    |
| **スコアリング** |
| GET              | `/api/mock/scoring/current`  | 現在のスコア取得   | ✓    |
| GET              | `/api/mock/scoring/team`     | チームスコア取得   | ✓    |
| **分析**         |
| GET              | `/api/mock/analytics`        | 分析データ取得     | ✓    |
| **アラート**     |
| GET              | `/api/mock/alerts`           | アラート一覧取得   | ✓    |

## アンケートAPI

### GET /api/mock/survey/questions

アンケートの質問一覧を取得します。

#### レスポンス

```json
{
  "questions": [
    {
      "id": "q1",
      "text": "今日の仕事の充実度はどうでしたか？",
      "category": "engagement",
      "weight": 1.0
    },
    {
      "id": "q2",
      "text": "チームメンバーとの関係性は良好ですか？",
      "category": "relationships",
      "weight": 1.2
    },
    {
      "id": "q3",
      "text": "業務量は適切だと感じますか？",
      "category": "workload",
      "weight": 1.0
    },
    {
      "id": "q4",
      "text": "上司からのサポートは十分ですか？",
      "category": "support",
      "weight": 1.1
    },
    {
      "id": "q5",
      "text": "この会社で働き続けたいと思いますか？",
      "category": "retention",
      "weight": 1.3
    }
  ]
}
```

### GET /api/mock/survey/status

本日のアンケート回答状況を確認します。

#### レスポンス

```json
{
  "hasSubmittedToday": false,
  "lastSubmissionDate": null,
  "canSubmit": true
}
```

### POST /api/mock/survey/submit

アンケート回答を送信します。

#### リクエストボディ

```json
{
  "responses": [
    {
      "questionId": "q1",
      "score": 4
    },
    {
      "questionId": "q2",
      "score": 5
    },
    {
      "questionId": "q3",
      "score": 3
    },
    {
      "questionId": "q4",
      "score": 4
    },
    {
      "questionId": "q5",
      "score": 5
    }
  ]
}
```

#### レスポンス

```json
{
  "success": true,
  "data": {
    "surveyId": "srv_20250104_usr_1",
    "userId": "usr_1",
    "submittedAt": "2025-01-04T09:30:00Z",
    "totalScore": 4.2,
    "riskLevel": "low",
    "weatherCondition": "晴れ"
  }
}
```

#### エラーケース

- 本日既に回答済み: `ALREADY_SUBMITTED`
- 不正な質問ID: `INVALID_QUESTION`
- スコアが範囲外: `INVALID_SCORE`

## スコアリングAPI

### GET /api/mock/scoring/current

現在のユーザーのリスクスコアを取得します。

#### レスポンス

```json
{
  "currentScore": 4.2,
  "riskLevel": "low",
  "trend": "improving",
  "lastUpdated": "2025-01-04T09:30:00Z",
  "history": [
    {
      "date": "2025-01-04",
      "score": 4.2,
      "riskLevel": "low"
    },
    {
      "date": "2025-01-03",
      "score": 3.8,
      "riskLevel": "medium"
    }
  ]
}
```

### GET /api/mock/scoring/team

チームメンバーのリスク分布を取得します（管理者のみ）。

#### クエリパラメータ

- `period`: 期間（`week` | `month` | `quarter`）デフォルト: `week`

#### レスポンス

```json
{
  "teamSize": 8,
  "averageScore": 3.5,
  "riskDistribution": {
    "high": 2,
    "medium": 3,
    "low": 3
  },
  "members": [
    {
      "userId": "usr_2",
      "name": "山田 花子",
      "currentScore": 2.3,
      "riskLevel": "high",
      "trend": "declining",
      "lastResponseDate": "2025-01-04"
    }
  ]
}
```

#### 権限エラー

- 管理者権限なし: `UNAUTHORIZED_ACCESS`

## 分析API

### GET /api/mock/analytics

詳細な分析データを取得します。

#### クエリパラメータ

- `type`: 分析タイプ（`personal` | `team` | `company`）
- `period`: 期間（`week` | `month` | `quarter` | `year`）
- `metrics`: 取得する指標（カンマ区切り）

#### レスポンス（personal）

```json
{
  "type": "personal",
  "data": {
    "summary": {
      "currentScore": 4.2,
      "averageScore": 3.9,
      "totalResponses": 20,
      "responseRate": 0.95
    },
    "trends": {
      "daily": [
        { "date": "2025-01-04", "score": 4.2 },
        { "date": "2025-01-03", "score": 3.8 }
      ],
      "categoryScores": {
        "engagement": 4.0,
        "relationships": 4.5,
        "workload": 3.5,
        "support": 4.2,
        "retention": 4.8
      }
    },
    "forecast": {
      "nextWeek": {
        "predictedScore": 4.1,
        "confidence": 0.85,
        "weatherCondition": "晴れ"
      }
    }
  }
}
```

## アラートAPI

### GET /api/mock/alerts

アラート一覧を取得します。

#### クエリパラメータ

- `status`: ステータス（`unread` | `read` | `all`）デフォルト: `unread`
- `type`: アラートタイプ（`high_risk` | `declining_trend` | `no_response`）
- `limit`: 取得件数（デフォルト: 20）
- `offset`: オフセット（デフォルト: 0）

#### レスポンス

```json
{
  "alerts": [
    {
      "id": "alert_1",
      "type": "high_risk",
      "userId": "usr_2",
      "targetName": "山田 花子",
      "message": "山田さんのリスクレベルが「高」になりました",
      "createdAt": "2025-01-04T08:00:00Z",
      "isRead": false,
      "metadata": {
        "currentScore": 2.3,
        "previousScore": 3.5,
        "riskLevel": "high"
      }
    }
  ],
  "pagination": {
    "total": 5,
    "limit": 20,
    "offset": 0,
    "hasMore": false
  }
}
```

## エラーハンドリング

### エラーコード一覧

| エラーコード          | HTTP Status | 説明                                |
| --------------------- | ----------- | ----------------------------------- |
| `UNAUTHORIZED`        | 401         | 認証が必要です                      |
| `FORBIDDEN`           | 403         | アクセス権限がありません            |
| `NOT_FOUND`           | 404         | リソースが見つかりません            |
| `ALREADY_SUBMITTED`   | 400         | 本日既に回答済みです                |
| `INVALID_QUESTION`    | 400         | 不正な質問IDです                    |
| `INVALID_SCORE`       | 400         | スコアは1-5の範囲で入力してください |
| `RATE_LIMIT_EXCEEDED` | 429         | レート制限を超えました              |
| `INTERNAL_ERROR`      | 500         | サーバーエラーが発生しました        |

### エラーレスポンス例

```json
{
  "success": false,
  "error": {
    "code": "ALREADY_SUBMITTED",
    "message": "本日のアンケートは既に回答済みです。明日また回答してください。",
    "details": {
      "lastSubmissionTime": "2025-01-04T09:30:00Z"
    }
  }
}
```

## レート制限

### 制限値（予定）

- 認証API: 5回/分
- アンケート送信: 1回/日
- その他のAPI: 60回/分

### レート制限ヘッダー

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1704355200
```

## 今後の実装予定

### Phase 1: 基本API実装

- [ ] 実データベース連携
- [ ] JWT認証実装
- [ ] WebSocket通知
- [ ] ファイルアップロード

### Phase 2: 高度な機能

- [ ] GraphQL対応
- [ ] バッチAPI
- [ ] Webhook
- [ ] 外部API連携

### Phase 3: エンタープライズ機能

- [ ] API Gateway統合
- [ ] マルチテナント対応
- [ ] カスタムフィールド
- [ ] 監査ログAPI

## サンプルコード

### JavaScript/TypeScript

```typescript
// アンケート回答送信
const submitSurvey = async (responses: SurveyResponse[]) => {
  try {
    const response = await fetch("/api/mock/survey/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ responses }),
    });

    if (!response.ok) {
      throw new Error("Survey submission failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error submitting survey:", error);
    throw error;
  }
};

// アラート取得
const fetchAlerts = async (status = "unread") => {
  const response = await fetch(`/api/mock/alerts?status=${status}`);
  const data = await response.json();
  return data.alerts;
};
```

### cURL

```bash
# アンケート質問取得
curl -X GET http://localhost:3000/api/mock/survey/questions \
  -H "Cookie: session=..."

# アンケート回答送信
curl -X POST http://localhost:3000/api/mock/survey/submit \
  -H "Content-Type: application/json" \
  -H "Cookie: session=..." \
  -d '{
    "responses": [
      {"questionId": "q1", "score": 4},
      {"questionId": "q2", "score": 5},
      {"questionId": "q3", "score": 3},
      {"questionId": "q4", "score": 4},
      {"questionId": "q5", "score": 5}
    ]
  }'
```
