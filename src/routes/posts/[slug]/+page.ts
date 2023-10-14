export async function load({ params }) {
	return { post: await import(`../../../posts/${params.slug}.md`) };
}
