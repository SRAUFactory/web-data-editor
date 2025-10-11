<script lang="ts">
  import DataTable from '$lib/components/DataTable.svelte';
  import DataEditor from '$lib/components/DataEditor.svelte';
  import FormView from '$lib/components/FormView.svelte';
  import { rows, isFormView, fileSettings } from '$lib/stores/editor';
  import type { FileSettings } from '$lib/types';

  function newFile() {
    rows.set([
      ['ID', 'Name', 'Age'],
      ['1', 'Alice', '30'],
      ['2', 'Bob', '25']
    ]);
  }

  function handleFileSettingsChange(e: Event, key: keyof FileSettings) {
    const value = (e.target as HTMLSelectElement).value as FileSettings[keyof FileSettings];
    fileSettings.update(fs => ({ ...fs, [key]: value }));
  }
</script>

<style>
  main { padding: 1rem; max-width: 1100px; margin: 0 auto; }
  .settings { border: 1px solid #ddd; padding: 1rem; margin-bottom: 1rem; }
</style>

<main>
  <h1>Web Data Editor (Svelte版)</h1>

  <section class="settings">
    <h2>ファイル設定</h2>
    <label>
      ファイル形式:
      <select on:change={(e) => handleFileSettingsChange(e, 'fileType')}>
        <option value="CSV" selected>CSV</option>
        <option value="TSV">TSV</option>
        <option value="JSON">JSON</option>
      </select>
    </label>

    <label style="margin-left:1rem">
      改行コード:
      <select on:change={(e) => handleFileSettingsChange(e, 'lfCode')}>
        <option value="LF" selected>LF</option>
        <option value="CRLF">CR+LF</option>
        <option value="CR">CR</option>
      </select>
    </label>

    <button style="margin-left:1rem" on:click={newFile}>新規作成</button>
  </section>

  <DataTable />

  {#if $isFormView}
    <FormView />
  {:else}
    <DataEditor />
  {/if}
</main>
