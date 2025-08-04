// Client-side utility functions that don't require database access

// リスクレベルを計算
export function calculateRiskLevel(score: number): "low" | "medium" | "high" {
  if (score >= 4.0) return "low";
  if (score >= 2.5) return "medium";

  return "high";
}

// スコアの統計情報を計算
export function calculateScoreStats(scores: number[]): {
  average: number;
  trend: "up" | "down" | "stable";
  changeFromPrevious: number;
} {
  if (scores.length === 0) {
    return { average: 0, trend: "stable", changeFromPrevious: 0 };
  }

  const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;

  if (scores.length < 2) {
    return { average, trend: "stable", changeFromPrevious: 0 };
  }

  const recent = scores.slice(-7); // 直近7日
  const previous = scores.slice(-14, -7); // その前の7日

  if (previous.length === 0) {
    return { average, trend: "stable", changeFromPrevious: 0 };
  }

  const recentAvg =
    recent.reduce((sum, score) => sum + score, 0) / recent.length;
  const previousAvg =
    previous.reduce((sum, score) => sum + score, 0) / previous.length;
  const changeFromPrevious = recentAvg - previousAvg;

  let trend: "up" | "down" | "stable" = "stable";
  if (Math.abs(changeFromPrevious) > 0.2) {
    trend = changeFromPrevious > 0 ? "up" : "down";
  }

  return { average, trend, changeFromPrevious };
}
