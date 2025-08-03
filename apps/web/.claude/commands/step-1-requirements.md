---
allowed-tools: TodoWrite, TodoRead, Read, Write, MultiEdit, Bash(mkdir:*)
description: Stage 1 - Requirements Analysis for Specification-Driven Development
---

# Requirements Analysis Stage

Transform user requests into comprehensive requirements documentation.

## 📋 Input

- User request: `$ARGUMENTS`
- Output: `.tmp/step-1-requirements.md`

## 🎯 Objectives

### Core Analysis Areas

1. **Problem Definition**
   - What problem are we solving?
   - Why is this solution needed?
   - Who are the stakeholders?

2. **Functional Requirements**
   - Explicit requirements (stated by user)
   - Implicit requirements (industry standards)
   - User workflows and interactions

3. **Non-Functional Requirements**
   - Performance targets
   - Security requirements
   - Accessibility standards
   - Browser compatibility

4. **Integration Points**
   - Existing system dependencies
   - API requirements
   - Data sources needed

## 📝 Requirements Template

````markdown
# 要件定義書 - [プロジェクト名]

**作成日**: YYYY-MM-DD  
**バージョン**: 1.0  
**ステータス**: Draft

## 1. エグゼクティブサマリー

### 1.1 目的

[プロジェクトの目的と背景]

### 1.2 スコープ

[プロジェクトの範囲と境界]

### 1.3 ステークホルダー

- プライマリユーザー: [詳細]
- セカンダリユーザー: [詳細]
- 管理者: [詳細]

## 2. 機能要件

### 2.1 ユーザーストーリー

| ID   | As a... | I want to... | So that... | Priority |
| ---- | ------- | ------------ | ---------- | -------- |
| US01 | [Role]  | [Action]     | [Benefit]  | High     |

### 2.2 機能一覧

#### 必須機能 (MVP)

- [ ] 機能1: [詳細説明]
- [ ] 機能2: [詳細説明]

#### 拡張機能 (Phase 2)

- [ ] 機能A: [詳細説明]
- [ ] 機能B: [詳細説明]

## 3. 非機能要件

### 3.1 パフォーマンス

- ページロード時間: < 3秒
- API レスポンス: < 200ms
- 同時接続数: 1000ユーザー

### 3.2 セキュリティ

- 認証方式: [JWT/OAuth/etc]
- データ暗号化: [要件]
- セキュリティヘッダー: [CSP, CORS等]

### 3.3 ユーザビリティ

- レスポンシブデザイン対応
- キーボードナビゲーション
- スクリーンリーダー対応

### 3.4 技術要件

- ブラウザサポート: Chrome 90+, Firefox 88+, Safari 14+
- Node.js: 18.x以上
- フレームワーク: Next.js 15+

## 4. UI/UXコンポーネント要件

### 4.1 @package/ui 利用可能コンポーネント

- Button, Card, Modal等の既存コンポーネント
- [利用予定のコンポーネントリスト]

### 4.2 カスタムコンポーネント要件

- [コンポーネント名]: [必要な理由と仕様]

### 4.3 デザインシステム

- カラーパレット: [定義]
- タイポグラフィ: [定義]
- スペーシング: [定義]

## 5. データ要件

### 5.1 データモデル

```typescript
interface User {
  id: string;
  email: string;
  // ...
}
```
````

### 5.2 API エンドポイント

| Method | Endpoint   | Description  | Request | Response |
| ------ | ---------- | ------------ | ------- | -------- |
| GET    | /api/users | ユーザー一覧 | -       | User[]   |

### 5.3 モックデータ戦略

- 開発フェーズでは静的JSONファイルを使用
- MSW (Mock Service Worker) でAPIモック

## 6. 制約事項

### 6.1 技術的制約

- TypeScript必須（any型禁止）
- 関数型プログラミング優先
- クラスベースコンポーネント禁止

### 6.2 リソース制約

- 開発期間: [期間]
- チームサイズ: [人数]
- 予算: [該当する場合]

## 7. 成功基準

### 7.1 定量的指標

- [ ] 全機能テストのパス率 100%
- [ ] Lighthouse スコア 90以上
- [ ] TypeScript エラー 0件

### 7.2 定性的指標

- [ ] ユーザビリティテストの完了
- [ ] アクセシビリティ監査のパス
- [ ] セキュリティ監査のパス

## 8. リスクと軽減策

| リスク    | 影響度 | 発生確率 | 軽減策 |
| --------- | ------ | -------- | ------ |
| [リスク1] | High   | Medium   | [対策] |

## 9. 依存関係

### 9.1 外部依存

- 外部API: [詳細]
- サードパーティライブラリ: [詳細]

### 9.2 内部依存

- 既存システム: [詳細]
- 共有コンポーネント: [詳細]

## 10. 次のステップ

- [ ] ステークホルダーレビュー
- [ ] 技術設計フェーズへ移行
- [ ] プロトタイプ作成

````

## 🚀 実行手順

1. **ディレクトリ作成**
   ```bash
   mkdir -p .tmp
````

2. **要件分析**
   - ユーザーの要求を詳細に分析
   - 暗黙の要件を明確化
   - 技術的実現可能性を検討

3. **ドキュメント生成**
   - テンプレートに基づいて作成
   - 具体的で測定可能な要件を記載
   - レビュー可能な形式で出力

4. **品質チェック**
   - 要件の完全性
   - 実現可能性
   - 測定可能性

## 💡 ベストプラクティス

- **SMART原則**: Specific, Measurable, Achievable, Relevant, Time-bound
- **ユーザー中心**: 技術ではなくユーザー価値に焦点
- **段階的詳細化**: MVPと将来の拡張を明確に分離
- **トレーサビリティ**: 各要件に一意のIDを付与
