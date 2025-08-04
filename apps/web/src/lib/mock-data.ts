// モックデータ定義
export const mockUsers = [
  {
    id: "1",
    email: "tanaka@company.com",
    name: "田中 太郎",
    department: "開発部",
    position: "シニアエンジニア",
    managerId: "4",
    role: "employee" as const,
    hireDate: "2022-04-01",
    isActive: true,
  },
  {
    id: "2",
    email: "sato@company.com",
    name: "佐藤 花子",
    department: "開発部",
    position: "エンジニア",
    managerId: "4",
    role: "employee" as const,
    hireDate: "2023-01-15",
    isActive: true,
  },
  {
    id: "3",
    email: "suzuki@company.com",
    name: "鈴木 次郎",
    department: "マーケティング部",
    position: "マーケター",
    managerId: "5",
    role: "employee" as const,
    hireDate: "2021-07-01",
    isActive: true,
  },
  {
    id: "4",
    email: "yamada@company.com",
    name: "山田 一郎",
    department: "開発部",
    position: "エンジニアリングマネージャー",
    managerId: null,
    role: "manager" as const,
    hireDate: "2020-03-01",
    isActive: true,
  },
  {
    id: "5",
    email: "watanabe@company.com",
    name: "渡辺 美咲",
    department: "マーケティング部",
    position: "マーケティングマネージャー",
    managerId: null,
    role: "manager" as const,
    hireDate: "2019-09-01",
    isActive: true,
  },
  {
    id: "6",
    email: "hr@company.com",
    name: "人事 太郎",
    department: "人事部",
    position: "人事マネージャー",
    managerId: null,
    role: "hr" as const,
    hireDate: "2018-04-01",
    isActive: true,
  },
  {
    id: "7",
    email: "admin@company.com",
    name: "管理者",
    department: "経営企画",
    position: "システム管理者",
    managerId: null,
    role: "admin" as const,
    hireDate: "2017-01-01",
    isActive: true,
  },
];

export const mockQuestions = [
  {
    id: "1",
    text: "今日の仕事に対するやりがいはいかがでしたか？",
    category: "engagement",
    weight: 1.2,
    isActive: true,
  },
  {
    id: "2",
    text: "職場の人間関係は良好ですか？",
    category: "relationship",
    weight: 1.0,
    isActive: true,
  },
  {
    id: "3",
    text: "仕事量は適切だと感じますか？",
    category: "workload",
    weight: 1.1,
    isActive: true,
  },
  {
    id: "4",
    text: "上司からのサポートは十分ですか？",
    category: "support",
    weight: 1.0,
    isActive: true,
  },
  {
    id: "5",
    text: "今の職場で働き続けたいと思いますか？",
    category: "retention",
    weight: 1.3,
    isActive: true,
  },
];

// 過去30日分のサンプルデータを生成
const generateMockSurveys = () => {
  const surveys: {
    id: string;
    userId: string;
    surveyDate: string;
    totalScore: number;
    submittedAt: string;
    responses: {
      questionId: string;
      score: number;
    }[];
  }[] = [];
  const today = new Date();

  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    mockUsers.forEach((user) => {
      // 今日のデータは一部のユーザーのみ未回答にする
      const isToday = i === 0;
      const shouldSkipToday = isToday && ['1', '3', '5'].includes(user.id); // 田中、鈴木、渡辺は今日未回答
      
      // 90%の確率でアンケートに回答（ただし今日は一部ユーザーは回答しない）
      if (!shouldSkipToday && Math.random() > 0.1) {
        const responses = mockQuestions.map((question) => ({
          questionId: question.id,
          score: Math.floor(Math.random() * 5) + 1, // 1-5のランダムスコア
        }));

        // 加重平均スコアを計算
        const totalWeightedScore = responses.reduce((sum, response) => {
          const question = mockQuestions.find(
            (q) => q.id === response.questionId,
          );

          return sum + response.score * (question?.weight || 1);
        }, 0);
        const totalWeight = mockQuestions.reduce((sum, q) => sum + q.weight, 0);
        const averageScore = totalWeightedScore / totalWeight;

        surveys.push({
          id: `${user.id}-${date.toISOString().split("T")[0]}`,
          userId: user.id,
          surveyDate: date.toISOString().split("T")[0] || "",
          totalScore: Math.round(averageScore * 10) / 10,
          submittedAt: date.toISOString(),
          responses,
        });
      }
    });
  }

  return surveys.sort(
    (a, b) =>
      new Date(b.surveyDate).getTime() - new Date(a.surveyDate).getTime(),
  );
};

