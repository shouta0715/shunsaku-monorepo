// 離職リスク予測ダッシュボード - TypeScript型定義

export type User = {
  id: string;
  email: string;
  name: string;
  department: string;
  position: string;
  managerId?: string;
  role: UserRole;
  hireDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type UserRole = "employee" | "manager" | "hr" | "admin";

export type Question = {
  id: string;
  text: string;
  category: string;
  weight: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Survey = {
  id: string;
  userId: string;
  surveyDate: Date;
  totalScore: number;
  submittedAt: Date;
  responses: SurveyResponse[];
};

export type SurveyResponse = {
  id: string;
  surveyId: string;
  questionId: string;
  score: number;
  createdAt: Date;
};

export type DailyScore = {
  id: string;
  userId: string;
  scoreDate: Date;
  totalScore: number;
  riskLevel: RiskLevel;
  calculatedAt: Date;
  categoryScores: CategoryScore[];
};

export type RiskLevel = "low" | "medium" | "high";

export type CategoryScore = {
  category: string;
  score: number;
  weight: number;
};

export type Alert = {
  id: string;
  userId: string;
  targetUserId?: string;
  type: AlertType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
};

export type AlertType = "high_risk" | "score_drop" | "no_response" | "system";

export type PersonalAnalytics = {
  currentScore: number;
  riskLevel: RiskLevel;
  scoreHistory: ScorePoint[];
  categoryScores: CategoryScore[];
  trends: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  comparisonData: ComparisonData;
};

export type ScorePoint = {
  date: string;
  score: number;
  riskLevel: RiskLevel;
};

export type ComparisonData = {
  departmentAverage: number;
  companyAverage: number;
  previousMonth: number;
};

export type TeamAnalytics = {
  teamStats: {
    averageScore: number;
    riskDistribution: RiskDistribution;
    responseRate: number;
  };
  members: TeamMemberSummary[];
  trends: TeamTrend[];
  departmentComparison: DepartmentComparison[];
};

export type RiskDistribution = {
  low: number;
  medium: number;
  high: number;
};

export type TeamMemberSummary = {
  id: string;
  name: string;
  position: string;
  currentScore: number;
  riskLevel: RiskLevel;
  trend: number;
  lastResponseDate: Date;
};

export type TeamTrend = {
  date: string;
  averageScore: number;
  responseCount: number;
};

export type DepartmentComparison = {
  department: string;
  averageScore: number;
  memberCount: number;
  riskLevel: RiskLevel;
};

export type CompanyAnalytics = {
  companyStats: CompanyStats;
  departmentStats: DepartmentStats[];
  riskPrediction: RiskPrediction[];
  trends: CompanyTrend[];
};

export type CompanyStats = {
  totalEmployees: number;
  responseRate: number;
  averageScore: number;
  riskDistribution: RiskDistribution;
};

export type DepartmentStats = {
  department: string;
  employeeCount: number;
  averageScore: number;
  responseRate: number;
  riskLevel: RiskLevel;
  trend: number;
};

export type RiskPrediction = {
  userId: string;
  userName: string;
  department: string;
  currentRisk: RiskLevel;
  predictedRisk: RiskLevel;
  confidence: number;
  reasons: string[];
};

export type CompanyTrend = {
  date: string;
  averageScore: number;
  responseCount: number;
  riskDistribution: RiskDistribution;
};

// API Response types
export type ApiResponse<T> = {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

// フォーム関連の型
export type LoginFormData = {
  email: string;
  password: string;
};

export type SurveyFormData = {
  responses: {
    questionId: string;
    score: number;
  }[];
};

export type ProfileFormData = {
  name: string;
  department: string;
  position: string;
};

export type ReportFormData = {
  title: string;
  type: ReportType;
  dateRange: {
    start: Date;
    end: Date;
  };
  departments?: string[];
  includeDetails: boolean;
};

export type ReportType =
  | "weekly"
  | "monthly"
  | "custom"
  | "department"
  | "risk_analysis";

// 通知関連の型
export type Notification = {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
};

export type NotificationType =
  | "alert"
  | "report"
  | "system"
  | "survey_reminder";

// 設定関連の型
export type UserSettings = {
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  alertFrequency: AlertFrequency;
  reportFrequency: ReportFrequency;
  language: Language;
};

export type AlertFrequency = "immediate" | "daily" | "weekly" | "disabled";
export type ReportFrequency = "daily" | "weekly" | "monthly" | "disabled";
export type Language = "ja" | "en";

export type SystemConfig = {
  surveyQuestions: Question[];
  riskThresholds: {
    high: number;
    medium: number;
    low: number;
  };
  alertRules: AlertRule[];
  reportSchedules: ReportSchedule[];
};

export type AlertRule = {
  id: string;
  name: string;
  condition: AlertCondition;
  action: AlertAction;
  isActive: boolean;
};

export type AlertCondition = {
  type: "score_below" | "score_drop" | "no_response" | "risk_level";
  threshold: number;
  duration: number; // days
};

export type AlertAction = {
  type: "email" | "push" | "slack" | "teams";
  recipients: string[];
  template: string;
};

export type ReportSchedule = {
  id: string;
  name: string;
  type: ReportType;
  frequency: ReportFrequency;
  recipients: string[];
  isActive: boolean;
};
