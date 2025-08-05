// ユーザー型定義
export type User = {
  id: string;
  email: string;
  name: string;
  department: string;
  position: string;
  managerId: string | null;
  role: "employee" | "manager" | "hr" | "admin";
  hireDate: string;
  isActive: boolean;
};

// モックデータ定義
export const mockUsers: User[] = [
  {
    id: "1",
    email: "tanaka@company.com",
    name: "田中 太郎",
    department: "開発部",
    position: "シニアエンジニア",
    managerId: "4",
    role: "employee",
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
    role: "employee",
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
    role: "employee",
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
    role: "manager",
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
    role: "manager",
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
    role: "hr",
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
    role: "admin",
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
      const shouldSkipToday = isToday && ["1", "3", "5"].includes(user.id); // 田中、鈴木、渡辺は今日未回答

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

// アラートデータを生成（Mock環境では全てのアラートを表示するため、全てのuserIdを"1"に統一）
export const mockAlerts = mockUsers.flatMap((user, userIndex) => [
  // === 高リスク・緊急対応系アラート ===
  {
    id: `${userIndex * 30 + 1}`,
    userId: user.id, // 全て田中太郎で統一
    targetUserId: "1",
    type: "high_risk" as const,
    title: "高リスク状態が検知されました",
    message:
      "あなたの現在のスコアは2.1点で、高リスク状態にあります。必要に応じてサポートを受けることをお勧めします。",
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2時間前
  },
  {
    id: `${userIndex * 30 + 2}`,
    userId: user.id,
    targetUserId: "1",
    type: "follow_up" as const,
    title: "フォローアップのお知らせ",
    message:
      "先日の1on1でお話しした件について、進捗をお聞かせください。必要なサポートがございましたらお知らせください。",
    isRead: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2日前
  },
  {
    id: `${userIndex * 30 + 3}`,
    userId: "1",
    targetUserId: "1",
    type: "weekly_summary" as const,
    title: "週間サマリー",
    message:
      "今週のあなたの平均スコアは3.2点でした。先週と比較して0.4点改善しています。継続して頑張りましょう！",
    isRead: false,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3日前
  },

  // === 改善・成果系アラート ===
  {
    id: `${userIndex * 30 + 4}`,
    userId: user.id, // 変更: "2" → "1"
    targetUserId: "2",
    type: "improvement" as const,
    title: "スコア改善のお知らせ",
    message:
      "あなたのスコアが先月から1.2点改善しました！素晴らしい成果です。この調子で頑張ってください。",
    isRead: false,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1時間前
  },
  {
    id: `${userIndex * 30 + 5}`,
    userId: user.id, // 変更: "2" → "1"
    targetUserId: "2",
    type: "team_concern" as const,
    title: "チーム状況について",
    message:
      "開発チーム全体のスコアが低下傾向にあります。チームミーティングでの情報共有をお願いします。",
    isRead: true,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1日前
  },
  {
    id: `${userIndex * 30 + 6}`,
    userId: user.id, // 変更: "2" → "1"
    targetUserId: "2",
    type: "weekly_summary" as const,
    title: "週間サマリー",
    message:
      "今週のあなたの平均スコアは4.1点でした。職場の人間関係スコアが特に高く評価されています。",
    isRead: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5日前
  },

  // === 未回答・低スコア系アラート ===
  {
    id: `${userIndex * 30 + 7}`,
    userId: user.id, // 変更: "3" → "1"
    targetUserId: "3",
    type: "no_response" as const,
    title: "アンケート未回答のお知らせ",
    message:
      "過去3日間アンケートに回答していません。あなたの声をお聞かせください。",
    isRead: false,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4時間前
  },
  {
    id: `${userIndex * 30 + 8}`,
    userId: user.id, // 変更: "3" → "1"
    targetUserId: "3",
    type: "consecutive_low" as const,
    title: "継続的な低スコアの検知",
    message:
      "過去1週間のスコアが平均を下回っています。何かお困りのことがございましたらご相談ください。",
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2日前
  },
  {
    id: `${userIndex * 30 + 9}`,
    userId: user.id, // 変更: "3" → "1"
    targetUserId: "3",
    type: "follow_up" as const,
    title: "マネージャーからのフォローアップ",
    message:
      "先週お話しした業務負荷の件について、改善策を検討しました。お時間のある時にお話ししましょう。",
    isRead: true,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4日前
  },

  // === マネージャー向けアラート ===
  {
    id: `${userIndex * 30 + 10}`,
    userId: user.id, // 変更: "4" → "1"
    targetUserId: "1",
    type: "high_risk" as const,
    title: "チームメンバーの高リスク状態",
    message:
      "田中 太郎さんが高リスク状態にあります。1on1の実施や業務調整をご検討ください。",
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2時間前
  },
  {
    id: `${userIndex * 30 + 11}`,
    userId: user.id, // 変更: "4" → "1"
    targetUserId: "2",
    type: "score_drop" as const,
    title: "チームメンバーのスコア低下",
    message:
      "佐藤 花子さんのスコアが一時的に低下しましたが、現在は回復傾向にあります。継続的なフォローをお願いします。",
    isRead: true,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6時間前
  },
  {
    id: `${userIndex * 30 + 12}`,
    userId: user.id, // 変更: "4" → "1"
    targetUserId: "4",
    type: "team_summary" as const,
    title: "開発チーム週間レポート",
    message:
      "開発チームの今週の平均スコアは3.4点です。先週と比較して0.2点低下しています。チーム全体のフォローアップを推奨します。",
    isRead: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1日前
  },
  {
    id: `${userIndex * 30 + 13}`,
    userId: user.id, // 変更: "4" → "1"
    targetUserId: "4",
    type: "management_tip" as const,
    title: "マネジメントのヒント",
    message:
      "定期的な1on1ミーティングがチームの満足度向上に効果的です。週1回の実施を推奨します。",
    isRead: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3日前
  },

  // === チーム管理・レポート系アラート ===
  {
    id: `${userIndex * 30 + 14}`,
    userId: user.id, // 変更: "5" → "1"
    targetUserId: "3",
    type: "no_response" as const,
    title: "チームメンバーの未回答",
    message:
      "鈴木 次郎さんが過去3日間アンケートに回答していません。フォローアップをお願いします。",
    isRead: false,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4時間前
  },
  {
    id: `${userIndex * 30 + 15}`,
    userId: user.id, // 変更: "5" → "1"
    targetUserId: "3",
    type: "consecutive_low" as const,
    title: "継続的な低スコア傾向",
    message:
      "鈴木 次郎さんのスコアが1週間継続して低下しています。業務負荷や環境の確認をお願いします。",
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2日前
  },
  {
    id: `${userIndex * 30 + 16}`,
    userId: user.id, // 変更: "5" → "1"
    targetUserId: "5",
    type: "team_summary" as const,
    title: "マーケティングチーム月間レポート",
    message:
      "マーケティングチームの今月の平均スコアは3.8点です。全社平均を上回る良好な状態です。",
    isRead: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1週間前
  },
  {
    id: `${userIndex * 30 + 17}`,
    userId: user.id, // 変更: "5" → "1"
    targetUserId: "5",
    type: "improvement" as const,
    title: "チーム改善成果",
    message:
      "新しいワークフロー導入により、チーム全体のスコアが15%向上しました。素晴らしい成果です！",
    isRead: true,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10日前
  },

  // === 人事・全社管理系アラート ===
  {
    id: `${userIndex * 30 + 18}`,
    userId: user.id, // 変更: "6" → "1"
    targetUserId: "1",
    type: "high_risk" as const,
    title: "高リスクメンバーの検知",
    message:
      "田中 太郎さん（開発部）が高リスク状態にあります。適切な対応をお願いします。",
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2時間前
  },
  {
    id: `${userIndex * 30 + 19}`,
    userId: user.id, // 変更: "6" → "1"
    targetUserId: "3",
    type: "consecutive_low" as const,
    title: "継続的な低スコア者の検知",
    message:
      "鈴木 次郎さん（マーケティング部）が1週間継続して低スコアです。マネージャーと連携したフォローアップを推奨します。",
    isRead: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1日前
  },
  {
    id: `${userIndex * 30 + 20}`,
    userId: user.id, // 変更: "6" → "1"
    targetUserId: "6",
    type: "company_summary" as const,
    title: "全社ウェルビーイング月間レポート",
    message:
      "今月の全社平均スコアは3.6点です。開発部で一部フォローが必要なメンバーがいますが、全体的に安定しています。",
    isRead: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3日前
  },
  {
    id: `${userIndex * 30 + 21}`,
    userId: user.id, // 変更: "6" → "1"
    targetUserId: "6",
    type: "policy_update" as const,
    title: "ウェルビーイング施策の更新",
    message:
      "新しいメンタルヘルスサポート制度が来月から開始されます。全社への周知をお願いします。",
    isRead: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5日前
  },
  {
    id: `${userIndex * 30 + 22}`,
    userId: user.id, // 変更: "6" → "1"
    targetUserId: "6",
    type: "training_reminder" as const,
    title: "マネージャー研修のリマインド",
    message:
      "来週開催予定のマネージャー向けウェルビーイング研修の参加者確認をお願いします。",
    isRead: false,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6日前
  },

  // === システム・管理者系アラート ===
  {
    id: `${userIndex * 30 + 23}`,
    userId: user.id, // 変更: "7" → "1"
    targetUserId: "7",
    type: "system_alert" as const,
    title: "システムメンテナンスのお知らせ",
    message:
      "ウェルビーイングシステムの定期メンテナンスを本日深夜2:00-4:00に実施します。一時的にアクセスできなくなります。",
    isRead: false,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3時間前
  },
  {
    id: `${userIndex * 30 + 24}`,
    userId: user.id, // 変更: "7" → "1"
    targetUserId: "7",
    type: "company_summary" as const,
    title: "全社ダッシュボード更新",
    message:
      "今月の全社データ分析レポートが完成しました。高リスク者2名、要注意者5名となっています。詳細はダッシュボードをご確認ください。",
    isRead: true,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1日前
  },
  {
    id: `${userIndex * 30 + 25}`,
    userId: user.id, // 変更: "7" → "1"
    targetUserId: "7",
    type: "data_insight" as const,
    title: "データ分析インサイト",
    message:
      "先月と比較して全社の回答率が5%向上しました。新しいリマインド機能の効果が現れています。",
    isRead: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2日前
  },
  {
    id: `${userIndex * 30 + 26}`,
    userId: user.id, // 変更: "7" → "1"
    targetUserId: "7",
    type: "security_update" as const,
    title: "セキュリティアップデートの完了",
    message:
      "システムのセキュリティアップデートが正常に完了しました。新しい認証機能が有効になっています。",
    isRead: false,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4日前
  },
  {
    id: `${userIndex * 30 + 27}`,
    userId: user.id, // 変更: "7" → "1"
    targetUserId: "7",
    type: "performance_report" as const,
    title: "システムパフォーマンスレポート",
    message:
      "今月のシステム稼働率は99.8%でした。レスポンス時間も目標値内を維持しています。",
    isRead: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1週間前
  },

  // === その他・多様なアラート ===
  {
    id: `${userIndex * 30 + 28}`,
    userId: user.id, // 元々"1"なので変更なし
    targetUserId: "1",
    type: "survey_reminder" as const,
    title: "アンケート回答のお願い",
    message:
      "本日のアンケートにまだ回答していません。あなたの声をお聞かせください。",
    isRead: false,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8時間前
  },
  {
    id: `${userIndex * 30 + 29}`,
    userId: user.id, // 変更: "2" → "1"
    targetUserId: "2",
    type: "achievement" as const,
    title: "連続回答達成！",
    message:
      "30日間連続でアンケートに回答いただき、ありがとうございます！継続は力なりです。",
    isRead: true,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1日前
  },
  {
    id: `${userIndex * 30 + 30}`,
    userId: user.id, // 変更: "4" → "1"
    targetUserId: "4",
    type: "feedback_request" as const,
    title: "フィードバックのお願い",
    message:
      "新しいウェルビーイング施策についてのご意見をお聞かせください。チームメンバーの声もお待ちしています。",
    isRead: false,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12時間前
  },
]);

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

// アラート操作関数（Mock用）
export const updateAlertReadStatus = (
  alertId: string,
  userId: string,
  isRead = true,
) => {
  try {
    const alertIndex = mockAlerts.findIndex(
      (alert) => alert.id === alertId && alert.userId === userId,
    );

    if (alertIndex !== -1) {
      const alert = mockAlerts[alertIndex];
      if (alert) {
        alert.isRead = isRead;

        return { success: true, alert };
      }
    }

    return { success: false, error: "アラートが見つかりません" };
  } catch {
    return { success: false, error: "アラートの更新に失敗しました" };
  }
};

export const updateAllUserAlertsReadStatus = (
  userId: string,
  isRead = true,
) => {
  try {
    let updatedCount = 0;

    for (const alert of mockAlerts) {
      if (alert && alert.userId === userId && alert.isRead !== isRead) {
        alert.isRead = isRead;
        updatedCount++;
      }
    }

    return { success: true, updatedCount };
  } catch {
    return { success: false, error: "一括更新に失敗しました" };
  }
};

export const findUserAlert = (alertId: string, userId: string) => {
  try {
    const alert = mockAlerts.find(
      (alert) => alert.id === alertId && alert.userId === userId,
    );

    return { success: true, alert };
  } catch {
    return { success: false, error: "アラートの検索に失敗しました" };
  }
};

// 管理者用データ
export const mockSystemStats = {
  totalUsers: mockUsers.length,
  activeUsers: mockUsers.filter((user) => user.isActive).length,
  totalSurveys: mockSurveys.length,
  responseRate: Math.round(
    (mockSurveys.length / (mockUsers.length * 30)) * 100,
  ),
  systemHealth: "healthy" as const,
};

export let mockSystemSettings = {
  surveyDeadline: "18:00",
  reminderEnabled: true,
  alertThreshold: 2.5,
  dataRetentionDays: 365,
};

export const updateSystemSettings = (
  newSettings: Partial<typeof mockSystemSettings>,
) => {
  try {
    mockSystemSettings = { ...mockSystemSettings, ...newSettings };

    return { success: true, data: mockSystemSettings };
  } catch {
    return { success: false, error: "設定の更新に失敗しました" };
  }
};

export const resetSystemSettings = () => {
  try {
    mockSystemSettings = {
      surveyDeadline: "18:00",
      reminderEnabled: true,
      alertThreshold: 2.5,
      dataRetentionDays: 365,
    };

    return { success: true, data: mockSystemSettings };
  } catch {
    return { success: false, error: "設定のリセットに失敗しました" };
  }
};

// チーム管理用データ型
export type TeamMemberStats = {
  id: string;
  name: string;
  department: string;
  role: string;
  riskLevel: "low" | "medium" | "high";
  score: number;
  responseRate: number;
  lastResponseDate: string;
  managerNotes?: string;
};

export type DepartmentStats = {
  department: string;
  memberCount: number;
  averageScore: number;
  riskDistribution: {
    high: number;
    medium: number;
    low: number;
  };
};

export type TeamOverallStats = {
  totalMembers: number;
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
  averageResponseRate: number;
  departmentBreakdown: DepartmentStats[];
};

// チーム管理用モックデータ
export const generateTeamMemberStats = (): TeamMemberStats[] =>
  mockUsers.map((user) => {
    // ユーザーごとの最新のスコアを取得
    const userScores = mockDailyScores.filter(
      (score) => score.userId === user.id,
    );
    const latestScore = userScores[0] || {
      totalScore: 3.5,
      riskLevel: "medium" as const,
    };

    // 回答率を計算（過去30日中の回答日数）
    const userSurveys = mockSurveys.filter(
      (survey) => survey.userId === user.id,
    );
    const responseRate = (userSurveys.length / 30) * 100;

    // 最終回答日を取得
    const lastResponse = userSurveys[0] || {
      submittedAt: new Date().toISOString(),
    };

    return {
      id: user.id,
      name: user.name,
      department: user.department,
      role: user.position,
      riskLevel: latestScore.riskLevel,
      score: latestScore.totalScore,
      responseRate: Math.round(responseRate),
      lastResponseDate: lastResponse.submittedAt,
      managerNotes:
        user.id === "1"
          ? "業務負荷が高い状態が続いています。要フォロー。"
          : undefined,
    };
  });

export const generateTeamOverallStats = (): TeamOverallStats => {
  const members = generateTeamMemberStats();

  // 部署ごとの統計を計算
  const departmentStats = Object.entries(
    members.reduce(
      (acc, member) => {
        const dept = member.department;
        if (!acc[dept]) {
          acc[dept] = {
            members: [],
            scores: [],
          };
        }
        const deptData = acc[dept];
        if (deptData) {
          deptData.members.push(member);
          deptData.scores.push(member.score);
        }

        return acc;
      },
      {} as Record<string, { members: TeamMemberStats[]; scores: number[] }>,
    ),
  ).map(([department, data]) => ({
    department,
    memberCount: data.members.length,
    averageScore: Number(
      (data.scores.reduce((a, b) => a + b, 0) / data.scores.length).toFixed(1),
    ),
    riskDistribution: {
      high: data.members.filter((m) => m.riskLevel === "high").length,
      medium: data.members.filter((m) => m.riskLevel === "medium").length,
      low: data.members.filter((m) => m.riskLevel === "low").length,
    },
  }));

  // 全体の統計を計算
  const totalMembers = members.length;
  const riskCounts = members.reduce(
    (acc, member) => {
      acc[member.riskLevel]++;

      return acc;
    },
    { high: 0, medium: 0, low: 0 },
  );
  const averageResponseRate = Math.round(
    members.reduce((sum, member) => sum + member.responseRate, 0) /
      totalMembers,
  );

  return {
    totalMembers,
    highRisk: riskCounts.high,
    mediumRisk: riskCounts.medium,
    lowRisk: riskCounts.low,
    averageResponseRate,
    departmentBreakdown: departmentStats,
  };
};

// システム監視データ
export const mockSystemHealth = {
  database: { status: "healthy", lastCheck: new Date().toISOString() },
  apiServer: { status: "healthy", lastCheck: new Date().toISOString() },
  emailService: { status: "healthy", lastCheck: new Date().toISOString() },
  uptime: "99.9%",
  lastIncident: null,
};

// ユーザー管理用関数
export const addUser = (userData: Omit<User, "id">) => {
  try {
    const newId = (
      Math.max(...mockUsers.map((u) => parseInt(u.id))) + 1
    ).toString();
    const newUser: User = { ...userData, id: newId };
    mockUsers.push(newUser);

    return { success: true, data: newUser };
  } catch {
    return { success: false, error: "ユーザーの追加に失敗しました" };
  }
};

export const updateUser = (userId: string, userData: Partial<User>) => {
  try {
    const userIndex = mockUsers.findIndex((u) => u.id === userId);
    if (userIndex === -1) {
      return { success: false, error: "ユーザーが見つかりません" };
    }

    // 既存のユーザーデータを取得
    const existingUser = mockUsers[userIndex];
    if (!existingUser) {
      return { success: false, error: "ユーザーデータが見つかりません" };
    }

    // 型安全な更新処理
    const updatedUser: User = {
      id: existingUser.id,
      email: userData.email ?? existingUser.email,
      name: userData.name ?? existingUser.name,
      department: userData.department ?? existingUser.department,
      position: userData.position ?? existingUser.position,
      managerId:
        userData.managerId !== undefined
          ? userData.managerId
          : existingUser.managerId,
      role: userData.role ?? existingUser.role,
      hireDate: userData.hireDate ?? existingUser.hireDate,
      isActive: userData.isActive ?? existingUser.isActive,
    };

    mockUsers[userIndex] = updatedUser;

    return { success: true, data: updatedUser };
  } catch {
    return { success: false, error: "ユーザーの更新に失敗しました" };
  }
};

export const deleteUser = (userId: string) => {
  try {
    const userIndex = mockUsers.findIndex((u) => u.id === userId);
    if (userIndex === -1) {
      return { success: false, error: "ユーザーが見つかりません" };
    }

    const deletedUser = mockUsers.splice(userIndex, 1)[0];

    return { success: true, data: deletedUser };
  } catch {
    return { success: false, error: "ユーザーの削除に失敗しました" };
  }
};
