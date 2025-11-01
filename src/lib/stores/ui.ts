// selectedMenu store
import { writable } from 'svelte/store';

/**
 * selectedMenu:
 *  - 'new'  : 新規作成フォーム
 *  - 'load' : ファイル読み込みフォーム
 *  - 'clear': クリアフォーム（実質ボタン）
 *  - 'save' : 保存フォーム
 *  - 'manual': マニュアル閲覧（テーブル領域をマニュアルに切替）
 *  - null   : 非表示
 */
export const selectedMenu = writable<'new' | 'load' | 'clear' | 'save' | 'manual' | null>(null);
