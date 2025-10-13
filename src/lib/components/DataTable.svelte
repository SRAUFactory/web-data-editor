<script lang="ts">
  import { rows } from '$lib/stores/editor';
  import { get } from 'svelte/store';

  /** セル編集（直接編集） */
  function updateCell(rowIdx: number, colIdx: number, value: string) {
    rows.update(r => {
      // defensive copy to keep immutability
      const newR = r.map(row => [...row]);
      newR[rowIdx][colIdx] = value;
      return newR;
    });
  }

  /** 行挿入（指定位置の下に新規行を挿入） */
  function insertRow(afterIdx: number) {
    const current = get(rows);
    const cols = current[0]?.length ?? 0;
    const newRow = Array(cols).fill('');
    rows.update(r => {
      const newArr = r.map(row => [...row]);
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

  /** 行削除 */
  function deleteRow(idx: number) {
    rows.update(r => {
      const newArr = r.map(row => [...row]);
      newArr.splice(idx, 1);
      return newArr;
    });
  }

  /** 列削除 */
  function deleteColumn(idx: number) {
    rows.update(r => {
      return r.map(row => {
        const newRow = [...row];
        newRow.splice(idx, 1);
        return newRow;
      });
    });
  }

  /** 採番処理 */
  function assignNumbers(mode: 'row' | 'col', index: number) {
    rows.update(r => {
      const newR = r.map(row => [...row]);
      if (mode === 'row') {
        newR[index] = newR[index].map((_, j) => String(j + 1));
      } else {
        for (let i = 0; i < newR.length; i++) {
          newR[i][index] = String(i + 1);
        }
      }
      return newR;
    });
  }

  /** コピー処理 */
  function copy(mode: 'row' | 'col', index: number) {
    rows.update(r => {
      const newR = r.map(row => [...row]);
      if (mode === 'row') {
        const copied = [...newR[index]];
        newR.splice(index + 1, 0, copied);
      } else {
        for (let i = 0; i < newR.length; i++) {
          const row = [...newR[i]];
          row.splice(index + 1, 0, newR[i][index]);
          newR[i] = row;
        }
      }
      return newR;
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
              <button title="列を右に挿入" on:click={() => insertColumn(colIdx)}>＋</button>
              <button title="列を削除" on:click={() => deleteColumn(colIdx)}>−</button>
              <button title="列採番" on:click={() => assignNumbers('col', colIdx)}>採番</button>
              <button title="列コピー" on:click={() => copy('col', colIdx)}>コピー</button>
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
          <td style="min-width:100px;">
            <input
              type="text"
              value={cell}
              on:input={(e) => updateCell(rowIdx, colIdx, (e.target as HTMLInputElement).value)}
              style="width:100%; box-sizing:border-box;"
            />
          </td>
        {/each}
        <td>
          <div>
            <button title="行を下に挿入" on:click={() => insertRow(rowIdx)}>＋</button>
            <button title="行を削除" on:click={() => deleteRow(rowIdx)}>−</button>
            <button title="行採番" on:click={() => assignNumbers('row', rowIdx)}>採番</button>
            <button title="行コピー" on:click={() => copy('row', rowIdx)}>コピー</button>
          </div>
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  table { border-collapse: collapse; width: 100%; }
  th, td { border: 1px solid #ccc; text-align: center; vertical-align: middle; }
  th { background: #f5f5f5; padding: 6px; }
  input { padding: 4px; font-size: 0.95rem; }
  button { font-size: 0.75rem; margin: 2px; }
</style>
