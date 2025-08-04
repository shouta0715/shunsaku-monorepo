"use client";

import { Button, Badge, Divider, Heading, Subheading, Text } from "@package/ui";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Form,
  FormField,
  FormMessage,
  LoadingSpinner,
} from "@/components/ui";
import type { Question } from "@/types";

type SurveyFormProps = {
  questions: Question[];
  onSubmit: (
    responses: { questionId: string; score: number }[],
  ) => Promise<void>;
  loading?: boolean;
};

export function SurveyForm({
  questions,
  onSubmit,
  loading = false,
}: SurveyFormProps) {
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleScoreChange = (questionId: string, score: number) => {
    setResponses((prev) => ({ ...prev, [questionId]: score }));
    // エラーをクリア
    if (errors[questionId]) {
      const { [questionId]: _, ...restErrors } = errors;
      setErrors(restErrors);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    for (const question of questions) {
      if (!responses[question.id]) {
        newErrors[question.id] = "この質問に回答してください";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const responseArray = questions
      .map((question) => ({
        questionId: question.id,
        score: responses[question.id] || 0,
      }))
      .filter((response) => response.score > 0);

    try {
      await onSubmit(responseArray);
    } catch {
      // エラーハンドリングは親コンポーネントで行う
    }
  };

  const getWeatherData = (score: number) => {
    const weatherMap = {
      1: {
        icon: "⛈️",
        label: "嵐",
        description: "とても辛い",
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-300",
      },
      2: {
        icon: "🌧️",
        label: "雨",
        description: "少し辛い",
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-300",
      },
      3: {
        icon: "🌤️",
        label: "くもり",
        description: "普通",
        color: "text-gray-600",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-300",
      },
      4: {
        icon: "🌞",
        label: "晴れ",
        description: "良い感じ",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-300",
      },
      5: {
        icon: "☀️",
        label: "快晴",
        description: "とても良い",
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-300",
      },
    };

    return weatherMap[score as keyof typeof weatherMap] || weatherMap[3];
  };

  const completedQuestions = Object.keys(responses).length;
  const progress = (completedQuestions / questions.length) * 100;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header Section */}
      <div className="space-y-4 text-center">
        <Heading>今日の気持ちチェック 🌤️</Heading>
        <Text>
          今日のあなたの心の天気はいかがですか？5つの質問で気持ちを記録しましょう。
        </Text>

        {/* Progress Section */}
        <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-white to-blue-50 p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="text-xl">🌤️</div>
              <Subheading level={3}>天気記録の進捗</Subheading>
            </div>
            <Badge
              color={completedQuestions === questions.length ? "green" : "blue"}
            >
              {completedQuestions}/{questions.length} 記録済み
            </Badge>
          </div>

          <div className="relative">
            <div className="h-4 w-full rounded-full bg-gray-200 shadow-inner">
              <div
                className="h-4 rounded-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 shadow-sm transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            {/* Weather icons on progress bar */}
            <div className="absolute -top-1 flex w-full justify-between px-2">
              {[1, 2, 3, 4, 5].map((step) => (
                <div
                  key={step}
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs transition-all duration-300 ${
                    completedQuestions >= step
                      ? "scale-110 bg-blue-500 text-white shadow-lg"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {completedQuestions >= step ? "✓" : step}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex justify-between text-sm text-gray-600">
            <span className="flex items-center space-x-1">
              <span>🌧️</span>
              <span>開始</span>
            </span>
            <span className="font-medium text-blue-600">
              {Math.round(progress)}% 完了
            </span>
            <span className="flex items-center space-x-1">
              <span>☀️</span>
              <span>完了</span>
            </span>
          </div>
        </div>
      </div>

      <Divider />

      {/* Survey Form */}
      <Form onSubmit={handleSubmit}>
        <div className="space-y-8">
          {questions.map((question, index) => (
            <motion.div
              key={question.id}
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.15 }}
            >
              <FormField>
                <Card>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <Subheading className="text-gray-900" level={2}>
                        質問 {index + 1}
                      </Subheading>
                      {responses[question.id] && (
                        <Badge color="green">回答済み</Badge>
                      )}
                    </div>
                    <Text className="text-lg font-medium text-gray-700">
                      {question.text}
                    </Text>
                  </CardHeader>

                  <CardContent className="pt-0">
                    {/* Weather Scale */}
                    <div className="space-y-6">
                      <div className="text-center">
                        <Text className="mb-4 text-sm text-gray-600">
                          今日のあなたの心の天気はどちらに近いですか？
                        </Text>
                        <div className="flex justify-between px-2 text-xs text-gray-400">
                          <span>辛い</span>
                          <span>良い</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-5 gap-2 sm:gap-3">
                        {[1, 2, 3, 4, 5].map((score) => {
                          const weather = getWeatherData(score);
                          const isSelected = responses[question.id] === score;

                          return (
                            <button
                              key={score}
                              className={`group relative rounded-2xl border-2 p-3 text-center transition-all duration-300 hover:scale-110 hover:shadow-lg focus:ring-4 focus:ring-blue-200 focus:outline-none sm:p-4 ${
                                isSelected
                                  ? `${weather.borderColor} ${weather.bgColor} scale-105 shadow-xl ring-4 ring-blue-200`
                                  : `border-slate-200 bg-white hover:${weather.borderColor} hover:${weather.bgColor}`
                              }`}
                              type="button"
                              onClick={() =>
                                handleScoreChange(question.id, score)
                              }
                            >
                              <div className="space-y-2">
                                {/* Weather Icon */}
                                <div className="mb-1 text-3xl transition-transform group-hover:scale-110 sm:mb-2 sm:text-4xl">
                                  {weather.icon}
                                </div>

                                {/* Weather Label */}
                                <div
                                  className={`text-xs font-bold transition-colors sm:text-sm ${
                                    isSelected ? weather.color : "text-gray-700"
                                  }`}
                                >
                                  {weather.label}
                                </div>

                                {/* Description */}
                                <div
                                  className={`hidden text-xs transition-colors sm:block ${
                                    isSelected ? weather.color : "text-gray-500"
                                  }`}
                                >
                                  {weather.description}
                                </div>
                              </div>

                              {/* Selection indicator */}
                              {isSelected && (
                                <div className="absolute -top-2 -right-2">
                                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
                                    <svg
                                      className="h-4 w-4 text-white"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        d="M5 13l4 4L19 7"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2.5}
                                      />
                                    </svg>
                                  </div>
                                </div>
                              )}

                              {/* Hover effect */}
                              <div
                                className={`absolute inset-0 rounded-2xl opacity-0 transition-opacity group-hover:opacity-10 ${weather.bgColor}`}
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Selected answer display */}
                    <AnimatePresence>
                      {responses[question.id] &&
                        (() => {
                          const selectedScore = responses[question.id];
                          if (!selectedScore) return null;

                          const selectedWeather = getWeatherData(selectedScore);

                          return (
                            <motion.div
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              className={`mt-6 rounded-xl border-2 p-4 ${selectedWeather.borderColor} ${selectedWeather.bgColor}`}
                              exit={{ opacity: 0, y: -10, scale: 0.95 }}
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              transition={{ duration: 0.15 }}
                            >
                              <div className="flex items-center space-x-3">
                                <div className="text-2xl">
                                  {selectedWeather.icon}
                                </div>
                                <div>
                                  <Text
                                    className={`font-bold ${selectedWeather.color}`}
                                  >
                                    今の気持ち: {selectedWeather.label}
                                  </Text>
                                  <Text
                                    className={`text-sm ${selectedWeather.color}`}
                                  >
                                    {selectedWeather.description}
                                  </Text>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })()}
                    </AnimatePresence>

                    {/* Error message */}
                    {errors[question.id] && (
                      <FormMessage error className="mt-3">
                        {errors[question.id]}
                      </FormMessage>
                    )}
                  </CardContent>
                </Card>
              </FormField>
            </motion.div>
          ))}
        </div>

        <Divider />

        {/* Submit Section */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-green-200 bg-gradient-to-br from-white to-green-50 p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.15 }}
        >
          <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
            <div className="flex items-center space-x-3">
              <motion.div
                key={
                  completedQuestions === questions.length
                    ? "complete"
                    : "incomplete"
                }
                animate={{ scale: 1, rotate: 0 }}
                className="text-xl"
                initial={{ scale: 0.8, rotate: -10 }}
                transition={{ duration: 0.15 }}
              >
                {completedQuestions === questions.length ? "🎉" : "📝"}
              </motion.div>
              <div>
                <motion.div
                  key={completedQuestions}
                  animate={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0.8, y: 2 }}
                  transition={{ duration: 0.15 }}
                >
                  <Text className="font-medium text-gray-800">
                    {completedQuestions < questions.length
                      ? `あと ${questions.length - completedQuestions} 問の天気記録が必要です`
                      : "全ての天気記録が完了しました！"}
                  </Text>
                </motion.div>
                <AnimatePresence>
                  {completedQuestions === questions.length && (
                    <motion.div
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      initial={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Text className="text-sm text-green-600">
                        あなたの今日の心の天気をお送りください{" "}
                        <motion.span
                          animate={{ rotate: [0, 10, -10, 0] }}
                          className="inline-block"
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          ☀️
                        </motion.span>
                      </Text>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <AnimatePresence>
                {completedQuestions === questions.length && (
                  <motion.div
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Badge color="green">送信準備完了</Badge>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.div
              whileHover={{
                scale: completedQuestions === questions.length ? 1.05 : 1,
              }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                className="h-12 min-w-40 bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg transition-all duration-200 hover:from-blue-600 hover:to-blue-700 hover:shadow-xl"
                disabled={loading || completedQuestions < questions.length}
                type="submit"
              >
                {loading ? (
                  <motion.div
                    animate={{ opacity: 1 }}
                    className="flex items-center space-x-2"
                    initial={{ opacity: 0 }}
                  >
                    <LoadingSpinner size="sm" />
                    <span>天気を記録中...</span>
                  </motion.div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <motion.div
                      className="text-lg"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      🌤️
                    </motion.div>
                    <span>今日の天気を記録</span>
                  </div>
                )}
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </Form>
    </div>
  );
}
