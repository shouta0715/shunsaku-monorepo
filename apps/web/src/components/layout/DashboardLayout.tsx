"use client";

import {
  SidebarLayout,
  Sidebar,
  SidebarHeader,
  SidebarBody,
  SidebarFooter,
  SidebarSection,
  SidebarItem,
  SidebarLabel,
  SidebarHeading,
  Navbar,
  NavbarSection,
  NavbarItem,
  NavbarSpacer,
  Badge,
} from "@package/ui";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { AlertBadge } from "@/components/alerts/AlertBadge";
import { LoadingSpinner } from "@/components/ui";
import {
  initializeSession,
  getCurrentSession,
  mockLogout,
} from "@/lib/mock-auth";

type DashboardLayoutProps = {
  children: React.ReactNode;
  className?: string;
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [session, setSession] = useState<ReturnType<
    typeof getCurrentSession
  > | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const currentSession = initializeSession();
    if (!currentSession.isAuthenticated) {
      router.push("/");

      return;
    }
    setSession(currentSession);
    setAuthenticated(true);
    setLoading(false);
  }, [router]);

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

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname.startsWith(href);
  };

  const navItems = [
    {
      href: "/",
      label: "トップページ",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
      ),
    },
    {
      href: "/dashboard",
      label: "ダッシュボード",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
          <path
            d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
      ),
    },
    {
      href: "/survey",
      label: "日次アンケート",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
      ),
      roles: ["employee", "manager", "hr", "admin"],
    },
    {
      href: "/analytics",
      label: "分析・レポート",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
      ),
      roles: ["manager", "hr", "admin"],
    },
    {
      href: "/team",
      label: "チーム管理",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
      ),
      roles: ["manager", "hr", "admin"],
    },
    {
      href: "/alerts",
      label: "アラート",
      icon: (
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
      ),
      roles: ["manager", "hr", "admin"],
    },
    {
      href: "/admin",
      label: "管理者設定",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
          <path
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
      ),
      roles: ["admin", "hr"],
    },
  ];

  const filteredNavItems = navItems.filter((item) => {
    if (!item.roles || !session?.user?.role) return true;

    return item.roles.includes(session.user.role);
  });

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!authenticated || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">
            認証が必要です。ログインしてください。
          </p>
        </div>
      </div>
    );
  }

  return (
    <SidebarLayout
      navbar={
        <Navbar>
          <NavbarSection>
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-blue-600">
                <span className="text-sm font-bold text-white">や</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-gray-900">
                  やめどき予報
                </h1>
                <p className="text-xs text-gray-500">
                  働く人の気持ちを天気予報のように。
                </p>
              </div>
            </div>
          </NavbarSection>
          <NavbarSpacer />
          <NavbarSection>
            {/* Alerts */}
            <NavbarItem href="/alerts">
              <div className="relative">
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
              </div>
            </NavbarItem>

            {/* User menu */}
            {session.user && (
              <div className="relative">
                <button
                  className="flex items-center space-x-2 rounded-lg px-3 py-2 hover:bg-gray-100"
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
                      <Badge color={getRoleBadge(session.user.role).color}>
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
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 z-50 mt-2 w-48 rounded-md border bg-white py-1 shadow-lg">
                    <a
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      href="/profile"
                    >
                      プロフィール
                    </a>
                    <a
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      href="/settings"
                    >
                      設定
                    </a>
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
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <button
              className="flex items-center space-x-2 text-left transition-colors hover:text-purple-600"
              onClick={() => router.push("/")}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-blue-600">
                <span className="text-sm font-bold text-white">や</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  やめどき予報
                </h1>
              </div>
            </button>
          </SidebarHeader>

          <SidebarBody>
            <SidebarSection>
              <SidebarHeading>メニュー</SidebarHeading>
              {filteredNavItems.map((item) => (
                <SidebarItem
                  key={item.href}
                  current={isActive(item.href)}
                  href={item.href}
                >
                  <div className="flex items-center space-x-3">
                    {item.icon}
                    <SidebarLabel>{item.label}</SidebarLabel>
                  </div>
                  {item.href === "/alerts" && (
                    <div className="ml-auto">
                      <Badge color="red">3</Badge>
                    </div>
                  )}
                </SidebarItem>
              ))}
            </SidebarSection>
          </SidebarBody>

          <SidebarFooter>
            <div className="space-y-1 text-xs text-gray-500">
              <p>© 2025 やめどき予報</p>
              <p>Version 1.0.0</p>
            </div>
          </SidebarFooter>
        </Sidebar>
      }
    >
      {children}
    </SidebarLayout>
  );
}
