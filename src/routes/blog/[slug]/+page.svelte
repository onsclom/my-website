<script lang="ts">
	export let data;
	const posts = import.meta.glob('/src/routes/blog/[slug]/*.md', { eager: true });
	const post: any = posts[`/src/routes/blog/[slug]/${data.slug}.md`];
	const title = post.metadata.title;
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<h1>
	{title}
</h1>

<svelte:component this={post.default} />
