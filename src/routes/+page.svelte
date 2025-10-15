<script lang="ts">
  import HeaderMenu from '$lib/components/header/HeaderMenu.svelte';
  import HeaderNewFile from '$lib/components/header/HeaderNewFile.svelte';
  import HeaderLoadFile from '$lib/components/header/HeaderLoadFile.svelte';
  import HeaderClearData from '$lib/components/header/HeaderClearData.svelte';
  import HeaderSaveFile from '$lib/components/header/HeaderSaveFile.svelte';
  import DataTable from '$lib/components/DataTable.svelte';
  import { selectedMenu } from '$lib/stores/ui';
  import { rows } from '$lib/stores/editor';
</script>

<style>
  main { padding: 1rem; max-width: 95%; margin: 0 auto; }
  .header-container { margin-bottom: 0.5rem; }
</style>

<main>
  <h1>Web Data Editor (Svelte版)</h1>

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

  <DataTable />
</main>
