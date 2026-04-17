<script lang="ts">
	import { rows, fileSettings } from '$lib/stores/editor';
	import { selectedMenu } from '$lib/stores/ui';
	import type { FileSettings } from '$lib/types';
	import { get } from 'svelte/store';

	let saveFileType: FileSettings['fileType'] = 'CSV';
	let saveLfCode: FileSettings['lfCode'] = 'LF';

	function escapeCsvCell(cell: string) {
		if (cell.includes('"') || cell.includes(',') || cell.includes('\n') || cell.includes('\r')) {
			return `"${cell.replace(/"/g, '""')}"`;
		}
		return cell;
	}

	function generateFileContent(
		data: string[][],
		type: FileSettings['fileType'],
		lf: FileSettings['lfCode']
	): string {
		const lfMap: Record<string, string> = { CRLF: '\r\n', LF: '\n', CR: '\r' };
		const chosenLf = lfMap[lf];
		if (type === 'JSON') {
			return JSON.stringify(data);
		} else if (type === 'TSV') {
			return data.map((row) => row.join('\t')).join(chosenLf);
		} else {
			return data.map((row) => row.map(escapeCsvCell).join(',')).join(chosenLf);
		}
	}

	async function saveFileAction() {
		const data = get(rows);
		if (!data || data.length === 0) {
			alert('保存するデータがありません');
			return;
		}
		const content = generateFileContent(data, saveFileType, saveLfCode);
		const ext = saveFileType === 'JSON' ? 'json' : saveFileType === 'TSV' ? 'tsv' : 'csv';
		const fileName = `web-data-editor.${ext}`;

		try {
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
				// @ts-expect-error showSaveFilePicker is not available in all browsers
				const handle = await window.showSaveFilePicker(opts);
				const writable = await handle.createWritable();
				await writable.write(content);
				await writable.close();
			} else {
				const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = fileName;
				document.body.appendChild(a);
				a.click();
				a.remove();
				URL.revokeObjectURL(url);
			}
		} catch (err) {
			console.error(err);
			alert('ファイル保存に失敗しました');
		}

		fileSettings.set({ fileType: saveFileType, lfCode: saveLfCode });
		selectedMenu.set(null);
	}
</script>

{#if $rows.length > 0}
	<div class="form" role="region" aria-label="ファイル保存フォーム">
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
			<select bind:value={saveLfCode} disabled={saveFileType === 'JSON'}>
				<option value="LF">LF</option>
				<option value="CRLF">CR+LF</option>
				<option value="CR">CR</option>
			</select>
		</label>

		<button on:click={saveFileAction} type="button">保存 (ダウンロード)</button>
	</div>
{/if}

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
