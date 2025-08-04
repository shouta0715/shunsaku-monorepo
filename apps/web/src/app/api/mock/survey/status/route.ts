import { NextResponse } from "next/server";
import { getCurrentUserSurveys } from "@/lib/mock-data";

export async function GET() {
  try {
    const today = new Date().toISOString().split("T")[0];
    const userSurveys = getCurrentUserSurveys();
    const todaySurvey = userSurveys.find(
      (survey) => survey.surveyDate === today,
    );

    return NextResponse.json({
      success: true,
      data: {
        completed: !!todaySurvey,
        survey: todaySurvey || null,
      },
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "アンケート状況の取得に失敗しました",
      },
      { status: 500 },
    );
  }
}
