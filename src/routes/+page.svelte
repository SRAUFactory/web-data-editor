<script lang="ts">
  import DataTable from '$lib/components/DataTable.svelte';
  import { rows, fileSettings } from '$lib/stores/editor';
  import type { FileSettings } from '$lib/types';
  import { get } from 'svelte/store';

  let newRowCount = 3;
  let newColCount = 3;

  let loadFileType: FileSettings['fileType'] = 'CSV';
  let loadLfCode: FileSettings['lfCode'] = 'LF';
  let loadFile: File | null = null;

  let saveFileType: FileSettings['fileType'] = 'CSV';
  let saveLfCode: FileSettings['lfCode'] = 'LF';

  // 🟢 データクリア処理
  function clearData() {
    if (!confirm('表の全データを削除します。よろしいですか？')) return;
    rows.set([]);
  }

  function newFile() {
    const data: string[][] = [];
    for (let i = 0; i < newRowCount; i++) {
      const row: string[] = [];
      for (let j = 0; j < newColCount; j++) row.push('');
      data.push(row);
    }
    rows.set(data);
  }

  function handleFileInput(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0] ?? null;
    loadFile = f;
  }

  async function loadFileAction() {
    if (!loadFile) {
      alert('読み込むファイルを選択してください');
      return;
    }
    const text = await loadFile.text();

    // 改行コード選択に基づく分割文字
    const lfMap: Record<string, string> = { 'CRLF': '\r\n', 'LF': '\n', 'CR': '\r' };
    const chosenLf = lfMap[loadLfCode];

    // パース
    let parsed: string[][] = [];
    if (loadFileType === 'JSON') {
      try {
        const json = JSON.parse(text);
        if (Array.isArray(json)) {
          // array of arrays
          if (json.length > 0 && Array.isArray(json[0])) {
            parsed = json.map((r: any[]) => r.map(c => (c === null || c === undefined) ? '' : String(c)));
          } else if (json.length > 0 && typeof json[0] === 'object') {
            // array of objects -> convert to array-of-arrays using keys order of first object
            const keys = Object.keys(json[0]);
            parsed = json.map((obj: Record<string, any>) => keys.map(k => obj[k] == null ? '' : String(obj[k])));
            // prepend header row as keys (optional). To keep structure consistent with earlier behavior,
            // don't insert headers unless original data expects it. Here we will not add headers automatically.
          } else {
            // fallback: wrap scalar array items as single column
            parsed = json.map((v: any) => [String(v)]);
          }
        } else {
          // Not array => create single row with stringified content
          parsed = [[String(json)]];
        }
      } catch (err) {
        alert('JSON のパースに失敗しました: ' + (err as Error).message);
        return;
      }
    } else {
      // CSV / TSV
      const delim = loadFileType === 'TSV' ? '\t' : ',';
      // Split by chosen lfCode. Use chosenLf for splitting but also tolerate mixed endings:
      const lines = text.split(chosenLf).filter((l) => l.length > 0 || text.includes(chosenLf)); // preserve possible empty lines if explicit
      // Simple CSV parsing: handle quoted fields for CSV only
      parsed = lines.map(line => {
        if (loadFileType === 'CSV') {
          const cells: string[] = [];
          let cur = '';
          let inQuotes = false;
          for (let i = 0; i < line.length; i++) {
            const ch = line[i];
            if (ch === '"' ) {
              if (inQuotes && line[i+1] === '"') { cur += '"'; i++; continue; }
              inQuotes = !inQuotes;
              continue;
            }
            if (!inQuotes && ch === ',') {
              cells.push(cur);
              cur = '';
              continue;
            }
            cur += ch;
          }
          cells.push(cur);
          return cells.map(c => c);
        } else {
          // TSV: simple split
          return line.split(delim).map(c => c);
        }
      });
    }

    // 書き込み
    rows.set(parsed);

    // 読み込み完了後、UIのファイル設定もストア側に反映しておく
    fileSettings.set({ fileType: loadFileType, lfCode: loadLfCode });

    // 読み込み時は行/列選択不可 → UI側で新規作成ブロックとは分離しているので問題なし
  }

  // 保存（ダウンロード）
  function escapeCsvCell(cell: string) {
    if (cell.includes('"') || cell.includes(',') || cell.includes('\n') || cell.includes('\r')) {
      return `"${cell.replace(/"/g, '""')}"`;
    }
    return cell;
  }

  function generateFileContent(data: string[][], type: FileSettings['fileType'], lf: FileSettings['lfCode']): string {
    const lfMap: Record<string, string> = { 'CRLF': '\r\n', 'LF': '\n', 'CR': '\r' };
    const chosenLf = lfMap[lf];
    if (type === 'JSON') {
      return JSON.stringify(data);
    } else if (type === 'TSV') {
      return data.map(row => row.join('\t')).join(chosenLf);
    } else {
      // CSV
      return data.map(row => row.map(escapeCsvCell).join(',')).join(chosenLf);
    }
  }

