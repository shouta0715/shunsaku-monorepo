import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/mock-auth";

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

    // モックチームメンバーデータ
    let teamMembers = [
      {
        id: "team-001",
        name: "田中 太郎",
        department: "開発部",
        role: "エンジニア",
        riskLevel: "high",
        score: 2.3,
        lastResponseDate: "2025-02-02",
        responseRate: 85,
        managerNotes: "最近のプロジェクト負荷が高い",
      },
      {
        id: "team-002",
        name: "佐藤 花子",
        department: "開発部",
        role: "シニアエンジニア",
        riskLevel: "medium",
        score: 3.2,
        lastResponseDate: "2025-02-02",
        responseRate: 92,
      },
      {
        id: "team-003",
        name: "鈴木 一郎",
        department: "営業部",
        role: "営業",
        riskLevel: "low",
        score: 4.1,
        lastResponseDate: "2025-02-01",
        responseRate: 98,
      },
      {
        id: "team-004",
        name: "高橋 美咲",
        department: "人事部",
        role: "人事",
        riskLevel: "low",
        score: 4.5,
        lastResponseDate: "2025-02-02",
        responseRate: 100,
      },
      {
        id: "team-005",
        name: "渡辺 健太",
        department: "総務部",
        role: "総務",
        riskLevel: "high",
        score: 2.1,
        lastResponseDate: "2025-01-30",
        responseRate: 76,
        managerNotes: "長期間低スコアが続いている",
      },
      {
        id: "team-006",
        name: "伊藤 まゆみ",
        department: "マーケティング部",
        role: "マーケター",
        riskLevel: "medium",
        score: 3.4,
        lastResponseDate: "2025-02-02",
        responseRate: 88,
      },
      {
        id: "team-007",
        name: "山田 大輔",
        department: "開発部",
        role: "テックリード",
        riskLevel: "medium",
        score: 3.6,
        lastResponseDate: "2025-02-01",
        responseRate: 94,
      },
      {
        id: "team-008",
        name: "小林 恵美",
        department: "営業部",
        role: "営業マネージャー",
        riskLevel: "low",
        score: 4.2,
        lastResponseDate: "2025-02-02",
        responseRate: 96,
      },
    ];

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
