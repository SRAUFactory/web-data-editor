<script lang="ts">
  import { rows, schema, selectedIndex, isFormView } from '$lib/stores/editor';
  import { get } from 'svelte/store';

  let local = {} as any;

  $: idx = $selectedIndex;

  $: if (idx !== null) {
    const r = get(rows)[idx] || {};
    local = JSON.parse(JSON.stringify(r));
  }

  function save() {
    if (idx === null) return;
    rows.update(rs => { rs[idx] = local; return rs; });
    isFormView.set(false);
    selectedIndex.set(null);
  }

  function cancel() {
    isFormView.set(false);
    selectedIndex.set(null);
  }
</script>

{#if idx === null}
  <p>編集対象が選択されていません。テーブルから編集を始めてください。</p>
{:else}
  <div class="editor">
    <h2>行編集</h2>
    {#each $schema.fields as f}
      <div class="field">
        <label>{f.label}</label>
        {#if f.type === 'number'}
          <input type="number" bind:value={local[f.key]} />
        {:else}
          <input type="text" bind:value={local[f.key]} />
        {/if}
      </div>
    {/each}

    <button on:click={save}>保存</button>
    <button on:click={cancel}>キャンセル</button>
  </div>
{/if}

<style>
  .editor { border: 1px solid #ddd; padding: 1rem; margin-top: 1rem; }
  .field { margin-bottom: 0.5rem; }
</style>
