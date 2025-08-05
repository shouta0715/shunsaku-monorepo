"use client";

import { Button, Heading, Text } from "@package/ui";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AlertList } from "@/components/alerts/AlertList";
import { DashboardLayout } from "@/components/layout";
import { LoadingSpinner } from "@/components/ui";
import { useErrorHandler } from "@/hooks/use-error-handler";
import { CustomError } from "@/lib/error-utils";
import { initializeSession } from "@/lib/mock-auth";

export default function AlertsPage() {
  const router = useRouter();
  const [session, setSession] = useState<{
    user: { id: string; name: string; role: string; department: string };
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // エラーハンドリング用フック
  const { error, isError, handleError, clearError, retryAction } =
    useErrorHandler({
      defaultMode: "inline",
      redirectOnAuth: true,
    });

  // 認証チェック関数
  const checkAuthentication = useCallback(async () => {
    try {
      setLoading(true);
      clearError();

      const currentSession = initializeSession();
      if (!currentSession.isAuthenticated) {
        throw new CustomError(
          "AUTHENTICATION_REQUIRED",
          "ログインが必要です",
          "No valid session found",
        );
      }

      // ユーザー情報の存在確認
      if (!currentSession.user) {
        throw new CustomError(
          "AUTHENTICATION_REQUIRED",
          "ユーザー情報が見つかりません",
          "User data not found in session",
        );
      }

      // アラート閲覧権限チェック（必要に応じて制限可能）
      // 現在は全ユーザーがアクセス可能
      setSession({ user: currentSession.user });
    } catch (error) {
      handleError(error);
      // 認証エラーの場合は自動的にリダイレクトされる
    } finally {
      setLoading(false);
    }
  }, [handleError, clearError]);

  useEffect(() => {
    void checkAuthentication();
  }, [checkAuthentication]);

  // ローディング表示
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
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 text-3xl text-white shadow-xl">
              🔔
            </div>
            <LoadingSpinner size="lg" />
            <Text className="mt-4 text-lg font-semibold text-gray-900">
              読み込み中...
            </Text>
            <Text className="text-gray-600">アラート情報を取得しています</Text>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  // 認証エラー表示（リダイレクト前のフォールバック）
  if (isError && error?.code === "AUTHENTICATION_REQUIRED") {
    return (
      <DashboardLayout>
        <div className="flex min-h-64 items-center justify-center">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-red-600 text-3xl text-white shadow-xl">
              <svg
                className="h-10 w-10"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  clipRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  fillRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="mb-3 text-xl font-bold text-gray-900">認証エラー</h3>
            <p className="mb-6 max-w-md text-gray-600">{error?.message}</p>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-2.5 text-white shadow-lg transition-all hover:from-red-600 hover:to-red-700 hover:shadow-xl"
                onClick={() => router.push("/")}
              >
                ログインページに戻る
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* 一般的なエラー表示 */}
        {isError && error?.code !== "AUTHENTICATION_REQUIRED" && (
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
                    <p className="text-sm text-red-700">{error?.message}</p>
                    {error?.details && (
                      <p className="mt-1 text-xs text-red-600">
                        詳細: {error.details}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-3">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      outline
                      className="border-2 border-red-300 bg-white px-4 py-2 text-red-700 hover:border-red-400 hover:bg-red-50"
                      onClick={() => retryAction(checkAuthentication)}
                    >
                      再試行
                    </Button>
                  </motion.div>
                  <motion.button
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-red-400 backdrop-blur-sm transition-colors hover:bg-white hover:text-red-600"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={clearError}
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
            </div>
          </motion.div>
        )}

        {/* Header */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-50 via-red-50/50 to-pink-50/30 p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 via-red-400/10 to-pink-400/10 opacity-50"></div>
          <div className="absolute -top-4 -left-4 h-32 w-32 rounded-full bg-orange-200/20 blur-xl"></div>
          <div className="absolute -right-4 -bottom-4 h-40 w-40 rounded-full bg-red-200/20 blur-xl"></div>

          <div className="relative z-10">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 text-3xl text-white shadow-xl"
              initial={{ scale: 1 }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              🔔
            </motion.div>
            <Heading className="mb-3 bg-gradient-to-r from-gray-900 via-orange-800 to-red-800 bg-clip-text text-transparent">
              アラート管理
            </Heading>
            <Text className="mx-auto max-w-2xl text-gray-600">
              重要な通知や状況変化をリアルタイムでお知らせします。効率的なアラート管理で迅速な対応をサポート。
            </Text>

            {session?.user && (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 inline-flex items-center space-x-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-gray-700 backdrop-blur-sm"
                initial={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-600 text-xs text-white">
                  👤
                </div>
                <span>{session.user.name}</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-600">{session.user.department}</span>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Alert List Section */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-gray-900/5 backdrop-blur-sm">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 px-8 py-6">
              <div className="flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10">
                  <svg
                    className="h-6 w-6 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M15 17h5l-5 5v-5zM9 14h1v3H9v-3zM12 14h1v3h-1v-3zM15 14h1v3h-1v-3zM6 20V7a1 1 0 011-1h10a1 1 0 011 1v5M3 3l18 18"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    アクティブアラート
                  </h3>
                  <p className="text-sm text-gray-600">
                    重要度の高いアラートから優先的に表示
                  </p>
                </div>
              </div>
            </div>
            <div className="p-8">
              {session?.user ? (
                <AlertList />
              ) : (
                <div className="py-12 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                    <LoadingSpinner size="md" />
                  </div>
                  <Text className="text-lg font-semibold text-gray-900">
                    認証情報を確認中...
                  </Text>
                  <Text className="text-gray-600">お待ちください</Text>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
