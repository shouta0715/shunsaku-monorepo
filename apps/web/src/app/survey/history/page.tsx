"use client";

import { Button, Badge, Alert } from "@package/ui";
import Link from "next/link";
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
      low: { color: "green" as const, label: "低リスク" },
      medium: { color: "orange" as const, label: "中リスク" },
      high: { color: "red" as const, label: "高リスク" },
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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">回答履歴</h1>
            <p className="text-gray-600">過去のアンケート回答とスコアの推移</p>
          </div>

          <Link href="/survey">
            <Button>今日のアンケート</Button>
          </Link>
        </div>

        {error && (
          <Alert open={Boolean(error)} onClose={() => setError(null)}>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Summary */}
        {history.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.average.toFixed(1)}
                  </div>
                  <p className="text-sm text-gray-500">平均スコア</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {history.length}
                    </span>
                    {stats.trend !== "stable" && (
                      <div
                        className={`flex items-center ${
                          stats.trend === "up"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        <svg
                          className="h-4 w-4"
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
                            strokeWidth={2}
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">回答日数</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Badge
                    color={
                      getRiskBadge(calculateRiskLevel(stats.average)).color
                    }
                  >
                    {getRiskBadge(calculateRiskLevel(stats.average)).label}
                  </Badge>
                  <p className="mt-2 text-sm text-gray-500">現在の状態</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* History List */}
        {history.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="py-8 text-center">
                <svg
                  className="mx-auto mb-4 h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
                <h3 className="mb-2 text-lg font-medium text-gray-900">
                  まだ回答がありません
                </h3>
                <p className="mb-4 text-gray-500">
                  アンケートに回答すると、ここに履歴が表示されます。
                </p>
                <Link href="/survey">
                  <Button>最初のアンケートに回答する</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {history.map((survey) => {
              const riskLevel = calculateRiskLevel(survey.totalScore);
              const badge = getRiskBadge(riskLevel);

              return (
                <Card key={survey.id}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {new Date(survey.surveyDate).toLocaleDateString(
                            "ja-JP",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              weekday: "long",
                            },
                          )}
                        </CardTitle>
                        <CardDescription>
                          回答時刻:{" "}
                          {new Date(survey.submittedAt).toLocaleTimeString(
                            "ja-JP",
                          )}
                        </CardDescription>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          {survey.totalScore.toFixed(1)}
                        </div>
                        <Badge className="mt-1" color={badge.color}>
                          {badge.label}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3">
                      {survey.responses.map((response) => (
                        <div
                          key={response.id}
                          className="flex items-center justify-between border-b border-gray-100 py-2 last:border-b-0"
                        >
                          <span className="text-sm text-gray-700">
                            {(
                              response as SurveyResponse & {
                                question_text?: string;
                              }
                            ).question_text || "質問"}
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">
                              {response.score}
                            </span>
                            <div className="h-1 w-16 rounded-full bg-gray-200">
                              <div
                                className="h-1 rounded-full bg-blue-600"
                                style={{
                                  width: `${(response.score / 5) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
