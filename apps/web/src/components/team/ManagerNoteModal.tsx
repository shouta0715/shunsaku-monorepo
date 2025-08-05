"use client";

import { Dialog } from "@package/ui";
import { motion } from "framer-motion";
import { useState } from "react";
import type { TeamMemberStats } from "@/lib/mock-data";

type ManagerNoteModalProps = {
  member: TeamMemberStats | null;
  open: boolean;
  onClose: () => void;
};

export const ManagerNoteModal = ({
  member,
  open,
  onClose,
}: ManagerNoteModalProps) => {
  const [noteType, setNoteType] = useState<string>("general");
  const [note, setNote] = useState<string>(member?.managerNotes || "");

  if (!member) return null;

  const noteTypes = [
    {
      value: "general",
      label: "一般メモ",
      description: "一般的な観察や気づき",
      icon: "📝",
    },
    {
      value: "performance",
      label: "パフォーマンス",
      description: "業務遂行に関する記録",
      icon: "📈",
    },
    {
      value: "wellbeing",
      label: "ウェルビーイング",
      description: "心身の健康状態",
      icon: "🌱",
    },
    {
      value: "followup",
      label: "フォローアップ",
      description: "要対応事項の記録",
      icon: "✅",
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
        <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-yellow-50/50 to-orange-50/30 px-8 py-6">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 via-yellow-400/10 to-orange-400/10 opacity-50"></div>
          <div className="absolute -top-4 -left-4 h-32 w-32 rounded-full bg-amber-200/20 blur-xl"></div>
          <div className="absolute -right-4 -bottom-4 h-40 w-40 rounded-full bg-yellow-200/20 blur-xl"></div>

          <div className="relative z-10">
            <div className="flex items-center space-x-4">
              <motion.div
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-2xl"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                📝
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  メモ追加 - {member.name}
                </h2>
                <p className="text-amber-600">
                  {member.department} • {member.role}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* メモタイプ選択 */}
          <div className="mb-6">
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              メモの種類
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {noteTypes.map((type) => (
                <motion.button
                  key={type.value}
                  animate={{ opacity: 1, y: 0 }}
                  className={`group relative overflow-hidden rounded-2xl border-2 p-4 transition-all duration-300 hover:shadow-lg ${
                    noteType === type.value
                      ? "border-amber-500 bg-amber-50"
                      : "border-gray-200 bg-white hover:border-amber-200"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setNoteType(type.value)}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl ${
                        noteType === type.value
                          ? "bg-amber-500 text-white"
                          : "bg-gray-100"
                      }`}
                    >
                      {type.icon}
                    </div>
                    <div className="text-left">
                      <h4 className="font-medium text-gray-900">
                        {type.label}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {type.description}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* メモ入力 */}
          <div className="mb-8">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              メモ内容
            </label>
            <textarea
              className="h-32 w-full rounded-xl border-2 border-amber-200 bg-white/50 px-4 py-2 shadow-sm backdrop-blur-sm transition-colors hover:border-amber-300 focus:border-amber-400 focus:outline-none"
              placeholder="メモを入力してください..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          {/* 既存のメモ */}
          {member.managerNotes && (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-gray-50 to-slate-50/50 p-6"
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-500/10">
                  <span className="text-lg">📜</span>
                </div>
                <h3 className="font-medium text-gray-800">既存のメモ</h3>
              </div>
              <p className="mt-3 text-gray-600">{member.managerNotes}</p>
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
              className="rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 px-6 py-2.5 text-white shadow-lg transition-all hover:from-amber-600 hover:to-yellow-700 hover:shadow-xl"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              メモを保存
            </motion.button>
          </div>
        </div>
      </motion.div>
    </Dialog>
  );
};
