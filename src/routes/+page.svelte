<script lang="ts">
  import HeaderMenu from '$lib/components/header/HeaderMenu.svelte';
  import HeaderNewFile from '$lib/components/header/HeaderNewFile.svelte';
  import HeaderLoadFile from '$lib/components/header/HeaderLoadFile.svelte';
  import HeaderClearData from '$lib/components/header/HeaderClearData.svelte';
  import HeaderSaveFile from '$lib/components/header/HeaderSaveFile.svelte';
  import DataTable from '$lib/components/DataTable.svelte';
  import ManualViewer from '$lib/components/manual/ManualViewer.svelte';
  import { selectedMenu } from '$lib/stores/ui';
  import { rows } from '$lib/stores/editor';
</script>

<style>
  main {
    background: #2B66C9; /* 指定のテーマカラー */
    color: white;
    font-family: 'Inter', 'Noto Sans JP', sans-serif;
    padding: 1rem;
    max-width: 95%;
    margin: 0 auto;
  }

  h1 {
    margin-bottom: 0.5rem;
  }

  .header-container {
    margin-bottom: 0.5rem;
  }
</style>

<main>
  <h1>Web Data Editor</h1>

  <div class="header-container">
    <HeaderMenu />
    <!-- メニュー選択に応じてフォームを表示（アニメーションなし） -->
    {#if $selectedMenu === 'new'}
      <HeaderNewFile />
    {:else if $selectedMenu === 'load'}
      <HeaderLoadFile />
    {:else if $selectedMenu === 'clear'}
      <HeaderClearData />
    {:else if $selectedMenu === 'save'}
      <HeaderSaveFile />
    {/if}
  </div>

  {#if $selectedMenu === 'manual'}
    <ManualViewer />
  {:else}
    <DataTable />
  {/if}
</main>

