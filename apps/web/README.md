# 離職リスク予測ダッシュボード

> 「日々の声から、未来の離職をゼロへ。」

社員の日々の満足度を可視化し、離職リスクを早期発見する次世代HRダッシュボード

![Dashboard Preview](./docs/images/dashboard-preview.png)

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
git clone https://github.com/your-org/employee-satisfaction-dashboard.git
cd employee-satisfaction-dashboard

# 2. 依存関係インストール
npm install

# 3. 環境変数設定
cp .env.example .env.local
# 必要な環境変数を設定（詳細は下記参照）

# 4. データベースセットアップ
npm run db:setup
npm run db:migrate
npm run db:seed

# 5. 開発サーバー起動
npm run dev
```

アプリケーションは http://localhost:3000 で起動します。

### 初期セットアップ

```bash
# 管理者ユーザー作成
npm run create-admin
# Email: admin@company.com
# Password: Admin123!

# テストデータ生成（開発環境のみ）
npm run generate-test-data
```

### 環境変数設定

`.env.local` ファイルに以下を設定してください:

```bash
# データベース
DATABASE_URL=postgresql://user:password@localhost:5432/employee_satisfaction

# 認証
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-32-character-secret-key
JWT_SECRET=your-jwt-secret-key

# 暗号化
ENCRYPTION_KEY=your-32-character-hex-encryption-key

# メール送信（Resend）
RESEND_API_KEY=your-resend-api-key

# Redis（オプション）
REDIS_URL=redis://localhost:6379

# 外部連携（オプション）
SLACK_WEBHOOK_URL=your-slack-webhook-url
TEAMS_WEBHOOK_URL=your-teams-webhook-url
```

## 🏗️ 技術スタック

### フロントエンド

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4.x
- **State Management**: Zustand 4.x
- **Charts**: Recharts 2.x
- **Forms**: React Hook Form + Zod
- **UI Components**: Headless UI + Lucide React

### バックエンド

- **Runtime**: Node.js 20.x
- **Database**: PostgreSQL 15.x
- **ORM**: Native SQL with pg
- **Authentication**: NextAuth.js
- **Validation**: Zod 3.x
- **Email**: Resend
- **Cache**: Redis (オプション)

### 開発・デプロイ

- **Build Tool**: Next.js built-in
- **Testing**: Jest + Testing Library + Playwright
- **Linting**: ESLint + Prettier + TypeScript
- **CI/CD**: GitHub Actions
- **Hosting**: Vercel
- **Monitoring**: Vercel Analytics + Sentry

## 📁 プロジェクト構造

```
src/
├── app/                      # Next.js App Router
│   ├── (auth)/              # 認証ページグループ
│   │   ├── login/           # ログインページ
│   │   └── layout.tsx       # 認証レイアウト
│   ├── (dashboard)/         # ダッシュボードページグループ
│   │   ├── dashboard/       # ダッシュボード
│   │   ├── survey/          # アンケート
│   │   ├── analytics/       # 分析
│   │   └── layout.tsx       # ダッシュボードレイアウト
│   ├── api/                 # API Routes
│   │   ├── auth/            # 認証API
│   │   ├── survey/          # アンケートAPI
│   │   ├── analytics/       # 分析API
│   │   └── alerts/          # アラートAPI
│   ├── globals.css          # グローバルCSS
│   ├── layout.tsx           # ルートレイアウト
│   └── page.tsx             # ホームページ
├── components/              # Reactコンポーネント
│   ├── ui/                 # 基本UIコンポーネント
│   ├── layout/             # レイアウトコンポーネント
│   ├── dashboard/          # ダッシュボード専用
│   ├── survey/             # アンケート専用
│   ├── charts/             # チャートコンポーネント
│   └── auth/               # 認証コンポーネント
├── lib/                    # ユーティリティ・設定
│   ├── auth.ts             # 認証ロジック
│   ├── database.ts         # データベース接続
│   ├── scoring.ts          # スコア計算
│   ├── analytics.ts        # 分析ロジック
│   └── validations/        # バリデーションスキーマ
├── hooks/                  # カスタムReactフック
├── store/                  # Zustand状態管理
├── types/                  # TypeScript型定義
└── scripts/                # ユーティリティスクリプト
```

## 🔌 API仕様

### 認証エンドポイント

```
POST   /api/auth/login      # ログイン
POST   /api/auth/logout     # ログアウト
GET    /api/auth/me         # 現在のユーザー情報
```

### アンケートエンドポイント

```
GET    /api/survey/daily    # 今日のアンケート取得
POST   /api/survey          # アンケート回答送信
GET    /api/survey/history  # 回答履歴
```

### 分析・統計エンドポイント

```
GET    /api/analytics/personal  # 個人分析データ
GET    /api/analytics/team      # チーム分析データ
GET    /api/analytics/company   # 全社分析データ
GET    /api/analytics/trends    # トレンド分析
```

### アラート・通知エンドポイント

```
GET    /api/alerts         # アラート一覧取得
POST   /api/alerts         # アラート作成
PUT    /api/alerts/[id]    # アラート更新（既読等）
GET    /api/notifications  # 通知一覧
```

### レポートエンドポイント

```
GET    /api/reports        # レポート一覧
POST   /api/reports/generate  # レポート生成
GET    /api/reports/[id]   # レポートダウンロード
```

詳細なAPI仕様は [API Documentation](./docs/api.md) を参照してください。

## 🧪 テスト

### ユニットテスト

```bash
# テスト実行
npm run test                # 一回実行
npm run test:watch         # ウォッチモード
npm run test:coverage      # カバレッジ付き

