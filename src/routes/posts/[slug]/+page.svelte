<script lang="ts">
	export let data;
	const posts = import.meta.glob('./*.md', { eager: true });
	const post: any = posts[`./${data.slug}.md`];
	const title = post.metadata.title;
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<h1 style={`view-transition-name: ${data.slug}`}>
	{title}
</h1>

<svelte:component this={post.default} />
