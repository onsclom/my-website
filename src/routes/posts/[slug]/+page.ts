const posts = import.meta.glob(`./*.md`, { eager: true });

export function load({ params }) {
	return { post: posts[`./${params.slug}.md`] };
}
