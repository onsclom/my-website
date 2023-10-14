export async function load({ params }) {
	return { post: await import(`./${params.slug}.md`) };
}
