"use client";

import { Button, Badge, Heading, Text } from "@package/ui";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout";
import {
  LoadingSpinner,
} from "@/components/ui";
import { initializeSession } from "@/lib/mock-auth";
import { getCurrentUserSurveys, mockQuestions } from "@/lib/mock-data";
import type { Survey, SurveyResponse } from "@/types";

type SurveyWithResponses = Survey & { responses: SurveyResponse[] };

export default function SurveyHistoryPage() {
  const router = useRouter();
  const [session, setSession] = useState<{
    user: { id: string; name: string; role: string; department: string };
  } | null>(null);
  const [history, setHistory] = useState<SurveyWithResponses[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 認証チェック
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
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);

        // モックデータから履歴を取得
        const surveys = getCurrentUserSurveys();
        const historyData = surveys.map((survey) => ({
          ...survey,
          surveyDate: new Date(survey.surveyDate),
          submittedAt: new Date(survey.submittedAt),
          responses: survey.responses.map((response) => {
            const question = mockQuestions.find(
              (q) => q.id === response.questionId,
            );

            return {
              id: `${survey.id}-${response.questionId}`,
              surveyId: survey.id,
              questionId: response.questionId,
              score: response.score,
              createdAt: new Date(survey.submittedAt),
              question_text: question?.text || "質問",
            };
          }),
        }));

        setHistory(historyData);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "エラーが発生しました";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      void fetchHistory();
    }
  }, [session]);

  const getRiskBadge = (level: "low" | "medium" | "high") => {
    const config = {
      low: { 
        color: "green" as const, 
        label: "低リスク",
        emoji: "☀️",
        bgGradient: "from-green-50 to-emerald-50",
        borderColor: "border-green-200",
      },
      medium: { 
        color: "yellow" as const, 
        label: "中リスク",
        emoji: "🌤️",
        bgGradient: "from-yellow-50 to-amber-50",
        borderColor: "border-yellow-200",
      },
      high: { 
        color: "red" as const, 
        label: "高リスク",
        emoji: "⛈️",
        bgGradient: "from-red-50 to-pink-50",
        borderColor: "border-red-200",
      },
    };

    return config[level];
  };

  // スコア統計を計算
  const calculateScoreStats = (scores: number[]) => {
    if (scores.length === 0) return { average: 0, trend: "stable" as const };

    const average =
      scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const recent = scores.slice(-5);
    const older = scores.slice(-10, -5);

    if (older.length === 0) return { average, trend: "stable" as const };

    const recentAvg =
      recent.reduce((sum, score) => sum + score, 0) / recent.length;
    const olderAvg =
      older.reduce((sum, score) => sum + score, 0) / older.length;

    const diff = recentAvg - olderAvg;
    const trend = Math.abs(diff) < 0.2 ? "stable" : diff > 0 ? "up" : "down";

    return { average, trend };
  };

  const calculateRiskLevel = (score: number): "low" | "medium" | "high" => {
    if (score >= 4.0) return "low";
    if (score >= 2.5) return "medium";

    return "high";
  };

  const stats = calculateScoreStats(history.map((h) => h.totalScore));

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
              📊
            </motion.div>
            <LoadingSpinner size="lg" />
            <Text className="mt-4 text-lg font-semibold text-gray-900">
              読み込み中...
            </Text>
            <Text className="text-gray-600">履歴データを取得しています</Text>
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
              📊
            </motion.div>
            <Heading className="mb-3 bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent">
              心の天気履歴
            </Heading>
            <Text className="mx-auto max-w-2xl text-gray-600">
              過去のアンケート回答とスコアの推移を確認できます。あなたの心の天気の変化を振り返りましょう。
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
            
            <motion.div
              className="mt-6 inline-block"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href="/survey">
                <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-2.5 text-white shadow-lg transition-all hover:from-indigo-600 hover:to-purple-700 hover:shadow-xl">
                  <span className="flex items-center space-x-2">
                    <span>今日のアンケート</span>
                    <span className="text-lg">🌤️</span>
                  </span>
                </Button>
              </Link>
            </motion.div>
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

        {/* Stats Summary */}
        {history.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="group cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              whileHover={{ y: -5 }}
            >
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-blue-500/25">
                <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-blue-200/30 blur-2xl transition-all duration-300 group-hover:bg-blue-300/40"></div>
                <div className="relative z-10">
                  <div className="mb-4 flex items-center justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 backdrop-blur-sm">
                      <svg
                        className="h-6 w-6 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="text-center">
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      className="mb-2 text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent"
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {stats.average.toFixed(1)}
                    </motion.div>
                    <Text className="text-sm font-medium text-gray-600">
                      平均スコア
                    </Text>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="group cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              whileHover={{ y: -5 }}
            >
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 to-green-100 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-emerald-500/25">
                <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-emerald-200/30 blur-2xl transition-all duration-300 group-hover:bg-emerald-300/40"></div>
                <div className="relative z-10">
                  <div className="mb-4 flex items-center justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 backdrop-blur-sm">
                      <svg
                        className="h-6 w-6 text-emerald-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="mb-2 flex items-center justify-center space-x-2">
                      <span className="text-3xl font-bold text-gray-800">
                        {history.length}
                      </span>
                      {stats.trend !== "stable" && (
                        <motion.div
                          animate={{ y: stats.trend === "up" ? [0, -3, 0] : [0, 3, 0] }}
                          className={`flex items-center ${
                            stats.trend === "up"
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d={
                                stats.trend === "up"
                                  ? "M7 14l5-5 5 5"
                                  : "M7 10l5 5 5-5"
                              }
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                            />
                          </svg>
                        </motion.div>
                      )}
                    </div>
                    <Text className="text-sm font-medium text-gray-600">
                      回答日数
                    </Text>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="group cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, delay: 0.6 }}
              whileHover={{ y: -5 }}
            >
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-violet-100 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-purple-500/25">
                <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-purple-200/30 blur-2xl transition-all duration-300 group-hover:bg-purple-300/40"></div>
                <div className="relative z-10">
                  <div className="mb-4 flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      className="text-3xl"
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {getRiskBadge(calculateRiskLevel(stats.average)).emoji}
                    </motion.div>
                  </div>
                  <div className="text-center">
                    <Badge
                      className="px-4 py-2 text-sm font-semibold shadow-md"
                      color={
                        getRiskBadge(calculateRiskLevel(stats.average)).color
                      }
                    >
                      {getRiskBadge(calculateRiskLevel(stats.average)).label}
                    </Badge>
                    <Text className="mt-3 text-sm font-medium text-gray-600">
                      現在の状態
                    </Text>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* History List */}
        {history.length === 0 ? (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <div className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-gray-900/5 backdrop-blur-sm">
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 px-8 py-6">
                <div className="flex items-center justify-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-500/10">
                    <svg
                      className="h-6 w-6 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900">
                      まだ回答がありません
                    </h3>
                  </div>
                </div>
              </div>
              <div className="p-12 text-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200"
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <span className="text-4xl">📝</span>
                </motion.div>
                <Text className="mb-6 text-lg text-gray-600">
                  アンケートに回答すると、ここに履歴が表示されます。
                </Text>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link href="/survey">
                    <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-3 text-white shadow-lg transition-all hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl">
                      <span className="flex items-center space-x-2">
                        <span>最初のアンケートに回答する</span>
                        <span className="text-lg">🌤️</span>
                      </span>
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <div className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-gray-900/5 backdrop-blur-sm">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-8 py-6">
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10">
                    <svg
                      className="h-6 w-6 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      回答履歴
                    </h3>
                    <p className="text-sm text-gray-600">
                      {history.length}件の記録があります
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="space-y-4">
                  {history.map((survey, index) => {
                    const riskLevel = calculateRiskLevel(survey.totalScore);
                    const badge = getRiskBadge(riskLevel);

                    return (
                      <motion.div
                        key={survey.id}
                        animate={{ opacity: 1, x: 0 }}
                        className={`group relative overflow-hidden rounded-2xl border-2 ${badge.borderColor} bg-gradient-to-r ${badge.bgGradient} p-6 shadow-lg transition-all duration-300 hover:shadow-xl`}
                        initial={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-lg font-bold text-gray-900">
                              {new Date(survey.surveyDate).toLocaleDateString(
                                "ja-JP",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  weekday: "long",
                                },
                              )}
                            </h4>
                            <p className="text-sm text-gray-600">
                              回答時刻:{" "}
                              {new Date(survey.submittedAt).toLocaleTimeString(
                                "ja-JP",
                              )}
                            </p>
                          </div>

                          <div className="text-right">
                            <motion.div
                              animate={{ scale: [1, 1.05, 1] }}
                              className="flex items-center space-x-3"
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <div>
                                <div className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent">
                                  {survey.totalScore.toFixed(1)}
                                </div>
                                <Badge className="mt-1" color={badge.color}>
                                  {badge.label}
                                </Badge>
                              </div>
                              <div className="text-3xl">
                                {badge.emoji}
                              </div>
                            </motion.div>
                          </div>
                        </div>

                        <motion.div
                          animate={{ opacity: 1 }}
                          className="mt-4 space-y-3"
                          initial={{ opacity: 0 }}
                          transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
                        >
                          {survey.responses.map((response, responseIndex) => (
                            <motion.div
                              key={response.id}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex items-center justify-between border-b border-gray-200/50 py-3 last:border-b-0"
                              initial={{ opacity: 0, x: -10 }}
                              transition={{ duration: 0.2, delay: 1 + index * 0.1 + responseIndex * 0.05 }}
                            >
                              <span className="text-sm font-medium text-gray-700">
                                {(
                                  response as SurveyResponse & {
                                    question_text?: string;
                                  }
                                ).question_text || "質問"}
                              </span>
                              <div className="flex items-center space-x-3">
                                <span className="text-sm font-bold text-gray-800">
                                  {response.score}
                                </span>
                                <div className="relative h-2 w-20 overflow-hidden rounded-full bg-gray-200/70 shadow-inner">
                                  <motion.div
                                    animate={{ width: `${(response.score / 5) * 100}%` }}
                                    className={`h-2 rounded-full shadow-sm ${
                                      response.score >= 4
                                        ? "bg-gradient-to-r from-green-400 to-emerald-500"
                                        : response.score >= 3
                                          ? "bg-gradient-to-r from-yellow-400 to-amber-500"
                                          : "bg-gradient-to-r from-red-400 to-red-500"
                                    }`}
                                    initial={{ width: 0 }}
                                    transition={{ duration: 0.5, delay: 1.1 + index * 0.1 + responseIndex * 0.05 }}
                                  />
                                </div>
                                <span className="text-lg">
                                  {response.score >= 4 ? "☀️" : response.score >= 3 ? "🌤️" : "⛈️"}
                                </span>
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
