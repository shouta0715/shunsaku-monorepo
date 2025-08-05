"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { AppError, CustomError, handleApiError } from "@/lib/error-utils";

export type ErrorDisplayMode = "toast" | "inline" | "modal" | "redirect";

export type UseErrorHandlerOptions = {
  defaultMode?: ErrorDisplayMode;
  onError?: (error: CustomError) => void;
  redirectOnAuth?: boolean;
};

export type ErrorState = {
  error: AppError | null;
  isError: boolean;
  errorMode: ErrorDisplayMode;
};

export function useErrorHandler(options: UseErrorHandlerOptions = {}) {
  const { defaultMode = "inline", onError, redirectOnAuth = true } = options;

  const router = useRouter();
  const [errorState, setErrorState] = useState<ErrorState>({
    error: null,
    isError: false,
    errorMode: defaultMode,
  });

  const handleError = useCallback(
    (error: unknown, mode: ErrorDisplayMode = defaultMode) => {
      const customError = handleApiError(error, "Frontend Error Handler");

      // 認証エラーの場合は自動リダイレクト
      if (customError.code === "AUTHENTICATION_REQUIRED" && redirectOnAuth) {
        router.push("/");

        return;
      }

      // アクセス拒否の場合はダッシュボードにリダイレクト
      if (customError.code === "ACCESS_DENIED") {
        router.push("/dashboard");

        return;
      }

      setErrorState({
        error: customError.toJSON(),
        isError: true,
        errorMode: mode,
      });

      // カスタムエラーハンドラーを実行
      if (onError) {
        onError(customError);
      }
    },
    [defaultMode, onError, redirectOnAuth, router],
  );

  const clearError = useCallback(() => {
    setErrorState({
      error: null,
      isError: false,
      errorMode: defaultMode,
    });
  }, [defaultMode]);

  const retryAction = useCallback(
    (retryFn: () => Promise<void> | void) => {
      clearError();
      try {
        const result = retryFn();
        if (result instanceof Promise) {
          result.catch(handleError);
        }
      } catch (error) {
        handleError(error);
      }
    },
    [clearError, handleError],
  );

  return {
    ...errorState,
    handleError,
    clearError,
    retryAction,
  };
}

// API呼び出し用のラッパー関数
export async function safeApiCall<T>(
  apiCall: () => Promise<T>,
  errorHandler?: (error: CustomError) => void,
): Promise<T | null> {
  try {
    const response = await apiCall();

    return response;
  } catch (error) {
    const customError = handleApiError(error, "API Call");
    if (errorHandler) {
      errorHandler(customError);
    }

    return null;
  }
}

// fetch API用のラッパー
export async function safeFetch(
  url: string,
  options?: RequestInit,
  timeout = 10000,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 401) {
        throw new CustomError("AUTHENTICATION_REQUIRED", "認証が必要です");
      }
      if (response.status === 403) {
        throw new CustomError("ACCESS_DENIED", "アクセス権限がありません");
      }
      if (response.status === 404) {
        throw new CustomError("RESOURCE_NOT_FOUND", "リソースが見つかりません");
      }
      if (response.status >= 400 && response.status < 500) {
        throw new CustomError("VALIDATION_ERROR", "リクエストが無効です");
      }
      if (response.status >= 500) {
        throw new CustomError("SERVER_ERROR", "サーバーエラーが発生しました");
      }
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof CustomError) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new CustomError(
          "TIMEOUT_ERROR",
          "リクエストがタイムアウトしました",
        );
      }
      if (error.message.includes("Failed to fetch")) {
        throw new CustomError(
          "NETWORK_ERROR",
          "ネットワークエラーが発生しました",
        );
      }
    }

    throw new CustomError("UNKNOWN_ERROR", "予期しないエラーが発生しました");
  }
}
