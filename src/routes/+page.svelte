<script lang="ts">
	import Project from '$lib/Project.svelte';
	export let data;
	const posts = data.posts;
</script>

<svelte:head>
	<title>Austin Merrick</title>
</svelte:head>

<h1>Austin Merrick</h1>

<h2>Projects</h2>

<div class="grid gap-4 sm:grid-cols-2">
	<Project
		emoji="💧"
		name="H2OPowerPro.com"
		desc="Power washing site"
		url="https://www.h2opowerpro.com/"
	/>

	<Project
		emoji="🔎"
		name="TypeScript JSON Parser"
		desc="RFC 8259 compliant parser"
		url="https://github.com/onsclom/ts-json-parser"
	/>

	<Project
		emoji="🕦"
		name="Circle Clock"
		desc="Minimalist timing game"
		url="https://circle-clock.onsclom.net/"
	/>

	<Project
		emoji="🧩"
		name="Holy Matri(x)mony"
		desc="Finalist in GMTK 2021"
		url="https://cegexe.itch.io/holymatrixmony/"
	/>

	<Project
		emoji="🐍"
		name="HTML5 snake"
		desc="Snake built with vanilla JS"
		url="https://onsclom.github.io/html5-snake/"
	/>

	<Project
		emoji="♟️"
		name="Blunder Puzzles"
		desc="Reverse chess puzzles"
		url="https://onsclom.github.io/blunder-chess/"
	/>
</div>

<h2>Writing</h2>

<div class="space-y-2">
	{#each posts as post}
		<a
			href={`/blog/${post.slug}`}
			class="flex flex-col p-2 no-underline transition-colors hover:bg-slate-100 sm:flex-row sm:space-x-2 dark:hover:bg-slate-800"
		>
			<div class="font-light text-slate-600 dark:text-slate-300">
				{post.pubDate.toLocaleDateString('en-US', {
					year: 'numeric',
					month: 'short',
					day: 'numeric'
				})}
			</div>
			<div>{post.title}</div>
		</a>
	{/each}
</div>
