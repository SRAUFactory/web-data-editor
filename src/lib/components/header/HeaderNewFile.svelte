<script lang="ts">
	import { rows } from '$lib/stores/editor';
	import { selectedMenu } from '$lib/stores/ui';

	let newRowCount = 3;
	let newColCount = 3;

	function newFile() {
		const data: string[][] = [];
		for (let i = 0; i < newRowCount; i++) {
			const row: string[] = [];
			for (let j = 0; j < newColCount; j++) row.push('');
			data.push(row);
		}
		rows.set(data);
		// 作成後はフォームを閉じる
		selectedMenu.set(null);
	}
</script>

<div class="form" role="region" aria-label="新規作成フォーム">
	<label>
		行数:
		<select bind:value={newRowCount}>
			{#each Array(50)
				.fill(0)
				.map((_, _i) => _i + 1) as n (n)}
				<option value={n}>{n}</option>
			{/each}
		</select>
	</label>

	<label>
		列数:
		<select bind:value={newColCount}>
			{#each Array(50)
				.fill(0)
				.map((_, _i) => _i + 1) as n (n)}
				<option value={n}>{n}</option>
			{/each}
		</select>
	</label>

	<button on:click={newFile} type="button">新規作成</button>
</div>

<style>
	.form {
		padding: 0.75rem 1rem;
		border-bottom: 1px solid #eee;
		display: flex;
		gap: 1rem;
		align-items: center;
	}
	label {
		display: inline-flex;
		gap: 0.5rem;
		align-items: center;
	}
</style>
