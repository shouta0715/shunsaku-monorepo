"use client";

import { Alert, Heading, Text, Button } from "@package/ui";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout";
import { SurveyForm, SurveyCompleted } from "@/components/survey";
import { AlertDescription, LoadingSpinner } from "@/components/ui";
import { initializeSession } from "@/lib/mock-auth";
import type { Question, Survey } from "@/types";

type SurveyStatus = {
  completed: boolean;
  survey: Survey | null;
};

export default function SurveyPage() {
  const router = useRouter();
  const [session, setSession] = useState<{
    user: { id: string; name: string; role: string; department: string };
  } | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [status, setStatus] = useState<SurveyStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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

  // 初期データ取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 質問とステータスを並行取得
        const [questionsRes, statusRes] = await Promise.all([
          fetch("/api/mock/survey/questions"),
          fetch("/api/mock/survey/status"),
        ]);

        if (!questionsRes.ok || !statusRes.ok) {
          throw new Error("データの取得に失敗しました");
        }

        const questionsData = await questionsRes.json();
        const statusData = await statusRes.json();

        if (!questionsData.success || !statusData.success) {
          throw new Error("データの取得に失敗しました");
        }

        setQuestions(questionsData.data);
        setStatus(statusData.data);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "エラーが発生しました";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      void fetchData();
    }
  }, [session]);

  // 回答送信
  const handleSubmit = async (
    responses: { questionId: string; score: number }[],
  ) => {
    try {
      setSubmitting(true);
      setError(null);

      const response = await fetch("/api/mock/survey/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": session?.user?.id || "",
        },
        body: JSON.stringify({ responses }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "送信に失敗しました");
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "送信に失敗しました");
      }

      // ステータスを更新
      setStatus({
        completed: true,
        survey: result.data,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "送信エラーが発生しました";
      setError(message);
    } finally {
      setSubmitting(false);
    }
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
              className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-3xl text-white shadow-xl"
              initial={{ rotate: 0 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              🌤️
            </motion.div>
            <LoadingSpinner size="lg" />
            <Text className="mt-4 text-lg font-semibold text-gray-900">
              読み込み中...
            </Text>
            <Text className="text-gray-600">
              心の天気をチェックする準備をしています
            </Text>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          {/* Header */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-50 via-blue-50/50 to-indigo-50/30 p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-sky-400/10 via-blue-400/10 to-indigo-400/10 opacity-50"></div>
            <div className="absolute -top-4 -left-4 h-32 w-32 rounded-full bg-sky-200/20 blur-xl"></div>
            <div className="absolute -right-4 -bottom-4 h-40 w-40 rounded-full bg-indigo-200/20 blur-xl"></div>

            <div className="relative z-10">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-3xl text-white shadow-xl"
                initial={{ scale: 1 }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                🌤️
              </motion.div>
              <Heading className="mb-3 bg-gradient-to-r from-gray-900 via-sky-800 to-blue-800 bg-clip-text text-transparent">
                日次アンケート
              </Heading>
              <Text className="mx-auto max-w-2xl text-gray-600">
                今日の気持ちを教えてください
              </Text>
            </div>
          </motion.div>

          {/* Error Card */}
          <motion.div
            animate={{ opacity: 1, x: 0 }}
            className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-gray-900/5 backdrop-blur-sm"
            initial={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-gradient-to-r from-red-50 to-pink-50 px-8 py-6">
              <div className="flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10">
                  <svg
                    className="h-6 w-6 text-red-600"
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
                  <h3 className="text-xl font-bold text-gray-900">
                    エラーが発生しました
                  </h3>
                  <p className="text-sm text-gray-600">
                    申し訳ございません。もう一度お試しください。
                  </p>
                </div>
              </div>
            </div>
            <div className="p-8">
              <Alert open={Boolean(error)} onClose={() => setError(null)}>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
              <motion.div
                className="mt-6"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-2.5 text-white shadow-lg transition-all hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl"
                  onClick={() => window.location.reload()}
                >
                  再試行
                </Button>
              </motion.div>
            </div>
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
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-50 via-blue-50/50 to-indigo-50/30 p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-sky-400/10 via-blue-400/10 to-indigo-400/10 opacity-50"></div>
          <div className="absolute -top-4 -left-4 h-32 w-32 rounded-full bg-sky-200/20 blur-xl"></div>
          <div className="absolute -right-4 -bottom-4 h-40 w-40 rounded-full bg-indigo-200/20 blur-xl"></div>

          <div className="relative z-10">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-3xl text-white shadow-xl"
              initial={{ scale: 1 }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              🌤️
            </motion.div>
            <Heading className="mb-3 bg-gradient-to-r from-gray-900 via-sky-800 to-blue-800 bg-clip-text text-transparent">
              心の天気チェック
            </Heading>
            <Text className="mx-auto max-w-2xl text-gray-600">
              {status?.completed
                ? "今日のアンケートは完了しています。明日またお会いしましょう！"
                : "今日のあなたの心の天気を記録しましょう。5つの質問で気持ちを可視化します。"}
            </Text>

            {session?.user && (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 inline-flex items-center space-x-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-gray-700 backdrop-blur-sm"
                initial={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-xs text-white">
                  👤
                </div>
                <span>{session.user.name}</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-600">{session.user.department}</span>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Error Alert */}
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

        {/* Main Content */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {status?.completed && status.survey ? (
            <SurveyCompleted survey={status.survey} />
          ) : (
            <div className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-gray-900/5 backdrop-blur-sm">
              <div className="bg-gradient-to-r from-sky-50 to-blue-50 px-8 py-6">
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10">
                    <svg
                      className="h-6 w-6 text-sky-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      今日の心の天気
                    </h3>
                    <p className="text-sm text-gray-600">
                      5つの質問であなたの今日の状態をチェック
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <SurveyForm
                  loading={submitting}
                  questions={questions}
                  onSubmit={handleSubmit}
                />
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
