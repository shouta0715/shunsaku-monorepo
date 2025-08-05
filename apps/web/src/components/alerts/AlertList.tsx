"use client";

import { Button } from "@package/ui";
import { useCallback, useEffect, useState } from "react";

import { LoadingSpinner } from "@/components/ui";
import { safeFetch, useErrorHandler } from "@/hooks/use-error-handler";
import { CustomError } from "@/lib/error-utils";

type AlertItem = {
  id: string;
  type:
    | "high_risk"
    | "score_drop"
    | "no_response"
    | "system"
    | "improvement"
    | "follow_up"
    | "weekly_summary"
    | "team_concern"
    | "consecutive_low"
    | "team_summary"
    | "management_tip"
    | "company_summary"
    | "policy_update"
    | "training_reminder"
    | "system_alert"
    | "data_insight"
    | "security_update"
    | "performance_report"
    | "survey_reminder"
    | "achievement"
    | "feedback_request";
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  targetUserId?: string;
  userId: string;
};

type AlertListProps = {
  unreadOnly?: boolean;
};

export function AlertList({ unreadOnly = false }: AlertListProps) {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<Set<number>>(new Set());
  const [showUnreadOnly, setShowUnreadOnly] = useState(unreadOnly);
  const [showFilters, setShowFilters] = useState(false);

  const { error, isError, handleError, clearError, retryAction } =
    useErrorHandler({
      defaultMode: "inline",
      redirectOnAuth: true,
    });

  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true);
      clearError();

      // 認証チェック
      const currentUserId = localStorage.getItem("currentUserId");
      if (!currentUserId) {
        throw new CustomError(
          "AUTHENTICATION_REQUIRED",
          "ログインが必要です",
          "User ID not found in localStorage",
        );
      }

      const params = new URLSearchParams();
      if (unreadOnly) params.set("unread_only", "true");

      const response = await safeFetch(`/api/mock/alerts?${params}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": currentUserId,
        },
      });

      const result = await response.json();

      if (!result.success) {
        throw new CustomError(
          "SERVER_ERROR",
          result.error?.message || "アラートの取得に失敗しました",
          result.error?.details,
        );
      }

      // データの型チェック
      if (!Array.isArray(result.data)) {
        throw new CustomError(
          "VALIDATION_ERROR",
          "無効なレスポンス形式です",
          `Expected array but got ${typeof result.data}`,
        );
      }

      setAlerts(result.data);

      // デバッグログ
      if (process.env.NODE_ENV === "development") {
        // eslint-disable-next-line no-console
        console.log(
          `Fetched ${result.data.length} alerts for user ${currentUserId}`,
        );
      }
    } catch (error) {
      handleError(error, "inline");
      // エラー時は空配列を設定
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  }, [unreadOnly, clearError, handleError]);

  useEffect(() => {
    void fetchAlerts();
  }, [fetchAlerts]);

  // カテゴリフィルター切り替え関数
  const toggleCategoryFilter = useCallback((priority: number) => {
    setActiveFilters((prev) => {
      const newFilters = new Set(prev);
      if (newFilters.has(priority)) {
        newFilters.delete(priority);
      } else {
        newFilters.add(priority);
      }

      return newFilters;
    });
  }, []);

  // フィルタリングされたアラートを取得する関数
  const getFilteredAlerts = useCallback(
    (alertList: AlertItem[]) => {
      const filteredAlerts = [];

      // まず未読フィルターを適用
      if (showUnreadOnly) {
        for (const alert of alertList) {
          if (!alert.isRead) {
            filteredAlerts.push(alert);
          }
        }
      } else {
        // 全てのアラートを対象とする
        for (const alert of alertList) {
          filteredAlerts.push(alert);
        }
      }

      // 次にカテゴリフィルターを適用
      if (activeFilters.size === 0) {
        return filteredAlerts; // カテゴリフィルターがない場合はそのまま返す
      }

      const categoryFilteredAlerts = [];

      for (const alert of filteredAlerts) {
        const config = getAlertTypeConfig(alert.type);

        // 緊急対応の場合は priority 1,2 を含む
        for (const filterPriority of activeFilters) {
          const matches =
            filterPriority === 1
              ? config.priority <= 2
              : config.priority === filterPriority;

          if (matches) {
            categoryFilteredAlerts.push(alert);
            break; // 一つでもマッチしたら追加して次のアラートへ
          }
        }
      }

      return categoryFilteredAlerts;
    },
    [activeFilters, showUnreadOnly],
  );

  // for ofを使った未読アラート検索関数
  const getUnreadAlerts = useCallback((alertList: AlertItem[]) => {
    const unreadAlerts = [];

    for (const alert of alertList) {
      if (!alert.isRead) {
        unreadAlerts.push(alert);
      }
    }

    return unreadAlerts;
  }, []);

  const markAsRead = useCallback(
    async (alertId: string) => {
      if (!alertId) {
        handleError(
          new CustomError("VALIDATION_ERROR", "無効なアラートIDです"),
        );

        return;
      }

      try {
        setUpdating(alertId);
        clearError();

        // 現在のユーザーIDを取得
        const currentUserId = localStorage.getItem("currentUserId");
        if (!currentUserId) {
          throw new CustomError(
            "AUTHENTICATION_REQUIRED",
            "ログインが必要です",
          );
        }

        const response = await safeFetch(`/api/mock/alerts/${alertId}/read`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": currentUserId,
          },
        });

        const result = await response.json();

        // デバッグログ
        if (process.env.NODE_ENV === "development") {
          // eslint-disable-next-line no-console
          console.log("Mark as read API response:", result);
        }

        if (!result.success) {
          throw new CustomError(
            "SERVER_ERROR",
            result.error?.message || "アラートの既読処理に失敗しました",
            result.error?.details,
          );
        }

        // UIを即座に更新
        setAlerts((prev) =>
          prev.map((alert) =>
            alert.id === alertId ? { ...alert, isRead: true } : alert,
          ),
        );

        // 成功ログ（デバッグ用）
        if (process.env.NODE_ENV === "development") {
          // eslint-disable-next-line no-console
          console.log(`Alert ${alertId} marked as read successfully`);
        }
      } catch (error) {
        handleError(error, "inline");
      } finally {
        setUpdating(null);
      }
    },
    [clearError, handleError],
  );

  const markAllAsRead = useCallback(async () => {
    try {
      setUpdating("all");
      clearError();

      // 現在のユーザーIDを取得
      const currentUserId = localStorage.getItem("currentUserId");
      if (!currentUserId) {
        throw new CustomError(
          "AUTHENTICATION_REQUIRED",
          "ログインが必要です",
          "User ID not found in localStorage",
        );
      }

      // 既読にする未読アラートがあるかチェック
      const unreadAlerts = alerts.filter((alert) => !alert.isRead);
      if (unreadAlerts.length === 0) {
        throw new CustomError(
          "VALIDATION_ERROR",
          "既読にするアラートがありません",
          "No unread alerts found",
        );
      }

      const response = await safeFetch("/api/mock/alerts/read-all", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": currentUserId,
        },
      });

      const result = await response.json();

      // デバッグログ
      if (process.env.NODE_ENV === "development") {
        // eslint-disable-next-line no-console
        console.log("Mark all as read API response:", result);
      }

      if (!result.success) {
        throw new CustomError(
          "SERVER_ERROR",
          result.error?.message || "一括既読処理に失敗しました",
          result.error?.details,
        );
      }

      // UIを即座に更新
      setAlerts((prev) => prev.map((alert) => ({ ...alert, isRead: true })));

      // 成功メッセージ（オプション）
      if (result.updatedCount !== undefined) {
        // eslint-disable-next-line no-console
        console.log(`${result.updatedCount}件のアラートを既読にしました`);
      }
    } catch (error) {
      handleError(error, "inline");
    } finally {
      setUpdating(null);
    }
  }, [alerts, clearError, handleError]);

  const getAlertCategoryInfo = (priority: number) => {
    if (priority <= 2) {
      return {
        category: "緊急対応",
        categoryIcon: "🚨",
        categoryColor: "bg-red-100 text-red-800 border-red-200",
        description: "即座の対応が必要です",
      };
    }
    if (priority === 3) {
      return {
        category: "要アクション",
        categoryIcon: "⚡",
        categoryColor: "bg-blue-100 text-blue-800 border-blue-200",
        description: "アクションをお願いします",
      };
    }
    if (priority === 4) {
      return {
        category: "成果・改善",
        categoryIcon: "✨",
        categoryColor: "bg-green-100 text-green-800 border-green-200",
        description: "ポジティブな成果です",
      };
    }
    if (priority === 5) {
      return {
        category: "情報・分析",
        categoryIcon: "📊",
        categoryColor: "bg-purple-100 text-purple-800 border-purple-200",
        description: "参考情報です",
      };
    }
    if (priority === 6) {
      return {
        category: "システム",
        categoryIcon: "⚙️",
        categoryColor: "bg-gray-100 text-gray-800 border-gray-200",
        description: "システム関連です",
      };
    }
    if (priority === 7) {
      return {
        category: "学習・発展",
        categoryIcon: "🎓",
        categoryColor: "bg-sky-100 text-sky-800 border-sky-200",
        description: "学習・研修関連です",
      };
    }

    return {
      category: "その他",
      categoryIcon: "📋",
      categoryColor: "bg-gray-100 text-gray-800 border-gray-200",
      description: "一般的な通知です",
    };
  };

  const getAlertTypeConfig = (type: AlertItem["type"]) => {
    const config = {
      // 危険・警告系 (赤・オレンジ) - 高い優先度
      high_risk: {
        label: "高リスク",
        badgeColor: "red" as const,
        color:
          "bg-gradient-to-r from-red-50 to-pink-50 border-red-200 shadow-sm",
        icon: (
          <svg
            className="h-5 w-5 text-red-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              clipRule="evenodd"
              d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
              fillRule="evenodd"
            />
          </svg>
        ),
        priority: 1,
      },
      consecutive_low: {
        label: "継続低下",
        badgeColor: "red" as const,
        color:
          "bg-gradient-to-r from-red-50 to-orange-50 border-red-200 shadow-sm",
        icon: (
          <svg
            className="h-5 w-5 text-red-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              clipRule="evenodd"
              d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
              fillRule="evenodd"
            />
          </svg>
        ),
        priority: 1,
      },
      score_drop: {
        label: "スコア低下",
        badgeColor: "orange" as const,
        color:
          "bg-gradient-to-r from-yellow-50 to-orange-50 border-orange-200 shadow-sm",
        icon: (
          <svg
            className="h-5 w-5 text-orange-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              clipRule="evenodd"
              d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
              fillRule="evenodd"
            />
          </svg>
        ),
        priority: 2,
      },
      team_concern: {
        label: "チーム懸念",
        badgeColor: "orange" as const,
        color:
          "bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200 shadow-sm",
        icon: (
          <svg
            className="h-5 w-5 text-orange-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.78.78 0 01-.358-.442 3 3 0 014.308-3.516 6.484 6.484 0 00-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 01-2.07-.655zM16.44 15.98a4.97 4.97 0 002.07-.654.78.78 0 00.357-.442 3 3 0 00-4.308-3.517 6.484 6.484 0 011.907 3.96 2.32 2.32 0 01-.026.654zM18 8a2 2 0 11-4 0 2 2 0 014 0zM5.304 16.19a.844.844 0 01-.277-.71 5 5 0 019.947 0 .843.843 0 01-.277.71A6.975 6.975 0 0110 18a6.974 6.974 0 01-4.696-1.81z" />
          </svg>
        ),
        priority: 2,
      },

      // 改善・成果系 (緑) - 正のフィードバック
      improvement: {
        label: "改善",
        badgeColor: "green" as const,
        color:
          "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-sm",
        icon: (
          <svg
            className="h-5 w-5 text-green-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              clipRule="evenodd"
              d="M10 3a.75.75 0 01.75.75v4.5h4.5a.75.75 0 010 1.5h-4.5v4.5a.75.75 0 01-1.5 0v-4.5h-4.5a.75.75 0 010-1.5h4.5v-4.5A.75.75 0 0110 3z"
              fillRule="evenodd"
            />
          </svg>
        ),
        priority: 4,
      },
      achievement: {
        label: "達成",
        badgeColor: "green" as const,
        color:
          "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 shadow-sm",
        icon: (
          <svg
            className="h-5 w-5 text-emerald-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              clipRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.236 4.53L8.93 10.7a.75.75 0 00-1.06 1.061l1.884 1.884a.75.75 0 001.137-.089l4-5.5z"
              fillRule="evenodd"
            />
          </svg>
        ),
        priority: 4,
      },

      // アクション要求系 (青) - 中程度の優先度
      follow_up: {
        label: "フォローアップ",
        badgeColor: "blue" as const,
        color:
          "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm",
        icon: (
          <svg
            className="h-5 w-5 text-blue-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
        ),
        priority: 3,
      },
      feedback_request: {
        label: "フィードバック",
        badgeColor: "blue" as const,
        color:
          "bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 shadow-sm",
        icon: (
          <svg
            className="h-5 w-5 text-blue-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              clipRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
              fillRule="evenodd"
            />
          </svg>
        ),
        priority: 3,
      },
      no_response: {
        label: "未回答",
        badgeColor: "blue" as const,
        color:
          "bg-gradient-to-r from-blue-50 to-sky-50 border-blue-200 shadow-sm",
        icon: (
          <svg
            className="h-5 w-5 text-blue-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              clipRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
              fillRule="evenodd"
            />
          </svg>
        ),
        priority: 3,
      },
      survey_reminder: {
        label: "回答依頼",
        badgeColor: "blue" as const,
        color:
          "bg-gradient-to-r from-sky-50 to-blue-50 border-sky-200 shadow-sm",
        icon: (
          <svg
            className="h-5 w-5 text-sky-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              clipRule="evenodd"
              d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm6.39-2.908a.75.75 0 01.766.027l3.5 2.25a.75.75 0 010 1.262l-3.5 2.25A.75.75 0 018 12.25v-4.5a.75.75 0 01.39-.658z"
              fillRule="evenodd"
            />
          </svg>
        ),
        priority: 3,
      },

      // 情報・レポート系 (紫) - 低い優先度だが重要
      weekly_summary: {
        label: "週間サマリー",
        badgeColor: "purple" as const,
        color:
          "bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200 shadow-sm",
        icon: (
          <svg
            className="h-5 w-5 text-purple-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M15.5 2A1.5 1.5 0 0014 3.5v13a1.5 1.5 0 001.5 1.5h1a1.5 1.5 0 001.5-1.5v-13A1.5 1.5 0 0016.5 2h-1zM9.5 6A1.5 1.5 0 008 7.5v9A1.5 1.5 0 009.5 18h1a1.5 1.5 0 001.5-1.5v-9A1.5 1.5 0 0010.5 6h-1zM3.5 10A1.5 1.5 0 002 11.5v5A1.5 1.5 0 003.5 18h1A1.5 1.5 0 006 16.5v-5A1.5 1.5 0 004.5 10h-1z" />
          </svg>
        ),
        priority: 5,
      },
      team_summary: {
        label: "チームレポート",
        badgeColor: "purple" as const,
        color:
          "bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200 shadow-sm",
        icon: (
          <svg
            className="h-5 w-5 text-violet-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
            <path d="M6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
          </svg>
        ),
        priority: 5,
      },
      company_summary: {
        label: "全社レポート",
        badgeColor: "purple" as const,
        color:
          "bg-gradient-to-r from-purple-50 to-fuchsia-50 border-purple-200 shadow-sm",
        icon: (
          <svg
            className="h-5 w-5 text-purple-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
          </svg>
        ),
        priority: 5,
      },
      data_insight: {
        label: "データ分析",
        badgeColor: "purple" as const,
        color:
          "bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 shadow-sm",
        icon: (
          <svg
            className="h-5 w-5 text-indigo-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
        ),
        priority: 5,
      },
      performance_report: {
        label: "パフォーマンス",
        badgeColor: "purple" as const,
        color:
          "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 shadow-sm",
        icon: (
          <svg
            className="h-5 w-5 text-purple-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              clipRule="evenodd"
              d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              fillRule="evenodd"
            />
          </svg>
        ),
        priority: 5,
      },

      // システム・管理系 (グレー) - 管理者向け
      system: {
        label: "システム",
        badgeColor: "zinc" as const,
        color:
          "bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 shadow-sm",
        icon: (
          <svg
            className="h-5 w-5 text-gray-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              clipRule="evenodd"
              d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z"
              fillRule="evenodd"
            />
          </svg>
        ),
        priority: 6,
      },
      system_alert: {
        label: "システム通知",
        badgeColor: "zinc" as const,
        color:
          "bg-gradient-to-r from-slate-50 to-gray-50 border-slate-200 shadow-sm",
        icon: (
          <svg
            className="h-5 w-5 text-slate-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              clipRule="evenodd"
              d="M10 2a6 6 0 00-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 00.515 1.076 32.91 32.91 0 003.256.508 3.5 3.5 0 006.972 0 32.903 32.903 0 003.256-.508.75.75 0 00.515-1.076A11.448 11.448 0 0116 8a6 6 0 00-6-6zM8.05 14.943a33.54 33.54 0 003.9 0 2 2 0 01-3.9 0z"
              fillRule="evenodd"
            />
          </svg>
        ),
        priority: 6,
      },
      security_update: {
        label: "セキュリティ",
        badgeColor: "zinc" as const,
        color:
          "bg-gradient-to-r from-gray-50 to-zinc-50 border-gray-200 shadow-sm",
        icon: (
          <svg
            className="h-5 w-5 text-gray-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              clipRule="evenodd"
              d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
              fillRule="evenodd"
            />
          </svg>
        ),
        priority: 6,
      },

      // 施策・研修系 (藍色) - 学習・発展
      policy_update: {
        label: "施策更新",
        badgeColor: "sky" as const,
        color:
          "bg-gradient-to-r from-sky-50 to-cyan-50 border-sky-200 shadow-sm",
        icon: (
          <svg
            className="h-5 w-5 text-sky-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              clipRule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              fillRule="evenodd"
            />
          </svg>
        ),
        priority: 7,
      },
      training_reminder: {
        label: "研修",
        badgeColor: "sky" as const,
        color:
          "bg-gradient-to-r from-cyan-50 to-sky-50 border-cyan-200 shadow-sm",
        icon: (
          <svg
            className="h-5 w-5 text-cyan-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
          </svg>
        ),
        priority: 7,
      },
      management_tip: {
        label: "マネジメント",
        badgeColor: "sky" as const,
        color:
          "bg-gradient-to-r from-sky-50 to-blue-50 border-sky-200 shadow-sm",
        icon: (
          <svg
            className="h-5 w-5 text-sky-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              clipRule="evenodd"
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              fillRule="evenodd"
            />
          </svg>
        ),
        priority: 7,
      },
    };

    return (
      config[type] || {
        label: "その他",
        badgeColor: "zinc" as const,
        color:
          "bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 shadow-sm",
        icon: (
          <svg
            className="h-5 w-5 text-gray-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              clipRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
              fillRule="evenodd"
            />
          </svg>
        ),
        priority: 8,
      }
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10">
            <svg
              className="h-6 w-6 text-orange-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {showUnreadOnly ? "未読アラート" : "アラート通知"}
            </h3>
            <div className="mt-1 flex items-center space-x-2">
              {(() => {
                const filteredAlerts = getFilteredAlerts(alerts);
                const unreadAlerts = getUnreadAlerts(filteredAlerts);

                return (
                  <>
                    <span className="text-sm text-gray-600">
                      {activeFilters.size > 0 || showUnreadOnly ? (
                        <>
                          表示中 {filteredAlerts.length} 件 / 全 {alerts.length}{" "}
                          件
                          {showUnreadOnly && (
                            <span className="ml-1 text-blue-600">
                              (未読のみ)
                            </span>
                          )}
                        </>
                      ) : (
                        <>全 {alerts.length} 件</>
                      )}
                    </span>
                    {unreadAlerts.length > 0 && (
                      <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                        未読 {unreadAlerts.length} 件
                      </span>
                    )}
                    {(activeFilters.size > 0 || showUnreadOnly) && (
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                        🔍 フィルタ適用中
                      </span>
                    )}
                    <button
                      className={`ml-2 flex items-center space-x-2 rounded-lg border px-3 py-1 text-xs font-medium transition-all duration-200 ${
                        showFilters
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-300 bg-white text-gray-600 hover:border-gray-400 hover:bg-gray-50"
                      }`}
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      <svg
                        className={`h-3 w-3 transition-transform duration-200 ${
                          showFilters ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M19 9l-7 7-7-7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                        />
                      </svg>
                      <span>
                        {showFilters ? "フィルターを隠す" : "フィルター"}
                      </span>
                      {(activeFilters.size > 0 || showUnreadOnly) &&
                        !showFilters && (
                          <span className="ml-1 rounded-full bg-blue-600 px-1.5 py-0.5 text-xs text-white">
                            {activeFilters.size + (showUnreadOnly ? 1 : 0)}
                          </span>
                        )}
                    </button>
                  </>
                );
              })()}
            </div>
          </div>
        </div>

        {getUnreadAlerts(getFilteredAlerts(alerts)).length > 0 && (
          <Button
            className={`font-medium transition-all duration-300 ${
              updating === "all"
                ? "cursor-not-allowed border border-gray-300 bg-gray-200 text-gray-700"
                : "bg-blue-600 text-white hover:scale-105 hover:bg-blue-700 hover:shadow-lg active:scale-95 active:bg-blue-800"
            }`}
            disabled={updating === "all"}
            onClick={markAllAsRead}
          >
            {updating === "all" ? (
              <span className="flex items-center space-x-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    fill="currentColor"
                  />
                </svg>
                <span>処理中...</span>
              </span>
            ) : (
              <span className="flex items-center space-x-2">
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    clipRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    fillRule="evenodd"
                  />
                </svg>
                <span>全て既読にする</span>
              </span>
            )}
          </Button>
        )}
      </div>

      {/* エラー表示 */}
      {isError && error && (
        <div className="mb-6 overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-gray-900/5">
          <div className="bg-gradient-to-r from-red-50 to-pink-50 px-6 py-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10">
                  <svg
                    className="h-5 w-5 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-red-800">
                    エラーが発生しました
                  </h3>
                  <p className="mt-1 text-sm text-red-700">{error?.message}</p>
                  {error?.details && (
                    <p className="mt-1 text-xs text-red-600">
                      詳細: {error?.details}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  className="bg-red-600 font-medium text-white transition-all duration-300 hover:bg-red-700 hover:shadow-md active:bg-red-800"
                  onClick={() => retryAction(fetchAlerts)}
                >
                  再試行
                </Button>
                <button
                  aria-label="エラーを閉じる"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-red-400 backdrop-blur-sm transition-colors hover:bg-white hover:text-red-600"
                  type="button"
                  onClick={clearError}
                >
                  <svg
                    className="h-4 w-4"
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
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {getFilteredAlerts(alerts).length === 0 && !loading ? (
        <div className="py-16 text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-red-100">
            <svg
              className="h-12 w-12 text-orange-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M15 17h5l-5 5V17zM9 17v5l-5-5h5zM21 7.6V7a1 1 0 00-1-1H4a1 1 0 00-1 1v.6l9 6.75L21 7.6z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
              />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">
            {showUnreadOnly
              ? "未読のアラートはありません"
              : alerts.length === 0
                ? "アラートはありません"
                : "条件に一致するアラートはありません"}
          </h3>
          <p className="mx-auto max-w-sm text-sm leading-relaxed text-gray-500">
            {showUnreadOnly
              ? "すべてのアラートは既読済みです。新しい通知があった場合は、こちらに表示されます。"
              : alerts.length === 0
                ? "現在、アラートはありません。システムに何か変化があった場合、こちらに通知が表示されます。"
                : "フィルター条件を変更するか、「全て解除」ボタンで全てのアラートを表示してください。"}
          </p>
          {alerts.length === 0 && !showUnreadOnly && (
            <div className="mt-6 flex items-center justify-center space-x-2 text-xs text-gray-400">
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-400"></div>
              <span>システム正常稼働中</span>
            </div>
          )}
          {alerts.length > 0 && (
            <div className="mt-6">
              <button
                className="rounded-md bg-gradient-to-r from-orange-500 to-red-600 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all hover:from-orange-600 hover:to-red-700 hover:shadow-xl focus:ring-2 focus:ring-orange-300 focus:outline-none"
                onClick={() => {
                  setActiveFilters(new Set());
                  setShowUnreadOnly(false);
                }}
              >
                📋 全てのアラートを表示
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* フィルター機能 - 条件付き表示 */}
          {showFilters && (
            <div className="space-y-4 rounded-lg border border-blue-200 bg-blue-50/30 p-4 transition-all duration-300">
              {/* 全て/未読のみフィルター */}
              <div className="flex items-center justify-center space-x-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                <span className="text-sm font-medium text-gray-700">
                  表示設定:
                </span>
                <div className="flex rounded-lg border border-gray-300 bg-white p-1">
                  <button
                    className={`rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ${
                      !showUnreadOnly
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                    onClick={() => setShowUnreadOnly(false)}
                  >
                    📋 全て表示
                  </button>
                  <button
                    className={`rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ${
                      showUnreadOnly
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                    onClick={() => setShowUnreadOnly(true)}
                  >
                    🔔 未読のみ
                  </button>
                </div>
                <div className="text-xs text-gray-500">
                  {showUnreadOnly
                    ? "未読アラートのみを表示中"
                    : "全てのアラートを表示中"}
                </div>
              </div>

              {/* カテゴリ統計サマリー */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                {[
                  {
                    priority: 1,
                    name: "緊急対応",
                    icon: "🚨",
                    color: "bg-red-50 border-red-200 text-red-700",
                  },
                  {
                    priority: 3,
                    name: "要アクション",
                    icon: "⚡",
                    color: "bg-blue-50 border-blue-200 text-blue-700",
                  },
                  {
                    priority: 4,
                    name: "成果・改善",
                    icon: "✨",
                    color: "bg-green-50 border-green-200 text-green-700",
                  },
                  {
                    priority: 5,
                    name: "情報・分析",
                    icon: "📊",
                    color: "bg-purple-50 border-purple-200 text-purple-700",
                  },
                  {
                    priority: 6,
                    name: "システム",
                    icon: "⚙️",
                    color: "bg-gray-50 border-gray-200 text-gray-700",
                  },
                  {
                    priority: 7,
                    name: "学習・発展",
                    icon: "🎓",
                    color: "bg-sky-50 border-sky-200 text-sky-700",
                  },
                ].map((category) => {
                  // for ofを使ったカテゴリ統計計算
                  let count = 0;
                  let unreadCount = 0;

                  for (const alert of alerts) {
                    const config = getAlertTypeConfig(alert.type);
                    const matchesPriority =
                      category.priority === 1
                        ? config.priority <= 2
                        : config.priority === category.priority;

                    if (matchesPriority) {
                      count++;
                      if (!alert.isRead) {
                        unreadCount++;
                      }
                    }
                  }

                  const isActive = activeFilters.has(category.priority);

                  return (
                    <button
                      key={category.priority}
                      className={`relative rounded-lg border-2 p-3 text-center transition-all duration-300 hover:shadow-md focus:ring-2 focus:ring-blue-300 focus:outline-none ${
                        isActive
                          ? `border-blue-600 bg-blue-50 shadow-lg ring-2 ring-blue-200`
                          : `${category.color} border-gray-300 hover:border-gray-400 hover:shadow-sm`
                      }`}
                      onClick={() => toggleCategoryFilter(category.priority)}
                    >
                      {/* ON/OFF状態インジケーター */}
                      <div className="absolute top-2 right-2">
                        {isActive ? (
                          <div className="flex h-5 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                            <span className="text-xs font-bold">ON</span>
                          </div>
                        ) : (
                          <div className="flex h-5 w-8 items-center justify-center rounded-full bg-gray-300">
                            <span className="text-xs text-gray-600">OFF</span>
                          </div>
                        )}
                      </div>

                      <div className="mb-1 text-lg">{category.icon}</div>
                      <div
                        className={`mb-1 text-xs font-medium ${isActive ? "font-semibold text-blue-800" : ""}`}
                      >
                        {category.name}
                      </div>
                      <div
                        className={`text-sm font-bold ${isActive ? "text-blue-900" : ""}`}
                      >
                        {count}件
                        {unreadCount > 0 && (
                          <span className="ml-1 rounded-full border border-gray-200 bg-white px-1.5 py-0.5 text-xs font-medium text-gray-800 shadow-sm">
                            {unreadCount}未読
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* アクティブフィルターの表示 */}
              {(activeFilters.size > 0 || showUnreadOnly) && (
                <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-blue-800">
                      🔍 アクティブなフィルター:
                    </span>

                    {/* 未読フィルターの表示 */}
                    {showUnreadOnly && (
                      <span className="inline-flex items-center rounded-full border border-blue-300 bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                        <span className="mr-1">🔔</span>
                        未読のみ
                        <button
                          className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                          onClick={() => setShowUnreadOnly(false)}
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {Array.from(activeFilters).map((priority) => {
                      const category = [
                        { priority: 1, name: "緊急対応", icon: "🚨" },
                        { priority: 3, name: "要アクション", icon: "⚡" },
                        { priority: 4, name: "成果・改善", icon: "✨" },
                        { priority: 5, name: "情報・分析", icon: "📊" },
                        { priority: 6, name: "システム", icon: "⚙️" },
                        { priority: 7, name: "学習・発展", icon: "🎓" },
                      ].find((cat) => cat.priority === priority);

                      return category ? (
                        <span
                          key={priority}
                          className="inline-flex items-center rounded-full border border-blue-300 bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
                        >
                          <span className="mr-1">{category.icon}</span>
                          {category.name}
                          <button
                            className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                            onClick={() => toggleCategoryFilter(priority)}
                          >
                            ×
                          </button>
                        </span>
                      ) : null;
                    })}
                    <button
                      className="ml-2 rounded-md bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                      onClick={() => {
                        setActiveFilters(new Set());
                        setShowUnreadOnly(false);
                      }}
                    >
                      全て解除
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* アラート一覧 */}
          <div className="space-y-4">
            {getFilteredAlerts(alerts)
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime(),
              )
              .map((alert) => {
                const typeConfig = getAlertTypeConfig(alert.type);
                const categoryInfo = getAlertCategoryInfo(typeConfig.priority);
                const isUpdating = updating === alert.id;

                return (
                  <div
                    key={alert.id}
                    className={`group relative overflow-hidden rounded-xl border-2 p-6 transition-all duration-300 hover:shadow-lg ${
                      typeConfig.color
                    } ${
                      !alert.isRead
                        ? "transform shadow-md ring-2 ring-blue-300/50 ring-offset-2 hover:scale-[1.02]"
                        : "transform hover:scale-[1.01] hover:shadow-md"
                    } ${isUpdating ? "scale-95 opacity-75" : ""}`}
                  >
                    {/* 左側のアクセント線（優先度に応じて） */}
                    <div
                      className={`absolute top-0 bottom-0 left-0 w-1.5 rounded-r-full ${
                        typeConfig.priority <= 2
                          ? "bg-red-400"
                          : typeConfig.priority <= 3
                            ? "bg-blue-400"
                            : typeConfig.priority <= 4
                              ? "bg-green-400"
                              : typeConfig.priority <= 5
                                ? "bg-purple-400"
                                : "bg-gray-400"
                      }`}
                    />

                    {/* カテゴリヘッダー部分 */}
                    <div className="mb-3 flex items-center justify-between">
                      <div
                        className={`inline-flex items-center rounded-lg border px-3 py-1.5 text-xs font-medium shadow-sm ${categoryInfo.categoryColor}`}
                      >
                        <span className="mr-2 text-sm">
                          {categoryInfo.categoryIcon}
                        </span>
                        <span className="font-semibold">
                          {categoryInfo.category}
                        </span>
                        {!alert.isRead && (
                          <div className="ml-2 flex items-center">
                            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-current opacity-70"></div>
                          </div>
                        )}
                      </div>

                      {/* 時刻表示 */}
                      <div className="text-right">
                        <div className="text-xs font-medium text-gray-500">
                          {new Date(alert.createdAt).toLocaleString("ja-JP", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        {/* 相対時間 */}
                        <div className="mt-1 text-xs text-gray-400">
                          {(() => {
                            const now = new Date();
                            const alertTime = new Date(alert.createdAt);
                            const diffInHours = Math.floor(
                              (now.getTime() - alertTime.getTime()) /
                                (1000 * 60 * 60),
                            );

                            if (diffInHours < 1) return "1時間未満前";
                            if (diffInHours < 24) return `${diffInHours}時間前`;
                            const diffInDays = Math.floor(diffInHours / 24);

                            return `${diffInDays}日前`;
                          })()}
                        </div>
                      </div>
                    </div>

                    {/* メインコンテンツ部分 */}
                    <div className="mb-4 flex items-start space-x-4">
                      {/* アイコン */}
                      <div
                        className={`flex-shrink-0 rounded-lg p-2.5 shadow-sm ${
                          typeConfig.priority <= 2
                            ? "bg-red-100"
                            : typeConfig.priority <= 3
                              ? "bg-blue-100"
                              : typeConfig.priority <= 4
                                ? "bg-green-100"
                                : typeConfig.priority <= 5
                                  ? "bg-purple-100"
                                  : "bg-gray-100"
                        }`}
                      >
                        {typeConfig.icon}
                      </div>

                      {/* テキストコンテンツ */}
                      <div className="min-w-0 flex-1">
                        {/* タイプバッジと未読ステータス */}
                        <div className="mb-3 flex flex-wrap items-center space-x-2">
                          <div
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium shadow-sm ${
                              typeConfig.priority <= 2
                                ? "border border-red-200 bg-red-50 text-red-700"
                                : typeConfig.priority <= 3
                                  ? "border border-blue-200 bg-blue-50 text-blue-700"
                                  : typeConfig.priority <= 4
                                    ? "border border-green-200 bg-green-50 text-green-700"
                                    : typeConfig.priority <= 5
                                      ? "border border-purple-200 bg-purple-50 text-purple-700"
                                      : "border border-gray-200 bg-gray-50 text-gray-700"
                            }`}
                          >
                            {typeConfig.label}
                          </div>

                          {!alert.isRead && (
                            <div className="flex items-center space-x-1 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5">
                              <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500"></div>
                              <span className="text-xs font-medium text-blue-700">
                                未読
                              </span>
                            </div>
                          )}

                          {/* 緊急度インジケーター */}
                          {typeConfig.priority <= 2 && (
                            <div className="flex items-center space-x-1 rounded-full border border-red-200 bg-red-100 px-2.5 py-0.5 shadow-sm">
                              <span className="text-xs">🔥</span>
                              <span className="text-xs font-bold text-red-700">
                                緊急
                              </span>
                            </div>
                          )}

                          {typeConfig.priority === 3 && (
                            <div className="flex items-center space-x-1 rounded-full border border-blue-200 bg-blue-100 px-2.5 py-0.5 shadow-sm">
                              <span className="text-xs">⚡</span>
                              <span className="text-xs font-medium text-blue-700">
                                要対応
                              </span>
                            </div>
                          )}
                        </div>

                        {/* タイトル */}
                        <h4 className="mb-2 text-lg leading-tight font-semibold text-gray-900">
                          {alert.title}
                        </h4>

                        {/* メッセージ */}
                        <p className="mb-3 line-clamp-3 text-sm leading-relaxed text-gray-700">
                          {alert.message}
                        </p>

                        {/* カテゴリ説明 */}
                        <div className="inline-block rounded-md bg-gray-50 px-2 py-1 text-xs text-gray-500 italic">
                          💡 {categoryInfo.description}
                        </div>
                      </div>
                    </div>

                    {/* アクション部分 */}
                    {!alert.isRead && (
                      <div className="flex items-center justify-between border-t border-gray-200/50 pt-4">
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <svg
                            className="h-3 w-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              clipRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.236 4.53L8.93 10.7a.75.75 0 00-1.06 1.061l1.884 1.884a.75.75 0 001.137-.089l4-5.5z"
                              fillRule="evenodd"
                            />
                          </svg>
                          <span>既読にしてアクションを完了</span>
                        </div>

                        <Button
                          className={`font-medium transition-all duration-300 ${
                            isUpdating
                              ? "cursor-not-allowed border border-gray-300 bg-gray-200 text-gray-700"
                              : "bg-green-600 text-white hover:scale-105 hover:bg-green-700 hover:shadow-lg active:scale-95 active:bg-green-800"
                          }`}
                          disabled={isUpdating}
                          onClick={() => markAsRead(alert.id)}
                        >
                          {isUpdating ? (
                            <span className="flex items-center space-x-2">
                              <svg
                                className="h-4 w-4 animate-spin"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  fill="currentColor"
                                />
                              </svg>
                              <span>処理中...</span>
                            </span>
                          ) : (
                            <span className="flex items-center space-x-2">
                              <svg
                                className="h-4 w-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  clipRule="evenodd"
                                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                  fillRule="evenodd"
                                />
                              </svg>
                              <span>既読にする</span>
                            </span>
                          )}
                        </Button>
                      </div>
                    )}

                    {/* 既読の場合の簡潔なフッター */}
                    {alert.isRead && (
                      <div className="border-t border-gray-200/30 pt-3">
                        <div className="flex items-center text-xs text-gray-500">
                          <svg
                            className="mr-1 h-3 w-3 text-green-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              clipRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.236 4.53L8.93 10.7a.75.75 0 00-1.06 1.061l1.884 1.884a.75.75 0 001.137-.089l4-5.5z"
                              fillRule="evenodd"
                            />
                          </svg>
                          既読済み
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
