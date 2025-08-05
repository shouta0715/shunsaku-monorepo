"use client";

import { Badge, Button, Divider, Heading, Text } from "@package/ui";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout";
import {
  HighRiskActionModal,
  ManagerNoteModal,
  MemberDetailModal,
  MemberSelectModal,
  OneOnOneMeetingModal,
  TeamReportModal,
} from "@/components/team";
import { LoadingSpinner } from "@/components/ui";
import { initializeSession } from "@/lib/mock-auth";
import type { TeamMemberStats, TeamOverallStats } from "@/lib/mock-data";

export default function TeamPage() {
  const router = useRouter();
  const [session, setSession] = useState<{
    user: { id: string; name: string; role: string; department: string };
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState<TeamMemberStats[]>([]);
  const [teamStats, setTeamStats] = useState<TeamOverallStats | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<string>("all");
  const [selectedMember, setSelectedMember] = useState<TeamMemberStats | null>(
    null,
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isHighRiskModalOpen, setIsHighRiskModalOpen] = useState(false);
  const [isOneOnOneModalOpen, setIsOneOnOneModalOpen] = useState(false);
  const [isTeamReportModalOpen, setIsTeamReportModalOpen] = useState(false);
  const [isManagerNoteModalOpen, setIsManagerNoteModalOpen] = useState(false);
  const [isMemberSelectModalOpen, setIsMemberSelectModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<
    "one_on_one" | "high_risk" | null
  >(null);

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

        // モックデータを生成
        const { generateTeamMemberStats, generateTeamOverallStats } =
          await import("@/lib/mock-data");
        const memberStats = generateTeamMemberStats();
        const overallStats = generateTeamOverallStats();

        setTeamMembers(memberStats);
        setTeamStats(overallStats);
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
              👥
            </motion.div>
            <LoadingSpinner size="lg" />
            <Text className="mt-4 text-lg font-semibold text-gray-900">
              読み込み中...
            </Text>
            <Text className="text-gray-600">チームデータを取得しています</Text>
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
              👥
            </motion.div>
            <Heading className="mb-3 bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent">
              チーム管理
            </Heading>
            <Text className="mx-auto max-w-2xl text-gray-600">
              チームメンバーの状況監視と管理を行います。メンバーの心の天気を把握し、適切なサポートを提供しましょう。
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

        {/* Team Stats */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
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
                    <div className="text-2xl">👥</div>
                  </div>
                </div>
                <div className="text-center">
                  <Text className="text-sm font-medium text-gray-600">
                    チームメンバー
                  </Text>
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    className="mt-2 bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-3xl font-bold text-transparent"
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {teamStats?.totalMembers}
                  </motion.div>
                  <Text className="mt-1 text-xs text-gray-500">人</Text>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, delay: 0.5 }}
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
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    className="mt-2 bg-gradient-to-r from-gray-900 via-red-800 to-pink-800 bg-clip-text text-3xl font-bold text-transparent"
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {teamStats?.highRisk}
                  </motion.div>
                  <Badge className="mt-2" color="red">
                    要注意
                  </Badge>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, delay: 0.6 }}
            whileHover={{ y: -5 }}
          >
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 to-green-100 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-emerald-500/25">
              <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-emerald-200/30 blur-2xl transition-all duration-300 group-hover:bg-emerald-300/40"></div>
              <div className="relative z-10">
                <div className="mb-4 flex items-center justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 backdrop-blur-sm">
                    <div className="text-2xl">📊</div>
                  </div>
                </div>
                <div className="text-center">
                  <Text className="text-sm font-medium text-gray-600">
                    平均回答率
                  </Text>
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    className="mt-2 bg-gradient-to-r from-gray-900 via-emerald-800 to-green-800 bg-clip-text text-3xl font-bold text-transparent"
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {teamStats?.averageResponseRate}%
                  </motion.div>
                  <Text className="mt-1 text-xs text-gray-500">過去30日</Text>
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
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-violet-100 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-purple-500/25">
              <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-purple-200/30 blur-2xl transition-all duration-300 group-hover:bg-purple-300/40"></div>
              <div className="relative z-10">
                <div className="mb-4 flex items-center justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 backdrop-blur-sm">
                    <div className="text-2xl">📈</div>
                  </div>
                </div>
                <div className="text-center">
                  <Text className="text-sm font-medium text-gray-600">
                    リスク分布
                  </Text>
                  <div className="mt-2 flex justify-center space-x-2">
                    <Badge color="red">高: {teamStats?.highRisk}</Badge>
                    <Badge color="yellow">中: {teamStats?.mediumRisk}</Badge>
                    <Badge color="green">低: {teamStats?.lowRisk}</Badge>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Department Breakdown */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-gray-900/5 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-8 py-6">
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10">
                <div className="text-2xl">🏢</div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">部署別状況</h3>
                <p className="text-sm text-gray-600">
                  各部署のメンバー状況とリスク分布
                </p>
              </div>
            </div>
          </div>
          <div className="p-8">
            <div className="space-y-4">
              {teamStats?.departmentBreakdown.map((dept, index) => (
                <motion.div
                  key={dept.department}
                  animate={{ opacity: 1, x: 0 }}
                  className="group relative overflow-hidden rounded-2xl border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50/30 p-6 shadow-lg transition-all duration-300 hover:shadow-xl"
                  initial={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">
                        {dept.department}
                      </h4>
                      <div className="mt-1 flex items-center space-x-3">
                        <Text className="text-sm text-gray-600">
                          {dept.memberCount}名
                        </Text>
                        <span className="text-gray-300">|</span>
                        <motion.div
                          animate={{ scale: [1, 1.05, 1] }}
                          className="bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-sm font-bold text-transparent"
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          スコア: {dept.averageScore.toFixed(1)}
                        </motion.div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {dept.riskDistribution.high > 0 && (
                        <Badge color="red">
                          高: {dept.riskDistribution.high}
                        </Badge>
                      )}
                      {dept.riskDistribution.medium > 0 && (
                        <Badge color="yellow">
                          中: {dept.riskDistribution.medium}
                        </Badge>
                      )}
                      {dept.riskDistribution.low > 0 && (
                        <Badge color="green">
                          低: {dept.riskDistribution.low}
                        </Badge>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Filters and Member List */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-gray-900/5 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6">
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                <div className="text-2xl">👥</div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  メンバー一覧
                </h3>
                <p className="text-sm text-gray-600">
                  チームメンバーの詳細情報と管理
                </p>
              </div>
            </div>
          </div>
          <div className="p-8">
            <div className="mb-8 flex flex-wrap gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  部署でフィルター
                </label>
                <select
                  className="rounded-xl border-2 border-indigo-200 bg-white/50 px-4 py-2 text-sm shadow-sm backdrop-blur-sm transition-colors hover:border-indigo-300 focus:border-indigo-400 focus:outline-none"
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
                  className="rounded-xl border-2 border-indigo-200 bg-white/50 px-4 py-2 text-sm shadow-sm backdrop-blur-sm transition-colors hover:border-indigo-300 focus:border-indigo-400 focus:outline-none"
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
              {filteredMembers.map((member, index) => {
                const badge = getRiskBadge(member.riskLevel);
                const riskColor =
                  member.riskLevel === "high"
                    ? "red"
                    : member.riskLevel === "medium"
                      ? "yellow"
                      : "green";
                const gradientClass = {
                  red: "from-red-50 to-pink-50/30 border-red-200",
                  yellow: "from-yellow-50 to-amber-50/30 border-yellow-200",
                  green: "from-emerald-50 to-green-50/30 border-emerald-200",
                }[riskColor];

                return (
                  <motion.div
                    key={member.id}
                    animate={{ opacity: 1, x: 0 }}
                    className={`group relative overflow-hidden rounded-2xl border-2 bg-gradient-to-r p-6 shadow-lg transition-all duration-300 hover:shadow-xl ${gradientClass}`}
                    initial={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <motion.div
                          className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/80 shadow-sm backdrop-blur-sm"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          <span className="text-lg font-medium text-gray-600">
                            {member.name.charAt(0)}
                          </span>
                        </motion.div>
                        <div>
                          <Text className="text-lg font-bold text-gray-900">
                            {member.name}
                          </Text>
                          <Text className="text-sm text-gray-600">
                            {member.department} • {member.role}
                          </Text>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            className={`bg-gradient-to-r from-gray-900 text-2xl font-bold ${
                              member.riskLevel === "high"
                                ? "via-red-800 to-pink-800"
                                : member.riskLevel === "medium"
                                  ? "via-yellow-800 to-amber-800"
                                  : "via-green-800 to-emerald-800"
                            } bg-clip-text text-transparent`}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            {member.score.toFixed(1)}
                          </motion.div>
                          <Badge color={badge.color}>{badge.label}</Badge>
                        </div>

                        <div className="text-right">
                          <div
                            className={`text-lg font-bold ${getResponseRateColor(member.responseRate)}`}
                          >
                            {member.responseRate}%
                          </div>
                          <Text className="text-xs text-gray-500">回答率</Text>
                        </div>

                        <div className="text-right">
                          <Text className="text-sm text-gray-500">
                            最終回答:{" "}
                            {new Date(
                              member.lastResponseDate,
                            ).toLocaleDateString("ja-JP")}
                          </Text>
                        </div>

                        <Button
                          className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-2.5 text-white shadow-lg transition-all hover:from-indigo-600 hover:to-purple-700 hover:shadow-xl"
                          onClick={() => {
                            setSelectedMember(member);
                            setIsDetailModalOpen(true);
                          }}
                        >
                          詳細
                        </Button>
                      </div>
                    </div>

                    {member.managerNotes && (
                      <motion.div
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 overflow-hidden rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50/50 p-4 shadow-sm"
                        initial={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-center space-x-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/10">
                            <span className="text-sm">📝</span>
                          </div>
                          <Text className="text-sm font-medium text-amber-800">
                            メモ: {member.managerNotes}
                          </Text>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {filteredMembers.length === 0 && (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl bg-gradient-to-r from-gray-50 to-slate-50 p-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <span className="text-2xl">🔍</span>
                </div>
                <Text className="text-gray-500">
                  条件に一致するメンバーが見つかりません
                </Text>
              </motion.div>
            )}
          </div>
        </motion.div>

        <Divider />

        {/* Quick Actions */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50 via-gray-50/50 to-white/90 shadow-xl ring-1 ring-gray-900/5 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
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
                  チーム管理に関連する操作
                </p>
              </div>
            </div>
          </div>
          <div className="p-8">
            <div className="flex flex-wrap gap-6">
              <motion.button
                animate={{ opacity: 1, y: 0 }}
                className="group relative min-w-[280px] flex-1 overflow-hidden rounded-2xl bg-gradient-to-br from-red-50 via-red-100/50 to-pink-100/30 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-red-500/25"
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, delay: 0.7 }}
                whileHover={{ y: -5, scale: 1.02 }}
                onClick={() => {
                  const highRiskMembers = teamMembers.filter(
                    (m) => m.riskLevel === "high",
                  );
                  if (highRiskMembers.length > 0) {
                    setIsMemberSelectModalOpen(true);
                    setSelectedAction("high_risk");
                  }
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-400/10 via-pink-400/10 to-red-400/10 opacity-50"></div>
                <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-red-200/30 blur-2xl transition-all duration-300 group-hover:bg-red-300/40"></div>
                <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-pink-200/30 blur-2xl transition-all duration-300 group-hover:bg-pink-300/40"></div>
                <div className="relative z-10">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-pink-600 text-2xl text-white shadow-lg"
                    transition={{ duration: 2, repeat: Infinity }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    ⚠️
                  </motion.div>
                  <h3 className="bg-gradient-to-r from-gray-900 via-red-800 to-pink-900 bg-clip-text font-medium text-transparent">
                    高リスク対応
                  </h3>
                  <p className="text-sm text-red-600">
                    緊急対応が必要なメンバー
                  </p>
                </div>
              </motion.button>

              <motion.button
                animate={{ opacity: 1, y: 0 }}
                className="group relative min-w-[280px] flex-1 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-blue-100/50 to-indigo-100/30 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25"
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, delay: 0.8 }}
                whileHover={{ y: -5, scale: 1.02 }}
                onClick={() => {
                  setIsMemberSelectModalOpen(true);
                  setSelectedAction("one_on_one");
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-indigo-400/10 to-blue-400/10 opacity-50"></div>
                <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-blue-200/30 blur-2xl transition-all duration-300 group-hover:bg-blue-300/40"></div>
                <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-indigo-200/30 blur-2xl transition-all duration-300 group-hover:bg-indigo-300/40"></div>
                <div className="relative z-10">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-2xl text-white shadow-lg"
                    transition={{ duration: 2, repeat: Infinity }}
                    whileHover={{ scale: 1.1, rotate: -5 }}
                  >
                    💬
                  </motion.div>
                  <h3 className="bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text font-medium text-transparent">
                    1on1ミーティング
                  </h3>
                  <p className="text-sm text-blue-600">
                    個別面談をスケジュール
                  </p>
                </div>
              </motion.button>

              <motion.button
                animate={{ opacity: 1, y: 0 }}
                className="group relative min-w-[280px] flex-1 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 via-emerald-100/50 to-green-100/30 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/25"
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, delay: 0.9 }}
                whileHover={{ y: -5, scale: 1.02 }}
                onClick={() => setIsTeamReportModalOpen(true)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 via-green-400/10 to-emerald-400/10 opacity-50"></div>
                <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-emerald-200/30 blur-2xl transition-all duration-300 group-hover:bg-emerald-300/40"></div>
                <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-green-200/30 blur-2xl transition-all duration-300 group-hover:bg-green-300/40"></div>
                <div className="relative z-10">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-2xl text-white shadow-lg"
                    transition={{ duration: 2, repeat: Infinity }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    📊
                  </motion.div>
                  <h3 className="bg-gradient-to-r from-gray-900 via-emerald-800 to-green-900 bg-clip-text font-medium text-transparent">
                    レポート出力
                  </h3>
                  <p className="text-sm text-emerald-600">チーム状況レポート</p>
                </div>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* メンバー詳細モーダル */}
      <MemberDetailModal
        isOpen={isDetailModalOpen}
        member={selectedMember}
        setIsManagerNoteModalOpen={setIsManagerNoteModalOpen}
        setIsOneOnOneModalOpen={setIsOneOnOneModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedMember(null);
        }}
      />

      {/* 高リスク対応モーダル */}
      <HighRiskActionModal
        member={selectedMember}
        open={isHighRiskModalOpen}
        onClose={() => {
          setIsHighRiskModalOpen(false);
          setSelectedMember(null);
        }}
      />

      {/* 1on1ミーティングモーダル */}
      <OneOnOneMeetingModal
        member={selectedMember}
        open={isOneOnOneModalOpen}
        onClose={() => {
          setIsOneOnOneModalOpen(false);
          setSelectedMember(null);
        }}
      />

      {/* チームレポートモーダル */}
      <TeamReportModal
        members={teamMembers}
        open={isTeamReportModalOpen}
        onClose={() => setIsTeamReportModalOpen(false)}
      />

      {/* マネージャーメモモーダル */}
      <ManagerNoteModal
        member={selectedMember}
        open={isManagerNoteModalOpen}
        onClose={() => {
          setIsManagerNoteModalOpen(false);
          setSelectedMember(null);
        }}
      />

      {/* メンバー選択モーダル */}
      <MemberSelectModal
        description={
          selectedAction === "high_risk"
            ? "緊急対応が必要なメンバーを選択してください"
            : "1on1を実施するメンバーを選択してください"
        }
        members={
          selectedAction === "high_risk"
            ? teamMembers.filter((m) => m.riskLevel === "high")
            : teamMembers
        }
        open={isMemberSelectModalOpen}
        title={
          selectedAction === "high_risk"
            ? "高リスクメンバーを選択"
            : "メンバーを選択"
        }
        onClose={() => {
          setIsMemberSelectModalOpen(false);
          setSelectedAction(null);
        }}
        onSelect={(member: TeamMemberStats) => {
          setSelectedMember(member);
          setIsMemberSelectModalOpen(false);
          if (selectedAction === "high_risk") {
            setIsHighRiskModalOpen(true);
          } else {
            setIsOneOnOneModalOpen(true);
          }
          setSelectedAction(null);
        }}
      />
    </DashboardLayout>
  );
}
