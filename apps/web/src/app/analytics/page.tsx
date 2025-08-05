"use client";

import { Badge, Divider, Heading, Subheading, Text } from "@package/ui";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout";
import { LoadingSpinner } from "@/components/ui";
import { initializeSession } from "@/lib/mock-auth";

type WeatherTrend = {
  date: string;
  averageScore: number;
  weatherType: "storm" | "rain" | "cloudy" | "sunny" | "clear";
  totalResponses: number;
};

type DepartmentAnalysis = {
  department: string;
  averageScore: number;
  weatherType: "storm" | "rain" | "cloudy" | "sunny" | "clear";
  riskLevel: "high" | "medium" | "low";
  memberCount: number;
  trend: "improving" | "stable" | "declining";
};

type WeatherForecast = {
  period: string;
  predictedWeather: "storm" | "rain" | "cloudy" | "sunny" | "clear";
  confidence: number;
  riskFactors: string[];
};

export default function AnalyticsPage() {
  const router = useRouter();
  const [session, setSession] = useState<{
    user: { id: string; name: string; role: string; department: string };
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [weeklyTrends, setWeeklyTrends] = useState<WeatherTrend[]>([]);
  const [departmentAnalysis, setDepartmentAnalysis] = useState<
    DepartmentAnalysis[]
  >([]);
  const [weatherForecast, setWeatherForecast] = useState<WeatherForecast[]>([]);

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
    const fetchAnalyticsData = async () => {
      if (!session) return;

      try {
        setLoading(true);

        // モックデータの生成
        const mockWeeklyTrends: WeatherTrend[] = [
          {
            date: "2025-01-27",
            averageScore: 4.2,
            weatherType: "sunny",
            totalResponses: 145,
          },
          {
            date: "2025-01-28",
            averageScore: 3.8,
            weatherType: "cloudy",
            totalResponses: 142,
          },
          {
            date: "2025-01-29",
            averageScore: 3.5,
            weatherType: "cloudy",
            totalResponses: 138,
          },
          {
            date: "2025-01-30",
            averageScore: 2.9,
            weatherType: "rain",
            totalResponses: 134,
          },
          {
            date: "2025-01-31",
            averageScore: 3.1,
            weatherType: "cloudy",
            totalResponses: 141,
          },
          {
            date: "2025-02-01",
            averageScore: 3.6,
            weatherType: "cloudy",
            totalResponses: 147,
          },
          {
            date: "2025-02-02",
            averageScore: 4.0,
            weatherType: "sunny",
            totalResponses: 150,
          },
        ];

        const mockDepartmentAnalysis: DepartmentAnalysis[] = [
          {
            department: "開発部",
            averageScore: 3.8,
            weatherType: "cloudy",
            riskLevel: "medium",
            memberCount: 24,
            trend: "stable",
          },
          {
            department: "営業部",
            averageScore: 4.1,
            weatherType: "sunny",
            riskLevel: "low",
            memberCount: 18,
            trend: "improving",
          },
          {
            department: "人事部",
            averageScore: 4.3,
            weatherType: "sunny",
            riskLevel: "low",
            memberCount: 8,
            trend: "stable",
          },
          {
            department: "総務部",
            averageScore: 2.8,
            weatherType: "rain",
            riskLevel: "high",
            memberCount: 12,
            trend: "declining",
          },
          {
            department: "マーケティング部",
            averageScore: 3.4,
            weatherType: "cloudy",
            riskLevel: "medium",
            memberCount: 15,
            trend: "improving",
          },
        ];

        const mockWeatherForecast: WeatherForecast[] = [
          {
            period: "来週",
            predictedWeather: "cloudy",
            confidence: 78,
            riskFactors: ["プロジェクト締切", "繁忙期"],
          },
          {
            period: "来月",
            predictedWeather: "sunny",
            confidence: 65,
            riskFactors: ["新入社員研修", "チームビルディング"],
          },
          {
            period: "四半期末",
            predictedWeather: "rain",
            confidence: 82,
            riskFactors: ["売上目標プレッシャー", "長時間労働"],
          },
        ];

        setWeeklyTrends(mockWeeklyTrends);
        setDepartmentAnalysis(mockDepartmentAnalysis);
        setWeatherForecast(mockWeatherForecast);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Analytics data fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    void fetchAnalyticsData();
  }, [session]);

  const getWeatherIcon = (weatherType: string) => {
    const weatherMap = {
      storm: "⛈️",
      rain: "🌧️",
      cloudy: "🌤️",
      sunny: "🌞",
      clear: "☀️",
    };

    return weatherMap[weatherType as keyof typeof weatherMap] || "🌤️";
  };

  const getWeatherColor = (weatherType: string) => {
    const colorMap = {
      storm: "text-red-600",
      rain: "text-orange-600",
      cloudy: "text-gray-600",
      sunny: "text-blue-600",
      clear: "text-green-600",
    };

    return colorMap[weatherType as keyof typeof colorMap] || "text-gray-600";
  };

  const getRiskColor = (riskLevel: string) => {
    const riskMap = {
      high: "red" as const,
      medium: "yellow" as const,
      low: "green" as const,
    };

    return riskMap[riskLevel as keyof typeof riskMap] || ("gray" as const);
  };

  const getTrendIcon = (trend: string) => {
    const trendMap = {
      improving: "📈",
      stable: "➡️",
      declining: "📉",
    };

    return trendMap[trend as keyof typeof trendMap] || "➡️";
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
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 text-3xl text-white shadow-xl">
              🔮
            </div>
            <LoadingSpinner size="lg" />
            <Text className="mt-4 text-lg font-semibold text-gray-900">
              天気データを分析中...
            </Text>
            <Text className="text-gray-600">
              AI分析により組織の心の天気を予測しています
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
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-50 via-blue-50/50 to-cyan-50/30 p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 via-blue-400/10 to-cyan-400/10 opacity-50"></div>
          <div className="absolute -top-4 -left-4 h-32 w-32 rounded-full bg-purple-200/20 blur-xl"></div>
          <div className="absolute -right-4 -bottom-4 h-40 w-40 rounded-full bg-blue-200/20 blur-xl"></div>

          <div className="relative z-10">
            <motion.div
              animate={{ rotate: [0, 360] }}
              className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 text-3xl text-white shadow-xl"
              initial={{ rotate: 0 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              🔮
            </motion.div>
            <Heading className="mb-3 bg-gradient-to-r from-gray-900 via-purple-800 to-blue-800 bg-clip-text text-transparent">
              組織の天気予報 & 分析
            </Heading>
            <Text className="mx-auto max-w-2xl text-gray-600">
              データドリブンで組織の心の天気を予測し、改善策を提案します。AI分析による戦略的インサイトを提供。
            </Text>
          </div>
        </motion.div>

        {/* Weekly Weather Trends */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-gray-900/5 backdrop-blur-sm">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-8 py-6">
              <div className="flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10">
                  <div className="text-2xl">📊</div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    週間天気トレンド
                  </h3>
                  <p className="text-sm text-gray-600">
                    過去7日間の組織全体の心の天気推移
                  </p>
                </div>
              </div>
            </div>
            <div className="p-8">
              <div className="space-y-4">
                {/* Weather trend visualization */}
                <div className="grid grid-cols-7 gap-2">
                  {weeklyTrends.map((trend) => (
                    <div key={trend.date} className="text-center">
                      <div className="mb-2 text-xs text-gray-500">
                        {new Date(trend.date).toLocaleDateString("ja-JP", {
                          month: "numeric",
                          day: "numeric",
                        })}
                      </div>
                      <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                        <div className="text-2xl">
                          {getWeatherIcon(trend.weatherType)}
                        </div>
                      </div>
                      <div
                        className={`text-sm font-semibold ${getWeatherColor(trend.weatherType)}`}
                      >
                        {trend.averageScore.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {trend.totalResponses}人
                      </div>
                    </div>
                  ))}
                </div>

                {/* Trend analysis */}
                <div className="mt-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 p-6 shadow-lg backdrop-blur-sm">
                  <div className="mb-4 flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                      <div className="text-lg">📈</div>
                    </div>
                    <Subheading className="text-blue-800" level={3}>
                      トレンド分析
                    </Subheading>
                  </div>
                  <Text className="text-blue-700">
                    今週は中盤に天気が悪化しましたが、週末にかけて回復傾向にあります。
                    総務部の課題が全体に影響していることが判明しました。
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Department Analysis */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-gray-900/5 backdrop-blur-sm">
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 px-8 py-6">
              <div className="flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10">
                  <div className="text-2xl">🏢</div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    部署別天気分析
                  </h3>
                  <p className="text-sm text-gray-600">
                    各部署の心の天気状況と改善提案
                  </p>
                </div>
              </div>
            </div>
            <div className="p-8">
              <div className="space-y-4">
                {departmentAnalysis.map((dept, index) => (
                  <motion.div
                    key={dept.department}
                    animate={{ opacity: 1, x: 0 }}
                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-50 to-gray-100 p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/25"
                    initial={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">
                        {getWeatherIcon(dept.weatherType)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <Subheading level={3}>{dept.department}</Subheading>
                          <Badge color={getRiskColor(dept.riskLevel)}>
                            {dept.riskLevel === "high"
                              ? "高リスク"
                              : dept.riskLevel === "medium"
                                ? "中リスク"
                                : "低リスク"}
                          </Badge>
                        </div>
                        <Text className="text-sm text-gray-600">
                          平均スコア: {dept.averageScore.toFixed(1)} |{" "}
                          {dept.memberCount}名
                        </Text>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-lg">{getTrendIcon(dept.trend)}</div>
                      <Text
                        className={`text-sm font-medium ${getWeatherColor(dept.weatherType)}`}
                      >
                        {dept.trend === "improving"
                          ? "改善中"
                          : dept.trend === "stable"
                            ? "安定"
                            : "悪化中"}
                      </Text>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Weather Forecast */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-gray-900/5 backdrop-blur-sm">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-8 py-6">
              <div className="flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10">
                  <div className="text-2xl">🔮</div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    組織天気予報
                  </h3>
                  <p className="text-sm text-gray-600">
                    AI予測による今後の組織の心の天気
                  </p>
                </div>
              </div>
            </div>
            <div className="p-8">
              <div className="grid gap-6 md:grid-cols-3">
                {weatherForecast.map((forecast, index) => (
                  <motion.div
                    key={forecast.period}
                    animate={{ opacity: 1, y: 0 }}
                    className="group relative overflow-hidden rounded-2xl border-2 border-dashed border-indigo-300 bg-gradient-to-br from-indigo-50 to-purple-50 p-6 text-center shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/25"
                    initial={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.05 }}
                  >
                    <div className="mb-3 text-4xl">
                      {getWeatherIcon(forecast.predictedWeather)}
                    </div>
                    <Subheading className="mb-2" level={3}>
                      {forecast.period}
                    </Subheading>
                    <div className="mb-4">
                      <Badge color="blue">
                        予測確度 {forecast.confidence}%
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <Text className="text-sm font-semibold text-gray-700">
                        リスク要因:
                      </Text>
                      {forecast.riskFactors.map((factor) => (
                        <div
                          key={factor}
                          className="rounded bg-gray-100 px-2 py-1 text-xs"
                        >
                          {factor}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <Divider />

        {/* Action Recommendations */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-gray-900/5 backdrop-blur-sm">
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 px-8 py-6">
              <div className="flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500/10">
                  <div className="text-2xl">💡</div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">改善提案</h3>
                  <p className="text-sm text-gray-600">
                    データに基づく組織改善のための具体的な提案
                  </p>
                </div>
              </div>
            </div>
            <div className="p-8">
              <div className="grid gap-6 md:grid-cols-2">
                <motion.div
                  animate={{ opacity: 1, x: 0 }}
                  className="group relative overflow-hidden rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 to-pink-50 p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-red-500/25"
                  initial={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, delay: 0.7 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <div className="mb-2 flex items-center space-x-2">
                    <div className="text-lg">🚨</div>
                    <Subheading className="text-red-800" level={3}>
                      緊急対応が必要
                    </Subheading>
                  </div>
                  <Text className="mb-3 text-red-700">
                    総務部の天気が「雨」状態です。早急な対応が必要です。
                  </Text>
                  <ul className="space-y-1 text-sm text-red-600">
                    <li>• 個別面談の実施</li>
                    <li>• 業務負荷の見直し</li>
                    <li>• チームビルディング活動</li>
                  </ul>
                </motion.div>

                <motion.div
                  animate={{ opacity: 1, x: 0 }}
                  className="group relative overflow-hidden rounded-2xl border border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50 p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/25"
                  initial={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: 0.8 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <div className="mb-2 flex items-center space-x-2">
                    <div className="text-lg">⚠️</div>
                    <Subheading className="text-yellow-800" level={3}>
                      予防的対応
                    </Subheading>
                  </div>
                  <Text className="mb-3 text-yellow-700">
                    開発部とマーケティング部の予防的ケアを推奨します。
                  </Text>
                  <ul className="space-y-1 text-sm text-yellow-600">
                    <li>• 定期的な1on1ミーティング</li>
                    <li>• ワークライフバランス改善</li>
                    <li>• スキルアップ支援</li>
                  </ul>
                </motion.div>

                <motion.div
                  animate={{ opacity: 1, x: 0 }}
                  className="group relative overflow-hidden rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-green-500/25"
                  initial={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, delay: 0.9 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <div className="mb-2 flex items-center space-x-2">
                    <div className="text-lg">✅</div>
                    <Subheading className="text-green-800" level={3}>
                      良好な状態を維持
                    </Subheading>
                  </div>
                  <Text className="mb-3 text-green-700">
                    営業部と人事部は良好な天気を維持しています。
                  </Text>
                  <ul className="space-y-1 text-sm text-green-600">
                    <li>• 現在の取り組みを継続</li>
                    <li>• 他部署への成功事例共有</li>
                    <li>• メンター制度の活用</li>
                  </ul>
                </motion.div>

                <motion.div
                  animate={{ opacity: 1, x: 0 }}
                  className="group relative overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25"
                  initial={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: 1.0 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <div className="mb-2 flex items-center space-x-2">
                    <div className="text-lg">📋</div>
                    <Subheading className="text-blue-800" level={3}>
                      データ収集の改善
                    </Subheading>
                  </div>
                  <Text className="mb-3 text-blue-700">
                    より正確な予測のためのデータ収集改善を提案します。
                  </Text>
                  <ul className="space-y-1 text-sm text-blue-600">
                    <li>• 回答率の向上施策</li>
                    <li>• 追加の質問項目検討</li>
                    <li>• リアルタイム分析機能</li>
                  </ul>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
