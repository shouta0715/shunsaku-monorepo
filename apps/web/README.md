# やめどき予報（離職リスク予測ダッシュボード）

> 「日々の声から、未来の離職をゼロへ。」

社員の日々の満足度を天気メタファーで可視化し、離職リスクを早期発見する次世代HRダッシュボード

![Dashboard Preview](./docs/images/dashboard-preview.png)

## 🌟 プロジェクトの特徴

**やめどき予報**は、従業員の満足度を天気（⛈️🌧️🌤️🌞☀️）で表現し、直感的に理解できるHRダッシュボードです。日々の5問アンケートから離職リスクを予測し、早期のフォローアップを可能にします。

## ✨ 主要機能

- 📊 **日次アンケート**: 5問5択の簡単回答で満足度をスコア化
- 📈 **リアルタイム分析**: 個人・チーム・全社の満足度推移を可視化
- ⚠️ **アラート機能**: 離職リスク高の社員を自動検知・通知
- 📋 **レポート生成**: 週次・月次の詳細分析レポート
- 🔮 **予測分析**: AIによる離職リスク予測モデル
- 🔒 **セキュリティ**: AES-256暗号化・GDPR準拠
- 📱 **レスポンシブ**: スマートフォン・タブレット・デスクトップ対応

## 🚀 クイックスタート

### 前提条件

- Node.js 20.x以上
- PostgreSQL 15.x以上
- Redis (オプション、キャッシュ用)

### インストール・起動

```bash
# 1. リポジトリクローン
git clone https://github.com/your-org/shunsaku-monorepo.git
cd shunsaku-monorepo/apps/web

# 2. 依存関係インストール
npm install

# 3. 環境変数設定（現在はモック実装のため不要）
# cp .env.example .env.local

# 4. 開発サーバー起動
npm run dev
```

アプリケーションは http://localhost:3000 で起動します。

**デモユーザー（モック認証）**:

- 一般社員: `tanaka@example.com` (田中太郎)
- マネージャー: `sato@example.com` (佐藤次郎)
- HR: `suzuki@example.com` (鈴木美咲)
- 管理者: `takahashi@example.com` (高橋健一)

### 初期セットアップ

現在はモック実装のため、初期セットアップは不要です。上記のデモユーザーでログインできます。

### 環境変数設定（将来実装予定）

現在はモック実装のため環境変数設定は不要です。将来的に以下の環境変数が必要になります:

```bash
# データベース（将来実装）
DATABASE_URL=postgresql://user:password@localhost:5432/yamefoki

# 認証（将来実装）
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-32-character-secret-key

# その他の外部サービス（将来実装）
RESEND_API_KEY=your-resend-api-key
SLACK_WEBHOOK_URL=your-slack-webhook-url
```

## 🏗️ 技術スタック

### フロントエンド

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4.x
- **State Management**: React State（Zustand導入予定）
- **Animations**: Framer Motion
- **UI Components**: Custom Components + Lucide React
- **Forms**: Controlled Components（React Hook Form導入予定）

### バックエンド（現在はモック実装）

- **Runtime**: Node.js 20.x
- **API**: Next.js API Routes（モックAPI）
- **Database**: モックデータ（PostgreSQL導入予定）
- **Authentication**: モック認証（NextAuth.js導入予定）
- **Validation**: 基本的なバリデーション（Zod導入予定）

### 開発・デプロイ

- **Build Tool**: Next.js built-in
- **Linting**: ESLint + Prettier + TypeScript
- **Package Manager**: npm
- **Hosting**: Vercel対応
- **Testing**: Jest導入予定
- **CI/CD**: GitHub Actions導入予定

## 📁 プロジェクト構造

```
src/
├── app/                      # Next.js App Router
│   ├── alerts/              # アラートページ
│   ├── analytics/           # 分析ページ
│   ├── api/mock/            # モックAPI
│   │   ├── alerts/          # アラートAPI
│   │   ├── analytics/       # 分析API
│   │   ├── scoring/         # スコアリングAPI
│   │   └── survey/          # アンケートAPI
│   ├── dashboard/           # ダッシュボード
│   ├── survey/              # アンケート
│   │   ├── page.tsx         # アンケート回答
│   │   └── history/         # 回答履歴
│   ├── globals.css          # グローバルCSS
│   ├── layout.tsx           # ルートレイアウト
│   └── page.tsx             # ランディングページ
├── components/              # Reactコンポーネント
│   ├── alerts/              # アラート関連
│   ├── layout/              # レイアウトコンポーネント
│   │   ├── DashboardLayout.tsx
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   ├── survey/              # アンケート関連
│   └── ui/                  # 基本UIコンポーネント
├── lib/                     # ユーティリティ
│   ├── mock-auth.ts         # モック認証
│   ├── mock-data.ts         # モックデータ
│   ├── survey-utils.ts      # アンケートユーティリティ
│   └── utils.ts             # 汎用ユーティリティ
└── types/                   # TypeScript型定義
    └── index.ts             # 全型定義
```

