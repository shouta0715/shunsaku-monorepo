import { NextResponse } from "next/server";
import { getCurrentUserScores } from "@/lib/mock-data";

export async function GET() {
  try {
    const userScores = getCurrentUserScores().sort(
      (a, b) =>
        new Date(b.scoreDate).getTime() - new Date(a.scoreDate).getTime(),
    );

    const latestScore = userScores[0];

    if (!latestScore) {
      return NextResponse.json({
        success: true,
        data: null,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        riskLevel: latestScore.riskLevel,
        score: latestScore.totalScore,
        date: latestScore.scoreDate,
      },
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "現在のリスクレベルの取得に失敗しました",
      },
      { status: 500 },
    );
  }
}
