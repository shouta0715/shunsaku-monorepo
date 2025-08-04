"use client";

import { Badge, Heading, Subheading, Text, Divider } from "@package/ui";
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
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">天気データを分析中...</p>
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
          <div className="mb-4 text-4xl">🔮</div>
          <Heading className="mb-2">組織の天気予報 & 分析</Heading>
          <Text className="text-gray-600">
            データドリブンで組織の心の天気を予測し、改善策を提案します
          </Text>
        </div>

        {/* Weekly Weather Trends */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="text-2xl">📊</div>
              <div>
                <CardTitle>週間天気トレンド</CardTitle>
                <CardDescription>
                  過去7日間の組織全体の心の天気推移
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
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
              <div className="mt-6 rounded-lg bg-blue-50 p-4">
                <div className="mb-2 flex items-center space-x-2">
                  <div className="text-lg">📈</div>
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
          </CardContent>
        </Card>

        {/* Department Analysis */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="text-2xl">🏢</div>
              <div>
                <CardTitle>部署別天気分析</CardTitle>
                <CardDescription>
                  各部署の心の天気状況と改善提案
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentAnalysis.map((dept) => (
                <div
                  key={dept.department}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/30 p-4"
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
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weather Forecast */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="text-2xl">🔮</div>
              <div>
                <CardTitle>組織天気予報</CardTitle>
                <CardDescription>
                  AI予測による今後の組織の心の天気
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              {weatherForecast.map((forecast) => (
                <div
                  key={forecast.period}
                  className="rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50/20 p-6 text-center"
                >
                  <div className="mb-3 text-4xl">
                    {getWeatherIcon(forecast.predictedWeather)}
                  </div>
                  <Subheading className="mb-2" level={3}>
                    {forecast.period}
                  </Subheading>
                  <div className="mb-4">
                    <Badge color="blue">予測確度 {forecast.confidence}%</Badge>
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
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Divider />

        {/* Action Recommendations */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.15 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <div className="text-2xl">💡</div>
                <div>
                  <CardTitle>改善提案</CardTitle>
                  <CardDescription>
                    データに基づく組織改善のための具体的な提案
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
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
                </div>

                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
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
                </div>

                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
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
                </div>

                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
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
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
