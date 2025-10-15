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
      const newArr = [...r];
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
  function deleteRow(index: number) {
    rows.update(r => {
      if (r.length <= 1) return r; // 最低1行は残す
      const newArr = [...r];
      newArr.splice(index, 1);
      return newArr;
    });
  }

  /** 列削除 */
  function deleteColumn(index: number) {
    rows.update(r => {
      if (r[0]?.length <= 1) return r; // 最低1列は残す
      return r.map(row => {
        const newRow = [...row];
        newRow.splice(index, 1);
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
              {#if colIdx === 0}
                <button on:click={() => insertColumn(0, 'before')}>＋</button>
              {/if}
              <button on:click={() => insertColumn(colIdx)}>＋</button>
              <button on:click={() => deleteColumn(colIdx)}>-</button>
              <button on:click={() => assignNumbers('col', colIdx)}>N</button>
              <button on:click={() => copy('col', colIdx)}>C</button>
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
          {#if rowIdx === 0}
            <button on:click={() => insertRow(0, 'before')}>＋</button>
          {/if}
          <button on:click={() => insertRow(rowIdx)}>＋</button>
          <button on:click={() => deleteRow(rowIdx)}>-</button>
          <button on:click={() => assignNumbers('row', rowIdx)}>N</button>
          <button on:click={() => copy('row', rowIdx)}>C</button>
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  table {
    border-collapse: collapse;
    width: 100%;
    background: white;
    color: #333;
  }

  th, td {
    border: 1px solid #ccc;
    text-align: center;
    padding: 4px;
  }

  th {
    background: #f5f5f5;
  }

  input {
    padding: 2px;
    font-size: 0.9rem;
    text-align: center;
    width: 100%;
    box-sizing: border-box;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  /* ボタンを統一サイズ化 */
  button {
    width: 32px;
    height: 28px;
    font-size: 0.8rem;
    margin: 1px;
    border: 1px solid #999;
    border-radius: 4px;
    background: #f8f8f8;
    cursor: pointer;
  }

  button:hover {
    background: #e6e6e6;
  }

  button:active {
    background: #dcdcdc;
  }
</style>
