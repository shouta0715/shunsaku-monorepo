# [プロジェクト名] - モダン Web アプリケーション

## プロジェクト概要

統一されたデザインシステムを持つ、モダンでアクセシブルな Web アプリケーション。  
白基調の優しい色調で、プロフェッショナルかつ親しみやすいユーザー体験を提供。

## v0.dev 最適化設計仕様

### 技術スタック

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **UI Library**: shadcn/ui components
- **Icons**: Lucide React
- **Responsive**: Mobile-first design approach

## デザインシステム (最重要)

### カラーパレット - 白基調 & 優しい色調

```
Primary Colors (統一使用):
- Background: bg-white, bg-gray-50, bg-gray-25
- Primary: bg-blue-50, text-blue-600, border-blue-200
- Secondary: bg-emerald-50, text-emerald-600, border-emerald-200
- Accent: bg-rose-50, text-rose-600, border-rose-200
- Neutral: bg-slate-50, text-slate-600, border-slate-200

Text Hierarchy:
- Headlines: text-slate-900
- Body: text-slate-600
- Muted: text-slate-400
- Links: text-blue-600 hover:text-blue-700
```

### デザイン原則

- **Tone**: Clean, Gentle, Professional, Approachable
- **Typography**: font-inter または font-geist-sans
- **Spacing**: 一貫した 8px グリッドシステム
- **Border Radius**: rounded-lg (8px) 統一
- **Shadows**: shadow-sm, shadow-md のみ使用
- **Borders**: border-slate-200 で統一

### コンポーネント統一ルール

- **全てのカード**: bg-white + border-slate-200 + shadow-sm
- **ボタン**: Primary (bg-blue-600), Secondary (bg-white border-slate-200)
- **入力フィールド**: bg-white + border-slate-200 + focus:border-blue-500
- **バッジ**: bg-{color}-50 + text-{color}-600 組み合わせ
- **アイコン**: 同じ色系統の text-{color}-500 で統一

## レイアウト構成

### ページタイプ

- **Type**: [Single page / Multi-section landing / Dashboard など]
- **Navigation**: [Header nav / Sidebar など]
- **Style**: Modern Minimal with Gentle Aesthetics

### 必須セクション

1. **Header**: 白背景、優しいボーダー、統一ナビゲーション
2. **Hero Section**: 大きなホワイトスペース、ソフトなグラデーション
3. **Feature Sections**: カード型レイアウト、統一カラーパレット
4. **Slide Show Section**: `/slide-show`ページ、プレゼンテーション機能
5. **Footer**: ミニマル、白基調、優しいアクセント

## 機能要件

### Core Features

- **スライドショー機能**: プロジェクトプレゼンテーション用の自動再生・手動ナビゲーション対応スライドショー
- **統一デザインシステム**: 全ページで一貫したカラーパレット・コンポーネントスタイル
- **レスポンシブレイアウト**: モバイルファースト設計による全デバイス対応

### インタラクティブ要素

- **Hover Effects**: 優しいトランジション (transition-all duration-200)
- **Buttons**: ソフトなホバーエフェクト
- **Cards**: 微細な shadow 変化
- **Forms**: フォーカス時の優しいボーダー変化

### コンテンツエリア

- **Typography**: 読みやすい行間、適切なコントラスト
- **Images**: rounded-lg、優しい border
- **Icons**: 統一カラーパレットで色付け

## v0.dev 最適化指示

### 必須キーワード

- "clean white design"
- "soft color palette"
- "consistent component styling"
- "gentle user interface"
- "unified color scheme"
- "modern minimal aesthetic"

### 避ける要素

- 強い色 (red-500, blue-500 など)
- 鋭いコントラスト
- 複雑なグラデーション
- 不統一な色使い

## アクセシビリティ & パフォーマンス

- WCAG 2.1 AA 準拠
- 適切なコントラスト比 (白背景での可読性確保)
- キーボードナビゲーション
- セマンティック HTML 構造
- 最適化された画像使用

## 品質要件

- **Code Quality**: TypeScript strict mode
- **Reusability**: 統一デザインシステムに基づく再利用可能コンポーネント
- **Consistency**: 全コンポーネントで同じカラーパレット使用
- **Responsiveness**: Mobile-first responsive design
- **Performance**: 軽量で高速な UI

---

**最優先事項**:

1. 白基調の優しい色使いを徹底
2. 全コンポーネントでカラーパレットを統一
3. 清潔で親しみやすいデザイン
4. プロフェッショナルかつ温かみのある UI

**v0.dev プロンプト戦略**:

- 具体的な色指定を含める
- 統一感を強調する表現を使用
- 優しい・柔らかいトーンを明示
