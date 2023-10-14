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

<main class="prose m-auto max-w-2xl px-4 pt-14 dark:prose-invert lg:prose-lg lg:max-w-4xl">
	<slot />
	<footer class="pb-5 pt-10 text-center italic">Website made with ❤️ by me.</footer>
</main>
