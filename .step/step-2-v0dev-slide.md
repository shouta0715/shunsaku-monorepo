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

### **7 つのスライド構成（見出し左上固定・コンテンツ中央配置）**

1. **タイトルスライド**

   - **左上見出し**: "01 | プロジェクトタイトル"
   - **中央コンテンツ**: プロジェクト名とサブタイトル、優しいブルーのアクセント、ミニマルなレイアウト

2. **プロジェクト概要**

   - **左上見出し**: "02 | プロジェクト概要"
   - **中央コンテンツ**: コンセプト・目的・ターゲットを白いカードで表示、アイコン + テキストの組み合わせ

3. **技術仕様**

   - **左上見出し**: "03 | 技術仕様"
   - **中央コンテンツ**: モダンテックスタックをカード形式で、Next.js, TypeScript, Tailwind のアイコン表示

4. **デザインシステム**

   - **左上見出し**: "04 | デザインシステム"
   - **中央コンテンツ**: カラーパレット見本を表示、統一感のある UI 要素サンプル

5. **主要機能**

   - **左上見出し**: "05 | 主要機能"
   - **中央コンテンツ**: 機能を優しい色のバッジで表示、ユーザージャーニーフロー

6. **実装ハイライト**

   - **左上見出し**: "06 | 実装ハイライト"
   - **中央コンテンツ**: 技術的特徴を視覚的に、コード品質とパフォーマンス指標

7. **今後の展望**

   - **左上見出し**: "07 | 今後の展望"
   - **中央コンテンツ**: ロードマップタイムライン、期待効果とビジョン

## プレゼンテーション機能

### ナビゲーション

- **前後移動**: 優しいボタン (bg-white border-slate-200)
- **キーボード**: 矢印キー対応

### レスポンシブ対応

- **デスクトップ**: 16:9 比率スライド
- **タブレット**: 適応型レイアウト
- **モバイル**: 縦型最適化

## 視覚的要素

### アニメーション

- **トランジション**: 優しいフェード (duration-300)
- **ホバー効果**: 微細な shadow 変化
- **進行表示**: スムーズなプログレスバー

### レイアウト構成

#### スライド全体構造

- **フルスクリーンレイアウト**: `h-screen w-full relative`
- **見出し配置**: 左上固定 (`absolute top-4 left-6 md:top-8 md:left-8`)
- **コンテンツエリア**: 上下左右中央配置 (`flex items-center justify-center min-h-screen`)

#### 配置仕様

- **見出し固定位置**:
  - デスクトップ: `top-8 left-8`
  - モバイル: `top-4 left-6`
  - z-index: `z-10`で最前面
- **メインコンテンツ**:
  - 中央配置: `flex items-center justify-center`
  - 最大幅: `max-w-4xl mx-auto`
  - パディング: `px-6 md:px-8`

#### レスポンシブ対応

- **余白**: 十分なホワイトスペース（8px グリッドシステム）
- **タイポグラフィ**: 階層的な文字サイズ
- **アイコン**: Lucide React で統一

## コンテンツ表示要件

### 各スライドの視覚的統一

#### 見出しエリア（左上固定）

- **スライドタイトル**: 左上固定位置、統一フォーマット (text-slate-900)
- **タイトルサイズ**: `text-xl md:text-2xl font-bold`
- **サブタイトル**: `text-sm md:text-base text-slate-600`
- **背景**: 透明または `bg-white/90 backdrop-blur-sm`（可読性確保）

#### メインコンテンツエリア（中央配置）

- **本文**: 読みやすい行間 (text-slate-600)
- **アクセント**: 控えめなブルー系統
- **カード**: 全て同じスタイル (bg-white + border-slate-200 + shadow-sm)
- **中央配置**: `flex flex-col items-center justify-center`

### 情報階層（配置別）

#### 見出しエリア

- **メインタイトル**: text-xl md:text-2xl font-bold (text-slate-900)
- **サブタイトル**: text-sm md:text-base (text-slate-600)

#### 中央コンテンツエリア

- **セクションタイトル**: text-2xl md:text-3xl font-bold (text-slate-900)
- **説明文**: text-lg md:text-xl (text-slate-600)
- **本文**: text-base (text-slate-600)
- **キャプション**: text-sm (text-slate-400)

## v0.dev プロンプト最適化（メイン仕様準拠）

### 必須キーワード

- "clean white slideshow design"
- "soft color palette"
- "consistent component styling"
- "gentle user interface"
- "unified color scheme"
- "modern minimal aesthetic"
- "professional presentation layout"
- "fixed header top-left positioning"
- "centered content layout"

### スタイル指定

- "white background with subtle slate cards"
- "fixed slide title in top-left corner"
- "main content centered vertically and horizontally"
- "gentle hover effects"
- "clean typography hierarchy"
- "soft transitions and animations"
- "fullscreen slide layout"

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
