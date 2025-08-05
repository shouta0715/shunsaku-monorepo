"use client";

import { Dialog } from "@package/ui";
import { motion } from "framer-motion";
import { useState } from "react";
import type { TeamMemberStats } from "@/lib/mock-data";

type TeamReportModalProps = {
  members: TeamMemberStats[];
  open: boolean;
  onClose: () => void;
};

export const TeamReportModal = ({
  members,
  open,
  onClose,
}: TeamReportModalProps) => {
  const [reportType, setReportType] = useState<string>("summary");
  const [period, setPeriod] = useState<string>("week");
  const [format, setFormat] = useState<string>("pdf");

  const reportTypes = [
    {
      value: "summary",
      label: "サマリーレポート",
      description: "チーム全体の状況概要",
      icon: "📊",
    },
    {
      value: "detailed",
      label: "詳細レポート",
      description: "メンバー別の詳細分析",
      icon: "📈",
    },
    {
      value: "trend",
      label: "トレンドレポート",
      description: "経時的な変化の分析",
      icon: "📉",
    },
    {
      value: "risk",
      label: "リスク分析レポート",
      description: "リスク要因の詳細分析",
      icon: "⚠️",
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
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50/50 to-teal-50/30 px-8 py-6">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 via-green-400/10 to-teal-400/10 opacity-50"></div>
          <div className="absolute -top-4 -left-4 h-32 w-32 rounded-full bg-emerald-200/20 blur-xl"></div>
          <div className="absolute -right-4 -bottom-4 h-40 w-40 rounded-full bg-green-200/20 blur-xl"></div>

          <div className="relative z-10">
            <div className="flex items-center space-x-4">
              <motion.div
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-2xl"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                📊
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  チームレポート出力
                </h2>
                <p className="text-emerald-600">
                  メンバー数: {members.length}名
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* レポートタイプ選択 */}
          <div className="mb-8">
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              レポートタイプ
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {reportTypes.map((type) => (
                <motion.button
                  key={type.value}
                  animate={{ opacity: 1, y: 0 }}
                  className={`group relative overflow-hidden rounded-2xl border-2 p-4 transition-all duration-300 hover:shadow-lg ${
                    reportType === type.value
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-200 bg-white hover:border-emerald-200"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setReportType(type.value)}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl ${
                        reportType === type.value
                          ? "bg-emerald-500 text-white"
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

          {/* 期間と形式の選択 */}
          <div className="mb-8 grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                期間
              </label>
              <select
                className="w-full rounded-xl border-2 border-emerald-200 bg-white/50 px-4 py-2 shadow-sm backdrop-blur-sm transition-colors hover:border-emerald-300 focus:border-emerald-400 focus:outline-none"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              >
                <option value="week">直近1週間</option>
                <option value="month">直近1ヶ月</option>
                <option value="quarter">直近3ヶ月</option>
                <option value="year">直近1年</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                出力形式
              </label>
              <select
                className="w-full rounded-xl border-2 border-emerald-200 bg-white/50 px-4 py-2 shadow-sm backdrop-blur-sm transition-colors hover:border-emerald-300 focus:border-emerald-400 focus:outline-none"
                value={format}
                onChange={(e) => setFormat(e.target.value)}
              >
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
                <option value="csv">CSV</option>
              </select>
            </div>
          </div>

          {/* 出力内容のプレビュー */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50/50 p-6"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
                <span className="text-lg">📄</span>
              </div>
              <h3 className="font-medium text-emerald-800">出力内容</h3>
            </div>
            <div className="mt-3 space-y-2 text-emerald-900">
              <p>
                レポート:{" "}
                {reportTypes.find((t) => t.value === reportType)?.label}
              </p>
              <p>
                期間:{" "}
                {
                  {
                    week: "直近1週間",
                    month: "直近1ヶ月",
                    quarter: "直近3ヶ月",
                    year: "直近1年",
                  }[period]
                }
              </p>
              <p>形式: {format.toUpperCase()}</p>
            </div>
          </motion.div>

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
              className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-2.5 text-white shadow-lg transition-all hover:from-emerald-600 hover:to-green-700 hover:shadow-xl"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              レポート出力
            </motion.button>
          </div>
        </div>
      </motion.div>
    </Dialog>
  );
};
