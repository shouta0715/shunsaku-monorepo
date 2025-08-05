import { NextRequest, NextResponse } from "next/server";
import { addUser, mockUsers } from "@/lib/mock-data";
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

    // for ofループを使ってユーザーリストを処理
    const userList = [];
    for (const user of mockUsers) {
      userList.push({
        ...user,
        // パスワード等の機密情報は除外
      });
    }

    return NextResponse.json({
      success: true,
      data: userList,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Admin users GET API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "ユーザー一覧の取得に失敗しました",
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

    // バリデーション
    const { email, name, department, position, managerId, role, hireDate } =
      body;

    if (!email || !name || !department || !position || !role || !hireDate) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "必須フィールドが不足しています",
          },
        },
        { status: 400 },
      );
    }

    // メールアドレスの重複チェック
    let emailExists = false;
    for (const user of mockUsers) {
      if (user.email === email) {
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

    // ロールのバリデーション
    if (!["employee", "manager", "hr", "admin"].includes(role)) {
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

    // ユーザー追加
    const userData = {
      email,
      name,
      department,
      position,
      managerId: managerId || null,
      role: role as "employee" | "manager" | "hr" | "admin",
      hireDate,
      isActive: true,
    };

    const result = addUser(userData);
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "CREATE_FAILED",
            message: result.error,
          },
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: result.data,
        message: "ユーザーを追加しました",
      },
      { status: 201 },
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Admin users POST API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "ユーザーの追加に失敗しました",
        },
      },
      { status: 500 },
    );
  }
}
