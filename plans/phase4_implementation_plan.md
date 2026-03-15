# Phase 4: UIブラッシュアップ 実装計画

## 1. デザインテーマの統一
- [ ] 漆黒（Black）をベースに、ネオンカラー（Blue, Green, Red, Yellow）をアクセントにしたダークモードUI。
- [ ] グラスモルフィズム（背景ぼかしと透過）の適用。
- [ ] モノスペースフォントとサンセリフフォントの使い分け。

## 2. コンポーネント化
- [ ] `src/components/layout/Header.tsx`: 資産状況とタイマー。
- [ ] `src/components/market/MarketGrid.tsx`: 5銘柄のチャートカード。
- [ ] `src/components/trading/TradingSidebar.tsx`: ポートフォリオと注文リスト。

## 3. フィードバックと演出
- [ ] 注文実行時の「フラッシュ」エフェクト。
- [ ] `framer-motion`（可能であれば）または CSS Transition による滑らかな動き。
- [ ] 簡易トースト通知システムの自作。

## 4. リザルト画面
- [ ] 最終資産額に基づいたランク表示（例: Amateur, Professional, Whale）。
- [ ] 「再挑戦」ボタンのスタイリッシュなデザイン。
