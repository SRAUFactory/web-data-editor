<script lang="ts">
  import { rows } from '$lib/stores/editor';
  import { get } from 'svelte/store';

  /** セル編集（直接編集） */
  function updateCell(rowIdx: number, colIdx: number, value: string) {
    rows.update(r => {
      r[rowIdx][colIdx] = value;
      return r;
    });
  }

  /** 行挿入（指定位置の下に新規行を挿入） */
  function insertRow(afterIdx: number) {
    const current = get(rows);
    const cols = current[0]?.length ?? 0;
    const newRow = Array(cols).fill('');
    rows.update(r => {
      const newArr = [...r];
      newArr.splice(afterIdx + 1, 0, newRow);
      return newArr;
    });
  }

  /** 列挿入（指定位置の右に新規列を挿入） */
  function insertColumn(afterIdx: number) {
    rows.update(r => {
      return r.map(row => {
        const newRow = [...row];
        newRow.splice(afterIdx + 1, 0, '');
        return newRow;
      });
    });
  }

  /** 採番処理 */
  function assignNumbers(mode: 'row' | 'col', index: number) {
    rows.update(r => {
      if (mode === 'row') {
        // 行方向のセルに連番
        r[index] = r[index].map((_, j) => String(j + 1));
      } else {
        // 列方向のセルに連番
        for (let i = 0; i < r.length; i++) {
          r[i][index] = String(i + 1);
        }
      }
      return r;
    });
  }

  /** コピー処理 */
  function copy(mode: 'row' | 'col', index: number) {
    rows.update(r => {
      if (mode === 'row') {
        const copied = [...r[index]];
        r.splice(index + 1, 0, copied);
      } else {
        for (let i = 0; i < r.length; i++) {
          const row = [...r[i]];
          row.splice(index + 1, 0, r[i][index]);
          r[i] = row;
        }
      }
      return r;
    });
  }
</script>

<table border="1" cellpadding="4" cellspacing="0">
  <thead>
    {#if $rows.length > 0}
      <tr>
        {#each $rows[0] as _, colIdx}
          <th>
            列 {colIdx + 1}
            <div style="margin-top:4px;">
              <button on:click={() => insertColumn(colIdx)}>＋</button>
              <button on:click={() => assignNumbers('col', colIdx)}>採番</button>
              <button on:click={() => copy('col', colIdx)}>コピー</button>
            </div>
          </th>
        {/each}
        <th>行操作</th>
      </tr>
    {/if}
  </thead>

  <tbody>
    {#each $rows as row, rowIdx}
      <tr>
        {#each row as cell, colIdx}
          <td>
            <input
              type="text"
              value={cell}
              on:input={(e) => updateCell(rowIdx, colIdx, (e.target as HTMLInputElement).value)}
              style="width:100%; box-sizing:border-box;"
            />
          </td>
        {/each}
        <td>
          <button on:click={() => insertRow(rowIdx)}>＋</button>
          <button on:click={() => assignNumbers('row', rowIdx)}>採番</button>
          <button on:click={() => copy('row', rowIdx)}>コピー</button>
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  table { border-collapse: collapse; width: 100%; }
  th, td { border: 1px solid #ccc; text-align: center; }
  th { background: #f5f5f5; }
  input { padding: 2px; font-size: 0.9rem; text-align: center; }
  button { font-size: 0.75rem; margin: 0 2px; }
</style>
