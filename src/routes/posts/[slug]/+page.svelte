<script lang="ts">
	import { page } from '$app/stores';
	export let data: any;
	const title = data.post.metadata.title;
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<h1 style="view-transition-name: {$page.params.slug}">
	{title}
</h1>

<svelte:component this={data.post.default} />
