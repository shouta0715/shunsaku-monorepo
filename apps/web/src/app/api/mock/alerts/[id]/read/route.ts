import { NextRequest, NextResponse } from "next/server";

import {
  findUserAlert,
  mockAlerts,
  updateAlertReadStatus,
} from "@/lib/mock-data";
import { authenticateUser } from "@/lib/server-auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
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

    const { id } = await params;

    // 基本的なパラメータ検証
    if (!id || typeof id !== "string" || id.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "無効なアラートIDです",
        },
        { status: 400 },
      );
    }

    // アラートの存在確認
    const findResult = findUserAlert(id, user.id);
    if (!findResult.success || !findResult.alert) {
      return NextResponse.json(
        {
          success: false,
          error: "指定されたアラートが見つかりません",
        },
        { status: 404 },
      );
    }

    // 既に既読の場合
    if (findResult.alert.isRead) {
      return NextResponse.json({
        success: true,
        message: "アラートは既に既読です",
        data: {
          alertId: id,
          alreadyRead: true,
        },
        meta: {
          processedAt: new Date().toISOString(),
        },
      });
    }

    // for ofを使った更新前の関連統計情報取得
    let totalUserAlerts = 0;
    let remainingUnreadCount = 0;
    const recentAlerts: {
      id: string;
      type: string;
      isRead: boolean;
      createdAt: string;
    }[] = [];

    for (const alert of mockAlerts) {
      if (alert.userId === user.id) {
        totalUserAlerts++;

        // 対象アラート以外の未読数をカウント
        if (!alert.isRead && alert.id !== id) {
          remainingUnreadCount++;
        }

        // 最新のアラートを記録（作成日時順）
        recentAlerts.push({
          id: alert.id,
          type: alert.type,
          isRead: alert.isRead,
          createdAt: alert.createdAt,
        });
      }
    }

    // for ofを使った作成日時順ソート（降順）
    const sortedRecentAlerts: typeof recentAlerts = [];

    for (const alert of recentAlerts) {
      let insertIndex = 0;

      for (const [index, sortedAlert] of sortedRecentAlerts.entries()) {
        const alertTime = new Date(alert.createdAt).getTime();
        const sortedTime = new Date(sortedAlert.createdAt).getTime();

        if (alertTime > sortedTime) {
          insertIndex = index;
          break;
        }
        insertIndex = index + 1;
      }

      sortedRecentAlerts.splice(insertIndex, 0, alert);
    }

    // アラートを既読状態に更新
    const updateResult = updateAlertReadStatus(id, user.id, true);

    if (!updateResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: updateResult.error || "アラートの更新に失敗しました",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "アラートを既読にしました",
      data: {
        alertId: id,
        updatedAt: new Date().toISOString(),
        alertDetails: findResult.alert,
      },
      meta: {
        processedAt: new Date().toISOString(),
        userStats: {
          totalAlerts: totalUserAlerts,
          remainingUnreadCount: remainingUnreadCount,
          recentAlerts: sortedRecentAlerts.slice(0, 3), // 最新3件
        },
      },
    });
  } catch (error) {
    // 開発環境でのみログ出力
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.error("Mock Alert read API error:", error);
    }

    return NextResponse.json(
      {
        success: false,
        error: "アラートの更新中に予期しないエラーが発生しました",
      },
      { status: 500 },
    );
  }
}
