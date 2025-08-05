"use client";

import { Dialog } from "@package/ui";
import { motion } from "framer-motion";
import type { TeamMemberStats } from "@/lib/mock-data";

type MemberSelectModalProps = {
  members: TeamMemberStats[];
  open: boolean;
  onClose: () => void;
  onSelect: (member: TeamMemberStats) => void;
  title: string;
  description: string;
};

export const MemberSelectModal = ({
  members,
  open,
  onClose,
  onSelect,
  title,
  description,
}: MemberSelectModalProps) => (
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
              👥
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
              <p className="text-blue-600">{description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-h-[60vh] overflow-y-auto p-8">
        <div className="grid gap-4">
          {members.map((member) => (
            <motion.button
              key={member.id}
              animate={{ opacity: 1, y: 0 }}
              className="group relative overflow-hidden rounded-2xl border-2 border-gray-200 bg-white p-4 transition-all duration-300 hover:border-blue-300 hover:shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => {
                onSelect(member);
                onClose();
              }}
            >
              <div className="flex items-center space-x-4">
                <motion.div
                  className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-xl"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  {member.name.charAt(0)}
                </motion.div>
                <div className="flex-1 text-left">
                  <h3 className="font-medium text-gray-900">{member.name}</h3>
                  <p className="text-sm text-gray-600">
                    {member.department} • {member.role}
                  </p>
                </div>
                <div
                  className={`rounded-lg px-3 py-1 text-sm ${
                    member.riskLevel === "high"
                      ? "bg-red-100 text-red-700"
                      : member.riskLevel === "medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                  }`}
                >
                  {member.riskLevel === "high"
                    ? "高リスク"
                    : member.riskLevel === "medium"
                      ? "中リスク"
                      : "低リスク"}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  </Dialog>
);
