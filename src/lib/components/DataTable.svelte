<script lang="ts">
  import { rows, schema, selectedIndex, isFormView } from '$lib/stores/editor';
  import { get } from 'svelte/store';

  function editRow(i: number) {
    selectedIndex.set(i);
    isFormView.set(true);
  }

  function addRow() {
    const r = get(rows).length;
    const newRow = {} as any;
    get(schema).fields.forEach(f => (newRow[f.key] = ''));
    rows.update(rs => { rs.push(newRow); return rs; });
    selectedIndex.set(r);
    isFormView.set(true);
  }
</script>

<table>
  <thead>
    <tr>
      {#each $schema.fields as f}
        <th>{f.label}</th>
      {/each}
      <th>操作</th>
    </tr>
  </thead>
  <tbody>
    {#each $rows as row, i}
      <tr>
        {#each $schema.fields as f}
          <td>{row[f.key]}</td>
        {/each}
        <td>
          <button on:click={() => editRow(i)}>編集</button>
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<button on:click={addRow}>行を追加</button>
