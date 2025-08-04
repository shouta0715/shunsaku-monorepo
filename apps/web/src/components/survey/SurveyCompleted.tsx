import { Badge, Heading, Subheading, Text, Divider } from "@package/ui";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui";
import type { Survey } from "@/types";

type SurveyCompletedProps = {
  survey: Survey;
};

export function SurveyCompleted({ survey }: SurveyCompletedProps) {
  const calculateRiskLevel = (score: number): "low" | "medium" | "high" => {
    if (score >= 4.0) return "low";
    if (score >= 2.5) return "medium";

    return "high";
  };

  const riskLevel = calculateRiskLevel(survey.totalScore);

  const getRiskBadge = (level: "low" | "medium" | "high") => {
    const config = {
      low: {
        color: "green" as const,
        label: "低リスク",
        message: "素晴らしい状態です！",
      },
      medium: {
        color: "orange" as const,
        label: "中リスク",
        message: "少し注意が必要です",
      },
      high: {
        color: "red" as const,
        label: "高リスク",
        message: "サポートが必要かもしれません",
      },
    };

    return config[level];
  };

  const badge = getRiskBadge(riskLevel);
  const scorePercentage = (survey.totalScore / 5) * 100;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Success Message */}
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500">
          <svg
            className="h-10 w-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M5 13l4 4L19 7"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
        </div>

        <div className="space-y-2">
          <Heading>今日の天気記録完了！ ✨</Heading>
          <Text className="text-lg text-green-700">
            今日の気持ちを記録していただき、ありがとうございました。
          </Text>
        </div>
      </div>

      <Divider />

      {/* Score Summary */}
      <Card>
        <CardHeader className="text-center">
          <Subheading level={1}>今日のスコア</Subheading>
          <Text className="text-gray-600">
            あなたの回答に基づいた評価結果です
          </Text>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {/* Score Display */}
            <div className="space-y-6 text-center">
              <div className="space-y-2">
                <div className="text-6xl font-bold text-gray-900">
                  {survey.totalScore.toFixed(1)}
                </div>
                <Text className="text-xl text-gray-500">/ 5.0</Text>
              </div>

              {/* Score Bar */}
              <div className="mx-auto w-full max-w-md">
                <div className="h-4 w-full rounded-full bg-gray-200">
                  <div
                    className={`h-4 rounded-full transition-all duration-700 ${
                      riskLevel === "low"
                        ? "bg-gradient-to-r from-green-400 to-green-500"
                        : riskLevel === "medium"
                          ? "bg-gradient-to-r from-yellow-400 to-yellow-500"
                          : "bg-gradient-to-r from-red-400 to-red-500"
                    }`}
                    style={{ width: `${scorePercentage}%` }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-sm text-gray-500">
                  <span>1.0</span>
                  <span>3.0</span>
                  <span>5.0</span>
                </div>
              </div>
            </div>

            {/* Risk Level */}
            <div className="space-y-4 text-center">
              <Badge
                className="px-6 py-3 text-base font-medium"
                color={badge.color}
              >
                {badge.label}
              </Badge>
              <Text className="text-lg text-gray-600">{badge.message}</Text>
            </div>

            {/* Timestamp */}
            <div className="text-center">
              <Text className="text-gray-500">
                回答日時: {new Date(survey.submittedAt).toLocaleString("ja-JP")}
              </Text>
            </div>
          </div>
        </CardContent>
      </Card>

      <Divider />

      {/* Next Actions */}
      <Card>
        <CardHeader className="text-center">
          <Subheading level={2}>次のアクション</Subheading>
          <Text className="text-gray-600">おすすめの機能をご活用ください</Text>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Link className="block" href="/dashboard">
              <div className="group rounded-xl border-2 border-gray-200 p-6 text-center transition-all duration-200 hover:border-blue-300 hover:shadow-md">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 transition-colors group-hover:bg-blue-200">
                  <svg
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                    <path
                      d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </div>
                <Subheading className="mb-2" level={3}>
                  ダッシュボード
                </Subheading>
                <Text className="text-gray-500">全体の状況を確認する</Text>
              </div>
            </Link>

            <Link className="block" href="/survey/history">
              <div className="group rounded-xl border-2 border-gray-200 p-6 text-center transition-all duration-200 hover:border-blue-300 hover:shadow-md">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 transition-colors group-hover:bg-green-200">
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
                <Subheading className="mb-2" level={3}>
                  履歴
                </Subheading>
                <Text className="text-gray-500">過去のスコアを確認する</Text>
              </div>
            </Link>
          </div>

          {/* Additional message for high risk */}
          {riskLevel === "high" && (
            <div className="mt-8 rounded-xl border-2 border-red-200 bg-red-50 p-6">
              <div className="flex items-start space-x-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-red-500">
                  <svg
                    className="h-5 w-5 text-white"
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
                <div className="space-y-2">
                  <Subheading className="text-red-900" level={3}>
                    サポートをお探しですか？
                  </Subheading>
                  <Text className="text-red-700">
                    困ったことがありましたら、お気軽に上司や人事部にご相談ください。
                    あなたの wellbeing は私たちにとって重要です。
                  </Text>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
