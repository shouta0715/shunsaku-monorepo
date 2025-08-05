import { NextRequest, NextResponse } from "next/server";
import {
  mockSystemSettings,
  resetSystemSettings,
  updateSystemSettings,
} from "@/lib/mock-data";
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

    // システム設定データを返す
    return NextResponse.json({
      success: true,
      data: mockSystemSettings,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Admin settings GET API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "システム設定の取得に失敗しました",
        },
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { action, settings } = body;

    if (action === "reset") {
      // 設定をリセット
      const result = resetSystemSettings();
      if (!result.success) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "RESET_FAILED",
              message: result.error,
            },
          },
          { status: 500 },
        );
      }

      return NextResponse.json({
        success: true,
        data: result.data,
        message: "設定をリセットしました",
      });
    } else {
      // 設定を更新
      if (!settings) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "VALIDATION_ERROR",
              message: "設定データが必要です",
            },
          },
          { status: 400 },
        );
      }

      // バリデーション
      const validatedSettings: Partial<typeof mockSystemSettings> = {};

      if (settings.surveyDeadline !== undefined) {
        // 時刻形式のバリデーション (HH:MM)
        if (
          !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(settings.surveyDeadline)
        ) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: "VALIDATION_ERROR",
                message: "アンケート締切時刻の形式が正しくありません (HH:MM)",
              },
            },
            { status: 400 },
          );
        }
        validatedSettings.surveyDeadline = settings.surveyDeadline;
      }

      if (settings.reminderEnabled !== undefined) {
        if (typeof settings.reminderEnabled !== "boolean") {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: "VALIDATION_ERROR",
                message: "リマインダー設定はtrue/falseで指定してください",
              },
            },
            { status: 400 },
          );
        }
        validatedSettings.reminderEnabled = settings.reminderEnabled;
      }

      if (settings.alertThreshold !== undefined) {
        const threshold = Number(settings.alertThreshold);
        if (isNaN(threshold) || threshold < 1 || threshold > 5) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: "VALIDATION_ERROR",
                message: "アラート閾値は1.0〜5.0の範囲で入力してください",
              },
            },
            { status: 400 },
          );
        }
        validatedSettings.alertThreshold = threshold;
      }

      if (settings.dataRetentionDays !== undefined) {
        const days = Number(settings.dataRetentionDays);
        if (isNaN(days) || days < 30 || days > 3650) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: "VALIDATION_ERROR",
                message: "データ保持期間は30〜3650日の範囲で入力してください",
              },
            },
            { status: 400 },
          );
        }
        validatedSettings.dataRetentionDays = days;
      }

      const result = updateSystemSettings(validatedSettings);
      if (!result.success) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "UPDATE_FAILED",
              message: result.error,
            },
          },
          { status: 500 },
        );
      }

      return NextResponse.json({
        success: true,
        data: result.data,
        message: "設定を保存しました",
      });
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Admin settings POST API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "システム設定の更新に失敗しました",
        },
      },
      { status: 500 },
    );
  }
}
