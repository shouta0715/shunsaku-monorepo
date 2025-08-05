"use client";

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
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { mockUsers } from "@/lib/mock-data";

export default function Home() {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [_currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem("currentUserId");
    if (userId) {
      setIsLoggedIn(true);
      setCurrentUser(userId);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-zinc-950/10 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Navbar>
            <NavbarSection>
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-blue-600">
                  <span className="text-sm font-bold text-white">や</span>
                </div>
                <Heading
                  className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-lg font-bold text-transparent"
                  level={3}
                >
                  やめどき予報
                </Heading>
              </div>
            </NavbarSection>
            <NavbarSpacer />
            <NavbarSection>
              {isLoggedIn ? (
                <div className="flex items-center space-x-3">
                  <button
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                    onClick={() => router.push("/dashboard")}
                  >
                    ダッシュボードへ
                  </button>
                  <button
                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    onClick={() => {
                      localStorage.removeItem("currentUserId");
                      setIsLoggedIn(false);
                      setCurrentUser(null);
                    }}
                  >
                    ログアウト
                  </button>
                </div>
              ) : (
                <button
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                  onClick={() => setShowLoginModal(true)}
                >
                  ログイン
                </button>
              )}
            </NavbarSection>
          </Navbar>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <section className="relative px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-6" color="purple">
              ☁️ 働き方の天気予報
            </Badge>
            <Heading
              className="mb-6 text-4xl sm:text-5xl lg:text-6xl"
              level={1}
            >
              <Strong className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                働く人の気持ち
              </Strong>
              を
              <br />
              <Strong className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                天気予報のように
              </Strong>
              📊
            </Heading>
            <Text className="mx-auto mb-10 max-w-2xl text-lg text-gray-600 sm:text-xl">
              社員のモチベーションを天気のように可視化。
              <Strong>毎日のちょっとした気持ち</Strong>から、
              組織の雰囲気と離職リスクをリアルタイムで予測します。
            </Text>

            {/* Weather Icons */}
            <div className="mb-10 flex items-center justify-center space-x-6">
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.15 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <motion.div
                  className="mb-2 text-4xl"
                  whileHover={{
                    rotate: [0, -10, 10, 0],
                    transition: { duration: 0.15 },
                  }}
                >
                  ⛈️
                </motion.div>
                <Text className="text-sm font-medium text-red-600">嵐</Text>
                <Text className="text-xs text-gray-500">とても辛い</Text>
              </motion.div>
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.15 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <motion.div
                  className="mb-2 text-4xl"
                  whileHover={{
                    rotate: [0, -10, 10, 0],
                    transition: { duration: 0.15 },
                  }}
                >
                  🌧️
                </motion.div>
                <Text className="text-sm font-medium text-orange-600">雨</Text>
                <Text className="text-xs text-gray-500">少し辛い</Text>
              </motion.div>
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.15 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <motion.div
                  className="mb-2 text-4xl"
                  whileHover={{
                    rotate: [0, -10, 10, 0],
                    transition: { duration: 0.15 },
                  }}
                >
                  🌤️
                </motion.div>
                <Text className="text-sm font-medium text-gray-600">
                  くもり
                </Text>
                <Text className="text-xs text-gray-500">普通</Text>
              </motion.div>
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.15 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <motion.div
                  className="mb-2 text-4xl"
                  whileHover={{
                    rotate: [0, -10, 10, 0],
                    transition: { duration: 0.15 },
                  }}
                >
                  🌞
                </motion.div>
                <Text className="text-sm font-medium text-blue-600">晴れ</Text>
                <Text className="text-xs text-gray-500">良い感じ</Text>
              </motion.div>
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.15 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <motion.div
                  className="mb-2 text-4xl"
                  whileHover={{
                    rotate: [0, -10, 10, 0],
                    transition: { duration: 0.15 },
                  }}
                >
                  ☀️
                </motion.div>
                <Text className="text-sm font-medium text-green-600">快晴</Text>
                <Text className="text-xs text-gray-500">とても良い</Text>
              </motion.div>
            </div>
          </div>
        </section>

        <Divider />

        {/* Features Section */}
        <section className="px-4 py-24 sm:px-6 lg:px-8" id="features">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <Subheading className="mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                主な機能
              </Subheading>
              <Heading className="mb-16" level={2}>
                組織の天気を
                <Strong className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  予報する
                </Strong>
                機能
              </Heading>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border border-purple-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg">
                <Subheading className="mb-3 text-purple-600">
                  🌤️ 日次気持ちチェック
                </Subheading>
                <Text>
                  5問の簡単な質問で、今日の気分を天気マークで記録。
                  わずか2分で完了する直感的なUIで毎日の心のコンディションを把握。
                </Text>
              </div>
              <div className="rounded-lg border border-green-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg">
                <Subheading className="mb-3 text-green-600">
                  📊 天気予報ダッシュボード
                </Subheading>
                <Text>
                  個人・チーム・全社の「心の天気」をリアルタイムで可視化。
                  晴れ・くもり・雨・嵐の4段階で組織の健康状態を即座に把握。
                </Text>
              </div>
              <div className="rounded-lg border border-red-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg">
                <Subheading className="mb-3 text-red-600">
                  🌩️ 嵐警報アラート
                </Subheading>
                <Text>
                  メンタル的に「嵐」状態の社員を自動検知し、管理者に即座に通知。
                  早期サポートで離職を未然に防止。
                </Text>
              </div>
              <div className="rounded-lg border border-blue-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg">
                <Subheading className="mb-3 text-blue-600">
                  📈 週間天気予報
                </Subheading>
                <Text>
                  過去の気持ちパターンから将来の「心の天気」を予測。
                  週次・月次の詳細分析レポートで組織改善をサポート。
                </Text>
              </div>
              <div className="rounded-lg border border-indigo-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg">
                <Subheading className="mb-3 text-indigo-600">
                  🔮 やめどき予測AI
                </Subheading>
                <Text>
                  AIが「やめどき」のタイミングを高精度で予測。
                  機械学習により個人の行動パターンを分析し、離職リスクを数値化。
                </Text>
              </div>
              <div className="rounded-lg border border-teal-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg">
                <Subheading className="mb-3 text-teal-600">
                  🔐 プライバシー保護
                </Subheading>
                <Text>
                  匿名化技術で個人を特定されない安心設計。
                  GDPR準拠の完全なプライバシー保護で安心してご利用いただけます。
                </Text>
              </div>
            </div>
          </div>
        </section>

        <Divider />

        {/* Benefits Section */}
        <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <Badge className="mb-6" color="blue">
                🌟 組織変革の実現
              </Badge>
              <Heading className="mb-6" level={2}>
                <Strong className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  データドリブンな組織運営
                </Strong>
                で
                <br />
                <Strong className="text-gray-800">未来の離職を予防</Strong>
              </Heading>
              <Text className="mx-auto max-w-3xl text-lg text-gray-600">
                天気予報のように組織の健康状態を可視化し、問題が深刻化する前に
                <Strong className="text-purple-600">予防的な対策</Strong>
                を実現します
              </Text>
            </div>

            {/* Before/After Comparison */}
            <div className="mb-16 grid gap-8 lg:grid-cols-2">
              <div className="rounded-2xl border-2 border-red-200 bg-gradient-to-br from-red-50 to-orange-50 p-8">
                <div className="mb-4 text-center">
                  <div className="mb-3 text-4xl">😰</div>
                  <Subheading className="text-red-700" level={3}>
                    従来の問題
                  </Subheading>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="mt-1 text-red-500">❌</div>
                    <Text className="text-red-700">
                      <Strong>突然の離職</Strong>で業務が停滞
                    </Text>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="mt-1 text-red-500">❌</div>
                    <Text className="text-red-700">
                      問題が<Strong>表面化してから</Strong>の後手対応
                    </Text>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="mt-1 text-red-500">❌</div>
                    <Text className="text-red-700">
                      勘と経験に頼った<Strong>属人的</Strong>な判断
                    </Text>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="mt-1 text-red-500">❌</div>
                    <Text className="text-red-700">
                      採用・教育コストの<Strong>継続的な負担</Strong>
                    </Text>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-8">
                <div className="mb-4 text-center">
                  <div className="mb-3 text-4xl">🌟</div>
                  <Subheading className="text-green-700" level={3}>
                    やめどき予報の効果
                  </Subheading>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="mt-1 text-green-500">✅</div>
                    <Text className="text-green-700">
                      <Strong>早期予兆検知</Strong>で離職を未然に防止
                    </Text>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="mt-1 text-green-500">✅</div>
                    <Text className="text-green-700">
                      <Strong>予防的対策</Strong>で問題を根本解決
                    </Text>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="mt-1 text-green-500">✅</div>
                    <Text className="text-green-700">
                      <Strong>データ根拠</Strong>に基づく科学的判断
                    </Text>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="mt-1 text-green-500">✅</div>
                    <Text className="text-green-700">
                      <Strong>定着率向上</Strong>でコスト削減を実現
                    </Text>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Benefits Cards */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  weather: "🌦️",
                  icon: "👁️",
                  title: "リスクの見える化",
                  description: "心の天気で状況を直感的に把握",
                  color: "blue",
                  bgColor: "from-blue-50 to-cyan-50",
                  borderColor: "border-blue-200",
                },
                {
                  weather: "⛈️",
                  icon: "🛡️",
                  title: "嵐の早期発見",
                  description: "危険信号を事前にキャッチ",
                  color: "purple",
                  bgColor: "from-purple-50 to-violet-50",
                  borderColor: "border-purple-200",
                },
                {
                  weather: "🌤️",
                  icon: "🚀",
                  title: "天気改善支援",
                  description: "具体的な改善策を迅速実行",
                  color: "indigo",
                  bgColor: "from-indigo-50 to-blue-50",
                  borderColor: "border-indigo-200",
                },
                {
                  weather: "☀️",
                  icon: "📊",
                  title: "晴天の組織作り",
                  description: "データで理想的な職場を実現",
                  color: "emerald",
                  bgColor: "from-emerald-50 to-green-50",
                  borderColor: "border-emerald-200",
                },
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  className={`group relative rounded-2xl border-2 ${benefit.borderColor} bg-gradient-to-br ${benefit.bgColor} cursor-pointer p-6 transition-all duration-300 hover:shadow-xl`}
                  initial={{ opacity: 0, y: 50 }}
                  transition={{ duration: 0.15 }}
                  viewport={{ once: true }}
                  whileHover={{
                    y: -10,
                    transition: { duration: 0.15 },
                  }}
                  whileInView={{ opacity: 1, y: 0 }}
                >
                  <div className="text-center">
                    <motion.div
                      className="mb-3 text-4xl"
                      whileHover={{
                        rotate: [0, -10, 10, 0],
                        transition: { duration: 0.15 },
                      }}
                    >
                      {benefit.weather}
                    </motion.div>
                    <motion.div className="mb-2 text-2xl" whileHover={{}}>
                      {benefit.icon}
                    </motion.div>
                    <Subheading
                      className={`mb-3 text-${benefit.color}-700`}
                      level={3}
                    >
                      {benefit.title}
                    </Subheading>
                    <Text className={`text-sm text-${benefit.color}-600`}>
                      {benefit.description}
                    </Text>
                  </div>
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${benefit.bgColor} opacity-0 transition-opacity group-hover:opacity-20`}
                  />
                </motion.div>
              ))}
            </div>

            {/* ROI Section */}
            <div className="mt-16 rounded-3xl border-2 border-orange-200 bg-gradient-to-r from-yellow-50 via-orange-50 to-red-50 p-8">
              <div className="text-center">
                <div className="mb-4 text-5xl">💰</div>
                <Subheading className="mb-4 text-orange-800" level={2}>
                  投資対効果（ROI）
                </Subheading>
                <Text className="mb-8 text-lg text-orange-700">
                  離職防止による具体的なコスト削減効果
                </Text>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="text-center">
                    <div className="mb-2 text-3xl font-bold text-orange-600">
                      -70%
                    </div>
                    <Text className="text-orange-700">採用コスト削減</Text>
                  </div>
                  <div className="text-center">
                    <div className="mb-2 text-3xl font-bold text-orange-600">
                      -50%
                    </div>
                    <Text className="text-orange-700">研修費用削減</Text>
                  </div>
                  <div className="text-center">
                    <div className="mb-2 text-3xl font-bold text-orange-600">
                      +40%
                    </div>
                    <Text className="text-orange-700">生産性向上</Text>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Divider />

        {/* CTA Section */}
        <section
          className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 px-4 py-24 text-white sm:px-6 lg:px-8"
          id="start"
        >
          <div className="mx-auto max-w-5xl text-center">
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.15 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <motion.div
                className="mb-4 text-6xl"
                initial={{ opacity: 0, rotate: -180 }}
                transition={{ duration: 0.15 }}
                viewport={{ once: true }}
                whileHover={{
                  rotate: [0, -5, 5, 0],
                  transition: { duration: 0.15 },
                }}
                whileInView={{ opacity: 1, rotate: 0 }}
              >
                🌅
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.15 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <Heading className="mb-6 text-white" level={2}>
                  明日の
                  <Strong className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                    晴天組織
                  </Strong>
                  を
                  <br />
                  今日から築きませんか？
                </Heading>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.15 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <Text className="mx-auto mb-8 max-w-3xl text-xl text-blue-100">
                  社員一人ひとりの心の天気を大切にし、
                  <Strong className="text-yellow-300">
                    データドリブンな組織改善
                  </Strong>
                  で 誰もが輝ける職場を実現しましょう
                </Text>
              </motion.div>
            </motion.div>

            {/* Value Props */}
            <div className="mb-12 grid gap-6 md:grid-cols-3">
              <div className="rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
                <div className="mb-3 text-3xl">⚡</div>
                <Subheading className="mb-2 text-white" level={3}>
                  即効性
                </Subheading>
                <Text className="text-sm text-blue-100">
                  今日から使える シンプルな仕組み
                </Text>
              </div>
              <div className="rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
                <div className="mb-3 text-3xl">🎯</div>
                <Subheading className="mb-2 text-white" level={3}>
                  高精度
                </Subheading>
                <Text className="text-sm text-blue-100">
                  AI予測による 確度82%の早期発見
                </Text>
              </div>
              <div className="rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
                <div className="mb-3 text-3xl">💝</div>
                <Subheading className="mb-2 text-white" level={3}>
                  安心設計
                </Subheading>
                <Text className="text-sm text-blue-100">
                  完全匿名化で プライバシー保護
                </Text>
              </div>
            </div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col gap-4 sm:flex-row sm:justify-center"
              initial={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.15 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <motion.button
                className="group hover:shadow-3xl relative inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400 px-10 py-5 text-xl font-bold text-gray-900 shadow-2xl transition-all duration-300 hover:from-yellow-300 hover:to-orange-300"
                transition={{ duration: 0.15 }}
                whileHover={{ y: -2 }}
                whileTap={{}}
                onClick={() => router.push("/dashboard")}
              >
                <div className="flex items-center space-x-3">
                  <motion.div
                    className="text-2xl"
                    whileHover={{
                      y: [0, -5, 0],
                      transition: { duration: 0.15, repeat: Infinity },
                    }}
                  >
                    🚀
                  </motion.div>
                  <span>今すぐ体験開始</span>
                </div>
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-400 opacity-30 blur transition-all group-hover:opacity-70" />
              </motion.button>
              <motion.button
                className="inline-flex items-center justify-center rounded-2xl border-2 border-white/30 bg-white/10 px-10 py-5 text-xl font-medium text-white backdrop-blur-sm transition-all duration-300 hover:border-white/50 hover:bg-white/20"
                transition={{ duration: 0.15 }}
                whileHover={{ y: -2 }}
                whileTap={{}}
                onClick={() => setShowLoginModal(true)}
              >
                <div className="flex items-center space-x-3">
                  <motion.div
                    className="text-xl"
                    transition={{ duration: 0.15 }}
                    whileHover={{ rotate: 360 }}
                  >
                    📊
                  </motion.div>
                  <span>デモを体験</span>
                </div>
              </motion.button>
            </motion.div>

            {/* Trust Indicators */}
            <div className="mt-12 border-t border-white/20 pt-8">
              <Text className="mb-6 text-blue-200">
                安心してお使いいただけます
              </Text>
              <div className="flex flex-wrap items-center justify-center gap-8 text-white/60">
                <div className="flex items-center space-x-2">
                  <div>🔒</div>
                  <span className="text-sm">GDPR準拠</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div>🛡️</div>
                  <span className="text-sm">ISO27001準拠</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div>📊</div>
                  <span className="text-sm">99.9%稼働率</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div>💬</div>
                  <span className="text-sm">24時間サポート</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-950/10 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Text className="mb-4 text-gray-600">
              © 2025 離職リスク予測ダッシュボード. Built with{" "}
              <Strong>Next.js 15</Strong>、<Strong>TypeScript</Strong>、
              <Strong>Tailwind CSS</Strong>.
            </Text>
            <Text className="text-sm text-gray-500">
              「日々の声から、未来の離職をゼロへ。」
            </Text>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <Heading level={3}>デモ用ログイン</Heading>
              <button
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setShowLoginModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  ユーザーを選択してください
                </label>
                <select
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                >
                  <option value="">-- ユーザーを選択 --</option>
                  {mockUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.department} -{" "}
                      {user.role === "employee"
                        ? "社員"
                        : user.role === "manager"
                          ? "マネージャー"
                          : user.role === "hr"
                            ? "人事"
                            : "管理者"}
                      )
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
                  onClick={() => setShowLoginModal(false)}
                >
                  キャンセル
                </button>
                <button
                  className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!selectedUser}
                  onClick={() => {
                    if (selectedUser) {
                      // ローカルストレージにユーザーIDを保存
                      localStorage.setItem("currentUserId", selectedUser);
                      setIsLoggedIn(true);
                      setCurrentUser(selectedUser);
                      setShowLoginModal(false);
                      router.push("/dashboard");
                    }
                  }}
                >
                  ログイン
                </button>
              </div>
            </div>

            <div className="mt-6 rounded-md bg-blue-50 p-4">
              <Text className="text-sm text-blue-800">
                <Strong>デモ用システムです</Strong>
                <br />
                お好きなユーザーでログインして、離職リスク予測ダッシュボードの機能をお試しください。
              </Text>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
