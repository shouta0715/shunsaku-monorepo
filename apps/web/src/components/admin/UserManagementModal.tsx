"use client";

import { Button, Text } from "@package/ui";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Input, Label, LoadingSpinner, Select } from "@/components/ui";
import { safeFetch } from "@/hooks/use-error-handler";

type User = {
  id: string;
  email: string;
  name: string;
  department: string;
  position: string;
  managerId: string | null;
  role: "employee" | "manager" | "hr" | "admin";
  hireDate: string;
  isActive: boolean;
};

type UserManagementModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode: "list" | "add" | "edit";
  userId?: string;
};

export function UserManagementModal({
  isOpen,
  onClose,
  onSuccess,
  mode,
  userId,
}: UserManagementModalProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    department: "",
    position: "",
    managerId: "",
    role: "employee" as const,
    hireDate: "",
    isActive: true,
  });

  // フィルター機能用state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // モーダルが開かれた時の処理
  useEffect(() => {
    if (isOpen) {
      if (mode === "list") {
        void fetchUsers();
      } else if (mode === "edit" && userId) {
        void fetchUser(userId);
      } else if (mode === "add") {
        // フォームをリセット
        setFormData({
          email: "",
          name: "",
          department: "",
          position: "",
          managerId: "",
          role: "employee",
          hireDate: new Date().toISOString().split("T")[0] || "",
          isActive: true,
        });
      }
    }
  }, [isOpen, mode, userId]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const currentUserId = localStorage.getItem("currentUserId");
      if (!currentUserId) return;

      const response = await safeFetch("/api/mock/admin/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": currentUserId,
        },
      });

      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      } else {
        setError(data.error?.message || "ユーザー一覧の取得に失敗しました");
      }
    } catch (err) {
      setError("ユーザー一覧の取得中にエラーが発生しました");
      // eslint-disable-next-line no-console
      console.error("Fetch users error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const currentUserId = localStorage.getItem("currentUserId");
      if (!currentUserId) return;

      const response = await safeFetch(`/api/mock/admin/users/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": currentUserId,
        },
      });

      const data = await response.json();
      if (data.success) {
        const user = data.data;
        setFormData({
          email: user.email,
          name: user.name,
          department: user.department,
          position: user.position,
          managerId: user.managerId || "",
          role: user.role,
          hireDate: user.hireDate,
          isActive: user.isActive,
        });
      } else {
        setError(data.error?.message || "ユーザー情報の取得に失敗しました");
      }
    } catch (err) {
      setError("ユーザー情報の取得中にエラーが発生しました");
      // eslint-disable-next-line no-console
      console.error("Fetch user error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError(null);

      const currentUserId = localStorage.getItem("currentUserId");
      if (!currentUserId) return;

      const url =
        mode === "add"
          ? "/api/mock/admin/users"
          : `/api/mock/admin/users/${userId}`;

      const method = mode === "add" ? "POST" : "PUT";

      const submitData = {
        ...formData,
        managerId: formData.managerId || null,
      };

      const response = await safeFetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-user-id": currentUserId,
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();
      if (data.success) {
        onSuccess();
        onClose();
      } else {
        setError(data.error?.message || "操作に失敗しました");
      }
    } catch (err) {
      setError("操作中にエラーが発生しました");
      // eslint-disable-next-line no-console
      console.error("Submit error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("本当にこのユーザーを削除しますか？")) return;

    try {
      setSaving(true);
      setError(null);

      const currentUserId = localStorage.getItem("currentUserId");
      if (!currentUserId) return;

      const response = await safeFetch(`/api/mock/admin/users/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": currentUserId,
        },
      });

      const data = await response.json();
      if (data.success) {
        void fetchUsers(); // リストを再取得
      } else {
        setError(data.error?.message || "削除に失敗しました");
      }
    } catch (err) {
      setError("削除中にエラーが発生しました");
      // eslint-disable-next-line no-console
      console.error("Delete error:", err);
    } finally {
      setSaving(false);
    }
  };

  // フィルタリング機能
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchTerm === "" ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment =
      filterDepartment === "" || user.department === filterDepartment;

    const matchesRole = filterRole === "" || user.role === filterRole;

    const matchesStatus =
      filterStatus === "" ||
      (filterStatus === "active" && user.isActive) ||
      (filterStatus === "inactive" && !user.isActive);

    return matchesSearch && matchesDepartment && matchesRole && matchesStatus;
  });

  // ページネーション
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // リセットフィルター
  const resetFilters = () => {
    setSearchTerm("");
    setFilterDepartment("");
    setFilterRole("");
    setFilterStatus("");
    setCurrentPage(1);
  };

  const getRoleColor = (role: User["role"]) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 border-red-200";
      case "hr":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "manager":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "employee":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRoleIcon = (role: User["role"]) => {
    switch (role) {
      case "admin":
        return "👑";
      case "hr":
        return "👥";
      case "manager":
        return "📊";
      case "employee":
        return "👤";
      default:
        return "👤";
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative max-h-[95vh] w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl"
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{
              duration: 0.3,
              type: "spring",
              damping: 25,
              stiffness: 300,
            }}
          >
            {/* Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 px-8 py-6">
              <div className="absolute -top-4 -right-4 h-32 w-32 rounded-full bg-indigo-200/20 blur-2xl"></div>
              <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-purple-200/20 blur-xl"></div>

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg"
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    {mode === "list" ? "👥" : mode === "add" ? "➕" : "✏️"}
                  </motion.div>
                  <div>
                    <Text className="text-2xl font-bold text-gray-900">
                      {mode === "list" && "ユーザー管理"}
                      {mode === "add" && "新規ユーザー追加"}
                      {mode === "edit" && "ユーザー情報編集"}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      {mode === "list" && `${users.length}名のユーザー`}
                      {mode === "add" && "新しいユーザーを作成します"}
                      {mode === "edit" && "ユーザー情報を更新します"}
                    </Text>
                  </div>
                </div>
                <motion.button
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-gray-600 backdrop-blur-sm transition-colors hover:bg-white hover:text-gray-900"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M6 18L18 6M6 6l12 12"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="max-h-[80vh] overflow-y-auto p-8">
              {error && (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4"
                  initial={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Text className="text-red-800">{error}</Text>
                </motion.div>
              )}

              {mode === "list" && (
                <div className="space-y-6">
                  {/* Search and Filters */}
                  <div className="space-y-4">
                    {/* Search Bar */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg
                          className="h-4 w-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                          />
                        </svg>
                      </div>
                      <Input
                        className="rounded-xl border-gray-200 bg-gray-50/50 pl-10 focus:border-indigo-500 focus:bg-white"
                        placeholder="名前、メール、部署で検索..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>

                    {/* Filter Toggle */}
                    <div className="flex items-center justify-between">
                      <motion.button
                        className="flex items-center space-x-2 rounded-lg bg-indigo-50 px-4 py-2 text-indigo-700 transition-colors hover:bg-indigo-100"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowFilters(!showFilters)}
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                          />
                        </svg>
                        <span>フィルター</span>
                        <motion.svg
                          animate={{ rotate: showFilters ? 180 : 0 }}
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          transition={{ duration: 0.2 }}
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M19 9l-7 7-7-7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                          />
                        </motion.svg>
                      </motion.button>
                      <div className="text-sm text-gray-600">
                        {filteredUsers.length}件中{" "}
                        {Math.min(startIndex + 1, filteredUsers.length)}-
                        {Math.min(
                          startIndex + itemsPerPage,
                          filteredUsers.length,
                        )}
                        件を表示
                      </div>
                    </div>

                    {/* Advanced Filters */}
                    <AnimatePresence>
                      {showFilters && (
                        <motion.div
                          animate={{ opacity: 1, height: "auto" }}
                          className="overflow-hidden rounded-xl bg-gray-50 p-4"
                          exit={{ opacity: 0, height: 0 }}
                          initial={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="grid gap-4 md:grid-cols-3">
                            <div>
                              <Label className="text-sm font-semibold text-gray-700">
                                部署
                              </Label>
                              <Select
                                className="mt-1 rounded-lg"
                                value={filterDepartment}
                                onChange={(e) =>
                                  setFilterDepartment(e.target.value)
                                }
                              >
                                <option value="">すべて</option>
                                <option value="開発部">開発部</option>
                                <option value="マーケティング部">
                                  マーケティング部
                                </option>
                                <option value="人事部">人事部</option>
                                <option value="経営企画">経営企画</option>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-sm font-semibold text-gray-700">
                                ロール
                              </Label>
                              <Select
                                className="mt-1 rounded-lg"
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value)}
                              >
                                <option value="">すべて</option>
                                <option value="employee">従業員</option>
                                <option value="manager">マネージャー</option>
                                <option value="hr">人事</option>
                                <option value="admin">管理者</option>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-sm font-semibold text-gray-700">
                                状態
                              </Label>
                              <Select
                                className="mt-1 rounded-lg"
                                value={filterStatus}
                                onChange={(e) =>
                                  setFilterStatus(e.target.value)
                                }
                              >
                                <option value="">すべて</option>
                                <option value="active">アクティブ</option>
                                <option value="inactive">無効</option>
                              </Select>
                            </div>
                          </div>
                          <div className="mt-4 flex justify-end">
                            <Button
                              outline
                              className="text-sm"
                              onClick={resetFilters}
                            >
                              フィルターをリセット
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* User Cards */}
                  {loading ? (
                    <div className="flex justify-center py-12">
                      <LoadingSpinner size="lg" />
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {paginatedUsers.map((user, index) => (
                          <motion.div
                            key={user.id}
                            animate={{ opacity: 1, y: 0 }}
                            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/25"
                            initial={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                          >
                            <div className="absolute -top-2 -right-2 h-16 w-16 rounded-full bg-indigo-200/20 blur-xl transition-all duration-300 group-hover:bg-indigo-300/30"></div>

                            <div className="relative z-10">
                              <div className="mb-4 flex items-start justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-xl text-white shadow-lg">
                                    {getRoleIcon(user.role)}
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-gray-900">
                                      {user.name}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                      {user.position}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span
                                    className={`rounded-full border px-2 py-1 text-xs font-medium ${getRoleColor(user.role)}`}
                                  >
                                    {user.role}
                                  </span>
                                  <span
                                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                                      user.isActive
                                        ? "bg-green-100 text-green-800"
                                        : "bg-gray-100 text-gray-800"
                                    }`}
                                  >
                                    {user.isActive ? "✓" : "✗"}
                                  </span>
                                </div>
                              </div>

                              <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-center space-x-2">
                                  <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                    />
                                  </svg>
                                  <span className="truncate">{user.email}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                    />
                                  </svg>
                                  <span>{user.department}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                    />
                                  </svg>
                                  <span>入社日: {user.hireDate}</span>
                                </div>
                              </div>

                              <div className="mt-4 flex space-x-2">
                                <motion.button
                                  className="flex-1 rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 transition-colors hover:bg-indigo-100"
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => {
                                    onClose();
                                    // 編集用の関数を呼び出し（親コンポーネントで処理）
                                  }}
                                >
                                  編集
                                </motion.button>
                                <motion.button
                                  className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50"
                                  disabled={saving}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => handleDelete(user.id)}
                                >
                                  削除
                                </motion.button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="flex items-center justify-center space-x-2">
                          <motion.button
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
                            disabled={currentPage === 1}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setCurrentPage(currentPage - 1)}
                          >
                            前へ
                          </motion.button>
                          {Array.from({ length: totalPages }, (_, i) => (
                            <motion.button
                              key={i + 1}
                              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                currentPage === i + 1
                                  ? "bg-indigo-600 text-white"
                                  : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                              }`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setCurrentPage(i + 1)}
                            >
                              {i + 1}
                            </motion.button>
                          ))}
                          <motion.button
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
                            disabled={currentPage === totalPages}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setCurrentPage(currentPage + 1)}
                          >
                            次へ
                          </motion.button>
                        </div>
                      )}

                      {filteredUsers.length === 0 && (
                        <div className="py-12 text-center">
                          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                            <svg
                              className="h-12 w-12 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                              />
                            </svg>
                          </div>
                          <Text className="text-lg font-semibold text-gray-900">
                            ユーザーが見つかりません
                          </Text>
                          <Text className="text-gray-600">
                            検索条件を変更してみてください
                          </Text>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {(mode === "add" || mode === "edit") && (
                <div className="space-y-6">
                  {loading ? (
                    <div className="flex justify-center py-12">
                      <LoadingSpinner size="lg" />
                    </div>
                  ) : (
                    <motion.form
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                      initial={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.3 }}
                      onSubmit={handleSubmit}
                    >
                      <div className="grid gap-6 md:grid-cols-2">
                        <motion.div
                          animate={{ opacity: 1, x: 0 }}
                          initial={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                        >
                          <Label
                            className="text-sm font-semibold text-gray-700"
                            htmlFor="email"
                          >
                            メールアドレス *
                          </Label>
                          <Input
                            required
                            className="mt-1 rounded-xl border-gray-200 bg-gray-50/50 focus:border-indigo-500 focus:bg-white"
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                email: e.target.value,
                              })
                            }
                          />
                        </motion.div>

                        <motion.div
                          animate={{ opacity: 1, x: 0 }}
                          initial={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                        >
                          <Label
                            className="text-sm font-semibold text-gray-700"
                            htmlFor="name"
                          >
                            氏名 *
                          </Label>
                          <Input
                            required
                            className="mt-1 rounded-xl border-gray-200 bg-gray-50/50 focus:border-indigo-500 focus:bg-white"
                            id="name"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                          />
                        </motion.div>

                        <motion.div
                          animate={{ opacity: 1, x: 0 }}
                          initial={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3, delay: 0.2 }}
                        >
                          <Label
                            className="text-sm font-semibold text-gray-700"
                            htmlFor="department"
                          >
                            部署 *
                          </Label>
                          <Select
                            required
                            className="mt-1 rounded-xl border-gray-200 bg-gray-50/50 focus:border-indigo-500 focus:bg-white"
                            id="department"
                            value={formData.department}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                department: e.target.value,
                              })
                            }
                          >
                            <option value="">選択してください</option>
                            <option value="開発部">開発部</option>
                            <option value="マーケティング部">
                              マーケティング部
                            </option>
                            <option value="人事部">人事部</option>
                            <option value="経営企画">経営企画</option>
                            <option value="営業部">営業部</option>
                          </Select>
                        </motion.div>

                        <motion.div
                          animate={{ opacity: 1, x: 0 }}
                          initial={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3, delay: 0.2 }}
                        >
                          <Label
                            className="text-sm font-semibold text-gray-700"
                            htmlFor="position"
                          >
                            役職 *
                          </Label>
                          <Input
                            required
                            className="mt-1 rounded-xl border-gray-200 bg-gray-50/50 focus:border-indigo-500 focus:bg-white"
                            id="position"
                            value={formData.position}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                position: e.target.value,
                              })
                            }
                          />
                        </motion.div>

                        <motion.div
                          animate={{ opacity: 1, x: 0 }}
                          initial={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3, delay: 0.3 }}
                        >
                          <Label
                            className="text-sm font-semibold text-gray-700"
                            htmlFor="role"
                          >
                            ロール *
                          </Label>
                          <Select
                            required
                            className="mt-1 rounded-xl border-gray-200 bg-gray-50/50 focus:border-indigo-500 focus:bg-white"
                            id="role"
                            value={formData.role}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                role: e.target.value as typeof formData.role,
                              })
                            }
                          >
                            <option value="employee">従業員</option>
                            <option value="manager">マネージャー</option>
                            <option value="hr">人事</option>
                            <option value="admin">管理者</option>
                          </Select>
                        </motion.div>

                        <motion.div
                          animate={{ opacity: 1, x: 0 }}
                          initial={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3, delay: 0.3 }}
                        >
                          <Label
                            className="text-sm font-semibold text-gray-700"
                            htmlFor="hireDate"
                          >
                            入社日 *
                          </Label>
                          <Input
                            required
                            className="mt-1 rounded-xl border-gray-200 bg-gray-50/50 focus:border-indigo-500 focus:bg-white"
                            id="hireDate"
                            type="date"
                            value={formData.hireDate}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                hireDate: e.target.value,
                              })
                            }
                          />
                        </motion.div>

                        <motion.div
                          animate={{ opacity: 1, y: 0 }}
                          className="md:col-span-2"
                          initial={{ opacity: 0, y: 20 }}
                          transition={{ duration: 0.3, delay: 0.4 }}
                        >
                          <Label
                            className="text-sm font-semibold text-gray-700"
                            htmlFor="managerId"
                          >
                            上司ID
                          </Label>
                          <Input
                            className="mt-1 rounded-xl border-gray-200 bg-gray-50/50 focus:border-indigo-500 focus:bg-white"
                            id="managerId"
                            placeholder="上司のユーザーIDを入力（オプション）"
                            value={formData.managerId}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                managerId: e.target.value,
                              })
                            }
                          />
                        </motion.div>

                        {mode === "edit" && (
                          <motion.div
                            animate={{ opacity: 1, y: 0 }}
                            className="md:col-span-2"
                            initial={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.3, delay: 0.5 }}
                          >
                            <label className="flex items-center space-x-3 rounded-lg bg-gray-50 p-3">
                              <input
                                checked={formData.isActive}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                type="checkbox"
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    isActive: e.target.checked,
                                  })
                                }
                              />
                              <span className="text-sm font-medium text-gray-700">
                                アクティブユーザー
                              </span>
                            </label>
                          </motion.div>
                        )}
                      </div>

                      <motion.div
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-end space-x-4 pt-6"
                        initial={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3, delay: 0.6 }}
                      >
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            outline
                            className="border-2 border-gray-300 bg-white px-6 py-2.5 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                            onClick={onClose}
                          >
                            キャンセル
                          </Button>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-2.5 text-white shadow-lg transition-all hover:from-indigo-600 hover:to-purple-700 hover:shadow-xl"
                            disabled={saving || loading}
                            type="submit"
                          >
                            {saving
                              ? "保存中..."
                              : mode === "add"
                                ? "ユーザーを追加"
                                : "ユーザーを更新"}
                          </Button>
                        </motion.div>
                      </motion.div>
                    </motion.form>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
