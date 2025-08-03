# プロジェクトプレゼンテーション - スライドショーアプリケーション

## デザイン基準

**ベースサイト**: 現在開発中の Web アプリケーションの白基調デザインシステムを継承
**統一カラーパレット**: bg-white, text-slate-600, border-slate-200, アクセントは blue-50/blue-600 系

## v0.dev 最適化スライドショー仕様

### 技術要件

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **UI Library**: shadcn/ui components
- **Icons**: Lucide React
- **Page Route**: `/slide-show`

## デザインシステム - Clean Gentle Design（メイン仕様準拠）

### カラーパレット（完全統一）

```
Primary Colors (メイン仕様と統一):
- Background: bg-white, bg-gray-50, bg-gray-25
- Primary: bg-blue-50, text-blue-600, border-blue-200
- Secondary: bg-emerald-50, text-emerald-600, border-emerald-200
- Accent: bg-rose-50, text-rose-600, border-rose-200
- Neutral: bg-slate-50, text-slate-600, border-slate-200

Text Hierarchy (統一):
- Headlines: text-slate-900
- Body: text-slate-600
- Muted: text-slate-400
- Links: text-blue-600 hover:text-blue-700

Components Styling (統一):
- Cards: bg-white + border-slate-200 + shadow-sm
- Buttons: Primary (bg-blue-600), Secondary (bg-white border-slate-200)
- Borders: border-slate-200 で統一
```

### UI 原則（メイン仕様準拠）

- **Tone**: Clean, Gentle, Professional, Approachable
- **Typography**: font-inter または font-geist-sans
- **Spacing**: 一貫した 8px グリッドシステム
- **Border Radius**: rounded-lg (8px) 統一
- **Shadows**: shadow-sm, shadow-md のみ使用（メイン仕様と統一）
- **Borders**: border-slate-200 で統一
- **Hover Effects**: 優しいトランジション (transition-all duration-200)
- **@package/ui コンポーネント使用**: 既存コンポーネント優先

## スライドショー構成

### **8 つのスライド構成**

1. **タイトルスライド**

   - プロジェクト名とサブタイトル
   - 優しいブルーのアクセント
   - ミニマルなレイアウト

2. **プロジェクト概要**

   - コンセプト・目的・ターゲットを白いカードで表示
   - アイコン + テキストの組み合わせ

3. **技術仕様**

   - モダンテックスタックをカード形式で
   - Next.js, TypeScript, Tailwind のアイコン表示

4. **デザインシステム**

   - カラーパレット見本を表示
   - 統一感のある UI 要素サンプル

5. **主要機能**

   - 機能を優しい色のバッジで表示
   - ユーザージャーニーフロー

6. **実装ハイライト**

   - 技術的特徴を視覚的に
   - コード品質とパフォーマンス指標

7. **今後の展望**

   - ロードマップタイムライン
   - 期待効果とビジョン

8. **質疑応答**
   - まとめスライド
   - コンタクト情報

## プレゼンテーション機能

### ナビゲーション

- **前後移動**: 優しいボタン (bg-white border-slate-200)
- **スライド選択**: ドット形式プログレスバー
- **キーボード**: 矢印キー対応

### 自動再生機能

- **間隔**: 10 秒自動進行
- **プログレス**: 優しいブルーのプログレスバー
- **一時停止**: ホバーで停止

### レスポンシブ対応

- **デスクトップ**: 16:9 比率スライド
- **タブレット**: 適応型レイアウト
- **モバイル**: 縦型最適化

## 視覚的要素

### アニメーション

- **トランジション**: 優しいフェード (duration-300)
- **ホバー効果**: 微細な shadow 変化
- **進行表示**: スムーズなプログレスバー

### レイアウト

- **余白**: 十分なホワイトスペース
- **タイポグラフィ**: 階層的な文字サイズ
- **アイコン**: Lucide React で統一

## コンテンツ表示要件

### 各スライドの視覚的統一

- **ヘッダー**: 統一フォーマット (text-slate-900)
- **本文**: 読みやすい行間 (text-slate-600)
- **アクセント**: 控えめなブルー系統
- **カード**: 全て同じスタイル (bg-white + border)

### 情報階層

- **タイトル**: text-2xl md:text-3xl font-bold
- **サブタイトル**: text-lg text-slate-600
- **本文**: text-base text-slate-600
- **キャプション**: text-sm text-slate-400

## ダウンロード機能

### スライド下部に配置

- **PDF ダウンロード**: 全スライドまとめ (presentation.pdf)
- **画像セット**: 個別 PNG 画像 (slide1.png - slide8.png)
- **ボタンデザイン**: 優しいブルー (bg-blue-600 hover:bg-blue-700)

### ダウンロードコンテンツ

- 高解像度画像 (1920x1080)
- 印刷最適化 PDF
- プロフェッショナル品質

## v0.dev プロンプト最適化（メイン仕様準拠）

### 必須キーワード

- "clean white slideshow design"
- "soft color palette"
- "consistent component styling"
- "gentle user interface"
- "unified color scheme"
- "modern minimal aesthetic"
- "professional presentation layout"

### スタイル指定

- "white background with subtle slate cards"
- "gentle hover effects"
- "clean typography hierarchy"
- "soft transitions and animations"

### 避ける要素（メイン仕様準拠）

- 強い色 (red-500, blue-500、zinc 系の強いコントラスト)
- 鋭いコントラスト
- 複雑なグラデーション
- shadow-lg, shadow-xl 等の強い影
- 不統一な色使い

---

**最優先事項**:

1. 本サイトとの完全な統一感
2. 白基調で優しい色使い
3. プロフェッショナルなプレゼンテーション品質
4. 清潔で読みやすいレイアウト

**実装パス**: `/slide-show` ページで 8 枚のスライドと自動再生機能を実装
