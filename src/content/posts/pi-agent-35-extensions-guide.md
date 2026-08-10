---
title: "pi-agent-35-extensions-guide"
date: 2026-08-10
category: "テクノロジー"
eyecatch: "/assets/eyecatch/pi-ext-eyecatch.png"
excerpt: "Pi Agentの35個の拡張を3カテゴリ全解説。permission-gateからssh・subagent・snake gameまで。"
tags: ["AIエージェント", "プログラミング", "デザイン", "ゲーム"]
---
# Pi Agentの35個の拡張を全解説—— 日本一詳細な拡張ガイド【続編】

前回の記事で「50個以上のサンプル拡張が公式リポジトリにあるよ」と書いた。あの数字の正体を解説する。

Pi Agentの公式リポジトリ（earendil-works/pi）には、正確には35個の拡張が3つのカテゴリに分かれて存在する。「ライフサイクル＆セーフティ」「カスタムツール」「コマンド＆UI」だ。

## 拡張の基本構造

Piの拡張はTypeScriptのファイル1個。デフォルトエクスポートの関数を1つ書く。引数はExtensionAPI。3つのメソッド：イベント購読、ツール登録、コマンド登録。全部この3つの組み合わせでできてる。

## カテゴリ1：ライフサイクル＆セーフティ（7個）

permission-gate.ts（危険コマンドに確認）、project-trust.ts（信頼レベル）、protected-paths.ts（.env等の保護）、confirm-destructive.ts（破壊的アクション確認）、dirty-repo-guard.ts（未コミット変更の保護）、sandbox/（OSレベルサンドボックス）、gondolin/（マイクロVM隔離）。

## カテゴリ2：カスタムツール（14個）

hello.ts（最小ツール）、todo.ts（TODO管理＋状態永続化）、question.ts（ユーザーへの質問）、questionnaire.ts（複数質問）、tool-override.ts（ビルトイン上書き）、dynamic-tools.ts（動的登録）、kimi-deferred-tools.ts（Kimi対応）、structured-output.ts（終了ツール）、built-in-tool-renderer.ts（表示カスタマイズ）、minimal-mode.ts（極簡表示）、truncated-tool.ts（ripgrepラップ）、ssh.ts（全ツールSSH委譲）、subagent/（子エージェントspawn）。

## カテゴリ3：コマンド＆UI（14個）

preset.ts（プリセット）、plan-mode/（計画モード）、tools.ts（ツール切替）、handoff.ts（コンテキスト移管）、qna.ts（質問抽出）、status-line.ts（進捗表示）、github-issue-autocomplete.ts（Issue補完）、widget-placement.ts（ウィジェット）、hidden-thinking-label.ts（思考ラベル）、working-indicator.ts（動作表示）、model-status.ts（モデル状態）、snake.ts（ヘビゲーム）、tic-tac-toe.ts（三目並べ）、send-user-message.ts（メッセージ送信）、timed-confirm.ts（タイムアウト確認）。

## 3つの掟

StringEnumを使え（Google API互換）、detailsに状態を保存しろ（分岐対応）、session_startで再構築しろ（永続化）。

## 結論

35個の拡張が教えるのは「やらない」は「できない」ではない。MCPも子エージェントも計画モードも、全部拡張として存在する。Piが「やらない」のは「全員が使うとは限らないから」。必要になったら、その時だけ読み込む。

---

参考: Pi Agent公式リポジトリ（earendil-works/pi） examples/extensions/README.md精読・主要拡張ソースコード分析

