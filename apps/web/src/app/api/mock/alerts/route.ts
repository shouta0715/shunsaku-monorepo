import { NextRequest, NextResponse } from "next/server";

import { mockAlerts } from "@/lib/mock-data";
import { authenticateUser } from "@/lib/server-auth";

export async function GET(request: NextRequest) {
  try {
    const { user, isAuthenticated } = authenticateUser(request);

    if (!isAuthenticated || !user) {
      return NextResponse.json(
        {
          success: false,
          error: "認証が必要です",
        },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get("limit")) || 50, 100);
    const unreadOnly = searchParams.get("unread_only") === "true";

    // for ofを使ったアラートフィルタリングとソート
    const userAlerts: typeof mockAlerts = [];

    // 1. for ofでユーザーのアラートを抽出
    for (const alert of mockAlerts) {
      if (alert.userId === user.id) {
        // 未読のみの場合は条件チェック
        if (!unreadOnly || !alert.isRead) {
          userAlerts.push(alert);
        }
      }
    }

    // 2. for ofを使った手動ソート（作成日時降順）
    const sortedAlerts: typeof mockAlerts = [];

    for (const alert of userAlerts) {
      let insertIndex = 0;

      // 適切な挿入位置を for of で検索
      for (const [index, sortedAlert] of sortedAlerts.entries()) {
        const alertTime = new Date(alert.createdAt).getTime();
        const sortedTime = new Date(sortedAlert.createdAt).getTime();

        if (alertTime > sortedTime) {
          // より新しい場合はこの位置に挿入
          insertIndex = index;
          break;
        }
        insertIndex = index + 1;
      }

      sortedAlerts.splice(insertIndex, 0, alert);
    }

    // 3. limit制限を for of で適用
    const alerts: typeof mockAlerts = [];
    let count = 0;

    for (const alert of sortedAlerts) {
      if (count >= limit) break;
      alerts.push(alert);
      count++;
    }

    return NextResponse.json({
      success: true,
      data: alerts,
      meta: {
        total: alerts.length,
        unreadOnly,
        userId: user.id,
        processedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    // 開発環境でのみログ出力
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.error("Mock Alerts API error:", error);
    }

    return NextResponse.json(
      {
        success: false,
        error: "アラートの取得に失敗しました",
      },
      { status: 500 },
    );
  }
}
