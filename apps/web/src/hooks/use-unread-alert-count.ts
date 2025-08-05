"use client";

import { useCallback, useEffect, useState } from "react";

export function useUnreadAlertCount() {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUnreadCount = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const currentUserId = localStorage.getItem("currentUserId");
      if (!currentUserId) {
        setUnreadCount(0);

        return;
      }

      const response = await fetch("/api/mock/alerts", {
        headers: {
          "x-user-id": currentUserId,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        // for ofループを使って未読アラート数をカウント
        let count = 0;
        for (const alert of data.data) {
          if (!alert.isRead) {
            count++;
          }
        }
        setUnreadCount(count);
      } else {
        setUnreadCount(0);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("未読アラート数の取得に失敗:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchUnreadCount();
  }, [fetchUnreadCount]);

  // アラートの状態が変更された時に再取得する関数
  const refetch = useCallback(() => {
    void fetchUnreadCount();
  }, [fetchUnreadCount]);

  return {
    unreadCount,
    loading,
    error,
    refetch,
  };
}
