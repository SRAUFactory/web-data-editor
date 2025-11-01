<script lang="ts">
  import { onMount } from 'svelte';
  import { marked } from 'marked';

  let md = '';
  let html = '';

  onMount(async () => {
    try {
      const res = await fetch('/web-data-editor/manual/README.md');
      if (!res.ok) {
        md = '# マニュアルを読み込めませんでした\n\nファイルが存在するか確認してください。';
      } else {
        md = await res.text();
      }
    } catch (e) {
      md = '# マニュアルを読み込めませんでした\n\nネットワークエラー';
    }

    // convert markdown to HTML
    html = marked.parse(md);
  });
</script>

<style>
  .manual-wrapper {
    background: white;
    color: #222;
    padding: 1rem;
    border-radius: 8px;
    max-width: 100%;
    box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  }

  :global(.manual-wrapper h1),
  :global(.manual-wrapper h2),
  :global(.manual-wrapper h3) {
    color: #1E4A99;
  }

  :global(.manual-wrapper pre) {
    background: #f6f8fa;
    padding: 0.75rem;
    border-radius: 6px;
    overflow: auto;
  }

  :global(.manual-wrapper code) {
    background: rgba(27,31,35,0.05);
    padding: 0.12rem 0.3rem;
    border-radius: 4px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Noto Mono', monospace;
  }
</style>

<div class="manual-wrapper">
  {@html html}
</div>
