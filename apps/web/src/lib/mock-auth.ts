"use client";

import { mockUsers, setCurrentUser } from "./mock-data";

// 簡易セッション管理
let currentSession: {
  user: (typeof mockUsers)[0] | null;
  isAuthenticated: boolean;
} = {
  user: null,
  isAuthenticated: false,
};

// ローカルストレージからセッションを復元
export const initializeSession = () => {
  if (typeof window !== "undefined") {
    const savedUserId = localStorage.getItem("currentUserId");
    if (savedUserId) {
      const user = mockUsers.find((u) => u.id === savedUserId);
      if (user) {
        currentSession = {
          user,
          isAuthenticated: true,
        };
        setCurrentUser(user.id);
      }
    }
  }

  return currentSession;
};

// ログイン
export const mockLogin = (userId: string) => {
  const user = mockUsers.find((u) => u.id === userId);
  if (user) {
    currentSession = {
      user,
      isAuthenticated: true,
    };
    setCurrentUser(user.id);

    // ローカルストレージに保存
    if (typeof window !== "undefined") {
      localStorage.setItem("currentUserId", user.id);
    }

    return { success: true, user };
  }

  return { success: false, error: "ユーザーが見つかりません" };
};

// ログアウト
export const mockLogout = () => {
  currentSession = {
    user: null,
    isAuthenticated: false,
  };

  if (typeof window !== "undefined") {
    localStorage.removeItem("currentUserId");
  }

  return { success: true };
};

// 現在のセッションを取得
export const getCurrentSession = () => currentSession;

// ログイン状態を確認
export const isAuthenticated = () => currentSession.isAuthenticated;

// 現在のユーザーを取得
export const getCurrentUser = () => currentSession.user;
