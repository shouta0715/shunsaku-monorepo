import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const systemSettings = {
      surveyDeadline: "18:00",
      reminderEnabled: true,
      alertThreshold: 2.5,
      dataRetentionDays: 365,
    };

    return NextResponse.json({
      success: true,
      data: systemSettings,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "システム設定の取得に失敗しました",
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // 設定の検証
    const {
      surveyDeadline,
      reminderEnabled,
      alertThreshold,
      dataRetentionDays,
    } = body;

    if (
      !surveyDeadline ||
      typeof reminderEnabled !== "boolean" ||
      typeof alertThreshold !== "number" ||
      typeof dataRetentionDays !== "number"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "無効な設定データです",
        },
        { status: 400 },
      );
    }

    // モックの成功レスポンス
    return NextResponse.json({
      success: true,
      message: "設定を更新しました",
      data: body,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "設定の更新に失敗しました",
      },
      { status: 500 },
    );
  }
}
