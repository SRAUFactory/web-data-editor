<script lang="ts">
  import { rows, schema, selectedIndex, isFormView } from '$lib/stores/editor';
  import { get } from 'svelte/store';

  let data: any = {};
  $: idx = $selectedIndex;

  $: if (idx !== null) data = JSON.parse(JSON.stringify(get(rows)[idx] || {}));

  function save() {
    if (idx === null) return;
    rows.update(rs => { rs[idx] = data; return rs; });
    isFormView.set(false);
    selectedIndex.set(null);
  }

  function back() {
    isFormView.set(false);
    selectedIndex.set(null);
  }
</script>

<article>
  <h2>フォームで編集（モーダル置換）</h2>
  {#if idx === null}
    <p>新しい行の作成やテーブルから編集を開始してください。</p>
  {:else}
    <form on:submit|preventDefault={save}>
      {#each $schema.fields as f}
        <div>
          <label for={f.key}>{f.label}</label>
          <input id={f.key} bind:value={data[f.key]} type={f.type === 'number' ? 'number' : 'text'} />
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
