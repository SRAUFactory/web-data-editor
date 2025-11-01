<script lang="ts">
  import { rows } from '$lib/stores/editor';
  import { selectedMenu } from '$lib/stores/ui';

  function clearData() {
    if (!confirm('表の全データを削除します。よろしいですか？')) return;
    rows.set([]);
    selectedMenu.set(null);
  }
</script>

<style>
  .form {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #eee;
    display: flex;
    gap: 1rem;
    align-items: center;
  }
  .danger { color: #b30000; }
</style>

<div class="form" role="region" aria-label="データクリア">
  <button class="danger" on:click={clearData} type="button">データクリア</button>
</div>
