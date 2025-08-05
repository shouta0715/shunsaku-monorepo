import { NextRequest, NextResponse } from "next/server";

import { mockAlerts, updateAllUserAlertsReadStatus } from "@/lib/mock-data";
import { authenticateUser } from "@/lib/server-auth";

export async function POST(request: NextRequest) {
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

    // for ofを使った処理前統計の取得
    let totalUserAlerts = 0;
    let unreadAlertsCount = 0;
    const alertsByCreatedDate: {
      id: string;
      createdAt: string;
      type: string;
    }[] = [];

    for (const alert of mockAlerts) {
      if (alert.userId === user.id) {
        totalUserAlerts++;
        if (!alert.isRead) {
          unreadAlertsCount++;
          // 未読アラートを作成日時順で記録
          alertsByCreatedDate.push({
            id: alert.id,
            createdAt: alert.createdAt,
            type: alert.type,
          });
        }
      }
    }

    // for ofを使った作成日時順ソート（降順）
    const sortedUnreadAlerts: typeof alertsByCreatedDate = [];

    for (const alert of alertsByCreatedDate) {
      let insertIndex = 0;

      for (const [index, sortedAlert] of sortedUnreadAlerts.entries()) {
        const alertTime = new Date(alert.createdAt).getTime();
        const sortedTime = new Date(sortedAlert.createdAt).getTime();

        if (alertTime > sortedTime) {
          insertIndex = index;
          break;
        }
        insertIndex = index + 1;
      }

      sortedUnreadAlerts.splice(insertIndex, 0, alert);
    }

    // Mock操作関数を使用してアラートを一括既読にする
    const result = updateAllUserAlertsReadStatus(user.id, true);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "一括更新に失敗しました",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: `${result.updatedCount}件のアラートを既読にしました`,
      updatedCount: result.updatedCount,
      meta: {
        processedAt: new Date().toISOString(),
        beforeUpdate: {
          totalAlerts: totalUserAlerts,
          unreadAlerts: unreadAlertsCount,
          latestUnreadAlerts: sortedUnreadAlerts.slice(0, 5), // 最新5件
        },
      },
    });
  } catch (error) {
    // 開発環境でのみログ出力
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.error("Mock Alert read-all API error:", error);
    }

    return NextResponse.json(
      {
        success: false,
        error: "アラートの一括更新中に予期しないエラーが発生しました",
      },
      { status: 500 },
    );
  }
}
