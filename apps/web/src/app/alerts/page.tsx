"use client";

import { Button } from "@package/ui";
import { useState } from "react";

import { AlertList } from "@/components/alerts/AlertList";
import { DashboardLayout } from "@/components/layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";

export default function AlertsPage() {
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">アラート</h1>
          <p className="text-gray-600">
            重要な通知や状況変化をお知らせします。
          </p>
        </div>

        {/* Filter Controls */}
        <Card>
          <CardHeader>
            <CardTitle>表示設定</CardTitle>
            <CardDescription>
              表示するアラートをフィルタリングできます
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              {showUnreadOnly ? (
                <Button outline onClick={() => setShowUnreadOnly(false)}>
                  全てのアラート
                </Button>
              ) : (
                <Button onClick={() => setShowUnreadOnly(false)}>
                  全てのアラート
                </Button>
              )}
              {!showUnreadOnly ? (
                <Button outline onClick={() => setShowUnreadOnly(true)}>
                  未読のみ
                </Button>
              ) : (
                <Button onClick={() => setShowUnreadOnly(true)}>
                  未読のみ
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Alerts List */}
        <AlertList unreadOnly={showUnreadOnly} />

        {/* Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>アラートについて</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-gray-600">
              <h4 className="mb-2 font-medium text-gray-900">
                アラートの種類:
              </h4>
              <ul className="ml-4 space-y-1">
                <li>
                  • <span className="font-medium text-red-600">高リスク</span>:
                  スコアが高リスクレベルに達した場合
                </li>
                <li>
                  •{" "}
                  <span className="font-medium text-yellow-600">
                    スコア低下
                  </span>
                  : 前回から大幅にスコアが下がった場合
                </li>
                <li>
                  • <span className="font-medium text-blue-600">未回答</span>:
                  長期間アンケートに回答していない場合
                </li>
                <li>
                  • <span className="font-medium text-gray-600">システム</span>:
                  システムからの重要なお知らせ
                </li>
              </ul>
            </div>
            <div className="text-sm text-gray-600">
              <p>
                アラートは自動的に生成され、重要な状況変化を見逃さないようにサポートします。
                アラートを受け取った際は、適切な対応を取ることをお勧めします。
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
