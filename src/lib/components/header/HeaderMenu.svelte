<script lang="ts">
  import { selectedMenu } from '$lib/stores/ui';
  import { rows } from '$lib/stores/editor';
  import { get } from 'svelte/store';

  // ボタンクリックで選択を切り替える（同じボタンを押すとトグルで閉じる）
  function toggle(menu: 'new' | 'load' | 'clear' | 'save') {
    const cur = get(selectedMenu);
    selectedMenu.set(cur === menu ? null : menu);
  }
</script>

<style>
  .header-menu {
    display: flex;
    background: #f5f5f5;
    border-bottom: 1px solid #ccc;
    padding: 0.4rem 1rem;
    gap: 1rem;
    justify-content: center;
    align-items: center;
  }
  .menu-btn {
    background: transparent;
    border: none;
    padding: 0.45rem 0.9rem;
    cursor: pointer;
    font-weight: 500;
    border-radius: 6px;
  }
  .menu-btn.active {
    background: #ddd;
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
    class:active={$selectedMenu === 'clear'}
    on:click={() => toggle('clear')}
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
