"use client";

import { Badge } from "@package/ui";
import { useEffect, useState } from "react";

export function AlertBadge() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await fetch("/api/mock/alerts?unread_only=true");
        const result = await response.json();

        if (result.success) {
          setUnreadCount(result.data.length);
        }
      } catch {
        // Silently handle error
      } finally {
        setLoading(false);
      }
    };

    void fetchUnreadCount();

    // 30秒ごとに更新
    const interval = setInterval(fetchUnreadCount, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading || unreadCount === 0) {
    return null;
  }

  return <Badge color="red">{unreadCount > 99 ? "99+" : unreadCount}</Badge>;
}
