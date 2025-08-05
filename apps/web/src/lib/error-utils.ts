// エラーハンドリングユーティリティ

export type ErrorCode =
  | "AUTHENTICATION_REQUIRED"
  | "ACCESS_DENIED"
  | "RESOURCE_NOT_FOUND"
  | "VALIDATION_ERROR"
  | "NETWORK_ERROR"
  | "SERVER_ERROR"
  | "TIMEOUT_ERROR"
  | "UNKNOWN_ERROR";

export type AppError = {
  code: ErrorCode;
  message: string;
  details?: string;
  timestamp: string;
  requestId?: string;
};

export class CustomError extends Error {
  public readonly code: ErrorCode;
  public readonly details?: string;
  public readonly timestamp: string;
  public readonly requestId?: string;

  constructor(
    code: ErrorCode,
    message: string,
    details?: string,
    requestId?: string,
  ) {
    super(message);
    this.name = "CustomError";
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
    this.requestId = requestId;
  }

  toJSON(): AppError {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
      timestamp: this.timestamp,
      requestId: this.requestId,
    };
  }
}

// エラーメッセージマップ
export const ERROR_MESSAGES = {
  AUTHENTICATION_REQUIRED: "認証が必要です。ログインしてください。",
  ACCESS_DENIED: "この操作を実行する権限がありません。",
  RESOURCE_NOT_FOUND: "要求されたリソースが見つかりません。",
  VALIDATION_ERROR: "入力データに問題があります。",
  NETWORK_ERROR: "ネットワークエラーが発生しました。接続を確認してください。",
  SERVER_ERROR:
    "サーバーでエラーが発生しました。しばらく時間をおいて再試行してください。",
  TIMEOUT_ERROR: "リクエストがタイムアウトしました。もう一度お試しください。",
  UNKNOWN_ERROR: "予期しないエラーが発生しました。",
} as const;

// APIエラーレスポンス作成
export function createErrorResponse(error: CustomError) {
  return {
    success: false,
    error: error.toJSON(),
  };
}

// エラーログ出力
export function logError(error: Error | CustomError, context?: string) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    context,
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
      ...(error instanceof CustomError
        ? {
            code: error.code,
            details: error.details,
            requestId: error.requestId,
          }
        : {}),
    },
  };

  // 開発環境では詳細ログを出力
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.error("Error Log:", JSON.stringify(logEntry, null, 2));
  }

  // 本番環境では適切なログサービスに送信
  // TODO: Sentryやその他のログサービスとの統合
}

// バリデーションエラーヘルパー
export function validateRequired(value: unknown, fieldName: string): void {
  if (value === null || value === undefined || value === "") {
    throw new CustomError(
      "VALIDATION_ERROR",
      `${fieldName}は必須項目です。`,
      `Field '${fieldName}' is required but was ${typeof value}: ${value}`,
    );
  }
}

export function validateType(
  value: unknown,
  expectedType: string,
  fieldName: string,
): void {
  if (typeof value !== expectedType) {
    throw new CustomError(
      "VALIDATION_ERROR",
      `${fieldName}の形式が正しくありません。`,
      `Field '${fieldName}' expected ${expectedType} but got ${typeof value}`,
    );
  }
}

export function validateArrayType(value: unknown, fieldName: string): void {
  if (!Array.isArray(value)) {
    throw new CustomError(
      "VALIDATION_ERROR",
      `${fieldName}は配列形式である必要があります。`,
      `Field '${fieldName}' expected array but got ${typeof value}`,
    );
  }
}

// ネットワークエラーの判定
export function isNetworkError(error: Error): boolean {
  return (
    error.message.includes("fetch") ||
    error.message.includes("network") ||
    error.message.includes("Failed to fetch") ||
    error.name === "TypeError"
  );
}

// タイムアウトエラーの判定
export function isTimeoutError(error: Error): boolean {
  return (
    error.message.includes("timeout") ||
    error.message.includes("aborted") ||
    error.name === "AbortError"
  );
}

// 汎用エラーハンドラー
export function handleApiError(error: unknown, context?: string): CustomError {
  logError(error as Error, context);

  if (error instanceof CustomError) {
    return error;
  }

  if (error instanceof Error) {
    if (isNetworkError(error)) {
      return new CustomError(
        "NETWORK_ERROR",
        ERROR_MESSAGES.NETWORK_ERROR,
        error.message,
      );
    }

    if (isTimeoutError(error)) {
      return new CustomError(
        "TIMEOUT_ERROR",
        ERROR_MESSAGES.TIMEOUT_ERROR,
        error.message,
      );
    }

    return new CustomError(
      "SERVER_ERROR",
      ERROR_MESSAGES.SERVER_ERROR,
      error.message,
    );
  }

  return new CustomError(
    "UNKNOWN_ERROR",
    ERROR_MESSAGES.UNKNOWN_ERROR,
    String(error),
  );
}

// フロントエンド用エラーハンドラー
export function handleFetchError(response: Response): Promise<never> {
  if (response.status === 401) {
    throw new CustomError(
      "AUTHENTICATION_REQUIRED",
      ERROR_MESSAGES.AUTHENTICATION_REQUIRED,
    );
  }

  if (response.status === 403) {
    throw new CustomError("ACCESS_DENIED", ERROR_MESSAGES.ACCESS_DENIED);
  }

  if (response.status === 404) {
    throw new CustomError(
      "RESOURCE_NOT_FOUND",
      ERROR_MESSAGES.RESOURCE_NOT_FOUND,
    );
  }

  if (response.status >= 400 && response.status < 500) {
    throw new CustomError("VALIDATION_ERROR", ERROR_MESSAGES.VALIDATION_ERROR);
  }

  if (response.status >= 500) {
    throw new CustomError("SERVER_ERROR", ERROR_MESSAGES.SERVER_ERROR);
  }

  throw new CustomError("UNKNOWN_ERROR", ERROR_MESSAGES.UNKNOWN_ERROR);
}
