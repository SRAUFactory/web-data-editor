// === 修正版 types.ts ===

/**
 * データの型: 各セルを string とする二次元配列
 */
export type Row = string[][];

/**
 * ファイル設定情報
 */
export interface FileSettings {
	/** ファイル形式 (CSV / TSV / JSON) */
	fileType: 'CSV' | 'TSV' | 'JSON';
	/** 改行コード (CRLF / LF / CR) */
	lfCode: 'CRLF' | 'LF' | 'CR';
}
