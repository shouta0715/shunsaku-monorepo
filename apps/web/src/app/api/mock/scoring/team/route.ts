import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/mock-auth";
import { mockDailyScores, mockUsers, getTeamMembers } from "@/lib/mock-data";

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

    let members: typeof mockUsers = [];

    // ロールに基づいてメンバーを取得
    if (currentUser.role === "manager") {
      members = getTeamMembers(currentUser.id);
    } else if (currentUser.role === "hr" || currentUser.role === "admin") {
      members = mockUsers.filter((u) => u.isActive);
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "アクセス権限がありません",
        },
        { status: 403 },
      );
    }

    // 各メンバーの最新スコアを取得
    const membersWithScores = members.map((member) => {
      const memberScores = mockDailyScores
        .filter((score) => score.userId === member.id)
        .sort(
          (a, b) =>
            new Date(b.scoreDate).getTime() - new Date(a.scoreDate).getTime(),
        );

      const latestScore = memberScores[0];

      return {
        id: member.id,
        name: member.name,
        department: member.department,
        riskLevel: latestScore?.riskLevel || "medium",
        score: latestScore?.totalScore || 0,
        lastUpdateDate:
          latestScore?.scoreDate || new Date().toISOString().split("T")[0],
      };
    });

    // リスク分布を計算
    const distribution = {
      totalMembers: membersWithScores.length,
      highRisk: membersWithScores.filter((m) => m.riskLevel === "high").length,
      mediumRisk: membersWithScores.filter((m) => m.riskLevel === "medium")
        .length,
      lowRisk: membersWithScores.filter((m) => m.riskLevel === "low").length,
      members: membersWithScores,
    };

    return NextResponse.json({
      success: true,
      data: distribution,
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
