<script lang="ts">
	import { rows, fileSettings } from '$lib/stores/editor';
	import { selectedMenu } from '$lib/stores/ui';
	import type { FileSettings } from '$lib/types';

	let loadFileType: Exclude<FileSettings['fileType'], 'Markdown'> = 'CSV';
	let loadLfCode: FileSettings['lfCode'] = 'LF';
	let loadFile: File | null = null;

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

		const lfMap: Record<string, string> = { CRLF: '\r\n', LF: '\n', CR: '\r' };
		const chosenLf = lfMap[loadLfCode];

		let parsed: string[][] = [];
		if (loadFileType === 'JSON') {
			try {
				const json = JSON.parse(text) as unknown;
				if (Array.isArray(json)) {
					if (json.length > 0 && Array.isArray(json[0])) {
						parsed = json.map((r) =>
							Array.isArray(r) ? r.map((c) => (c === null || c === undefined ? '' : String(c))) : []
						);
					} else if (json.length > 0 && typeof json[0] === 'object' && json[0] !== null) {
						const keys = Object.keys(json[0] as Record<string, unknown>);
						parsed = json.map((obj) =>
							typeof obj === 'object' && obj !== null
								? keys.map((k) => {
										const value = (obj as Record<string, unknown>)[k];
										return value == null ? '' : String(value);
									})
								: keys.map(() => '')
						);
					} else {
						parsed = json.map((v) => [String(v)]);
					}
				} else {
					parsed = [[String(json)]];
				}
			} catch (err) {
				alert('JSON のパースに失敗しました: ' + (err as Error).message);
				return;
			}
		} else {
			const delim = loadFileType === 'TSV' ? '\t' : ',';
			// split by chosenLf, tolerant to mixed endings by also trimming empty trailing line
			const lines = text.split(chosenLf);
			parsed = lines
				.filter((l) => !(l === '' && lines.length === 1))
				.map((line) => {
					if (loadFileType === 'CSV') {
						const cells: string[] = [];
						let cur = '';
						let inQuotes = false;
						for (let i = 0; i < line.length; i++) {
							const ch = line[i];
							if (ch === '"') {
								if (inQuotes && line[i + 1] === '"') {
									cur += '"';
									i++;
									continue;
								}
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
						return cells;
					} else {
						return line.split(delim).map((c) => c);
					}
				});
		}

		rows.set(parsed);
		fileSettings.set({ fileType: loadFileType, lfCode: loadLfCode });
		selectedMenu.set(null);
	}
</script>

<div class="form" role="region" aria-label="ファイル読み込みフォーム">
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
		<select bind:value={loadLfCode} disabled={loadFileType === 'JSON'}>
			<option value="LF">LF</option>
			<option value="CRLF">CR+LF</option>
			<option value="CR">CR</option>
		</select>
	</label>

	<label>
		ファイル:
		<input type="file" accept=".csv,.tsv,.json" on:change={handleFileInput} />
	</label>

	<button on:click={loadFileAction} type="button">読み込み</button>
</div>

<style>
	.form {
		padding: 0.75rem 1rem;
		border-bottom: 1px solid #eee;
		display: flex;
		gap: 1rem;
		align-items: center;
		flex-wrap: wrap;
	}
	label {
		display: inline-flex;
		gap: 0.5rem;
		align-items: center;
	}
</style>
