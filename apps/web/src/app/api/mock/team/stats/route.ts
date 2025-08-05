import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/mock-auth";

export async function GET() {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          error: "認証が必要です",
        },
        { status: 401 },
      );
    }

    // チーム管理権限チェック
    if (!["manager", "hr", "admin"].includes(currentUser.role)) {
      return NextResponse.json(
        {
          success: false,
          error: "アクセス権限がありません",
        },
        { status: 403 },
      );
    }

    // チーム統計データ
    const teamStats = {
      totalMembers: 8,
      highRisk: 2,
      mediumRisk: 3,
      lowRisk: 3,
      averageResponseRate: 91,
      departmentBreakdown: [
        {
          department: "開発部",
          memberCount: 3,
          averageScore: 3.0,
          riskDistribution: { high: 1, medium: 2, low: 0 },
        },
        {
          department: "営業部",
          memberCount: 2,
          averageScore: 4.15,
          riskDistribution: { high: 0, medium: 0, low: 2 },
        },
        {
          department: "人事部",
          memberCount: 1,
          averageScore: 4.5,
          riskDistribution: { high: 0, medium: 0, low: 1 },
        },
        {
          department: "総務部",
          memberCount: 1,
          averageScore: 2.1,
          riskDistribution: { high: 1, medium: 0, low: 0 },
        },
        {
          department: "マーケティング部",
          memberCount: 1,
          averageScore: 3.4,
          riskDistribution: { high: 0, medium: 1, low: 0 },
        },
      ],
    };

    return NextResponse.json({
      success: true,
      data: teamStats,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "チーム統計の取得に失敗しました",
      },
      { status: 500 },
    );
  }
}
