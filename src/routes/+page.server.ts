export async function load() {
	const paths = import.meta.glob('/src/routes/blog/[slug]/*.md', { eager: true });

	type Post = {
		title: string;
		pubDate: string;
		slug: string;
	};

	const posts: Post[] = [];

	for (const path in paths) {
		const file = paths[path];
		const slug = path.split('/').at(-1)?.replace('.md', '');
		if (file && typeof file === 'object' && 'metadata' in file && slug) {
			const metadata = file.metadata as Post;
			posts.push({
				...metadata,
				slug
			});
		}
	}

	return {
		posts: posts
			.map((post) => ({
				...post,
				pubDate: new Date(post.pubDate)
			}))
			.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())
	};
}
