<script lang="ts">
  import { selectedMenu } from '$lib/stores/ui';
  import { rows } from '$lib/stores/editor';
  import { get } from 'svelte/store';

  function clearData() {
    if (!confirm('表の全データを削除します。よろしいですか？')) return;
    rows.set([]);
    selectedMenu.set(null);
  }

  // ボタンクリックで選択を切り替える（同じボタンを押すとトグルで閉じる）
  function toggle(menu: 'new' | 'load' | 'clear' | 'save' | 'manual') {
    const cur = get(selectedMenu);
    selectedMenu.set(cur === menu ? null : menu);
  }
</script>

<style>
  .header-menu {
    display: flex;
    background: #1E4A99; /* ← #2B66C9より少し濃く */
    color: white;
    border-bottom: 2px solid #17407D;
    padding: 0.4rem 1rem;
    gap: 1rem;
    justify-content: center;
    align-items: center;
  }

  .menu-btn {
    background: transparent;
    color: white;
    border: 1px solid transparent;
    padding: 0.45rem 0.9rem;
    cursor: pointer;
    font-weight: 500;
    border-radius: 6px;
    transition: background 0.15s ease;
  }

  .menu-btn.active {
    background: #17407D; /* アクティブ状態 */
    border: 1px solid #13346B;
  }

  .menu-btn:hover {
    background: #2B66C9; /* ホバー時：ベースカラー */
  }

  .menu-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>

<div class="header-menu" role="navigation" aria-label="ヘッダーメニュー">
  <button
    class="menu-btn"
    class:active={$selectedMenu === 'new'}
    on:click={() => toggle('new')}
    type="button"
  >新規作成</button>

  <button
    class="menu-btn"
    class:active={$selectedMenu === 'load'}
    on:click={() => toggle('load')}
    type="button"
  >ファイル読み込み</button>

  <button
    class="menu-btn"
    class:active={$selectedMenu === 'manual'}
    on:click={() => toggle('manual')}
    type="button"
  >マニュアル</button>

  <button
    class="menu-btn"
    on:click={clearData}
    type="button"
  >クリア</button>

  <!-- 保存はデータがある時のみメニュー表示 -->
  <button
    class="menu-btn"
    class:active={$selectedMenu === 'save'}
    on:click={() => toggle('save')}
    disabled={$rows.length === 0}
    type="button"
  >保存</button>
</div>
