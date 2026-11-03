import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			adapter: adapter({
				pages: 'build',
				assets: 'build',
				fallback: 'index.html', // SPA mode
				precompress: false,
				strict: false
			}),
			paths: {
				base: '/web-data-editor'
			}
		})
	],
	base: '/web-data-editor/'
});

