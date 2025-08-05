"use client";

import { Badge, Divider, Heading, Text } from "@package/ui";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout";
import { LoadingSpinner } from "@/components/ui";
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
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-3xl text-white shadow-xl"
              initial={{ rotate: 0 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              ☀️
            </motion.div>
            <LoadingSpinner size="lg" />
            <Text className="mt-4 text-lg font-semibold text-gray-900">
              読み込み中...
            </Text>
            <Text className="text-gray-600">
              ダッシュボードの準備をしています
            </Text>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-50 via-purple-50/50 to-pink-50/30 p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 via-purple-400/10 to-pink-400/10 opacity-50"></div>
          <div className="absolute -top-4 -left-4 h-32 w-32 rounded-full bg-indigo-200/20 blur-xl"></div>
          <div className="absolute -right-4 -bottom-4 h-40 w-40 rounded-full bg-purple-200/20 blur-xl"></div>

          <div className="relative z-10">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-3xl text-white shadow-xl"
              initial={{ scale: 1 }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              ☀️
            </motion.div>
            <Heading className="mb-3 bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent">
              おかえりなさい、{session?.user?.name}さん
            </Heading>
            <Text className="mx-auto max-w-2xl text-gray-600">
              今日のあなたの心の天気はいかがですか？現在の状況をお知らせします。
            </Text>

            {session?.user && (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 inline-flex items-center space-x-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-gray-700 backdrop-blur-sm"
                initial={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xs text-white">
                  👤
                </div>
                <span>{session.user.name}</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-600">{session.user.department}</span>
              </motion.div>
            )}
          </div>
        </motion.div>

        {error && (
          <motion.div
            animate={{ opacity: 1, x: 0 }}
            className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-gray-900/5 backdrop-blur-sm"
            initial={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-gradient-to-r from-red-50 to-pink-50 px-8 py-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10">
                    <svg
                      className="h-6 w-6 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-red-800">
                      エラーが発生しました
                    </h3>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
                <motion.button
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-red-400 backdrop-blur-sm transition-colors hover:bg-white hover:text-red-600"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setError(null)}
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M6 18L18 6M6 6l12 12"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Daily Survey Alert */}
        {surveyStatus && !surveyStatus.completed && (
          <motion.div
            animate={{ opacity: 1, x: 0 }}
            className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-gray-900/5 backdrop-blur-sm"
            initial={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                    <div className="text-2xl">🌤️</div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-blue-800">
                      今日の気持ちチェック
                    </h3>
                    <p className="text-sm text-blue-700">
                      あなたの心の天気を教えてください！
                    </p>
                  </div>
                </div>
                <motion.button
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-blue-400 backdrop-blur-sm transition-colors hover:bg-white hover:text-blue-600"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSurveyStatus(null)}
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M6 18L18 6M6 6l12 12"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Personal Risk Level */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            whileHover={{ y: -5 }}
          >
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-blue-500/25">
              <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-blue-200/30 blur-2xl transition-all duration-300 group-hover:bg-blue-300/40"></div>
              <div className="relative z-10">
                <div className="mb-4 flex items-center justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 backdrop-blur-sm">
                    <div className="text-2xl">
                      {currentRisk?.riskLevel === "low"
                        ? "☀️"
                        : currentRisk?.riskLevel === "medium"
                          ? "🌤️"
                          : "⛈️"}
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <Text className="text-sm font-medium text-gray-600">
                    あなたのリスクレベル
                  </Text>
                  {currentRisk ? (
                    <div className="mt-2 space-y-2">
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        className="bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-3xl font-bold text-transparent"
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {currentRisk.score.toFixed(1)}
                      </motion.div>
                      <Badge color={getRiskBadge(currentRisk.riskLevel).color}>
                        {getRiskBadge(currentRisk.riskLevel).label}
                      </Badge>
                    </div>
                  ) : (
                    <div className="mt-2 text-center">
                      <Text className="text-sm text-gray-500">
                        まだデータがありません
                      </Text>
                      <Text className="text-xs text-gray-400">
                        アンケートに回答してください
                      </Text>
                    </div>
                  )}
                  {currentRisk && (
                    <Text className="mt-3 text-xs text-gray-500">
                      最終更新:{" "}
                      {new Date(currentRisk.date).toLocaleDateString("ja-JP")}
                    </Text>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Survey Status */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            whileHover={{ y: -5 }}
          >
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 to-green-100 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-emerald-500/25">
              <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-emerald-200/30 blur-2xl transition-all duration-300 group-hover:bg-emerald-300/40"></div>
              <div className="relative z-10">
                <div className="mb-4 flex items-center justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 backdrop-blur-sm">
                    <div className="text-2xl">📝</div>
                  </div>
                </div>
                <div className="text-center">
                  <Text className="text-sm font-medium text-gray-600">
                    アンケート進捗
                  </Text>
                  <div className="mt-2">
                    <div className="mb-2 flex items-center justify-center space-x-2">
                      <span className="text-3xl font-bold text-emerald-600">
                        {surveyStatus?.completed ? "5" : "0"}/5
                      </span>
                    </div>
                    <Badge color="green">
                      {surveyStatus?.completed ? "完了" : "未回答"}
                    </Badge>
                  </div>
                  <Text className="mt-3 text-xs text-gray-500">
                    締切: 18:00
                  </Text>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Team Stats (for managers and above) */}
          {session?.user?.role &&
            ["manager", "hr", "admin"].includes(session.user.role) &&
            teamStats && (
              <>
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-violet-100 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-purple-500/25">
                    <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-purple-200/30 blur-2xl transition-all duration-300 group-hover:bg-purple-300/40"></div>
                    <div className="relative z-10">
                      <div className="mb-4 flex items-center justify-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 backdrop-blur-sm">
                          <div className="text-2xl">👥</div>
                        </div>
                      </div>
                      <div className="text-center">
                        <Text className="text-sm font-medium text-gray-600">
                          チームメンバー
                        </Text>
                        <div className="mt-2">
                          <div className="mb-2 flex items-center justify-center space-x-2">
                            <span className="text-3xl font-bold text-purple-600">
                              {teamStats.totalMembers}
                            </span>
                            <span className="text-sm text-gray-500">人</span>
                          </div>
                          <div className="flex justify-center space-x-2">
                            <Badge color="red">高: {teamStats.highRisk}</Badge>
                            <Badge color="yellow">
                              中: {teamStats.mediumRisk}
                            </Badge>
                            <Badge color="green">低: {teamStats.lowRisk}</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3, delay: 0.7 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-50 to-pink-100 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-red-500/25">
                    <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-red-200/30 blur-2xl transition-all duration-300 group-hover:bg-red-300/40"></div>
                    <div className="relative z-10">
                      <div className="mb-4 flex items-center justify-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 backdrop-blur-sm">
                          <div className="text-2xl">⚠️</div>
                        </div>
                      </div>
                      <div className="text-center">
                        <Text className="text-sm font-medium text-gray-600">
                          高リスクメンバー
                        </Text>
                        <div className="mt-2">
                          <div className="mb-2 flex items-center justify-center space-x-2">
                            <span className="text-3xl font-bold text-red-600">
                              {teamStats.highRisk}
                            </span>
                            <span className="text-sm text-gray-500">人</span>
                          </div>
                          <Badge color="red">要注意</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
        </div>

        {/* High Risk Members Alert */}
        <AnimatePresence>
          {teamStats && teamStats.highRisk > 0 && (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-gray-900/5 backdrop-blur-sm"
              exit={{ opacity: 0, y: -20 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="bg-gradient-to-r from-red-50 to-pink-50 px-8 py-6">
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10">
                    <div className="text-2xl">⚠️</div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-red-800">
                      高リスクメンバー
                    </h3>
                    <p className="text-sm text-red-600">
                      注意が必要なメンバーがいます
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="space-y-4">
                  {teamStats.members
                    .filter((member) => member.riskLevel === "high")
                    .slice(0, 5) // 最大5人まで表示
                    .map((member, index) => (
                      <motion.div
                        key={member.id}
                        animate={{ opacity: 1, x: 0 }}
                        className="group relative overflow-hidden rounded-2xl border-2 border-red-200 bg-gradient-to-r from-red-50 to-pink-50/30 p-6 shadow-lg transition-all duration-300 hover:shadow-xl"
                        initial={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-lg font-bold text-gray-900">
                              {member.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {member.department}
                            </p>
                          </div>
                          <div className="text-right">
                            <motion.div
                              animate={{ scale: [1, 1.05, 1] }}
                              className="flex items-center space-x-3"
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <div>
                                <div className="bg-gradient-to-r from-gray-900 via-red-800 to-pink-800 bg-clip-text text-2xl font-bold text-transparent">
                                  {member.score.toFixed(1)}
                                </div>
                                <Badge color="red">高リスク</Badge>
                              </div>
                              <div className="text-2xl">⛈️</div>
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Divider />

        {/* Quick Actions */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50 via-gray-50/50 to-white/90 shadow-xl ring-1 ring-gray-900/5 backdrop-blur-sm">
            <div className="relative overflow-hidden bg-gradient-to-r from-indigo-50 via-purple-50/50 to-pink-50/30 px-8 py-6">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 via-purple-400/10 to-pink-400/10 opacity-50"></div>
              <div className="absolute -top-4 -left-4 h-32 w-32 rounded-full bg-indigo-200/20 blur-xl"></div>
              <div className="absolute -right-4 -bottom-4 h-40 w-40 rounded-full bg-purple-200/20 blur-xl"></div>
              <div className="relative z-10 flex items-center space-x-4">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl text-white shadow-lg"
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  whileHover={{ scale: 1.1 }}
                >
                  ⚡
                </motion.div>
                <div>
                  <h3 className="bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-900 bg-clip-text text-xl font-bold text-transparent">
                    クイックアクション
                  </h3>
                  <p className="text-sm text-gray-600">
                    よく使用する機能へのショートカット
                  </p>
                </div>
              </div>
            </div>
            <div className="p-8">
              <div className="flex flex-wrap gap-6">
                <motion.button
                  animate={{ opacity: 1, y: 0 }}
                  className="group relative min-w-[280px] flex-1 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-blue-100/50 to-indigo-100/30 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25"
                  initial={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3, delay: 0.7 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  onClick={() => router.push("/survey")}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-indigo-400/10 to-blue-400/10 opacity-50"></div>
                  <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-blue-200/30 blur-2xl transition-all duration-300 group-hover:bg-blue-300/40"></div>
                  <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-indigo-200/30 blur-2xl transition-all duration-300 group-hover:bg-indigo-300/40"></div>
                  <div className="relative z-10">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-2xl text-white shadow-lg"
                      transition={{ duration: 2, repeat: Infinity }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      🌤️
                    </motion.div>
                    <h3 className="bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text font-medium text-transparent">
                      今日の天気記録
                    </h3>
                    <p className="text-sm text-blue-600">心の天気を記録する</p>
                  </div>
                </motion.button>

                <motion.button
                  animate={{ opacity: 1, y: 0 }}
                  className="group relative min-w-[280px] flex-1 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 via-emerald-100/50 to-green-100/30 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/25"
                  initial={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3, delay: 0.8 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  onClick={() => router.push("/survey/history")}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 via-green-400/10 to-emerald-400/10 opacity-50"></div>
                  <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-emerald-200/30 blur-2xl transition-all duration-300 group-hover:bg-emerald-300/40"></div>
                  <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-green-200/30 blur-2xl transition-all duration-300 group-hover:bg-green-300/40"></div>
                  <div className="relative z-10">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-2xl text-white shadow-lg"
                      transition={{ duration: 2, repeat: Infinity }}
                      whileHover={{ scale: 1.1, rotate: -5 }}
                    >
                      📊
                    </motion.div>
                    <h3 className="bg-gradient-to-r from-gray-900 via-emerald-800 to-green-900 bg-clip-text font-medium text-transparent">
                      過去の天気
                    </h3>
                    <p className="text-sm text-emerald-600">履歴を確認する</p>
                  </div>
                </motion.button>

                <motion.button
                  animate={{ opacity: 1, y: 0 }}
                  className="group relative min-w-[280px] flex-1 overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 via-purple-100/50 to-violet-100/30 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/25"
                  initial={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3, delay: 0.9 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  onClick={() => router.push("/analytics")}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 via-violet-400/10 to-purple-400/10 opacity-50"></div>
                  <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-purple-200/30 blur-2xl transition-all duration-300 group-hover:bg-purple-300/40"></div>
                  <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-violet-200/30 blur-2xl transition-all duration-300 group-hover:bg-violet-300/40"></div>
                  <div className="relative z-10">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 text-2xl text-white shadow-lg"
                      transition={{ duration: 2, repeat: Infinity }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      🔮
                    </motion.div>
                    <h3 className="bg-gradient-to-r from-gray-900 via-purple-800 to-violet-900 bg-clip-text font-medium text-transparent">
                      分析・予報
                    </h3>
                    <p className="text-sm text-purple-600">データを分析する</p>
                  </div>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
