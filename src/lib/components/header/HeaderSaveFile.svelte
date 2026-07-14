<script lang="ts">
	import { rows, fileSettings } from '$lib/stores/editor';
	import { selectedMenu } from '$lib/stores/ui';
	import type { FileSettings } from '$lib/types';
	import { get } from 'svelte/store';

	const settings = get(fileSettings);
	let saveFileType: FileSettings['fileType'] = settings.fileType || 'CSV';
	let saveLfCode: FileSettings['lfCode'] = settings.lfCode || 'LF';

	let copied = false;
	let copyTimeout: ReturnType<typeof setTimeout>;

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
		} else if (type === 'Markdown') {
			if (data.length === 0) return '';

			const escapeMarkdownCell = (cell: string) => {
				return cell.replace(/\|/g, '\\|').replace(/\r?\n|\r/g, ' ');
			};

			const formatRow = (row: string[]) => `| ${row.join(' | ')} |`;

			const headerRow = data[0].map(escapeMarkdownCell);
			const delimiterRow = headerRow.map(() => '---');
			const bodyRows = data.slice(1).map((row) => row.map(escapeMarkdownCell));

			return [formatRow(headerRow), formatRow(delimiterRow), ...bodyRows.map(formatRow)].join(
				chosenLf
			);
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
		const ext =
			saveFileType === 'JSON'
				? 'json'
				: saveFileType === 'TSV'
					? 'tsv'
					: saveFileType === 'Markdown'
						? 'md'
						: 'csv';
		const fileName = `web-data-editor.${ext}`;

		try {
			if ('showSaveFilePicker' in window) {
				const opts = {
					suggestedName: fileName,
					types: [
						{
							description: 'Data file',
							accept: {
								'text/plain': ['.csv', '.tsv', '.json', '.md']
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

	async function copyToClipboard() {
		const data = get(rows);
		if (!data || data.length === 0) {
			alert('コピーするデータがありません');
			return;
		}
		const content = generateFileContent(data, saveFileType, saveLfCode);
		try {
			await navigator.clipboard.writeText(content);
			copied = true;
			if (copyTimeout) clearTimeout(copyTimeout);
			copyTimeout = setTimeout(() => {
				copied = false;
			}, 2000);
		} catch (err) {
			console.error(err);
			alert('クリップボードへのコピーに失敗しました');
		}
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
				<option value="Markdown">Markdown</option>
			</select>
		</label>

		{#if saveFileType === 'Markdown'}
			<span class="info-text">※ 1行目のデータがヘッダー（見出し）として出力されます</span>
		{/if}

		<label>
			改行コード:
			<select bind:value={saveLfCode} disabled={saveFileType === 'JSON'}>
				<option value="LF">LF</option>
				<option value="CRLF">CR+LF</option>
				<option value="CR">CR</option>
			</select>
		</label>

		<button on:click={saveFileAction} type="button">保存 (ダウンロード)</button>

		{#if saveFileType === 'Markdown'}
			<button on:click={copyToClipboard} type="button" class="copy-btn">
				{copied ? 'コピーしました！' : 'クリップボードにコピー'}
			</button>
		{/if}
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
	.info-text {
		font-size: 0.85rem;
		color: #d32f2f;
		background: #fff;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		border: 1px solid #e2b3b3;
	}
	/* コピペボタンと保存ボタンのスタイルを統一 */
	button {
		padding: 0.25rem 0.75rem;
		height: 32px;
		font-size: 0.9rem;
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
	.copy-btn {
		background: #eef9ff;
		border-color: #7ab3ef;
		color: #0b57d0;
	}
	.copy-btn:hover {
		background: #dbebff;
	}
	.copy-btn:active {
		background: #c7e0ff;
	}
</style>
