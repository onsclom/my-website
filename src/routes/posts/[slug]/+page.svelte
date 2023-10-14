<script lang="ts">
	import { page } from '$app/stores';
	export let data: any;
	const title = data.post.metadata.title;
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<nav class="pb-5">
	<a
		href="/"
		class="text-xl font-bold no-underline hover:underline text-slate-700 dark:text-slate-300"
		>onsclom.net</a
	>
</nav>

<h1 style="view-transition-name: {$page.params.slug}">
	{title}
</h1>

<svelte:component this={data.post.default} />
