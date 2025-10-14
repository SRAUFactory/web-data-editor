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
  function insertRow(afterIdx: number, position: 'before' | 'after' = 'after') {
    const current = get(rows);
    const cols = current[0]?.length ?? 0;
    const newRow = Array(cols).fill('');
    rows.update(r => {
      const newArr = r.map(row => [...row]);
      const insertIndex = position === 'before' ? afterIdx : afterIdx + 1;
      newArr.splice(insertIndex, 0, newRow);
      return newArr;
    });
  }

  /** 列挿入（指定位置の右に新規列を挿入） */
  function insertColumn(afterIdx: number, position: 'before' | 'after' = 'after') {
    rows.update(r => {
      return r.map(row => {
        const newRow = [...row];
        const insertIndex = position === 'before' ? afterIdx : afterIdx + 1;
        newRow.splice(insertIndex, 0, '');
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
        <th>
          <!-- 先頭列の前に挿入 -->
          <button on:click={() => insertColumn(0, 'before')}>＋</button>
        </th>
        {#each $rows[0] as _, colIdx}
          <th>
            列 {colIdx + 1}
            <div style="margin-top:4px;">
              <button on:click={() => insertColumn(colIdx, 'before')}>←＋</button>
              <button on:click={() => insertColumn(colIdx, 'after')}>＋→</button>
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
        <!-- 行の先頭挿入 -->
        <td>
          {#if rowIdx === 0}
            <button on:click={() => insertRow(0, 'before')}>＋</button>
          {/if}
        </td>
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
          <button on:click={() => insertRow(rowIdx, 'before')}>↑＋</button>
          <button on:click={() => insertRow(rowIdx, 'after')}>＋↓</button>
          <button on:click={() => assignNumbers('row', rowIdx)}>採番</button>
          <button on:click={() => copy('row', rowIdx)}>コピー</button>
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
