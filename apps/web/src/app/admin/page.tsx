"use client";

import { Badge, Button, Divider, Heading, Text } from "@package/ui";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  LoadingSpinner,
} from "@/components/ui";
import { initializeSession } from "@/lib/mock-auth";

type SystemStats = {
  totalUsers: number;
  activeUsers: number;
  totalSurveys: number;
  responseRate: number;
  systemHealth: "healthy" | "warning" | "error";
};

type SystemSettings = {
  surveyDeadline: string;
  reminderEnabled: boolean;
  alertThreshold: number;
  dataRetentionDays: number;
};

export default function AdminPage() {
  const router = useRouter();
  const [session, setSession] = useState<{
    user: { id: string; name: string; role: string; department: string };
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [systemSettings, setSystemSettings] = useState<SystemSettings | null>(
    null,
  );

  useEffect(() => {
    const currentSession = initializeSession();
    if (!currentSession.isAuthenticated) {
      router.push("/");

      return;
    }

    // 管理者権限チェック
    if (!["admin", "hr"].includes(currentSession.user?.role || "")) {
      router.push("/dashboard");

      return;
    }

    if (currentSession.user) {
      setSession({ user: currentSession.user });
    }
  }, [router]);

  useEffect(() => {
    const fetchAdminData = async () => {
      if (!session) return;

      try {
        setLoading(true);

        // APIからデータを取得
        const [statsRes, settingsRes] = await Promise.all([
          fetch("/api/mock/admin/stats"),
          fetch("/api/mock/admin/settings"),
        ]);

        if (statsRes.ok && settingsRes.ok) {
          const statsData = await statsRes.json();
          const settingsData = await settingsRes.json();

          if (statsData.success) setSystemStats(statsData.data);
          if (settingsData.success) setSystemSettings(settingsData.data);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Admin data fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    void fetchAdminData();
  }, [session]);

  const getHealthColor = (health: string) => {
    const colorMap = {
      healthy: "green" as const,
      warning: "yellow" as const,
      error: "red" as const,
    };

    return colorMap[health as keyof typeof colorMap] || ("gray" as const);
  };

  const getHealthLabel = (health: string) => {
    const labelMap = {
      healthy: "正常",
      warning: "注意",
      error: "エラー",
    };

    return labelMap[health as keyof typeof labelMap] || "不明";
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
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mb-4 text-4xl">⚙️</div>
          <Heading className="mb-2">管理者設定</Heading>
          <Text className="text-gray-600">
            システム全体の設定と監視を行います
          </Text>
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.15 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  総ユーザー数
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {systemStats?.totalUsers}
                </div>
                <p className="text-xs text-gray-500">
                  アクティブ: {systemStats?.activeUsers}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.15 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  総アンケート数
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {systemStats?.totalSurveys}
                </div>
                <p className="text-xs text-gray-500">累計回答数</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.15 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  回答率
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {systemStats?.responseRate}%
                </div>
                <p className="text-xs text-gray-500">今月平均</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.15 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  システム状態
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge
                  color={getHealthColor(systemStats?.systemHealth || "gray")}
                >
                  {getHealthLabel(systemStats?.systemHealth || "unknown")}
                </Badge>
                <p className="mt-1 text-xs text-gray-500">全サービス稼働中</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle>システム設定</CardTitle>
            <CardDescription>アンケートとアラートの基本設定</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <Text className="font-medium">アンケート締切時刻</Text>
                    <Text className="text-sm text-gray-500">
                      毎日のアンケート回答締切
                    </Text>
                  </div>
                  <div className="text-right">
                    <Text className="font-mono text-lg">
                      {systemSettings?.surveyDeadline}
                    </Text>
                  </div>
                </div>

                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <Text className="font-medium">リマインダー通知</Text>
                    <Text className="text-sm text-gray-500">
                      未回答者への自動通知
                    </Text>
                  </div>
                  <div>
                    <Badge
                      color={
                        systemSettings?.reminderEnabled
                          ? ("green" as const)
                          : ("zinc" as const)
                      }
                    >
                      {systemSettings?.reminderEnabled ? "有効" : "無効"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <Text className="font-medium">アラート閾値</Text>
                    <Text className="text-sm text-gray-500">
                      高リスク判定の基準スコア
                    </Text>
                  </div>
                  <div className="text-right">
                    <Text className="font-mono text-lg">
                      {systemSettings?.alertThreshold}
                    </Text>
                  </div>
                </div>

                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <Text className="font-medium">データ保持期間</Text>
                    <Text className="text-sm text-gray-500">
                      履歴データの保管日数
                    </Text>
                  </div>
                  <div className="text-right">
                    <Text className="font-mono text-lg">
                      {systemSettings?.dataRetentionDays}日
                    </Text>
                  </div>
                </div>
              </div>
            </div>

            <Divider className="my-6" />

            <div className="flex justify-end space-x-3">
              <Button outline>設定をリセット</Button>
              <Button>設定を保存</Button>
            </div>
          </CardContent>
        </Card>

        {/* User Management */}
        <Card>
          <CardHeader>
            <CardTitle>ユーザー管理</CardTitle>
            <CardDescription>システムユーザーの管理と権限設定</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <button className="rounded-lg border border-blue-200 bg-blue-50/30 p-4 text-left transition-colors hover:border-blue-300 hover:bg-blue-50">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                    <svg
                      className="h-5 w-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  </div>
                  <div>
                    <Text className="font-medium">ユーザー一覧</Text>
                    <Text className="text-sm text-gray-500">
                      全ユーザーの表示・編集
                    </Text>
                  </div>
                </div>
              </button>

              <button className="rounded-lg border border-green-200 bg-green-50/30 p-4 text-left transition-colors hover:border-green-300 hover:bg-green-50">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                    <svg
                      className="h-5 w-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  </div>
                  <div>
                    <Text className="font-medium">ユーザー追加</Text>
                    <Text className="text-sm text-gray-500">
                      新しいユーザーを作成
                    </Text>
                  </div>
                </div>
              </button>

              <button className="rounded-lg border border-purple-200 bg-purple-50/30 p-4 text-left transition-colors hover:border-purple-300 hover:bg-purple-50">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                    <svg
                      className="h-5 w-5 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  </div>
                  <div>
                    <Text className="font-medium">権限管理</Text>
                    <Text className="text-sm text-gray-500">
                      ロールと権限の設定
                    </Text>
                  </div>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* System Monitoring */}
        <Card>
          <CardHeader>
            <CardTitle>システム監視</CardTitle>
            <CardDescription>パフォーマンスとエラー状況の監視</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg bg-green-50 p-4">
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <Text className="font-medium text-green-800">
                    データベース接続: 正常
                  </Text>
                </div>
              </div>

              <div className="rounded-lg bg-green-50 p-4">
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <Text className="font-medium text-green-800">
                    APIサーバー: 正常稼働
                  </Text>
                </div>
              </div>

              <div className="rounded-lg bg-green-50 p-4">
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <Text className="font-medium text-green-800">
                    メール送信サービス: 正常
                  </Text>
                </div>
              </div>

              <div className="rounded-lg bg-blue-50 p-4">
                <div className="flex items-center justify-between">
                  <Text className="font-medium text-blue-800">
                    システムログをエクスポート
                  </Text>
                  <Button outline>ダウンロード</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
