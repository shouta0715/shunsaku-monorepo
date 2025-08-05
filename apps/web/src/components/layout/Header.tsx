"use client";

import { Button } from "@package/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCurrentSession } from "@/lib/mock-auth";
import { cn } from "@/lib/utils";

type HeaderProps = {
  onMenuToggle?: () => void;
  className?: string;
};

export function Header({ onMenuToggle, className }: HeaderProps) {
  const router = useRouter();
  const session = getCurrentSession();

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
