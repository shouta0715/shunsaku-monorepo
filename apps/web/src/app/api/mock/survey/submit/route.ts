import { NextRequest, NextResponse } from "next/server";
import {
  CustomError,
  createErrorResponse,
  handleApiError,
  validateArrayType,
  validateRequired,
  validateType,
} from "@/lib/error-utils";
import { mockQuestions, mockUsers } from "@/lib/mock-data";

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID();

  try {
    // リクエストヘッダーからユーザーIDを取得
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      throw new CustomError(
        "AUTHENTICATION_REQUIRED",
        "ユーザーIDが指定されていません",
        "Missing x-user-id header",
        requestId,
      );
    }

    const currentUser = mockUsers.find((u) => u.id === userId);
    if (!currentUser) {
      throw new CustomError(
        "AUTHENTICATION_REQUIRED",
        "無効なユーザーIDです",
        `User ID ${userId} not found`,
        requestId,
      );
    }

    // リクエストボディの解析
    let requestBody;
    try {
      requestBody = await request.json();
    } catch (parseError) {
      throw new CustomError(
        "VALIDATION_ERROR",
        "リクエストの形式が正しくありません",
        `JSON parsing failed: ${parseError}`,
        requestId,
      );
    }

    const { responses } = requestBody;

    // バリデーション
    validateRequired(responses, "回答データ");
    validateArrayType(responses, "回答データ");

    if (responses.length === 0) {
      throw new CustomError(
        "VALIDATION_ERROR",
        "回答が空です",
        "Empty responses array",
        requestId,
      );
    }

    if (responses.length !== mockQuestions.length) {
      throw new CustomError(
        "VALIDATION_ERROR",
        `${mockQuestions.length}つの質問に対する回答が必要です`,
        `Expected ${mockQuestions.length} responses, got ${responses.length}`,
        requestId,
      );
    }

    // 各回答のバリデーション
    for (let i = 0; i < responses.length; i++) {
      const response = responses[i];

      validateRequired(response.questionId, `回答${i + 1}の質問ID`);
      validateType(response.questionId, "string", `回答${i + 1}の質問ID`);
      validateRequired(response.score, `回答${i + 1}のスコア`);
      validateType(response.score, "number", `回答${i + 1}のスコア`);

      // 質問IDの存在確認
      const question = mockQuestions.find((q) => q.id === response.questionId);
      if (!question) {
        throw new CustomError(
          "VALIDATION_ERROR",
          `無効な質問ID: ${response.questionId}`,
          `Question ID ${response.questionId} not found`,
          requestId,
        );
      }

      // スコア範囲の確認
      if (response.score < 1 || response.score > 5) {
        throw new CustomError(
          "VALIDATION_ERROR",
          `スコアは1から5の範囲で入力してください (回答${i + 1})`,
          `Score ${response.score} is out of range (1-5)`,
          requestId,
        );
      }
    }

    // 重複チェック（同日の回答があるかどうか）
    const today = new Date().toISOString().split("T")[0] || "";

    // スコアを計算
    let totalWeightedScore = 0;
    let totalWeight = 0;

    try {
      for (const response of responses) {
        const question = mockQuestions.find(
          (q) => q.id === response.questionId,
        );
        if (!question) {
          throw new CustomError(
            "VALIDATION_ERROR",
            `質問が見つかりません: ${response.questionId}`,
            `Question ${response.questionId} not found during calculation`,
            requestId,
          );
        }

        totalWeightedScore += response.score * question.weight;
        totalWeight += question.weight;
      }

      if (totalWeight === 0) {
        throw new CustomError(
          "SERVER_ERROR",
          "重み付けの計算でエラーが発生しました",
          "Total weight is zero",
          requestId,
        );
      }
    } catch (calcError) {
      if (calcError instanceof CustomError) {
        throw calcError;
      }
      throw new CustomError(
        "SERVER_ERROR",
        "スコア計算中にエラーが発生しました",
        `Score calculation failed: ${calcError}`,
        requestId,
      );
    }

    const averageScore = totalWeightedScore / totalWeight;

    // サーベイデータを作成
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
      meta: {
        requestId,
        processedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    const customError = handleApiError(error, "Survey Submit API");

    if (customError.code === "AUTHENTICATION_REQUIRED") {
      return NextResponse.json(createErrorResponse(customError), {
        status: 401,
      });
    }

    if (customError.code === "VALIDATION_ERROR") {
      return NextResponse.json(createErrorResponse(customError), {
        status: 400,
      });
    }

    if (customError.code === "ACCESS_DENIED") {
      return NextResponse.json(createErrorResponse(customError), {
        status: 403,
      });
    }

    return NextResponse.json(createErrorResponse(customError), { status: 500 });
  }
}
