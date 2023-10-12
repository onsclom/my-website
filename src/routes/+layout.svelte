<script>
	import '../app.postcss';
	import { onNavigate } from '$app/navigation';

	onNavigate((navigation) => {
		// @ts-ignore
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			// @ts-ignore
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<main class="max-w-2xl px-4 pt-20 m-auto prose lg:max-w-4xl lg:prose-lg dark:prose-invert">
	<slot />
	<footer class="pt-10 pb-5 italic text-center">Website made with ❤️ by me.</footer>
</main>
