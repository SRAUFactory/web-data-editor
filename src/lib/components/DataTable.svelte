<script lang="ts">
  import { rows, selected, isFormView } from '$lib/stores/editor';
  import { get } from 'svelte/store';

  function editCell(rowIdx: number, colIdx: number) {
    selected.set({ row: rowIdx, col: colIdx });
    isFormView.set(true);
  }

  function addRow() {
    const current = get(rows);
    const cols = current[0]?.length ?? 0;
    const newRow = new Array(cols).fill('');
    rows.update(r => [...r, newRow]);
  }
</script>

<table border="1" cellpadding="4" cellspacing="0">
  <thead>
    {#if $rows.length > 0}
      <tr>
        {#each $rows[0] as header}
          <th>{header}</th>
        {/each}
        <th>操作</th>
      </tr>
    {/if}
  </thead>
  <tbody>
    {#each $rows.slice(1) as row, i}
      <tr>
        {#each row as cell, j}
          <td>{cell}</td>
        {/each}
        <td><button on:click={() => editCell(i + 1, 0)}>編集</button></td>
      </tr>
    {/each}
  </tbody>
</table>

<button on:click={addRow} style="margin-top:1rem;">行を追加</button>
