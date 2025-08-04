import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserAlerts } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get("limit")) || 50, 100);
    const unreadOnly = searchParams.get("unread_only") === "true";

    let alerts = getCurrentUserAlerts();

    if (unreadOnly) {
      alerts = alerts.filter((alert) => !alert.isRead);
    }

    // 作成日時でソート（新しい順）
    alerts = alerts
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, limit);

    return NextResponse.json({
      success: true,
      data: alerts,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "アラートの取得に失敗しました",
      },
      { status: 500 },
    );
  }
}
