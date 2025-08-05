// サーバーサイド用の認証ユーティリティ

import { NextRequest } from "next/server";
import { mockUsers } from "./mock-data";

// サーバーサイドでユーザーを取得する関数
export const getServerUser = (userId: string | null) => {
  if (!userId) return null;

  const user = mockUsers.find((u) => u.id === userId);

  return user || null;
};

// リクエストヘッダーからユーザーIDを取得
export const getUserIdFromHeaders = (headers: Headers): string | null =>
  headers.get("x-user-id") || null;

// 認証チェックヘルパー（NextRequestから直接使用）
export const authenticateUser = (request: NextRequest) => {
  const userId = getUserIdFromHeaders(request.headers);
  const user = getServerUser(userId);

  return {
    success: !!user,
    user,
    isAuthenticated: !!user,
    userId,
  };
};

// Headersオブジェクトから直接認証チェック
export const authenticateUserFromHeaders = (headers: Headers) => {
  const userId = getUserIdFromHeaders(headers);
  const user = getServerUser(userId);

  return {
    success: !!user,
    user,
    isAuthenticated: !!user,
    userId,
  };
};
