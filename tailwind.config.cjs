/** @type {import('tailwindcss').Config}*/
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {}
	},

	// TODO: make toggleable in site
	// darkMode: 'class',

	plugins: [require('@tailwindcss/typography')]
};

module.exports = config;
