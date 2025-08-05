import { NextRequest, NextResponse } from "next/server";
import { mockQuestions, mockUsers } from "@/lib/mock-data";

export async function POST(request: NextRequest) {
  try {
    // リクエストヘッダーからユーザーIDを取得（フロントエンドから送信）
    const userId = request.headers.get("x-user-id");
    const currentUser = userId ? mockUsers.find((u) => u.id === userId) : null;

    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          error: "認証が必要です",
        },
        { status: 401 },
      );
    }

    const { responses } = await request.json();

    if (!responses || !Array.isArray(responses)) {
      return NextResponse.json(
        {
          success: false,
          error: "回答データが無効です",
        },
        { status: 400 },
      );
    }

    // スコアを計算
    const totalWeightedScore = responses.reduce((sum, response) => {
      const question = mockQuestions.find((q) => q.id === response.questionId);

      return sum + response.score * (question?.weight || 1);
    }, 0);
    const totalWeight = mockQuestions.reduce((sum, q) => sum + q.weight, 0);
    const averageScore = totalWeightedScore / totalWeight;

    const today = new Date().toISOString().split("T")[0] || "";

    // サンプルのサーベイデータを返す
    const surveyData = {
      id: `${currentUser.id}-${today}`,
      userId: currentUser.id,
      surveyDate: today,
      totalScore: Math.round(averageScore * 10) / 10,
      submittedAt: new Date().toISOString(),
      responses,
    };

    return NextResponse.json({
      success: true,
      data: surveyData,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "アンケートの送信に失敗しました",
      },
      { status: 500 },
    );
  }
}
