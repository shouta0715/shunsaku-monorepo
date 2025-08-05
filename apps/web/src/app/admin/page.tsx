"use client";

import { Badge, Button, Heading, Text } from "@package/ui";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { UserManagementModal } from "@/components/admin/UserManagementModal";
import { DashboardLayout } from "@/components/layout";
import { Input, Label, LoadingSpinner, Select } from "@/components/ui";
import { safeFetch } from "@/hooks/use-error-handler";
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

  // 新しいstate
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [editingSettings, setEditingSettings] = useState(false);
  const [editFormData, setEditFormData] = useState<SystemSettings>({
    surveyDeadline: "18:00",
    reminderEnabled: true,
    alertThreshold: 2.5,
    dataRetentionDays: 365,
  });

  // ユーザー管理モーダル
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [userModalMode, setUserModalMode] = useState<"list" | "add" | "edit">(
    "list",
  );
  const [editingUserId, setEditingUserId] = useState<string | undefined>();

  // システム監視
  const [downloadingLogs, setDownloadingLogs] = useState(false);

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

        const currentUserId = localStorage.getItem("currentUserId");
        if (!currentUserId) return;

        // APIからデータを取得
        const [statsRes, settingsRes] = await Promise.all([
          safeFetch("/api/mock/admin/stats", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-user-id": currentUserId,
            },
          }),
          safeFetch("/api/mock/admin/settings", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-user-id": currentUserId,
            },
          }),
        ]);

        const statsData = await statsRes.json();
        const settingsData = await settingsRes.json();

        if (statsData.success) setSystemStats(statsData.data);
        if (settingsData.success) {
          setSystemSettings(settingsData.data);
          setEditFormData(settingsData.data);
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

  // 設定保存機能
  const handleSaveSettings = useCallback(async () => {
    try {
      setSettingsLoading(true);
      setSettingsError(null);

      const currentUserId = localStorage.getItem("currentUserId");
      if (!currentUserId) return;

      const response = await safeFetch("/api/mock/admin/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": currentUserId,
        },
        body: JSON.stringify({
          action: "update",
          settings: editFormData,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSystemSettings(data.data);
        setEditingSettings(false);
        // 成功メッセージを表示（省略）
      } else {
        setSettingsError(data.error?.message || "設定の保存に失敗しました");
      }
    } catch (error) {
      setSettingsError("設定の保存中にエラーが発生しました");
      // eslint-disable-next-line no-console
      console.error("Save settings error:", error);
    } finally {
      setSettingsLoading(false);
    }
  }, [editFormData]);

  // 設定リセット機能
  const handleResetSettings = useCallback(async () => {
    if (!confirm("設定をデフォルト値にリセットしますか？")) return;

    try {
      setSettingsLoading(true);
      setSettingsError(null);

      const currentUserId = localStorage.getItem("currentUserId");
      if (!currentUserId) return;

      const response = await safeFetch("/api/mock/admin/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": currentUserId,
        },
        body: JSON.stringify({
          action: "reset",
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSystemSettings(data.data);
        setEditFormData(data.data);
        setEditingSettings(false);
      } else {
        setSettingsError(data.error?.message || "設定のリセットに失敗しました");
      }
    } catch (error) {
      setSettingsError("設定のリセット中にエラーが発生しました");
      // eslint-disable-next-line no-console
      console.error("Reset settings error:", error);
    } finally {
      setSettingsLoading(false);
    }
  }, []);

  // ログダウンロード機能
  const handleDownloadLogs = useCallback(async () => {
    try {
      setDownloadingLogs(true);

      const currentUserId = localStorage.getItem("currentUserId");
      if (!currentUserId) return;

      const response = await safeFetch("/api/mock/admin/logs", {
        method: "GET",
        headers: {
          "x-user-id": currentUserId,
        },
      });

      if (response.ok) {
        // CSVファイルとしてダウンロード
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `system-logs-${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Download logs error:", error);
    } finally {
      setDownloadingLogs(false);
    }
  }, []);

  // ユーザー管理機能
  const openUserModal = useCallback(
    (mode: "list" | "add" | "edit", userId?: string) => {
      setUserModalMode(mode);
      setEditingUserId(userId);
      setUserModalOpen(true);
    },
    [],
  );

  const handleUserModalSuccess = useCallback(() => {
    // ユーザー操作成功時の処理（統計の再取得など）
    const currentUserId = localStorage.getItem("currentUserId");
    if (!currentUserId) return;

    // 統計データを再取得
    void safeFetch("/api/mock/admin/stats", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": currentUserId,
      },
    }).then(async (response: Response) => {
      const data = await response.json();
      if (data.success) {
        setSystemStats(data.data);
      }
    });
  }, []);

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
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50/30 p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10 opacity-50"></div>
          <div className="absolute -top-4 -left-4 h-32 w-32 rounded-full bg-blue-200/20 blur-xl"></div>
          <div className="absolute -right-4 -bottom-4 h-40 w-40 rounded-full bg-purple-200/20 blur-xl"></div>

          <div className="relative z-10">
            <motion.div
              animate={{ rotate: 360 }}
              className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-3xl text-white shadow-xl"
              initial={{ rotate: 0 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              ⚙️
            </motion.div>
            <Heading className="mb-3 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              管理者設定
            </Heading>
            <Text className="mx-auto max-w-2xl text-gray-600">
              システム全体の設定と監視を行います。リアルタイムでの状況把握と効率的な管理をサポートします。
            </Text>
          </div>
        </motion.div>

        {/* System Stats */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="group cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            whileHover={{ y: -5 }}
          >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-blue-500/25">
              <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-blue-200/30 blur-2xl transition-all duration-300 group-hover:bg-blue-300/40"></div>
              <div className="relative z-10">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 backdrop-blur-sm">
                    <svg
                      className="h-6 w-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold tracking-wider text-blue-600/80 uppercase">
                    Users
                  </span>
                </div>
                <div className="mb-2 text-3xl font-bold text-gray-800">
                  {systemStats?.totalUsers}
                </div>
                <div className="flex items-center space-x-1 text-sm">
                  <span className="text-gray-600">アクティブ:</span>
                  <span className="font-semibold text-blue-600">
                    {systemStats?.activeUsers}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="group cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            whileHover={{ y: -5 }}
          >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 to-green-100 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-emerald-500/25">
              <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-emerald-200/30 blur-2xl transition-all duration-300 group-hover:bg-emerald-300/40"></div>
              <div className="relative z-10">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 backdrop-blur-sm">
                    <svg
                      className="h-6 w-6 text-emerald-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold tracking-wider text-emerald-600/80 uppercase">
                    Surveys
                  </span>
                </div>
                <div className="mb-2 text-3xl font-bold text-gray-800">
                  {systemStats?.totalSurveys}
                </div>
                <div className="text-sm text-gray-600">累計回答数</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="group cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            whileHover={{ y: -5 }}
          >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-amber-500/25">
              <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-amber-200/30 blur-2xl transition-all duration-300 group-hover:bg-amber-300/40"></div>
              <div className="relative z-10">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 backdrop-blur-sm">
                    <svg
                      className="h-6 w-6 text-amber-600"
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
                  <span className="text-xs font-semibold tracking-wider text-amber-600/80 uppercase">
                    Rate
                  </span>
                </div>
                <div className="mb-2 flex items-baseline space-x-1">
                  <span className="text-3xl font-bold text-gray-800">
                    {systemStats?.responseRate}
                  </span>
                  <span className="text-xl font-semibold text-amber-600">
                    %
                  </span>
                </div>
                <div className="text-sm text-gray-600">今月平均</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="group cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            whileHover={{ y: -5 }}
          >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-violet-100 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-purple-500/25">
              <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-purple-200/30 blur-2xl transition-all duration-300 group-hover:bg-purple-300/40"></div>
              <div className="relative z-10">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 backdrop-blur-sm">
                    <svg
                      className="h-6 w-6 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold tracking-wider text-purple-600/80 uppercase">
                    Status
                  </span>
                </div>
                <div className="mb-3">
                  <Badge
                    className="px-3 py-1.5 text-sm font-semibold"
                    color={getHealthColor(systemStats?.systemHealth || "gray")}
                  >
                    {getHealthLabel(systemStats?.systemHealth || "unknown")}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600">全サービス稼働中</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* System Settings */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-gray-900/5 backdrop-blur-sm">
            <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                    <svg
                      className="h-6 w-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                      <path
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      システム設定
                    </h3>
                    <p className="text-sm text-gray-600">
                      アンケートとアラートの基本設定
                    </p>
                  </div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    outline
                    className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2.5 text-white shadow-lg transition-all hover:from-blue-600 hover:to-purple-700 hover:shadow-xl"
                    disabled={settingsLoading}
                    onClick={() => setEditingSettings(!editingSettings)}
                  >
                    {editingSettings ? "キャンセル" : "編集"}
                  </Button>
                </motion.div>
              </div>
            </div>
            <div className="p-8">
              {settingsError && (
                <motion.div
                  animate={{ opacity: 1, x: 0 }}
                  className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4"
                  initial={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Text className="text-red-800">{settingsError}</Text>
                </motion.div>
              )}

              {editingSettings ? (
                // 編集モード
                <div className="space-y-8">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label
                        className="text-sm font-semibold text-gray-700"
                        htmlFor="surveyDeadline"
                      >
                        アンケート締切時刻
                      </Label>
                      <Input
                        className="rounded-xl border-gray-200 bg-gray-50/50 focus:border-blue-500 focus:bg-white"
                        id="surveyDeadline"
                        type="time"
                        value={editFormData.surveyDeadline}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            surveyDeadline: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        className="text-sm font-semibold text-gray-700"
                        htmlFor="alertThreshold"
                      >
                        アラート閾値
                      </Label>
                      <Input
                        className="rounded-xl border-gray-200 bg-gray-50/50 focus:border-blue-500 focus:bg-white"
                        id="alertThreshold"
                        max="5"
                        min="1"
                        step="0.1"
                        type="number"
                        value={editFormData.alertThreshold}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            alertThreshold: Number(e.target.value),
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        className="text-sm font-semibold text-gray-700"
                        htmlFor="dataRetentionDays"
                      >
                        データ保持期間（日）
                      </Label>
                      <Input
                        className="rounded-xl border-gray-200 bg-gray-50/50 focus:border-blue-500 focus:bg-white"
                        id="dataRetentionDays"
                        max="3650"
                        min="30"
                        type="number"
                        value={editFormData.dataRetentionDays}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            dataRetentionDays: Number(e.target.value),
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        className="text-sm font-semibold text-gray-700"
                        htmlFor="reminderEnabled"
                      >
                        リマインダー通知
                      </Label>
                      <Select
                        className="rounded-xl border-gray-200 bg-gray-50/50 focus:border-blue-500 focus:bg-white"
                        id="reminderEnabled"
                        value={editFormData.reminderEnabled ? "true" : "false"}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            reminderEnabled: e.target.value === "true",
                          })
                        }
                      >
                        <option value="true">有効</option>
                        <option value="false">無効</option>
                      </Select>
                    </div>
                  </div>

                  <div className="border-t border-gray-100"></div>

                  <div className="flex justify-end space-x-4">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        outline
                        className="border-2 border-gray-300 !bg-white px-6 py-2.5 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                        disabled={settingsLoading}
                        onClick={handleResetSettings}
                      >
                        {settingsLoading ? "処理中..." : "デフォルトに戻す"}
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-2.5 text-white shadow-lg transition-all hover:from-green-600 hover:to-emerald-700 hover:shadow-xl"
                        disabled={settingsLoading}
                        onClick={handleSaveSettings}
                      >
                        {settingsLoading ? "保存中..." : "設定を保存"}
                      </Button>
                    </motion.div>
                  </div>
                </div>
              ) : (
                // 表示モード
                <div className="grid gap-8 md:grid-cols-2">
                  <div className="space-y-6">
                    <div className="rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-gray-900">
                            アンケート締切時刻
                          </div>
                          <div className="text-sm text-gray-600">
                            毎日のアンケート回答締切
                          </div>
                        </div>
                        <div className="rounded-lg bg-white px-3 py-2 font-mono text-lg font-bold text-blue-600 shadow-sm">
                          {systemSettings?.surveyDeadline}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-gray-900">
                            リマインダー通知
                          </div>
                          <div className="text-sm text-gray-600">
                            未回答者への自動通知
                          </div>
                        </div>
                        <Badge
                          className="px-4 py-2 text-sm font-semibold"
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

                  <div className="space-y-6">
                    <div className="rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-gray-900">
                            アラート閾値
                          </div>
                          <div className="text-sm text-gray-600">
                            高リスク判定の基準スコア
                          </div>
                        </div>
                        <div className="rounded-lg bg-white px-3 py-2 font-mono text-lg font-bold text-amber-600 shadow-sm">
                          {systemSettings?.alertThreshold}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl bg-gradient-to-r from-purple-50 to-violet-50 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-gray-900">
                            データ保持期間
                          </div>
                          <div className="text-sm text-gray-600">
                            履歴データの保管日数
                          </div>
                        </div>
                        <div className="rounded-lg bg-white px-3 py-2 font-mono text-lg font-bold text-purple-600 shadow-sm">
                          {systemSettings?.dataRetentionDays}日
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* User Management */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.6 }}
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
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    ユーザー管理
                  </h3>
                  <p className="text-sm text-gray-600">
                    システムユーザーの管理と権限設定
                  </p>
                </div>
              </div>
            </div>
            <div className="p-8">
              <div className="grid gap-6 md:grid-cols-3">
                <motion.button
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 p-6 text-left transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25"
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openUserModal("list")}
                >
                  <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-blue-200/30 blur-xl transition-all duration-300 group-hover:bg-blue-300/40"></div>
                  <div className="relative z-10">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-500/10 backdrop-blur-sm">
                      <svg
                        className="h-7 w-7 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                        />
                      </svg>
                    </div>
                    <div className="font-semibold text-gray-900">
                      ユーザー一覧
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      全ユーザーの表示・編集
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 to-green-100 p-6 text-left transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/25"
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openUserModal("add")}
                >
                  <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-emerald-200/30 blur-xl transition-all duration-300 group-hover:bg-emerald-300/40"></div>
                  <div className="relative z-10">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-500/10 backdrop-blur-sm">
                      <svg
                        className="h-7 w-7 text-emerald-600"
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
                    <div className="font-semibold text-gray-900">
                      ユーザー追加
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      新しいユーザーを作成
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-violet-100 p-6 text-left transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/25"
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openUserModal("list")}
                >
                  <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-purple-200/30 blur-xl transition-all duration-300 group-hover:bg-purple-300/40"></div>
                  <div className="relative z-10">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-purple-500/10 backdrop-blur-sm">
                      <svg
                        className="h-7 w-7 text-purple-600"
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
                    <div className="font-semibold text-gray-900">権限管理</div>
                    <div className="mt-1 text-sm text-gray-600">
                      ロールと権限の設定
                    </div>
                  </div>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* System Monitoring */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <div className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-gray-900/5 backdrop-blur-sm">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-8 py-6">
              <div className="flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10">
                  <svg
                    className="h-6 w-6 text-green-600"
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
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    システム監視
                  </h3>
                  <p className="text-sm text-gray-600">
                    パフォーマンスとエラー状況の監視
                  </p>
                </div>
              </div>
            </div>
            <div className="p-8">
              <div className="space-y-6">
                <motion.div
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 p-6 transition-all duration-300 hover:shadow-lg"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="absolute -top-2 -right-2 h-16 w-16 rounded-full bg-green-200/30 blur-xl"></div>
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        className="h-3 w-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50"
                        transition={{ duration: 2, repeat: Infinity }}
                      ></motion.div>
                      <div className="font-semibold text-green-800">
                        データベース接続: 正常
                      </div>
                    </div>
                    <div className="rounded-lg bg-white px-3 py-1 text-sm font-medium text-green-600 shadow-sm">
                      応答時間: 23ms
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 p-6 transition-all duration-300 hover:shadow-lg"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="absolute -top-2 -right-2 h-16 w-16 rounded-full bg-blue-200/30 blur-xl"></div>
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        className="h-3 w-3 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: 0.5,
                        }}
                      ></motion.div>
                      <div className="font-semibold text-blue-800">
                        APIサーバー: 正常稼働
                      </div>
                    </div>
                    <div className="rounded-lg bg-white px-3 py-1 text-sm font-medium text-blue-600 shadow-sm">
                      稼働率: 99.9%
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-50 to-violet-50 p-6 transition-all duration-300 hover:shadow-lg"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="absolute -top-2 -right-2 h-16 w-16 rounded-full bg-purple-200/30 blur-xl"></div>
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        className="h-3 w-3 rounded-full bg-purple-500 shadow-lg shadow-purple-500/50"
                        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                      ></motion.div>
                      <div className="font-semibold text-purple-800">
                        メール送信サービス: 正常
                      </div>
                    </div>
                    <div className="rounded-lg bg-white px-3 py-1 text-sm font-medium text-purple-600 shadow-sm">
                      送信数: 142件/日
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 p-6 transition-all duration-300 hover:shadow-lg"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="absolute -top-2 -right-2 h-16 w-16 rounded-full bg-amber-200/30 blur-xl"></div>
                  <div className="relative z-10 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-amber-800">
                        システムログをエクスポート
                      </div>
                      <div className="mt-1 text-sm text-amber-600">
                        過去7日間のログをCSV形式でダウンロード
                      </div>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        className="bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-2.5 text-white shadow-lg transition-all hover:from-amber-600 hover:to-orange-700 hover:shadow-xl"
                        disabled={downloadingLogs}
                        onClick={handleDownloadLogs}
                      >
                        {downloadingLogs ? "処理中..." : "ダウンロード"}
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>

                {/* システム統計 */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <motion.div
                    className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-gray-100 p-6"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-slate-200/30 blur-xl"></div>
                    <div className="relative z-10">
                      <div className="mb-4 flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-500/10">
                          <svg
                            className="h-5 w-5 text-slate-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M13 10V3L4 14h7v7l9-11h-7z"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                            />
                          </svg>
                        </div>
                        <div className="font-semibold text-slate-800">
                          今日のアクティビティ
                        </div>
                      </div>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between rounded-lg bg-white/70 p-3">
                          <span className="text-gray-600">ログイン数:</span>
                          <span className="font-bold text-slate-800">
                            {systemStats?.activeUsers || 0}回
                          </span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-white/70 p-3">
                          <span className="text-gray-600">アンケート回答:</span>
                          <span className="font-bold text-slate-800">
                            {Math.floor((systemStats?.totalSurveys || 0) / 30)}
                            件
                          </span>
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-white/70 p-3">
                          <span className="text-gray-600">アラート生成:</span>
                          <span className="font-bold text-slate-800">3件</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-100 p-6"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-cyan-200/30 blur-xl"></div>
                    <div className="relative z-10">
                      <div className="mb-4 flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">
                          <svg
                            className="h-5 w-5 text-cyan-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                            />
                          </svg>
                        </div>
                        <div className="font-semibold text-cyan-800">
                          リソース使用状況
                        </div>
                      </div>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between rounded-lg bg-white/70 p-3">
                          <span className="text-gray-600">CPU使用率:</span>
                          <div className="flex items-center space-x-2">
                            <div className="h-2 w-16 overflow-hidden rounded-full bg-gray-200">
                              <div className="h-full w-[15%] bg-green-500"></div>
                            </div>
                            <span className="font-bold text-cyan-800">15%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-white/70 p-3">
                          <span className="text-gray-600">メモリ使用率:</span>
                          <div className="flex items-center space-x-2">
                            <div className="h-2 w-16 overflow-hidden rounded-full bg-gray-200">
                              <div className="h-full w-[42%] bg-yellow-500"></div>
                            </div>
                            <span className="font-bold text-cyan-800">42%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-white/70 p-3">
                          <span className="text-gray-600">ストレージ:</span>
                          <div className="flex items-center space-x-2">
                            <div className="h-2 w-16 overflow-hidden rounded-full bg-gray-200">
                              <div className="h-full w-[68%] bg-orange-500"></div>
                            </div>
                            <span className="font-bold text-cyan-800">68%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ユーザー管理モーダル */}
        <UserManagementModal
          isOpen={userModalOpen}
          mode={userModalMode}
          userId={editingUserId}
          onClose={() => setUserModalOpen(false)}
          onSuccess={handleUserModalSuccess}
        />
      </div>
    </DashboardLayout>
  );
}
