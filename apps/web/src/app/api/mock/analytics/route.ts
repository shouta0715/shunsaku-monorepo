import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    // 週間トレンドデータ
    if (type === "trends") {
      const weeklyTrends = [
        {
          date: "2025-01-27",
          averageScore: 4.2,
          weatherType: "sunny",
          totalResponses: 145,
        },
        {
          date: "2025-01-28",
          averageScore: 3.8,
          weatherType: "cloudy",
          totalResponses: 142,
        },
        {
          date: "2025-01-29",
          averageScore: 3.5,
          weatherType: "cloudy",
          totalResponses: 138,
        },
        {
          date: "2025-01-30",
          averageScore: 2.9,
          weatherType: "rain",
          totalResponses: 134,
        },
        {
          date: "2025-01-31",
          averageScore: 3.1,
          weatherType: "cloudy",
          totalResponses: 141,
        },
        {
          date: "2025-02-01",
          averageScore: 3.6,
          weatherType: "cloudy",
          totalResponses: 147,
        },
        {
          date: "2025-02-02",
          averageScore: 4.0,
          weatherType: "sunny",
          totalResponses: 150,
        },
      ];

      return NextResponse.json({
        success: true,
        data: weeklyTrends,
      });
    }

    // 部署別分析データ
    if (type === "departments") {
      const departmentAnalysis = [
        {
          department: "開発部",
          averageScore: 3.8,
          weatherType: "cloudy",
          riskLevel: "medium",
          memberCount: 24,
          trend: "stable",
        },
        {
          department: "営業部",
          averageScore: 4.1,
          weatherType: "sunny",
          riskLevel: "low",
          memberCount: 18,
          trend: "improving",
        },
        {
          department: "人事部",
          averageScore: 4.3,
          weatherType: "sunny",
          riskLevel: "low",
          memberCount: 8,
          trend: "stable",
        },
        {
          department: "総務部",
          averageScore: 2.8,
          weatherType: "rain",
          riskLevel: "high",
          memberCount: 12,
          trend: "declining",
        },
        {
          department: "マーケティング部",
          averageScore: 3.4,
          weatherType: "cloudy",
          riskLevel: "medium",
          memberCount: 15,
          trend: "improving",
        },
      ];

      return NextResponse.json({
        success: true,
        data: departmentAnalysis,
      });
    }

    // 天気予報データ
    if (type === "forecast") {
      const weatherForecast = [
        {
          period: "来週",
          predictedWeather: "cloudy",
          confidence: 78,
          riskFactors: ["プロジェクト締切", "繁忙期"],
        },
        {
          period: "来月",
          predictedWeather: "sunny",
          confidence: 65,
          riskFactors: ["新入社員研修", "チームビルディング"],
        },
        {
          period: "四半期末",
          predictedWeather: "rain",
          confidence: 82,
          riskFactors: ["売上目標プレッシャー", "長時間労働"],
        },
      ];

      return NextResponse.json({
        success: true,
        data: weatherForecast,
      });
    }

    // 総合分析データ（デフォルト）
    const analyticsData = {
      summary: {
        totalEmployees: 77,
        averageScore: 3.6,
        overallWeather: "cloudy",
        responseRate: 94.8,
        riskDistribution: {
          high: 12,
          medium: 39,
          low: 26,
        },
      },
      insights: [
        {
          type: "warning",
          title: "総務部の天気悪化",
          description:
            "総務部の平均スコアが2.8と低下しています。個別対応が必要です。",
          priority: "high",
        },
        {
          type: "positive",
          title: "営業部・人事部の好調維持",
          description: "営業部と人事部は安定した好天を維持しています。",
          priority: "low",
        },
        {
          type: "info",
          title: "全体的な回復傾向",
          description: "週の後半にかけて全体的な改善が見られます。",
          priority: "medium",
        },
      ],
      recommendations: [
        {
          target: "総務部",
          action: "緊急面談実施",
          deadline: "1週間以内",
          impact: "高",
        },
        {
          target: "開発部・マーケティング部",
          action: "予防的ケア強化",
          deadline: "2週間以内",
          impact: "中",
        },
        {
          target: "全社",
          action: "成功事例の横展開",
          deadline: "1ヶ月以内",
          impact: "中",
        },
      ],
    };

    return NextResponse.json({
      success: true,
      data: analyticsData,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Analytics API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch analytics data",
      },
      { status: 500 },
    );
  }
}
