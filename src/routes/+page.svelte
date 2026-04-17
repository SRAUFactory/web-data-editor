<script lang="ts">
	import HeaderMenu from '$lib/components/header/HeaderMenu.svelte';
	import HeaderNewFile from '$lib/components/header/HeaderNewFile.svelte';
	import HeaderLoadFile from '$lib/components/header/HeaderLoadFile.svelte';
	import HeaderSaveFile from '$lib/components/header/HeaderSaveFile.svelte';
	import DataTable from '$lib/components/DataTable.svelte';
	import ManualViewer from '$lib/components/manual/ManualViewer.svelte';
	import { selectedMenu } from '$lib/stores/ui';
</script>

<main>
	<h1>Web Data Editor</h1>

	<div class="header-container">
		<HeaderMenu />
		<!-- メニュー選択に応じてフォームを表示（アニメーションなし） -->
		{#if $selectedMenu === 'new'}
			<HeaderNewFile />
		{:else if $selectedMenu === 'load'}
			<HeaderLoadFile />
		{:else if $selectedMenu === 'save'}
			<HeaderSaveFile />
		{/if}
	</div>

	{#if $selectedMenu === 'manual'}
		<ManualViewer />
	{:else}
		<DataTable />
	{/if}
</main>

<style>
	main {
		background: #2b66c9; /* 指定のテーマカラー */
		color: white;
		font-family: 'Inter', 'Noto Sans JP', sans-serif;
		padding: 1rem;
		max-width: 95%;
		margin: 0 auto;
	}

	h1 {
		margin-bottom: 0.5rem;
	}

	.header-container {
		margin-bottom: 0.5rem;
	}
</style>
