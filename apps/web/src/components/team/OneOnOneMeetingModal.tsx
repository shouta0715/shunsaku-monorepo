"use client";

import { Dialog } from "@package/ui";
import { motion } from "framer-motion";
import { useState } from "react";
import type { TeamMemberStats } from "@/lib/mock-data";

type OneOnOneMeetingModalProps = {
  member: TeamMemberStats | null;
  open: boolean;
  onClose: () => void;
};

export const OneOnOneMeetingModal = ({
  member,
  open,
  onClose,
}: OneOnOneMeetingModalProps) => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [meetingType, setMeetingType] = useState<string>("online");
  const [agenda, setAgenda] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!member) return null;

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !agenda) {
      setError("日付、時間、議題を選択してください");

      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      // TODO: APIエンドポイントが実装されたら実際の予約処理を追加
      await new Promise((resolve) => setTimeout(resolve, 1000)); // モック遅延

      // 予約成功時の処理
      onClose();
    } catch {
      setError("予約に失敗しました。もう一度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 今日から2週間分の日付を生成
  const dates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);

    return date.toISOString().split("T")[0];
  });

  // 9:00から18:00までの時間枠を生成
  const times = Array.from({ length: 19 }, (_, i) => {
    const hour = 9 + Math.floor(i / 2);
    const minute = i % 2 === 0 ? "00" : "30";

    return `${hour.toString().padStart(2, "0")}:${minute}`;
  });

  return (
    <Dialog open={open} onClose={onClose}>
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-white shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4 }}
      >
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50/30 px-8 py-6">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-indigo-400/10 to-purple-400/10 opacity-50"></div>
          <div className="absolute -top-4 -left-4 h-32 w-32 rounded-full bg-blue-200/20 blur-xl"></div>
          <div className="absolute -right-4 -bottom-4 h-40 w-40 rounded-full bg-indigo-200/20 blur-xl"></div>

          <div className="relative z-10">
            <div className="flex items-center space-x-4">
              <motion.div
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-2xl"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                💬
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  1on1ミーティング - {member.name}
                </h2>
                <p className="text-blue-600">
                  {member.department} • {member.role}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-8 grid gap-6 md:grid-cols-2">
            {/* 日付選択 */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                日付
              </label>
              <select
                className="w-full rounded-xl border-2 border-blue-200 bg-white/50 px-4 py-2 shadow-sm backdrop-blur-sm transition-colors hover:border-blue-300 focus:border-blue-400 focus:outline-none"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              >
                <option value="">日付を選択</option>
                {dates.map((date) => (
                  <option key={date} value={date}>
                    {new Date(date ?? "").toLocaleDateString("ja-JP")}
                  </option>
                ))}
              </select>
            </div>

            {/* 時間選択 */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                時間
              </label>
              <select
                className="w-full rounded-xl border-2 border-blue-200 bg-white/50 px-4 py-2 shadow-sm backdrop-blur-sm transition-colors hover:border-blue-300 focus:border-blue-400 focus:outline-none"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
              >
                <option value="">時間を選択</option>
                {times.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            {/* ミーティング形式 */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                形式
              </label>
              <select
                className="w-full rounded-xl border-2 border-blue-200 bg-white/50 px-4 py-2 shadow-sm backdrop-blur-sm transition-colors hover:border-blue-300 focus:border-blue-400 focus:outline-none"
                value={meetingType}
                onChange={(e) => setMeetingType(e.target.value)}
              >
                <option value="online">オンライン</option>
                <option value="offline">対面</option>
              </select>
            </div>

            {/* 議題 */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                議題
              </label>
              <select
                className="w-full rounded-xl border-2 border-blue-200 bg-white/50 px-4 py-2 shadow-sm backdrop-blur-sm transition-colors hover:border-blue-300 focus:border-blue-400 focus:outline-none"
                value={agenda}
                onChange={(e) => setAgenda(e.target.value)}
              >
                <option value="">議題を選択</option>
                <option value="regular">定期面談</option>
                <option value="followup">フォローアップ</option>
                <option value="career">キャリア相談</option>
                <option value="performance">パフォーマンス</option>
                <option value="issue">課題解決</option>
              </select>
            </div>
          </div>

          {/* エラーメッセージ */}
          {error && (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-red-50 to-pink-50/50 p-6"
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10">
                  <span className="text-lg">⚠️</span>
                </div>
                <h3 className="font-medium text-red-800">エラー</h3>
              </div>
              <p className="mt-3 text-red-600">{error}</p>
            </motion.div>
          )}

          {/* 予約内容の確認 */}
          {selectedDate && selectedTime && (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50/50 p-6"
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                  <span className="text-lg">📅</span>
                </div>
                <h3 className="font-medium text-blue-800">予約内容</h3>
              </div>
              <div className="mt-3 space-y-2 text-blue-900">
                <p>
                  日時: {new Date(selectedDate).toLocaleDateString("ja-JP")}{" "}
                  {selectedTime}
                </p>
                <p>形式: {meetingType === "online" ? "オンライン" : "対面"}</p>
                {agenda && (
                  <p>
                    議題:{" "}
                    {
                      {
                        regular: "定期面談",
                        followup: "フォローアップ",
                        career: "キャリア相談",
                        performance: "パフォーマンス",
                        issue: "課題解決",
                      }[agenda]
                    }
                  </p>
                )}
              </div>
            </motion.div>
          )}

          <div className="flex justify-end space-x-4">
            <motion.button
              className="rounded-xl bg-gradient-to-r from-gray-500 to-gray-600 px-6 py-2.5 text-white shadow-lg transition-all hover:from-gray-600 hover:to-gray-700 hover:shadow-xl"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
            >
              キャンセル
            </motion.button>
            <motion.button
              className={`rounded-xl bg-gradient-to-r px-6 py-2.5 text-white shadow-lg transition-all ${
                isSubmitting
                  ? "cursor-not-allowed from-gray-400 to-gray-500"
                  : "from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl"
              }`}
              disabled={isSubmitting}
              whileHover={isSubmitting ? undefined : { scale: 1.02 }}
              whileTap={isSubmitting ? undefined : { scale: 0.98 }}
              onClick={handleSubmit}
            >
              {isSubmitting ? "予約中..." : "予約を確定"}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </Dialog>
  );
};
