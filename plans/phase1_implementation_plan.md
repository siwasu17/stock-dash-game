# Phase 1: プロジェクト基盤とState管理 実装計画

## 1. プロジェクトの初期化と環境構築
- [ ] Vite (React + TypeScript) によるプロジェクト作成
- [ ] Tailwind CSS の導入
- [ ] shadcn/ui の導入
- [ ] 必要なライブラリのインストール (`zustand`, `lucide-react`, `chart.js`, `react-chartjs-2`, `chartjs-plugin-streaming`, `date-fns`)

## 2. 型定義 (src/types/game.ts)
- [ ] Stock: 銘柄名、現在の価格、ボラティリティ、相関パラメータ
- [ ] Order: 銘柄ID、数量、注文タイプ(Buy/Sell)、注文価格、約定予定時刻
- [ ] Holding: 銘柄ID、保有数量、平均取得単価
- [ ] GameState: ゲームの状態（準備中、プレイ中、終了）

## 3. 状態管理の実装 (src/store/useGameStore.ts)
- [ ] State: balance, holdings, stocks, orders, timer, gameStatus
- [ ] Actions:
    - [ ] `startGame`: タイマー開始、初期価格設定
    - [ ] `placeOrder`: 注文をキューに追加（5秒のラグを考慮）
    - [ ] `executeOrder`: 待機時間を経過した注文をholdings/balanceに反映
    - [ ] `updatePrices`: 株価の更新（Phase 1では簡易的なランダムウォーク）
    - [ ] `tickTimer`: 1秒ごとのカウントダウン

## 4. タイムラグ注文ロジックの構築
- [ ] `useOrderManager` フック、または Store内での `setInterval` による注文監視

## 5. 動作確認用デバッグUI
- [ ] 資産状況、保有株、待機中の注文リスト、注文ボタンの簡易実装
