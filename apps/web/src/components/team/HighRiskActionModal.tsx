"use client";

import { Dialog, Text } from "@package/ui";
import { motion } from "framer-motion";
import type { TeamMemberStats } from "@/lib/mock-data";

type HighRiskActionModalProps = {
  member: TeamMemberStats | null;
  open: boolean;
  onClose: () => void;
};

export const HighRiskActionModal = ({
  member,
  open,
  onClose,
}: HighRiskActionModalProps) => {
  if (!member) return null;

  const actions = [
    {
      icon: "📞",
      title: "緊急1on1の実施",
      description: "直接対話で状況を確認",
      color: "from-red-500 to-pink-600",
      hoverColor: "hover:from-red-600 hover:to-pink-700",
    },
    {
      icon: "📋",
      title: "業務負荷の調整",
      description: "タスクの再配分を検討",
      color: "from-orange-500 to-red-600",
      hoverColor: "hover:from-orange-600 hover:to-red-700",
    },
    {
      icon: "👥",
      title: "チーム会議の開催",
      description: "チーム全体での状況共有",
      color: "from-yellow-500 to-orange-600",
      hoverColor: "hover:from-yellow-600 hover:to-orange-700",
    },
    {
      icon: "🏥",
      title: "産業医への相談",
      description: "専門家のアドバイスを取得",
      color: "from-purple-500 to-indigo-600",
      hoverColor: "hover:from-purple-600 hover:to-indigo-700",
    },
  ];

  return (
    <Dialog open={open} onClose={onClose}>
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-white shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4 }}
      >
        <div className="relative overflow-hidden bg-gradient-to-br from-red-50 via-pink-50/50 to-rose-50/30 px-8 py-6">
          <div className="absolute inset-0 bg-gradient-to-r from-red-400/10 via-pink-400/10 to-rose-400/10 opacity-50"></div>
          <div className="absolute -top-4 -left-4 h-32 w-32 rounded-full bg-red-200/20 blur-xl"></div>
          <div className="absolute -right-4 -bottom-4 h-40 w-40 rounded-full bg-pink-200/20 blur-xl"></div>

          <div className="relative z-10">
            <div className="flex items-center space-x-4">
              <motion.div
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-2xl"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                ⚠️
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  高リスク対応 - {member.name}
                </h2>
                <p className="text-red-600">
                  スコア: {member.score.toFixed(1)} • 要緊急対応
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-6">
            <Text className="text-gray-600">
              以下のアクションから適切な対応を選択してください。複数の対応を組み合わせることも可能です。
            </Text>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {actions.map((action, index) => (
              <motion.button
                key={action.title}
                animate={{ opacity: 1, y: 0 }}
                className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <div className="relative flex items-center space-x-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r ${action.color} text-2xl text-white shadow-lg transition-all duration-300 ${action.hoverColor}`}
                  >
                    {action.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {action.description}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <motion.button
              className="rounded-xl bg-gradient-to-r from-gray-500 to-gray-600 px-6 py-2.5 text-white shadow-lg transition-all hover:from-gray-600 hover:to-gray-700 hover:shadow-xl"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
            >
              キャンセル
            </motion.button>
            <motion.button
              className="rounded-xl bg-gradient-to-r from-red-500 to-pink-600 px-6 py-2.5 text-white shadow-lg transition-all hover:from-red-600 hover:to-pink-700 hover:shadow-xl"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              対応を開始
            </motion.button>
          </div>
        </div>
      </motion.div>
    </Dialog>
  );
};
