// === 修正版 editor.ts ===
import { writable } from 'svelte/store';
import type { Row, FileSettings } from '../types';

/** テーブルの内容 */
export const rows = writable<Row>([]);

/** 選択中の行・列インデックス */
export const selected = writable<{ row: number | null; col: number | null }>({
  row: null,
  col: null
});

/** 編集ビュー切り替え（true = フォーム表示） */
export const isFormView = writable<boolean>(false);

/** ファイル設定 */
export const fileSettings = writable<FileSettings>({
  fileType: 'CSV',
  lfCode: 'LF'
});
