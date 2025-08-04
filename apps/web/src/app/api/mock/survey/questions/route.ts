import { NextResponse } from "next/server";
import { mockQuestions } from "@/lib/mock-data";

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: mockQuestions,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "アンケート質問の取得に失敗しました",
      },
      { status: 500 },
    );
  }
}
