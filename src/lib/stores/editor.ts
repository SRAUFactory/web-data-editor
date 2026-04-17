// src/lib/stores/editor.ts
import { writable } from 'svelte/store';
import type { Row, FileSettings } from '../types';

/** テーブルの内容（各行は string[]） */
export const rows = writable<Row>([]);

/** ファイル設定 */
export const fileSettings = writable<FileSettings>({
	fileType: 'CSV',
	lfCode: 'LF'
});
