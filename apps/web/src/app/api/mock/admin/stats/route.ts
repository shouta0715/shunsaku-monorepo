import { NextResponse } from "next/server";

export async function GET() {
  try {
    const systemStats = {
      totalUsers: 77,
      activeUsers: 73,
      totalSurveys: 1540,
      responseRate: 94.8,
      systemHealth: "healthy",
    };

    return NextResponse.json({
      success: true,
      data: systemStats,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "システム統計の取得に失敗しました",
      },
      { status: 500 },
    );
  }
}