// 🔹 ファイル保存処理（ダイアログ付き）
  async function saveFileAction() {
    const data = get(rows);
    if (!data || data.length === 0) return alert('保存するデータがありません');
    const content = generateFileContent(data, saveFileType, saveLfCode);
    const ext = saveFileType === 'JSON' ? 'json' : (saveFileType === 'TSV' ? 'tsv' : 'csv');
    const fileName = `web-data-editor.${ext}`;

    try {
      // showSaveFilePicker は対応ブラウザのみ
      if ('showSaveFilePicker' in window) {
        const opts = {
          suggestedName: fileName,
          types: [
            {
              description: 'Data file',
              accept: {
                'text/plain': ['.csv', '.tsv', '.json']
              }
            }
          ]
        };
        // @ts-ignore
        const handle = await window.showSaveFilePicker(opts);
        const writable = await handle.createWritable();
        await writable.write(content);
        await writable.close();
      } else {
        // 非対応ブラウザは従来の Blob ダウンロード方式
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error(err);
      alert('ファイル保存に失敗しました');
    }

    fileSettings.set({ fileType: saveFileType, lfCode: saveLfCode });
  }

  // 🔹 JSON時は改行コードを選択不可にする
  $: jsonSelectedForLoad = loadFileType === 'JSON';
  $: jsonSelectedForSave = saveFileType === 'JSON';
</script>

<style>
  main { padding: 1rem; max-width: 1100px; margin: 0 auto; }
  .block { border: 1px solid #ddd; padding: 1rem; margin-bottom: 1rem; display:flex; align-items:center; gap:1rem; flex-wrap:wrap; }
  .block h2 { margin:0 1rem 0 0; font-size:1rem; }
  label { display:inline-flex; align-items:center; gap:0.5rem; }
  .danger { color: #b30000; }
</style>

<main>
  <h1>Web Data Editor (Svelte版)</h1>

  <!-- 🟢 データクリアボタン -->
  {#if $rows.length > 0}
    <div class="block">
      <h2>データ操作</h2>
      <button class="danger" on:click={clearData}>データクリア</button>
    </div>
  {/if}

  <!-- 新規作成 -->
  <section class="block" aria-labelledby="new-file">
    <h2 id="new-file">新規作成</h2>
    <label>
      行数:
      <select bind:value={newRowCount}>
        {#each Array(50).fill(0).map((_, i) => i + 1) as n}
          <option value={n}>{n}</option>
        {/each}
      </select>
    </label>

    <label>
      列数:
      <select bind:value={newColCount}>
        {#each Array(50).fill(0).map((_, i) => i + 1) as n}
          <option value={n}>{n}</option>
        {/each}
      </select>
    </label>

    <button on:click={newFile}>新規作成</button>
  </section>

  <!-- ファイル読み込み -->
  <section class="block" aria-labelledby="load-file">
    <h2 id="load-file">ファイル読み込み</h2>

    <label>
      ファイル形式:
      <select bind:value={loadFileType}>
        <option value="CSV">CSV</option>
        <option value="TSV">TSV</option>
        <option value="JSON">JSON</option>
      </select>
    </label>

    <label>
      改行コード:
      <select bind:value={loadLfCode} disabled={jsonSelectedForLoad}>
        <option value="LF">LF</option>
        <option value="CRLF">CR+LF</option>
        <option value="CR">CR</option>
      </select>
    </label>

    <label>
      ファイル:
      <input type="file" accept=".csv,.tsv,.json" on:change={handleFileInput} />
    </label>

    <button on:click={loadFileAction}>読み込み</button>
  </section>

  <!-- ファイル保存（🟢 データありの時のみ表示） -->
  {#if $rows.length > 0}
    <section class="block" aria-labelledby="save-file">
      <h2 id="save-file">ファイル保存</h2>

      <label>
        ファイル形式:
        <select bind:value={saveFileType}>
          <option value="CSV">CSV</option>
          <option value="TSV">TSV</option>
          <option value="JSON">JSON</option>
        </select>
      </label>

      <label>
        改行コード:
        <select bind:value={saveLfCode} disabled={jsonSelectedForSave}>
          <option value="LF">LF</option>
          <option value="CRLF">CR+LF</option>
          <option value="CR">CR</option>
        </select>
      </label>

      <button on:click={saveFileAction}>保存 (ダウンロード)</button>
    </section>
  {/if}

  <DataTable />
</main>