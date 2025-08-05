import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/mock-auth";
import { mockDailyScores, mockSurveys, mockUsers } from "@/lib/mock-data";

// リスクレベル計算
const calculateRiskLevel = (score: number): "low" | "medium" | "high" => {
  if (score >= 4.0) return "low";
  if (score >= 2.5) return "medium";

  return "high";
};

// 回答率計算（過去30日）
const calculateResponseRate = (userId: string): number => {
  const userSurveys = mockSurveys.filter((s) => s.userId === userId);
  const totalDays = 30;
  const responseDays = userSurveys.length;

  return Math.round((responseDays / totalDays) * 100);
};

// 最終回答日取得
const getLastResponseDate = (userId: string): string => {
  const userSurveys = mockSurveys
    .filter((s) => s.userId === userId)
    .sort(
      (a, b) =>
        new Date(b.surveyDate).getTime() - new Date(a.surveyDate).getTime(),
    );

  return (
    userSurveys[0]?.surveyDate || new Date().toISOString().split("T")[0] || ""
  );
};

// マネージャーメモ取得
const getManagerNotes = (
  userId: string,
  riskLevel: string,
): string | undefined => {
  const notesMap: Record<string, string> = {
    "1": "最近のプロジェクト負荷が高い",
    "2": "チーム内でのコミュニケーションに改善が必要",
    "3": "長期間低スコアが続いている",
  };

  if (riskLevel === "high") {
    return notesMap[userId] || "要注意状態が継続している";
  }

  return undefined;
};

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const department = searchParams.get("department");
    const riskLevel = searchParams.get("risk_level");

    // mockUsersを基にチームメンバーデータを生成
    let teamMembers = mockUsers
      .filter((user) => user.isActive)
      .map((user) => {
        // 最新スコアを取得
        const userScores = mockDailyScores
          .filter((score) => score.userId === user.id)
          .sort(
            (a, b) =>
              new Date(b.scoreDate).getTime() - new Date(a.scoreDate).getTime(),
          );

        const latestScore = userScores[0];
        const score = latestScore?.totalScore || 3.0;
        const calculatedRiskLevel = calculateRiskLevel(score);

        return {
          id: user.id,
          name: user.name,
          department: user.department,
          role: user.position,
          riskLevel: calculatedRiskLevel,
          score: Math.round(score * 10) / 10,
          lastResponseDate: getLastResponseDate(user.id),
          responseRate: calculateResponseRate(user.id),
          managerNotes: getManagerNotes(user.id, calculatedRiskLevel),
        };
      });

    // フィルタリング
    if (department && department !== "all") {
      teamMembers = teamMembers.filter(
        (member) => member.department === department,
      );
    }

    if (riskLevel && riskLevel !== "all") {
      teamMembers = teamMembers.filter(
        (member) => member.riskLevel === riskLevel,
      );
    }

    return NextResponse.json({
      success: true,
      data: teamMembers,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "チームメンバーの取得に失敗しました",
      },
      { status: 500 },
    );
  }
}
