"use client";

import { Dialog } from "@package/ui";
import { motion } from "framer-motion";
import type { TeamMemberStats } from "@/lib/mock-data";

type MemberDetailModalProps = {
  member: TeamMemberStats | null;
  isOpen: boolean;
  onClose: () => void;
  setIsManagerNoteModalOpen: (isOpen: boolean) => void;
  setIsOneOnOneModalOpen: (isOpen: boolean) => void;
};

export const MemberDetailModal = ({
  member,
  isOpen,
  onClose,
  setIsOneOnOneModalOpen,
  setIsManagerNoteModalOpen,
}: MemberDetailModalProps) => {
  if (!member) return null;

  const getRiskColor = (level: "low" | "medium" | "high") => {
    const config = {
      low: "text-green-600",
      medium: "text-yellow-600",
      high: "text-red-600",
    };

    return config[level];
  };

  const getResponseRateColor = (rate: number) => {
    if (rate >= 95) return "text-green-600";
    if (rate >= 85) return "text-yellow-600";

    return "text-red-600";
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-white shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4 }}
      >
        {/* ヘッダー */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50/50 to-pink-50/30 px-8 py-6">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 via-purple-400/10 to-pink-400/10 opacity-50"></div>
          <div className="absolute -top-4 -left-4 h-32 w-32 rounded-full bg-indigo-200/20 blur-xl"></div>
          <div className="absolute -right-4 -bottom-4 h-40 w-40 rounded-full bg-purple-200/20 blur-xl"></div>

          <div className="relative z-10">
            <div className="flex items-center space-x-4">
              <motion.div
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/80 text-2xl shadow-sm backdrop-blur-sm"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                {member.name.charAt(0)}
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {member.name}
                </h2>
                <p className="text-gray-600">
                  {member.department} • {member.role}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* スコア情報 */}
        <div className="p-8">
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 p-6"
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="text-center">
                <div className="mb-2 text-sm font-medium text-gray-600">
                  現在のスコア
                </div>
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  className={`text-3xl font-bold ${getRiskColor(member.riskLevel)}`}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {member.score.toFixed(1)}
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 to-green-100 p-6"
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="text-center">
                <div className="mb-2 text-sm font-medium text-gray-600">
                  回答率
                </div>
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  className={`text-3xl font-bold ${getResponseRateColor(member.responseRate)}`}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {member.responseRate}%
                </motion.div>
                <div className="mt-1 text-xs text-gray-500">過去30日</div>
              </div>
            </motion.div>

            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-violet-100 p-6"
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <div className="text-center">
                <div className="mb-2 text-sm font-medium text-gray-600">
                  最終回答日
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {new Date(member.lastResponseDate).toLocaleDateString(
                    "ja-JP",
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* マネージャーメモ */}
          {member.managerNotes && (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-amber-50 to-yellow-50/50 p-6"
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
                  <span className="text-lg">📝</span>
                </div>
                <h3 className="font-medium text-amber-800">マネージャーメモ</h3>
              </div>
              <p className="mt-3 text-amber-900">{member.managerNotes}</p>
            </motion.div>
          )}

          {/* アクションボタン */}
          <div className="flex space-x-4">
            <motion.button
              className="flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 text-white shadow-lg transition-all hover:from-indigo-600 hover:to-purple-700 hover:shadow-xl"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsOneOnOneModalOpen(true)}
            >
              1on1を予約
            </motion.button>
            <motion.button
              className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-3 text-white shadow-lg transition-all hover:from-emerald-600 hover:to-green-700 hover:shadow-xl"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsManagerNoteModalOpen(true)}
            >
              メモを追加
            </motion.button>
          </div>
        </div>
      </motion.div>
    </Dialog>
  );
};
