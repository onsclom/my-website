export async function load() {
	// do import.meta.glob here i think..
	const paths = import.meta.glob('/src/routes/blog/[post]/*.md', { eager: true });
	// const paths = [];

	type Post = {
		title: string;
		pubDate: string;
		slug: string;
	};

	// console.log(paths);
	const posts: Post[] = [];

	for (const path in paths) {
		const file = paths[path];
		const slug = path.split('/').at(-1)?.replace('.md', '');

		// console.log(file, slug);
		if (file && typeof file === 'object' && 'metadata' in file && slug) {
			const metadata = file.metadata as Post;
			// console.log(metadata);
			posts.push({
				...metadata,
				slug
			});
		}
	}

	return {
		props: {
			posts: posts
				.map((post) => ({
					...post,
					pubDate: new Date(post.pubDate)
				}))
				.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())
		}
	};
}
