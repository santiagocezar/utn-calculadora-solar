import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
    base: "/utn-calculadora-solar/",
	plugins: [sveltekit()]
});
