import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "@/lib/server-auth";

export async function GET(request: NextRequest) {
  try {
    // 管理者権限チェック
    const authResult = authenticateUser(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "認証が必要です",
          },
        },
        { status: 401 },
      );
    }

    // 管理者・HR権限チェック
    if (!["admin", "hr"].includes(authResult.user.role)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "FORBIDDEN",
            message: "管理者権限が必要です",
          },
        },
        { status: 403 },
      );
    }

    // モックログデータを生成
    const mockLogs = [];
    const currentDate = new Date();

    // for ofループを使って過去7日分のログを生成
    for (let i = 0; i < 7; i++) {
      const logDate = new Date(currentDate);
      logDate.setDate(logDate.getDate() - i);

      const dailyLogs = [
        {
          timestamp: logDate.toISOString(),
          level: "INFO",
          category: "AUTH",
          message: "ユーザーログイン成功",
          userId: "1",
          details: { ip: "192.168.1.100" },
        },
        {
          timestamp: logDate.toISOString(),
          level: "INFO",
          category: "SURVEY",
          message: "アンケート回答完了",
          userId: "2",
          details: { surveyId: "daily-survey" },
        },
        {
          timestamp: logDate.toISOString(),
          level: "WARNING",
          category: "ALERT",
          message: "高リスクユーザー検出",
          userId: "3",
          details: { score: 2.1, threshold: 2.5 },
        },
        {
          timestamp: logDate.toISOString(),
          level: "INFO",
          category: "SYSTEM",
          message: "定期バックアップ完了",
          userId: null,
          details: { backup_size: "2.3GB" },
        },
      ];

      for (const log of dailyLogs) {
        mockLogs.push(log);
      }
    }

    // CSVフォーマットでログを生成
    let csvContent = "Timestamp,Level,Category,Message,UserID,Details\n";

    for (const log of mockLogs) {
      const details = log.details
        ? JSON.stringify(log.details).replace(/"/g, '""')
        : "";
      csvContent += `"${log.timestamp}","${log.level}","${log.category}","${log.message}","${log.userId || ""}","${details}"\n`;
    }

    // CSVファイルとしてレスポンス
    const headers = new Headers();
    headers.set("Content-Type", "text/csv; charset=utf-8");
    headers.set(
      "Content-Disposition",
      `attachment; filename="system-logs-${currentDate.toISOString().split("T")[0]}.csv"`,
    );

    return new Response(csvContent, {
      status: 200,
      headers: headers,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Admin logs API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "ログのエクスポートに失敗しました",
        },
      },
      { status: 500 },
    );
  }
}
