"use client";

import { Button, Badge } from "@package/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertBadge } from "@/components/alerts/AlertBadge";
import { getCurrentSession, mockLogout } from "@/lib/mock-auth";
import { cn } from "@/lib/utils";

type HeaderProps = {
  onMenuToggle?: () => void;
  className?: string;
};

export function Header({ onMenuToggle, className }: HeaderProps) {
  const router = useRouter();
  const session = getCurrentSession();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignOut = () => {
    mockLogout();
    router.push("/");
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      admin: "red" as const,
      hr: "orange" as const,
      manager: "green" as const,
      employee: "zinc" as const,
    };
    const labels = {
      admin: "管理者",
      hr: "人事",
      manager: "マネージャー",
      employee: "社員",
    };

    return {
      color: colors[role as keyof typeof colors],
      label: labels[role as keyof typeof labels],
    };
  };

  return (
    <header
      className={cn("border-b border-gray-200 bg-white shadow-sm", className)}
    >
      <div className="flex h-16 items-center justify-between px-4">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          {onMenuToggle && (
            <Button plain className="lg:hidden" onClick={onMenuToggle}>
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </Button>
          )}

          <Link className="flex items-center space-x-2" href="/dashboard">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <span className="text-sm font-bold text-white">離</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-gray-900">
                離職リスク予測
              </h1>
              <p className="text-xs text-gray-500">
                日々の声から、未来の離職をゼロへ。
              </p>
            </div>
          </Link>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-4">
          {/* Alerts */}
          <Link href="/alerts">
            <Button plain className="relative">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
              <div className="absolute -top-1 -right-1">
                <AlertBadge />
              </div>
            </Button>
          </Link>

          {/* User menu */}
          {session?.user && (
            <div className="relative">
              <Button
                plain
                className="flex items-center space-x-2"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300">
                  <span className="text-sm font-medium text-gray-700">
                    {session.user.name?.charAt(0) || "U"}
                  </span>
                </div>
                <div className="hidden text-left sm:block">
                  <p className="text-sm font-medium text-gray-900">
                    {session.user.name}
                  </p>
                  <div className="flex items-center space-x-1">
                    <p className="text-xs text-gray-500">
                      {session.user.department}
                    </p>
                    <Badge
                      className="text-xs"
                      color={getRoleBadge(session.user.role).color}
                    >
                      {getRoleBadge(session.user.role).label}
                    </Badge>
                  </div>
                </div>
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M19 9l-7 7-7-7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </Button>

              {showUserMenu && (
                <div className="absolute right-0 z-50 mt-2 w-48 rounded-md border bg-white py-1 shadow-lg">
                  <Link
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    href="/profile"
                    onClick={() => setShowUserMenu(false)}
                  >
                    プロフィール
                  </Link>
                  <Link
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    href="/settings"
                    onClick={() => setShowUserMenu(false)}
                  >
                    設定
                  </Link>
                  <hr className="my-1" />
                  <button
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      setShowUserMenu(false);
                      handleSignOut();
                    }}
                  >
                    ログアウト
                  </button>
                </div>
              )}
            </div>
          )}

          {!session.isAuthenticated && (
            <button
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
              onClick={() => router.push("/")}
            >
              ログイン
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
