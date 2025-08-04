"use client";

import { Alert, Badge, Button } from "@package/ui";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  LoadingSpinner,
} from "@/components/ui";

type AlertItem = {
  id: string;
  type: "high_risk" | "score_drop" | "no_response" | "system";
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  targetUserId?: string;
};

type AlertListProps = {
  unreadOnly?: boolean;
};

export function AlertList({ unreadOnly = false }: AlertListProps) {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (unreadOnly) params.set("unread_only", "true");

        const response = await fetch(`/api/mock/alerts?${params}`);
        const result = await response.json();

        if (result.success) {
          setAlerts(result.data);
        } else {
          setError(result.error || "アラートの取得に失敗しました");
        }
      } catch {
        setError("アラートの取得中にエラーが発生しました");
      } finally {
        setLoading(false);
      }
    };

    void fetchAlerts();
  }, [unreadOnly]);

  const markAsRead = async (alertId: string) => {
    try {
      const response = await fetch(`/api/alerts/${alertId}/read`, {
        method: "POST",
      });

      if (response.ok) {
        setAlerts((prev) =>
          prev.map((alert) =>
            alert.id === alertId ? { ...alert, isRead: true } : alert,
          ),
        );
      }
    } catch {
      // Silently handle error
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch("/api/alerts/read-all", {
        method: "POST",
      });

      if (response.ok) {
        setAlerts((prev) => prev.map((alert) => ({ ...alert, isRead: true })));
      }
    } catch {
      // Silently handle error
    }
  };

  const getAlertTypeConfig = (type: AlertItem["type"]) => {
    const config = {
      high_risk: {
        label: "高リスク",
        badgeColor: "red" as const,
        color: "bg-red-50 border-red-200",
      },
      score_drop: {
        label: "スコア低下",
        badgeColor: "orange" as const,
        color: "bg-yellow-50 border-yellow-200",
      },
      no_response: {
        label: "未回答",
        badgeColor: "blue" as const,
        color: "bg-blue-50 border-blue-200",
      },
      system: {
        label: "システム",
        badgeColor: "zinc" as const,
        color: "bg-gray-50 border-gray-200",
      },
    };

    return config[type];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            {unreadOnly ? "未読アラート" : "アラート"} ({alerts.length})
          </CardTitle>
          {alerts.some((alert) => !alert.isRead) && (
            <Button outline onClick={markAllAsRead}>
              全て既読にする
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert
            className="mb-4"
            open={Boolean(error)}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {alerts.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            {unreadOnly ? "未読のアラートはありません" : "アラートはありません"}
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => {
              const typeConfig = getAlertTypeConfig(alert.type);

              return (
                <div
                  key={alert.id}
                  className={`rounded-lg border p-4 ${typeConfig.color} ${
                    !alert.isRead ? "ring-2 ring-blue-200" : ""
                  }`}
                >
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge color={typeConfig.badgeColor}>
                        {typeConfig.label}
                      </Badge>
                      {!alert.isRead && <Badge color="zinc">未読</Badge>}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(alert.createdAt).toLocaleString("ja-JP")}
                    </div>
                  </div>

                  <h4 className="mb-1 font-medium text-gray-900">
                    {alert.title}
                  </h4>

                  <p className="mb-3 text-sm text-gray-600">{alert.message}</p>

                  {!alert.isRead && (
                    <Button outline onClick={() => markAsRead(alert.id)}>
                      既読にする
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
