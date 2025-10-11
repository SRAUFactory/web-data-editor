<script lang="ts">
  import { rows, selected, isFormView } from '$lib/stores/editor';
  import { get } from 'svelte/store';

  let data: string[] = [];
  $: idx = $selected.row;

  $: if (idx !== null) {
    data = [...(get(rows)[idx] || [])];
  }

  function save() {
    if (idx === null) return;
    rows.update(r => {
      r[idx] = [...data];
      return r;
    });
    isFormView.set(false);
    selected.set({ row: null, col: null });
  }

  function back() {
    isFormView.set(false);
    selected.set({ row: null, col: null });
  }
</script>

<article>
  <h2>フォーム編集（モーダル置換）</h2>
  {#if idx === null}
    <p>テーブルから編集を開始してください。</p>
  {:else}
    <form on:submit|preventDefault={save}>
      {#each data as cell, j}
        <div>
          <label for={"col" + j}>列 {j}</label>
          <input id={"col" + j} bind:value={data[j]} />
        </div>
      {/each}

      <button type="submit">保存</button>
      <button type="button" on:click={back}>戻る</button>
    </form>
  {/if}
</article>

<style>
  article { border: 1px solid #eee; padding: 1rem; margin-top: 1rem; }
  form div { margin-bottom: 0.5rem; }
</style>
