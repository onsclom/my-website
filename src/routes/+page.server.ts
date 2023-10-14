export async function load() {
	const paths = import.meta.glob('/src/posts/*.md', { eager: true });

	const posts = Object.entries(paths)
		.map(([path, file]) => {
			const slug = path.split('/').at(-1)?.replace('.md', '') as string;
			const metadata = (file as any).metadata;
			return {
				title: metadata.title as string,
				pubDate: new Date(metadata.pubDate),
				slug
			};
		})
		.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

	return {
		posts
	};
}