export const mockSurveys = generateMockSurveys();

// リスクレベル計算
const calculateRiskLevel = (score: number): "low" | "medium" | "high" => {
  if (score >= 4.0) return "low";
  if (score >= 2.5) return "medium";

  return "high";
};

// 日次スコアを生成
export const mockDailyScores = mockSurveys.map((survey) => ({
  id: `score-${survey.id}`,
  userId: survey.userId,
  scoreDate: survey.surveyDate,
  totalScore: survey.totalScore,
  riskLevel: calculateRiskLevel(survey.totalScore),
  calculatedAt: survey.submittedAt,
  categoryScores: {
    engagement: Math.random() * 5,
    relationship: Math.random() * 5,
    workload: Math.random() * 5,
    support: Math.random() * 5,
    retention: Math.random() * 5,
  },
}));

// アラートデータを生成
export const mockAlerts = [
  {
    id: "1",
    userId: "6", // 人事
    targetUserId: "1",
    type: "high_risk" as const,
    title: "高リスクメンバーの検知",
    message:
      "田中 太郎さん（開発部）が高リスク状態にあります。適切な対応をお願いします。",
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2時間前
  },
  {
    id: "2",
    userId: "4", // マネージャー
    targetUserId: "2",
    type: "score_drop" as const,
    title: "チームメンバーのスコア低下",
    message:
      "佐藤 花子さんのスコアが25.3%低下しました。状況確認をお願いします。",
    isRead: false,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6時間前
  },
  {
    id: "3",
    userId: "5", // マネージャー
    targetUserId: "3",
    type: "no_response" as const,
    title: "チームメンバーの未回答",
    message:
      "鈴木 次郎さんが過去7日間アンケートに回答していません。フォローアップをお願いします。",
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1日前
  },
  {
    id: "4",
    userId: "1", // 本人
    targetUserId: "1",
    type: "high_risk" as const,
    title: "高リスク状態が検知されました",
    message:
      "あなたの現在のスコアは2.1点で、高リスク状態にあります。必要に応じてサポートを受けることをお勧めします。",
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
];

// 現在のユーザー（デモ用）
export let currentUser = mockUsers[0]; // デフォルトは田中さん

export const setCurrentUser = (userId: string) => {
  const user = mockUsers.find((u) => u.id === userId);
  if (user) {
    currentUser = user;
  }
};

// ユーティリティ関数
export const getCurrentUserAlerts = () => {
  const user = currentUser;
  if (!user) return [];

  return mockAlerts.filter((alert) => alert.userId === user.id);
};

export const getCurrentUserSurveys = () => {
  const user = currentUser;
  if (!user) return [];

  return mockSurveys.filter((survey) => survey.userId === user.id);
};

export const getCurrentUserScores = () => {
  const user = currentUser;
  if (!user) return [];

  return mockDailyScores.filter((score) => score.userId === user.id);
};

export const getTeamMembers = (managerId: string) =>
  mockUsers.filter((user) => user.managerId === managerId);

export const getTeamScores = (managerId: string) => {
  const teamMembers = getTeamMembers(managerId);
  const teamMemberIds = teamMembers.map((member) => member.id);

  return mockDailyScores.filter((score) =>
    teamMemberIds.includes(score.userId),
  );
};