# 特定のテストファイル実行
npm run test -- --testPathPattern=scoring
npm run test -- components/Button
```

### E2Eテスト

```bash
# E2Eテスト実行
npm run test:e2e           # ヘッドレスモード
npm run test:e2e:ui        # UIモード
npm run test:e2e:debug     # デバッグモード

# 特定のテスト実行
npm run test:e2e -- --grep "survey flow"
```

### テストカバレッジ目標

- **ユニットテスト**: 90%以上
- **統合テスト**: 80%以上
- **E2Eテスト**: 主要フロー100%

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

### データベース移行

```bash
# 本番データベースマイグレーション
DATABASE_URL=postgresql://prod-url npm run db:migrate

# 初期データ投入（質問項目等）
DATABASE_URL=postgresql://prod-url npm run db:seed:prod
```

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
npm run type-check         # 型チェック
npm run format             # コードフォーマット

# データベース
npm run db:migrate         # マイグレーション実行
npm run db:rollback        # マイグレーション巻き戻し
npm run db:seed            # シードデータ投入
npm run db:studio          # データベースGUI

# ユーティリティ
npm run analyze            # バンドルサイズ分析
npm run generate:types     # 型定義生成
npm run check:deps         # 依存関係チェック
```

### トラブルシューティング

#### よくある問題

**問題**: データベース接続エラー

```bash
# 解決策
npm run db:setup           # データベース再作成
npm run db:migrate         # マイグレーション実行
```

**問題**: TypeScriptエラー

```bash
# 解決策
npm run type-check         # 型エラー確認
npm run build              # ビルドで詳細確認
```

**問題**: テスト失敗

```bash
# 解決策
npm run test:coverage      # カバレッジ確認
npm run test:watch         # ウォッチモードで修正
```

**問題**: 本番デプロイ失敗

```bash
# 解決策
vercel logs                # ログ確認
vercel env ls              # 環境変数確認
```

## 🔒 セキュリティ

### セキュリティ対策実装済み

- **認証**: JWT + セッション管理
- **認可**: ロールベースアクセス制御
- **暗号化**: AES-256による機密データ暗号化
- **入力検証**: Zodによる厳格なバリデーション
- **CSRF対策**: CSRFトークン検証
- **XSS対策**: サニタイゼーション実装
- **SQL Injection対策**: パラメータ化クエリ

### セキュリティ監査

```bash
# 脆弱性スキャン
npm audit                  # npm脆弱性チェック
npm run security:scan      # セキュリティスキャン

# 依存関係更新
npm update                 # 安全な更新
npm run deps:check         # 危険な依存関係チェック
```

### GDPR・個人情報保護

- データの利用目的明示
- 個人データの暗号化保存
- データ削除権の実装
- アクセスログの記録
- データ保持期間の管理

## 🤝 コントリビューション

### 貢献方法

1. このリポジトリをFork
2. feature/xxx ブランチを作成
3. 変更をコミット・プッシュ
4. Pull Requestを作成

### 開発者向けセットアップ

```bash
# 開発環境セットアップ
git clone https://github.com/your-username/employee-satisfaction-dashboard.git
cd employee-satisfaction-dashboard
npm install
npm run dev

# pre-commitフック設定
npm run prepare              # Huskyセットアップ
```

### Issue報告

バグ報告や機能要望は[GitHub Issues](https://github.com/your-org/employee-satisfaction-dashboard/issues)で受け付けています。

**バグ報告テンプレート**:

- 環境情報（OS、ブラウザ、Node.jsバージョン）
- 再現手順
- 期待される動作
- 実際の動作
- エラーメッセージ・スクリーンショット

## 📋 ロードマップ

### v1.0 - MVP（完了）

- [x] 基本認証システム
- [x] 日次アンケート機能
- [x] 個人・管理者ダッシュボード
- [x] 基本スコアリング・リスクレベル

### v1.1 - 分析強化（開発中）

- [x] 詳細分析・比較機能
- [x] アラート・通知システム
- [x] レポート生成機能
- [ ] モバイルアプリ最適化

### v1.2 - AI機能（計画中）

- [ ] 機械学習による離職予測
- [ ] 自然言語処理によるフィードバック分析
- [ ] 推奨アクションの自動提案

### v2.0 - エンタープライズ機能（検討中）

- [ ] マルチテナント対応
- [ ] 高度なカスタマイズ機能
- [ ] 外部HRシステム連携強化
- [ ] リアルタイム協業機能

## 📞 サポート・連絡先

### 開発チーム

- **プロジェクトオーナー**: [Your Name](mailto:owner@company.com)
- **リードデベロッパー**: [Lead Dev](mailto:lead@company.com)
- **DevOpsエンジニア**: [DevOps](mailto:devops@company.com)

### サポート窓口

- **バグ報告**: [GitHub Issues](https://github.com/your-org/employee-satisfaction-dashboard/issues)
- **機能要望**: [GitHub Discussions](https://github.com/your-org/employee-satisfaction-dashboard/discussions)
- **技術サポート**: support@company.com
- **緊急時**: emergency@company.com

### ドキュメント

- [API仕様書](./docs/api.md)
- [設計ドキュメント](./docs/architecture.md)
- [デプロイガイド](./docs/deployment.md)
- [セキュリティガイド](./docs/security.md)

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
