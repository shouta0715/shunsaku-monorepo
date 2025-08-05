import { Badge, Heading, Subheading, Text, Divider } from "@package/ui";
import { motion } from "framer-motion";
import Link from "next/link";
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
        emoji: "🌟",
        bgGradient: "from-green-50 to-emerald-50",
        borderColor: "border-green-200",
      },
      medium: {
        color: "orange" as const,
        label: "中リスク",
        message: "少し注意が必要です",
        emoji: "⚡",
        bgGradient: "from-yellow-50 to-amber-50",
        borderColor: "border-yellow-200",
      },
      high: {
        color: "red" as const,
        label: "高リスク",
        message: "サポートが必要かもしれません",
        emoji: "🆘",
        bgGradient: "from-red-50 to-pink-50",
        borderColor: "border-red-200",
      },
    };

    return config[level];
  };

  const badge = getRiskBadge(riskLevel);
  const scorePercentage = (survey.totalScore / 5) * 100;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Success Message */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 text-center"
        initial={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 360, 720] }}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-600 shadow-xl"
          initial={{ scale: 0, rotate: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
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
              strokeWidth={3}
            />
          </svg>
        </motion.div>

        <div className="space-y-2">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Heading className="bg-gradient-to-r from-gray-900 via-green-800 to-emerald-800 bg-clip-text text-transparent">
              今日の天気記録完了！ ✨
            </Heading>
          </motion.div>
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Text className="text-lg text-gray-600">
              今日の気持ちを記録していただき、ありがとうございました。
            </Text>
          </motion.div>
        </div>

        {/* Confetti animation */}
        <motion.div
          animate={{ opacity: [0, 1, 0] }}
          className="pointer-events-none absolute inset-0"
          initial={{ opacity: 0 }}
          transition={{ duration: 2, times: [0, 0.5, 1] }}
        >
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [-20, 100],
                x: [0, (i % 2 === 0 ? 1 : -1) * (20 + i * 10)],
                rotate: [0, 360],
              }}
              className={`text-2xl" absolute top-1/2 left-1/2 ${i % 3 === 0 ? "text-green-500" : i % 3 === 1 ? "text-blue-500" : "text-yellow-500"}`}
              initial={{ y: -20 }}
              transition={{ duration: 2, ease: "easeOut", delay: i * 0.1 }}
            >
              {i % 2 === 0 ? "🎉" : "🎊"}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <Divider />

      {/* Score Summary */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-gray-900/5 backdrop-blur-sm">
          <div className={`bg-gradient-to-r ${badge.bgGradient} px-8 py-6`}>
            <div className="flex items-center justify-center space-x-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                className="text-4xl"
                transition={{ duration: 2, repeat: Infinity }}
              >
                {badge.emoji}
              </motion.div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900">
                  今日のスコア
                </h3>
                <p className="text-sm text-gray-600">
                  あなたの回答に基づいた評価結果です
                </p>
              </div>
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                className="text-4xl"
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              >
                {badge.emoji}
              </motion.div>
            </div>
          </div>
          <div className="p-8">
            <div className="space-y-8">
              {/* Score Display */}
              <div className="space-y-6 text-center">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  className="space-y-2"
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <motion.div
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-6xl font-bold text-transparent"
                    initial={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    {survey.totalScore.toFixed(1)}
                  </motion.div>
                  <Text className="text-xl text-gray-500">/ 5.0</Text>
                </motion.div>

                {/* Score Bar */}
                <div className="mx-auto w-full max-w-md">
                  <div className="relative">
                    <div className="h-6 w-full overflow-hidden rounded-full bg-gray-200 shadow-inner">
                      <motion.div
                        animate={{ width: `${scorePercentage}%` }}
                        className={`h-6 rounded-full shadow-sm ${
                          riskLevel === "low"
                            ? "bg-gradient-to-r from-green-400 via-emerald-500 to-green-600"
                            : riskLevel === "medium"
                              ? "bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500"
                              : "bg-gradient-to-r from-red-400 via-red-500 to-red-600"
                        }`}
                        initial={{ width: 0 }}
                        transition={{
                          duration: 1.5,
                          delay: 0.8,
                          ease: "easeOut",
                        }}
                      >
                        <div className="h-full w-full bg-white/20 backdrop-blur-sm" />
                      </motion.div>
                    </div>
                    <motion.div
                      animate={{
                        left: `${scorePercentage}%`,
                        opacity: 1,
                        y: 0,
                      }}
                      className="absolute -top-10 -translate-x-1/2 transform"
                      initial={{ left: 0, opacity: 0, y: 10 }}
                      transition={{
                        duration: 1.5,
                        delay: 0.8,
                        ease: "easeOut",
                      }}
                    >
                      <div className="rounded bg-gray-800 px-2 py-1 text-sm font-semibold text-white">
                        {survey.totalScore.toFixed(1)}
                      </div>
                      <div className="absolute left-1/2 h-0 w-0 -translate-x-1/2 transform border-t-4 border-r-4 border-l-4 border-t-gray-800 border-r-transparent border-l-transparent" />
                    </motion.div>
                  </div>
                  <div className="mt-3 flex justify-between text-sm text-gray-500">
                    <span className="flex items-center space-x-1">
                      <span>⛈️</span>
                      <span>1.0</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span>🌤️</span>
                      <span>3.0</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <span>☀️</span>
                      <span>5.0</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Risk Level */}
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 text-center"
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Badge
                    className="px-8 py-4 text-lg font-semibold shadow-lg"
                    color={badge.color}
                  >
                    {badge.label}
                  </Badge>
                </motion.div>
                <Text className="text-lg font-medium text-gray-700">
                  {badge.message}
                </Text>
              </motion.div>

              {/* Timestamp */}
              <motion.div
                animate={{ opacity: 1 }}
                className="border-t border-gray-100 pt-4 text-center"
                initial={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: 1.4 }}
              >
                <Text className="text-gray-500">
                  回答日時:{" "}
                  {new Date(survey.submittedAt).toLocaleString("ja-JP")}
                </Text>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      <Divider />

      {/* Next Actions */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 1.5 }}
      >
        <div className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-gray-900/5 backdrop-blur-sm">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-8 py-6">
            <div className="flex items-center justify-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10">
                <svg
                  className="h-6 w-6 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900">
                  次のアクション
                </h3>
                <p className="text-sm text-gray-600">
                  おすすめの機能をご活用ください
                </p>
              </div>
            </div>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, delay: 1.6 }}
                whileHover={{ y: -5 }}
              >
                <Link className="block" href="/dashboard">
                  <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 p-6 text-center shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25">
                    <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-blue-200/30 blur-2xl transition-all duration-300 group-hover:bg-blue-300/40"></div>
                    <div className="relative z-10">
                      <motion.div
                        className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-500/10 backdrop-blur-sm"
                        transition={{ duration: 0.5 }}
                        whileHover={{ rotate: 360 }}
                      >
                        <svg
                          className="h-7 w-7 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                          />
                        </svg>
                      </motion.div>
                      <Subheading className="mb-2 text-gray-900" level={3}>
                        ダッシュボード
                      </Subheading>
                      <Text className="text-gray-600">
                        全体の状況を確認する
                      </Text>
                    </div>
                  </div>
                </Link>
              </motion.div>

              <motion.div
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, delay: 1.7 }}
                whileHover={{ y: -5 }}
              >
                <Link className="block" href="/survey/history">
                  <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 to-green-100 p-6 text-center shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/25">
                    <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-emerald-200/30 blur-2xl transition-all duration-300 group-hover:bg-emerald-300/40"></div>
                    <div className="relative z-10">
                      <motion.div
                        className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-500/10 backdrop-blur-sm"
                        transition={{ duration: 0.5 }}
                        whileHover={{ rotate: -360 }}
                      >
                        <svg
                          className="h-7 w-7 text-emerald-600"
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
                      </motion.div>
                      <Subheading className="mb-2 text-gray-900" level={3}>
                        履歴
                      </Subheading>
                      <Text className="text-gray-600">
                        過去のスコアを確認する
                      </Text>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </div>

            {/* Additional message for high risk */}
            {riskLevel === "high" && (
              <motion.div
                animate={{ opacity: 1, x: 0 }}
                className="mt-8 rounded-2xl border-2 border-red-200 bg-gradient-to-r from-red-50 to-pink-50 p-6 shadow-lg"
                initial={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5, delay: 1.8 }}
              >
                <div className="flex items-start space-x-4">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-lg"
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <svg
                      className="h-6 w-6 text-white"
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
                  </motion.div>
                  <div className="space-y-2">
                    <Subheading className="text-red-900" level={3}>
                      サポートをお探しですか？
                    </Subheading>
                    <Text className="text-red-700">
                      困ったことがありましたら、お気軽に上司や人事部にご相談ください。
                      あなたの wellbeing は私たちにとって重要です。
                    </Text>
                    <motion.div
                      className="mt-4 inline-flex items-center space-x-2 font-medium text-red-600"
                      whileHover={{ x: 5 }}
                    >
                      <span>サポートを受ける</span>
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M9 5l7 7-7 7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                        />
                      </svg>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
