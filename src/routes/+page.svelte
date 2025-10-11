<script lang="ts">
  import DataTable from '$lib/components/DataTable.svelte';
  import DataEditor from '$lib/components/DataEditor.svelte';
  import FormView from '$lib/components/FormView.svelte';
  import { rows, schema, isFormView } from '$lib/stores/editor';
  import { onMount } from 'svelte';

  // サンプルスキーマとデータ（実際はAPIから取得）
  onMount(() => {
    schema.set({
      fields: [
        { key: 'id', label: 'ID', type: 'number' },
        { key: 'name', label: '名前', type: 'text' },
        { key: 'age', label: '年齢', type: 'number' }
      ]
    });

    rows.set([
      { id: 1, name: 'Alice', age: 30 },
      { id: 2, name: 'Bob', age: 25 }
    ]);
  });
</script>

<style>
  main { padding: 1rem; max-width: 1100px; margin: 0 auto; }
</style>

<main>
  <h1>Web Data Editor (Svelte版)</h1>

  <!-- テーブル表示 -->
  <DataTable />

  <!-- 編集領域: モーダルではなくフォームビューへ切り替え -->
  {#if $isFormView}
    <FormView />
  {:else}
    <DataEditor />
  {/if}
</main>
