import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
	kit: {
		// https://svelte.dev/docs/kit/adapter-cloudflare
		adapter: adapter({
			routes: {
				include: ['/*'],
				exclude: ['<all>']
			},
		})
	},
	preprocess: vitePreprocess()
};