## 🔌 API仕様（モック実装）

現在はすべてモックAPIとして実装されています。

### アンケートAPI

```
GET    /api/mock/survey/questions    # アンケート質問取得
GET    /api/mock/survey/status       # 本日の回答状況
POST   /api/mock/survey/submit       # アンケート回答送信
```

### スコアリングAPI

```
GET    /api/mock/scoring/current     # 現在のリスクスコア
GET    /api/mock/scoring/team        # チームメンバーのリスク分布
```

### 分析API

```
GET    /api/mock/analytics          # 詳細分析データ取得
```

### アラートAPI

```
GET    /api/mock/alerts             # アラート一覧取得
```

詳細なAPI仕様は [API Documentation](./docs/API.md) を参照してください。

## 🧪 テスト（今後実装予定）

テストは今後実装予定です。以下のテスト戦略を計画しています:

- **ユニットテスト**: Jest + Testing Library
- **統合テスト**: API Routes のテスト
- **E2Eテスト**: Playwright

### 現在の品質管理

```bash
# リント実行
npm run lint
npm run lint:fix

# 型チェック
npm run type-check

# フォーマット
npm run format
```

## 🚀 本番デプロイメント

### Vercelデプロイ

```bash
# Vercel CLIインストール
npm i -g vercel

# 初回デプロイ設定
vercel

# 本番デプロイ
vercel --prod
```

### 本番環境変数

Vercelダッシュボードで以下の環境変数を設定:

```bash
NODE_ENV=production
DATABASE_URL=postgresql://... # 本番DB URL
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=... # 本番用シークレット
JWT_SECRET=... # 本番用JWTシークレット
ENCRYPTION_KEY=... # 本番用暗号化キー
RESEND_API_KEY=... # Resend API key
REDIS_URL=... # Redis URL（本番用）
```

### データベース設定（将来実装）

現在はモックデータを使用しているため、データベース設定は不要です。

## 📊 監視・メトリクス

### パフォーマンス監視

- **Vercel Analytics**: ページパフォーマンス・ユーザー行動
- **Sentry**: エラー監視・パフォーマンス追跡
- **DataDog**: インフラ監視・ログ集約（オプション）

### 主要メトリクス

- **システム稼働率**: 99.9%以上
- **ページ読み込み時間**: 3秒以内
- **日次回答率**: 90%以上目標
- **ユーザー満足度**: 4.0/5.0以上

### アラート設定

- エラー率5%超過時
- レスポンス時間10秒超過時
- データベース接続失敗時
- 離職リスク高判定時

## 🔧 開発ワークフロー

### ブランチ戦略

```
main           # 本番環境（自動デプロイ）
├── develop    # 開発統合環境
├── feature/xxx # 機能開発ブランチ
└── hotfix/xxx  # 緊急修正ブランチ
```

### コミット規約

```bash
feat: 新機能追加
fix: バグ修正
docs: ドキュメント更新
style: コードフォーマット修正
refactor: リファクタリング
test: テスト追加・修正
chore: その他の変更
```

例: `feat: add survey response validation`

### Pull Request手順

1. `develop`から`feature/xxx`ブランチ作成
2. 機能開発・テスト作成
3. `npm run pre-commit`でローカル検証
4. `develop`にPull Request作成
5. CI/CD通過・コードレビュー後マージ
6. `develop`→`main`は週次リリース

### コードレビューポイント

- [ ] 機能要件を満たしているか
- [ ] セキュリティ脆弱性はないか
- [ ] パフォーマンスは問題ないか
- [ ] テストが適切に書かれているか
- [ ] ドキュメントが更新されているか

## 🛠️ 開発ガイド

### 新機能追加手順

1. **要件定義**: GitHub Issueで要件明確化
2. **設計**: API・UI設計をドキュメント化
3. **実装**: feature/xxxブランチで開発
4. **テスト**: ユニット・統合・E2Eテスト作成
5. **レビュー**: Pull Requestでコードレビュー
6. **デプロイ**: stagingでテスト後本番反映

### よく使うコマンド

```bash
# 開発
npm run dev                # 開発サーバー起動
npm run build              # 本番ビルド
npm run start              # 本番サーバー起動

# 品質管理
npm run lint               # リント実行
npm run lint:fix           # リント自動修正
npm run format             # コードフォーマット

# ビルド検証
npm run type-check         # TypeScript型チェック
```

