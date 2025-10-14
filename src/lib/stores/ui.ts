// selectedMenu store
import { writable } from 'svelte/store';

/**
 * selectedMenu:
 *  - 'new'  : 新規作成フォーム
 *  - 'load' : ファイル読み込みフォーム
 *  - 'clear': クリアフォーム（実質ボタン）
 *  - 'save' : 保存フォーム
 *  - null   : 非表示
 */
export const selectedMenu = writable<'new' | 'load' | 'clear' | 'save' | null>(null);
