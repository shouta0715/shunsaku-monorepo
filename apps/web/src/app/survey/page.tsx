"use client";

import { Alert } from "@package/ui";
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
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">読み込み中...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">日次アンケート</h1>
            <p className="text-gray-600">今日の気持ちを教えてください</p>
          </div>

          <Alert open={Boolean(error)} onClose={() => setError(null)}>
            <AlertDescription>{error}</AlertDescription>
          </Alert>

          <button
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            onClick={() => window.location.reload()}
          >
            再試行
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">日次アンケート</h1>
          <p className="text-gray-600">
            {status?.completed
              ? "今日のアンケートは完了しています"
              : "今日の気持ちを教えてください"}
          </p>
        </div>

        {error && (
          <Alert open={Boolean(error)} onClose={() => setError(null)}>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {status?.completed && status.survey ? (
          <SurveyCompleted survey={status.survey} />
        ) : (
          <SurveyForm
            loading={submitting}
            questions={questions}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
