import adapter from '@sveltejs/adapter-cloudflare';

export default {
	kit: {
		// https://svelte.dev/docs/kit/adapter-cloudflare
		adapter: adapter({
			routes: {
				include: ['/*'],
				exclude: ['<all>']
			},
		})
	}
};