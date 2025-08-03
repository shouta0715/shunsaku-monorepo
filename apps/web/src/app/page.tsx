import {
  Badge,
  Divider,
  Heading,
  Navbar,
  NavbarSection,
  NavbarSpacer,
  Strong,
  Subheading,
  Text,
} from "@package/ui";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-zinc-950/10 bg-white/80 backdrop-blur-sm dark:border-white/10 dark:bg-zinc-900/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Navbar>
            <NavbarSection>
              <Heading className="text-lg font-bold" level={3}>
                Shunsaku
              </Heading>
            </NavbarSection>
            <NavbarSpacer />
          </Navbar>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <section className="relative px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-6" color="blue">
              新しいプロジェクト
            </Badge>
            <Heading
              className="mb-6 text-4xl sm:text-5xl lg:text-6xl"
              level={1}
            >
              <Strong>Shunsaku</Strong>で
              <br />
              開発体験を革新
            </Heading>
            <Text className="mx-auto mb-10 max-w-2xl text-lg sm:text-xl">
              モダンなモノレポ構成で、
              <Strong>Next.js</Strong>、<Strong>TypeScript</Strong>、
              <Strong>Tailwind CSS</Strong>を使った
              高品質なWebアプリケーション開発を実現します。
            </Text>
          </div>
        </section>

        <Divider />

        {/* Features Section */}
        <section className="px-4 py-24 sm:px-6 lg:px-8" id="features">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <Subheading className="mb-4">主な機能</Subheading>
              <Heading className="mb-16" level={2}>
                開発者のための
                <Strong className="text-blue-600 dark:text-blue-400">
                  最適化されたツール
                </Strong>
              </Heading>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
                <Subheading className="mb-3">🚀 高速開発</Subheading>
                <Text>
                  Turbopackによる高速なHot
                  Reload、最適化されたビルドプロセスで開発効率を最大化。
                </Text>
              </div>
              <div className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
                <Subheading className="mb-3">🎨 デザインシステム</Subheading>
                <Text>
                  統一されたUIコンポーネントライブラリで、一貫性のあるユーザーインターフェースを構築。
                </Text>
              </div>
              <div className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
                <Subheading className="mb-3">🔒 型安全性</Subheading>
                <Text>
                  TypeScriptによる厳密な型チェックで、ランタイムエラーを事前に防止し、保守性を向上。
                </Text>
              </div>
              <div className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
                <Subheading className="mb-3">📱 レスポンシブ</Subheading>
                <Text>
                  モバイルファーストのレスポンシブデザインで、あらゆるデバイスに最適化された体験を提供。
                </Text>
              </div>
              <div className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
                <Subheading className="mb-3">⚡ パフォーマンス</Subheading>
                <Text>
                  自動最適化、コード分割、画像最適化により、Lighthouseスコア90以上を実現。
                </Text>
              </div>
              <div className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
                <Subheading className="mb-3">🛠 開発ツール</Subheading>
                <Text>
                  ESLint、Prettier、品質保証パイプラインによる自動化されたコード品質管理。
                </Text>
              </div>
            </div>
          </div>
        </section>

        <Divider />

        {/* Technology Stack */}
        <section className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <Subheading className="mb-4">技術スタック</Subheading>
            <Heading className="mb-16" level={2}>
              モダンで
              <Strong className="text-green-600 dark:text-green-400">
                実証済みの技術
              </Strong>
            </Heading>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { name: "Next.js 15", description: "React フレームワーク" },
                { name: "TypeScript", description: "型安全なJavaScript" },
                {
                  name: "Tailwind CSS",
                  description: "ユーティリティファーストCSS",
                },
                {
                  name: "Headless UI",
                  description: "アクセシブルなUIコンポーネント",
                },
                {
                  name: "Framer Motion",
                  description: "アニメーションライブラリ",
                },
                { name: "Zustand", description: "シンプルな状態管理" },
              ].map((tech, index) => (
                <div
                  key={index}
                  className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800/50"
                >
                  <Subheading className="mb-2">{tech.name}</Subheading>
                  <Text className="text-sm">{tech.description}</Text>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Divider />

        {/* CTA Section */}
        <section className="px-4 py-24 sm:px-6 lg:px-8" id="about">
          <div className="mx-auto max-w-4xl text-center">
            <Heading className="mb-6" level={2}>
              今すぐ
              <Strong className="text-purple-600 dark:text-purple-400">
                開発を始めましょう
              </Strong>
            </Heading>
            <Text className="mx-auto mb-10 max-w-2xl text-lg">
              Specification-Driven Development ワークフローで、
              要件定義から実装まで体系的な開発プロセスを体験してください。
            </Text>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-950/10 py-12 dark:border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Text className="mb-4">
              © 2024 Shunsaku. Built with <Strong>Next.js</Strong> and{" "}
              <Strong>@package/ui</Strong>.
            </Text>
          </div>
        </div>
      </footer>
    </div>
  );
}