### トラブルシューティング

#### よくある問題

**問題**: TypeScriptエラー

```bash
# 解決策
npm run type-check         # 型エラー確認
npm run build              # ビルドで詳細確認
```

**問題**: ESLintエラー

```bash
# 解決策
npm run lint               # エラー確認
npm run lint:fix           # 自動修正
```

**問題**: ビルドエラー

```bash
# 解決策
rm -rf .next               # キャッシュクリア
npm run build              # 再ビルド
```

## 🔒 セキュリティ（今後強化予定）

### 現在のセキュリティ対策

- **認証**: モック認証（実装済み）
- **認可**: ロールベースアクセス制御（実装済み）
- **XSS対策**: React自動エスケープ（実装済み）

### 今後実装予定のセキュリティ機能

- JWT認証
- データ暗号化
- CSRF対策
- レート制限
- 監査ログ

### 依存関係の管理

```bash
# 脆弱性チェック
npm audit

# 依存関係更新
npm update
```

## 🤝 コントリビューション

### 貢献方法

1. このリポジトリをFork
2. feature/xxx ブランチを作成
3. 変更をコミット・プッシュ
4. Pull Requestを作成

### 開発者向けセットアップ

```bash
# 開発環境セットアップ
git clone https://github.com/your-username/shunsaku-monorepo.git
cd shunsaku-monorepo/apps/web
npm install
npm run dev
```

### Issue報告

バグ報告や機能要望は[GitHub Issues](https://github.com/your-org/shunsaku-monorepo/issues)で受け付けています。

**バグ報告テンプレート**:

- 環境情報（OS、ブラウザ、Node.jsバージョン）
- 再現手順
- 期待される動作
- 実際の動作
- エラーメッセージ・スクリーンショット

## 📋 現在の実装状況とロードマップ

### 実装済み機能 ✅

- **認証システム**: モック認証（7名のサンプルユーザー）
- **ダッシュボード**: 個人・チーム統計表示
- **日次アンケート**: 天気メタファーによる5段階評価
- **アラート機能**: リスクレベル別通知
- **分析機能**: トレンド分析とAI予測（モック）
- **履歴機能**: 過去の回答履歴表示
- **レスポンシブデザイン**: モバイル対応
- **アニメーション**: Framer Motionによる滑らかなUI

### 未実装機能 ❌

- **チーム管理ページ** (`/team`)
- **管理者設定ページ** (`/admin`)
- **ユーザープロフィール** (`/profile`)
- **実データベース連携**
- **本番認証システム**
- **メール/Slack通知**
- **レポート生成（PDF/Excel）**
- **多言語対応**

### 今後のロードマップ

#### Phase 1: 基盤強化（3ヶ月）

- [ ] PostgreSQLデータベース統合
- [ ] NextAuth.js認証実装
- [ ] Zustand状態管理導入
- [ ] Jest/Playwrightテスト実装

#### Phase 2: 機能拡張（6ヶ月）

- [ ] チーム・管理者ページ実装
- [ ] 通知システム（Email/Slack）
- [ ] レポート生成機能
- [ ] 多言語対応（日英）

#### Phase 3: エンタープライズ対応（12ヶ月）

- [ ] AI/ML統合（本格的な予測モデル）
- [ ] 外部HRシステム連携
- [ ] マルチテナント対応
- [ ] モバイルアプリ開発

## 📞 サポート・連絡先

### 開発チーム

- **プロジェクトオーナー**: [Your Name](mailto:owner@company.com)
- **リードデベロッパー**: [Lead Dev](mailto:lead@company.com)
- **DevOpsエンジニア**: [DevOps](mailto:devops@company.com)

### サポート窓口

- **バグ報告**: [GitHub Issues](https://github.com/your-org/shunsaku-monorepo/issues)
- **機能要望**: [GitHub Discussions](https://github.com/your-org/shunsaku-monorepo/discussions)
- **技術サポート**: support@company.com
- **緊急時**: emergency@company.com

### ドキュメント

- [アーキテクチャ設計書](./docs/ARCHITECTURE.md)
- [API仕様書](./docs/API.md)
- [コンポーネントドキュメント](./docs/COMPONENTS.md)
- [開発ガイド](./docs/DEVELOPMENT.md)
- [デプロイメントガイド](./docs/DEPLOYMENT.md)

## 📄 ライセンス

このプロジェクトは [MIT License](./LICENSE) の下で公開されています。

```
MIT License

Copyright (c) 2025 Your Company

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<div align="center">

**Made with ❤️ by HRTech Team**

[🌐 Website](https://your-company.com) • [📧 Contact](mailto:contact@company.com) • [🐦 Twitter](https://twitter.com/yourcompany)

</div>
