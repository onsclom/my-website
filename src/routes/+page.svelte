<script lang="ts">
	import Project from '$lib/Project.svelte';
	export let data;
	const posts = data.posts;

	const projects = [
		{
			emoji: '💧',
			name: 'H2OPowerPro.com',
			desc: 'Professional power washing site',
			url: 'https://www.h2opowerpro.com/'
		},
		{
			emoji: '📝',
			name: 'Smooth Text Editor',
			desc: 'Animation experiment',
			url: 'https://canvas-text-editor.vercel.app/'
		},
		{
			emoji: '🕦',
			name: 'Circle Clock',
			desc: 'Minimalist browser game',
			url: 'https://circle-clock.onsclom.net/'
		},
		{
			emoji: '🧩',
			name: 'Holy Matri(x)mony',
			desc: 'Finalist in GMTK 2021',
			url: 'https://cegexe.itch.io/holymatrixmony/'
		},
		{
			emoji: '📺',
			name: 'Animated Text Canvas',
			desc: 'JavaScript library',
			url: 'https://onsclom.github.io/animated-text-framework//'
		},
		{
			emoji: '♟️',
			name: 'Blunder Puzzles',
			desc: 'Reverse chess puzzles',
			url: 'https://onsclom.github.io/blunder-chess/'
		}
	];
</script>

<svelte:head>
	<title>onsclom</title>
</svelte:head>

<hgroup>
	<h1 class="mb-6">Hi, I'm <span class="whitespace-nowrap">Austin Merrick</span></h1>
	<!-- TODO: make this a typewriter effect that goes through a list! -->
	<h2 class="mt-3 text-slate-700 dark:text-slate-300">I enjoy making things</h2>
</hgroup>

<h2>Projects</h2>

<div class="grid gap-4 sm:grid-cols-2">
	{#each projects as project}
		<Project {...project} />
	{/each}
</div>

<h2>Writing</h2>

<div class="space-y-2">
	{#each posts as post}
		<a
			href={`/posts/${post.slug}`}
			class="flex flex-col p-2 no-underline transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 sm:flex-row sm:space-x-2"
		>
			<div class="font-light text-slate-600 dark:text-slate-300">
				{post.pubDate.toLocaleDateString('en-US', {
					year: 'numeric',
					month: 'short',
					day: 'numeric'
				})}
			</div>
			<div style={`view-transition-name: ${post.slug}`}>
				{post.title}
			</div>
		</a>
	{/each}
</div>
