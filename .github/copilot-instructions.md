# Copilot Instructions — web-data-editor

## プロジェクト概要

**web-data-editor** は、ブラウザ上で CSV / TSV / JSON データを作成・編集・保存できる Web アプリケーションです。
SvelteKit (Svelte 5) + TypeScript で構築し、GitHub Pages に静的サイトとしてデプロイされています。

- **本番 URL**: https://sraufactory.github.io/web-data-editor/
- **デプロイ**: `master` ブランチへの push で GitHub Actions が自動デプロイ

---

## 技術スタック

| カテゴリ | 採用技術 |
|---|---|
| フレームワーク | SvelteKit 2 + Svelte 5 |
| 言語 | TypeScript (strict モード) |
| ビルド | Vite 7 |
| デプロイ | `@sveltejs/adapter-static` → GitHub Pages |
| Lint / Format | ESLint 9 (Flat Config) + Prettier + eslint-plugin-svelte |
| ルーティング | SPA モード (`fallback: 'index.html'`) |
| ベースパス | `/web-data-editor` |

---

## ディレクトリ構成

```
src/
├── app.html                      # HTMLエントリポイント
├── app.d.ts                      # 型定義 (SvelteKit)
├── lib/
│   ├── assets/
│   │   └── favicon.svg
│   ├── components/
│   │   ├── DataTable.svelte      # メインのデータ表示・編集コンポーネント
│   │   ├── header/
│   │   │   ├── HeaderMenu.svelte     # ナビゲーションメニュー
│   │   │   ├── HeaderNewFile.svelte  # 新規作成フォーム
│   │   │   ├── HeaderLoadFile.svelte # ファイル読み込みフォーム
│   │   │   └── HeaderSaveFile.svelte # ファイル保存フォーム
│   │   └── manual/
│   │       └── ManualViewer.svelte   # マニュアル表示
│   ├── stores/
│   │   ├── editor.ts    # rows, fileSettings ストア
│   │   └── ui.ts        # selectedMenu ストア
│   ├── types.ts          # 共通型定義 (Row, FileSettings)
│   └── index.ts
└── routes/
    ├── +layout.svelte
    └── +page.svelte      # アプリケーションルート
```

---

## コアの型定義

```typescript
// src/lib/types.ts
export type Row = string[][];  // 二次元配列（セルはすべて string）

export interface FileSettings {
  fileType: 'CSV' | 'TSV' | 'JSON';
  lfCode: 'CRLF' | 'LF' | 'CR';
}
```

---

## Svelte ストア

### `src/lib/stores/editor.ts`
| ストア | 型 | 役割 |
|---|---|---|
| `rows` | `Writable<Row>` | テーブル全体のデータ（二次元配列） |
| `fileSettings` | `Writable<FileSettings>` | 現在のファイル形式・改行コード設定 |

### `src/lib/stores/ui.ts`
| ストア | 型 | 役割 |
|---|---|---|
| `selectedMenu` | `Writable<'new' \| 'load' \| 'clear' \| 'save' \| 'manual' \| null>` | 表示中のヘッダーフォームの状態 |

---

## コーディング規約

### 全般
- **TypeScript strict モード**を使用。`any` は原則禁止（やむを得ない場合は `// @ts-ignore` にコメントを添える）
- `import type` を使って型のみのインポートを明示する
- Prettier によるフォーマットを必ず適用する（`npm run format`）

### Svelte コンポーネント
- **Svelte 5 の構文** (`$state`, `$derived`, `$effect` ルーン) を優先して使用する
  - Svelte 4 の `on:event` ディレクティブや `export let` プロパティは新規コードでは避ける
- コンポーネントは `src/lib/components/` 以下に配置する
- `$lib/` エイリアスを使ってインポートする（相対パス `../../` は使わない）
- スタイルはコンポーネントの `<style>` ブロックに閉じ込め、グローバルなスタイルは原則追加しない

### ストア操作
- `rows` を更新する際は必ず immutable に行う（元配列を直接変更しない）

```typescript
// ✅ 正しい例
rows.update(r => r.map(row => [...row]));

// ❌ 避けるべき例
rows.update(r => { r[0][0] = 'value'; return r; });
```

### テーブルデータの不変条件
- 行数は最低 1 行、列数は最低 1 列を維持する（削除時にチェック必須）
- すべてのセルは `string` 型で管理する。`null` / `undefined` は `''` に変換する

### ファイル処理
- CSV のパースは RFC 4180 に準拠したダブルクォート対応の実装を維持する
- JSON は配列形式（`string[][]` / オブジェクト配列 / スカラー配列）すべてをサポートする
- 保存時は `showSaveFilePicker` API を優先し、非対応ブラウザでは Blob ダウンロードにフォールバックする

---

## UI・デザイン規約

- **テーマカラー**: `#2B66C9`（メイン背景）/ `#1E4A99`（ヘッダーメニュー）/ `#17407D`（アクティブ・ボーダー）
- **フォント**: `'Inter', 'Noto Sans JP', sans-serif`
- ボタンはサイズを統一（`width: 32px; height: 28px`）し、hover・active フィードバックを持たせる
- アクセシビリティのため `role` 属性と `aria-label` を適切に付与する

---

## 開発コマンド

```bash
# 依存インストール
npm install

# 開発サーバー起動
npm run dev

# 型チェック
npm run check

# Lint
npm run lint

# フォーマット
npm run format

# 本番ビルド
npm run build

# ビルド結果のプレビュー
npm run preview
```

---

## 機能追加時のガイドライン

### 新しいメニュー項目を追加する場合
1. `src/lib/stores/ui.ts` の `selectedMenu` の型ユニオンに新しい値を追加する
2. `HeaderMenu.svelte` にボタンを追加する
3. `src/lib/components/header/` に対応するコンポーネントを作成する
4. `src/routes/+page.svelte` の `{#if}` ブロックに分岐を追加する

### 新しいファイル形式を追加する場合
1. `src/lib/types.ts` の `FileSettings.fileType` の型を拡張する
2. `HeaderLoadFile.svelte` のパース処理に対応ロジックを追加する
3. `HeaderSaveFile.svelte` の生成処理に対応ロジックを追加する
4. 各フォームの `<select>` オプションに追加する

### 新しいストアが必要な場合
- UI 状態 → `src/lib/stores/ui.ts` に追加する
- データ状態 → `src/lib/stores/editor.ts` に追加する
- 新しいファイルへの分離は、ストアが 5 つ以上になったタイミングで検討する
