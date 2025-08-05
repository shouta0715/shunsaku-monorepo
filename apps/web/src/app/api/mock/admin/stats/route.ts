import { NextRequest, NextResponse } from "next/server";
import { mockSystemStats } from "@/lib/mock-data";
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

    // システム統計データを返す
    return NextResponse.json({
      success: true,
      data: mockSystemStats,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Admin stats API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "システム統計の取得に失敗しました",
        },
      },
      { status: 500 },
    );
  }
}
