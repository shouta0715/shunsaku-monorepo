"use client";

import { Badge, Alert } from "@package/ui";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  AlertDescription,
  LoadingSpinner,
} from "@/components/ui";
import { initializeSession } from "@/lib/mock-auth";

type SurveyStatus = {
  completed: boolean;
  survey: unknown | null;
};

type CurrentRisk = {
  riskLevel: "low" | "medium" | "high";
  score: number;
  date: string;
} | null;

type TeamStats = {
  totalMembers: number;
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
  members: {
    id: string;
    name: string;
    department: string;
    riskLevel: "low" | "medium" | "high";
    score: number;
    lastUpdateDate: string;
  }[];
};

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<{
    user: { id: string; name: string; role: string; department: string };
  } | null>(null);
  const [surveyStatus, setSurveyStatus] = useState<SurveyStatus | null>(null);
  const [currentRisk, setCurrentRisk] = useState<CurrentRisk>(null);
  const [teamStats, setTeamStats] = useState<TeamStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const currentSession = initializeSession();
    if (!currentSession.isAuthenticated) {
      router.push("/");

      return;
    }
    if (currentSession.user) {
      setSession({ user: currentSession.user });
    }
  }, [router]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!session) return;

      try {
        setLoading(true);
        setError(null);

        // 並行でデータを取得
        const requests = [
          fetch("/api/mock/survey/status"),
          fetch("/api/mock/scoring/current"),
        ];

        // 管理者・人事・マネージャーの場合はチーム統計も取得
        if (
          session.user?.role &&
          ["manager", "hr", "admin"].includes(session.user.role)
        ) {
          requests.push(fetch("/api/mock/scoring/team"));
        }

        const responses = await Promise.all(requests);

        // レスポンスをチェック
        for (const response of responses) {
          if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
          }
        }

        const [surveyRes, riskRes, teamRes] = await Promise.all(
          responses.map((r) => r.json()),
        );

        if (surveyRes.success) setSurveyStatus(surveyRes.data);
        if (riskRes.success) setCurrentRisk(riskRes.data);
        if (teamRes?.success) setTeamStats(teamRes.data);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "データの取得に失敗しました";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    void fetchDashboardData();
  }, [session]);

  const getRiskBadge = (level: "low" | "medium" | "high") => {
    const config = {
      low: {
        color: "green" as const,
        label: "低リスク",
        textColor: "text-green-600",
      },
      medium: {
        color: "yellow" as const,
        label: "中リスク",
        textColor: "text-yellow-600",
      },
      high: {
        color: "red" as const,
        label: "高リスク",
        textColor: "text-red-600",
      },
    };

    return config[level];
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-64 items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">読み込み中...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            おかえりなさい、{session?.user?.name}さん ☀️
          </h1>
          <p className="text-gray-600">
            今日のあなたの心の天気はいかがですか？現在の状況をお知らせします。
          </p>
        </div>

        {error && (
          <Alert open={Boolean(error)} onClose={() => setError(null)}>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Daily Survey Alert */}
        {surveyStatus && !surveyStatus.completed && (
          <Alert
            open={Boolean(surveyStatus && !surveyStatus.completed)}
            onClose={() => setSurveyStatus(null)}
          >
            <AlertDescription>
              今日の気持ちチェックがまだです 🌤️
              あなたの心の天気を教えてください！
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Personal Risk Level */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.15 }}
            whileHover={{ y: -2, scale: 1.02 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  あなたのリスクレベル
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentRisk ? (
                  <div className="flex items-center space-x-2">
                    <Badge color={getRiskBadge(currentRisk.riskLevel).color}>
                      {getRiskBadge(currentRisk.riskLevel).label}
                    </Badge>
                    <span
                      className={`text-2xl font-bold ${getRiskBadge(currentRisk.riskLevel).textColor}`}
                    >
                      {currentRisk.score.toFixed(1)}
                    </span>
                  </div>
                ) : (
                  <div className="py-4 text-center">
                    <p className="text-sm text-gray-500">
                      まだデータがありません
                    </p>
                    <p className="text-xs text-gray-400">
                      アンケートに回答してください
                    </p>
                  </div>
                )}
                {currentRisk && (
                  <p className="mt-1 text-xs text-gray-500">
                    最終更新:{" "}
                    {new Date(currentRisk.date).toLocaleDateString("ja-JP")}
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Survey Status */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.15 }}
            whileHover={{ y: -2, scale: 1.02 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  アンケート進捗
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-blue-600">
                    {surveyStatus?.completed ? "5" : "0"}/5
                  </span>
                  <span className="text-sm text-gray-500">完了</span>
                </div>
                <p className="mt-1 text-xs text-gray-500">締切: 18:00</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Team Stats (for managers and above) */}
          {session?.user?.role &&
            ["manager", "hr", "admin"].includes(session.user.role) &&
            teamStats && (
              <>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      チームメンバー
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-gray-900">
                        {teamStats.totalMembers}
                      </span>
                      <span className="text-sm text-gray-500">人</span>
                    </div>
                    <div className="mt-2 flex space-x-2">
                      <span className="text-xs text-red-600">
                        高: {teamStats.highRisk}
                      </span>
                      <span className="text-xs text-yellow-600">
                        中: {teamStats.mediumRisk}
                      </span>
                      <span className="text-xs text-green-600">
                        低: {teamStats.lowRisk}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      高リスクメンバー
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-red-600">
                        {teamStats.highRisk}
                      </span>
                      <span className="text-sm text-gray-500">人</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">要注意</p>
                  </CardContent>
                </Card>
              </>
            )}
        </div>

        {/* High Risk Members Alert */}
        <AnimatePresence>
          {teamStats && teamStats.highRisk > 0 && (
            <motion.div
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.15 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600">
                    高リスクメンバー
                  </CardTitle>
                  <CardDescription>
                    注意が必要なメンバーがいます
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {teamStats.members
                      .filter((member) => member.riskLevel === "high")
                      .slice(0, 5) // 最大5人まで表示
                      .map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-3"
                        >
                          <div>
                            <p className="font-medium text-gray-900">
                              {member.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {member.department}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge color="red">高リスク</Badge>
                            <p className="mt-1 text-xs text-gray-500">
                              スコア: {member.score.toFixed(1)}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Actions */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.15 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>クイックアクション</CardTitle>
              <CardDescription>
                よく使用する機能へのショートカット
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <motion.button
                  animate={{ opacity: 1, y: 0 }}
                  className="cursor-pointer rounded-lg border border-blue-200 bg-blue-50/30 p-4 text-left transition-colors hover:border-blue-300 hover:bg-blue-50"
                  initial={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.15 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push("/survey")}
                >
                  <div className="flex items-center space-x-3">
                    <motion.div
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <div className="text-xl">🌤️</div>
                    </motion.div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        今日の天気記録
                      </h3>
                      <p className="text-sm text-gray-500">
                        心の天気を記録する
                      </p>
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  animate={{ opacity: 1, y: 0 }}
                  className="cursor-pointer rounded-lg border border-green-200 bg-green-50/30 p-4 text-left transition-colors hover:border-green-300 hover:bg-green-50"
                  initial={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.15 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push("/survey/history")}
                >
                  <div className="flex items-center space-x-3">
                    <motion.div
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100"
                      whileHover={{ scale: 1.1, rotate: -5 }}
                    >
                      <div className="text-xl">📊</div>
                    </motion.div>
                    <div>
                      <h3 className="font-medium text-gray-900">過去の天気</h3>
                      <p className="text-sm text-gray-500">履歴を確認する</p>
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  animate={{ opacity: 1, y: 0 }}
                  className="cursor-pointer rounded-lg border border-purple-200 bg-purple-50/30 p-4 text-left transition-colors hover:border-purple-300 hover:bg-purple-50"
                  initial={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.15 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push("/analytics")}
                >
                  <div className="flex items-center space-x-3">
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100"
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3,
                      }}
                      whileHover={{ scale: 1.1 }}
                    >
                      <div className="text-xl">🔮</div>
                    </motion.div>
                    <div>
                      <h3 className="font-medium text-gray-900">分析・予報</h3>
                      <p className="text-sm text-gray-500">データを分析する</p>
                    </div>
                  </div>
                </motion.button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
