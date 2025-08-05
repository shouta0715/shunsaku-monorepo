"use client";

import { Badge, Button, Heading, Text } from "@package/ui";
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

type TeamMember = {
  id: string;
  name: string;
  department: string;
  role: string;
  riskLevel: "low" | "medium" | "high";
  score: number;
  lastResponseDate: string;
  responseRate: number;
  managerNotes?: string;
};

type TeamStats = {
  totalMembers: number;
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
  averageResponseRate: number;
  departmentBreakdown: {
    department: string;
    memberCount: number;
    averageScore: number;
    riskDistribution: { high: number; medium: number; low: number };
  }[];
};

export default function TeamPage() {
  const router = useRouter();
  const [session, setSession] = useState<{
    user: { id: string; name: string; role: string; department: string };
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [teamStats, setTeamStats] = useState<TeamStats | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<string>("all");

  useEffect(() => {
    const currentSession = initializeSession();
    if (!currentSession.isAuthenticated) {
      router.push("/");

      return;
    }

    // チーム管理権限チェック
    if (!["manager", "hr", "admin"].includes(currentSession.user?.role || "")) {
      router.push("/dashboard");

      return;
    }

    if (currentSession.user) {
      setSession({ user: currentSession.user });
    }
  }, [router]);

  useEffect(() => {
    const fetchTeamData = async () => {
      if (!session) return;

      try {
        setLoading(true);

        // APIからデータを取得
        const [membersRes, statsRes] = await Promise.all([
          fetch("/api/mock/team/members"),
          fetch("/api/mock/team/stats"),
        ]);

        if (membersRes.ok && statsRes.ok) {
          const membersData = await membersRes.json();
          const statsData = await statsRes.json();

          if (membersData.success) setTeamMembers(membersData.data);
          if (statsData.success) setTeamStats(statsData.data);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Team data fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    void fetchTeamData();
  }, [session]);

  const getRiskBadge = (level: "low" | "medium" | "high") => {
    const config = {
      low: { color: "green" as const, label: "低リスク" },
      medium: { color: "yellow" as const, label: "中リスク" },
      high: { color: "red" as const, label: "高リスク" },
    };

    return config[level];
  };

  const getResponseRateColor = (rate: number) => {
    if (rate >= 95) return "text-green-600";
    if (rate >= 85) return "text-yellow-600";

    return "text-red-600";
  };

  // フィルタリング
  const filteredMembers = teamMembers.filter((member) => {
    const departmentMatch =
      selectedDepartment === "all" || member.department === selectedDepartment;
    const riskMatch =
      selectedRiskLevel === "all" || member.riskLevel === selectedRiskLevel;

    return departmentMatch && riskMatch;
  });

  const departments = ["all", ...new Set(teamMembers.map((m) => m.department))];
  const riskLevels = ["all", "high", "medium", "low"];

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
          <div className="mb-4 text-4xl">👥</div>
          <Heading className="mb-2">チーム管理</Heading>
          <Text className="text-gray-600">
            チームメンバーの状況監視と管理を行います
          </Text>
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.15 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  チームメンバー
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {teamStats?.totalMembers}
                </div>
                <p className="text-xs text-gray-500">人</p>
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
                  高リスクメンバー
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {teamStats?.highRisk}
                </div>
                <p className="text-xs text-gray-500">要注意</p>
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
                  平均回答率
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {teamStats?.averageResponseRate}%
                </div>
                <p className="text-xs text-gray-500">過去30日</p>
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
                  リスク分布
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <span className="text-xs text-red-600">
                    高:{teamStats?.highRisk}
                  </span>
                  <span className="text-xs text-yellow-600">
                    中:{teamStats?.mediumRisk}
                  </span>
                  <span className="text-xs text-green-600">
                    低:{teamStats?.lowRisk}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Department Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>部署別状況</CardTitle>
            <CardDescription>各部署のメンバー状況とリスク分布</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamStats?.departmentBreakdown.map((dept) => (
                <div
                  key={dept.department}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50/30 p-4"
                >
                  <div className="flex items-center space-x-4">
                    <div>
                      <Text className="font-medium">{dept.department}</Text>
                      <Text className="text-sm text-gray-600">
                        {dept.memberCount}名 | 平均スコア:{" "}
                        {dept.averageScore.toFixed(1)}
                      </Text>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {dept.riskDistribution.high > 0 && (
                      <Badge color="red">高:{dept.riskDistribution.high}</Badge>
                    )}
                    {dept.riskDistribution.medium > 0 && (
                      <Badge color="yellow">
                        中:{dept.riskDistribution.medium}
                      </Badge>
                    )}
                    {dept.riskDistribution.low > 0 && (
                      <Badge color="green">
                        低:{dept.riskDistribution.low}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>メンバー一覧</CardTitle>
            <CardDescription>チームメンバーの詳細情報と管理</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex flex-wrap gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  部署でフィルター
                </label>
                <select
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept === "all" ? "すべての部署" : dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  リスクレベルでフィルター
                </label>
                <select
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                  value={selectedRiskLevel}
                  onChange={(e) => setSelectedRiskLevel(e.target.value)}
                >
                  {riskLevels.map((level) => (
                    <option key={level} value={level}>
                      {level === "all"
                        ? "すべてのレベル"
                        : level === "high"
                          ? "高リスク"
                          : level === "medium"
                            ? "中リスク"
                            : "低リスク"}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredMembers.map((member) => {
                const badge = getRiskBadge(member.riskLevel);

                return (
                  <div
                    key={member.id}
                    className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                          <span className="text-lg font-medium text-gray-600">
                            {member.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <Text className="font-medium">{member.name}</Text>
                          <Text className="text-sm text-gray-600">
                            {member.department} • {member.role}
                          </Text>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">
                            {member.score.toFixed(1)}
                          </div>
                          <Badge color={badge.color}>{badge.label}</Badge>
                        </div>

                        <div className="text-right">
                          <div
                            className={`text-sm font-medium ${getResponseRateColor(member.responseRate)}`}
                          >
                            {member.responseRate}%
                          </div>
                          <Text className="text-xs text-gray-500">回答率</Text>
                        </div>

                        <div className="text-right">
                          <Text className="text-xs text-gray-500">
                            最終回答:{" "}
                            {new Date(
                              member.lastResponseDate,
                            ).toLocaleDateString("ja-JP")}
                          </Text>
                        </div>

                        <Button outline>詳細</Button>
                      </div>
                    </div>

                    {member.managerNotes && (
                      <div className="mt-3 rounded-md bg-yellow-50 p-3">
                        <Text className="text-sm text-yellow-800">
                          📝 メモ: {member.managerNotes}
                        </Text>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {filteredMembers.length === 0 && (
              <div className="py-8 text-center">
                <Text className="text-gray-500">
                  条件に一致するメンバーが見つかりません
                </Text>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>クイックアクション</CardTitle>
            <CardDescription>チーム管理に関連する操作</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <button className="rounded-lg border border-red-200 bg-red-50/30 p-4 text-left transition-colors hover:border-red-300 hover:bg-red-50">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                    <svg
                      className="h-5 w-5 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  </div>
                  <div>
                    <Text className="font-medium text-red-700">
                      高リスク対応
                    </Text>
                    <Text className="text-sm text-red-600">
                      緊急対応が必要なメンバー
                    </Text>
                  </div>
                </div>
              </button>

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
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  </div>
                  <div>
                    <Text className="font-medium text-blue-700">
                      1on1ミーティング
                    </Text>
                    <Text className="text-sm text-blue-600">
                      個別面談をスケジュール
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
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  </div>
                  <div>
                    <Text className="font-medium text-green-700">
                      レポート出力
                    </Text>
                    <Text className="text-sm text-green-600">
                      チーム状況レポート
                    </Text>
                  </div>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
