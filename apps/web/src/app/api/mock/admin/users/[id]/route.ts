import { NextRequest, NextResponse } from "next/server";
import { deleteUser, mockUsers, updateUser } from "@/lib/mock-data";
import { authenticateUser } from "@/lib/server-auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
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

    const { id: userId } = await params;

    // ユーザー検索
    let foundUser = null;
    for (const user of mockUsers) {
      if (user.id === userId) {
        foundUser = user;
        break;
      }
    }

    if (!foundUser) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "USER_NOT_FOUND",
            message: "ユーザーが見つかりません",
          },
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: foundUser,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Admin user GET API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "ユーザー情報の取得に失敗しました",
        },
      },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
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

    const { id: userId } = await params;
    const body = await request.json();

    // バリデーション
    const allowedFields = [
      "email",
      "name",
      "department",
      "position",
      "managerId",
      "role",
      "isActive",
    ];
    const updateData: Record<string, unknown> = {};

    for (const key of Object.keys(body)) {
      if (allowedFields.includes(key)) {
        updateData[key] = body[key];
      }
    }

    // メールアドレスの重複チェック（自分以外）
    if (updateData.email) {
      let emailExists = false;
      for (const user of mockUsers) {
        if (user.email === updateData.email && user.id !== userId) {
          emailExists = true;
          break;
        }
      }

      if (emailExists) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "VALIDATION_ERROR",
              message: "このメールアドレスは既に使用されています",
            },
          },
          { status: 400 },
        );
      }
    }

    // ロールのバリデーション
    if (
      updateData.role &&
      !["employee", "manager", "hr", "admin"].includes(
        updateData.role as string,
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "無効なロールです",
          },
        },
        { status: 400 },
      );
    }

    const result = updateUser(userId, updateData);
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
      message: "ユーザー情報を更新しました",
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Admin user PUT API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "ユーザー情報の更新に失敗しました",
        },
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
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

    const { id: userId } = await params;

    // 自分自身は削除できない
    if (authResult.user.id === userId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "自分自身のアカウントは削除できません",
          },
        },
        { status: 400 },
      );
    }

    const result = deleteUser(userId);
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "DELETE_FAILED",
            message: result.error,
          },
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      message: "ユーザーを削除しました",
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Admin user DELETE API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "ユーザーの削除に失敗しました",
        },
      },
      { status: 500 },
    );
  }
}
