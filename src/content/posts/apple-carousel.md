---
title: "Remaking a Carousel from Apple's Website"
pubDate: 2023-10-15
---

I wanted to recreate this:

<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src='https://www.youtube.com/embed/nsBi8D5e188' frameborder='0' allowfullscreen></iframe></div>

Here's the [resulting code](https://github.com/onsclom/apple-carousel-remake) and a
[live preview](https://apple-carousel-remake.vercel.app/) (best used on desktop). Using Svelte and
Tailwind, the recreation experience was surprisingly easy and fun.

It's not perfect:

- Not pixel perfect
- Doesn't have a mobile version
- Might be missing some accessibility features

Though there are things it does better than Apple's:

- The animation does not lock out user input (so you can click the arrow twice quickly)
- It wraps
- The dots at the bottom have bigger hitboxes

The code ended up being much more simple than I thought:

```svelte
<script>
	export let items: { text: string; image: string }[];
	let index = 0;
	$: index = (index + items.length) % items.length;
</script>

<div class="space-y-5">
	<div class="flex items-center justify-center space-x-3">
		<button
			class="h-12 w-12 rounded-full bg-gray-200 text-lg hover:bg-gray-100"
			on:click={() => (index -= 1)}>←</button
		>
		<div class="flex max-w-xs flex-1 overflow-hidden rounded-3xl bg-gray-50">
			{#each items as item}
				<div
					class="flex w-full flex-shrink-0 flex-col justify-between overflow-hidden transition-transform duration-300"
					style:transform="translateX({-100 * index}%)"
				>
					<p class="flex justify-center px-4 py-14 text-center align-middle">
						{item.text}
					</p>
					<img src={item.image} alt={item.text} />
				</div>
			{/each}
		</div>
		<button
			class="h-12 w-12 rounded-full bg-gray-200 text-lg hover:bg-gray-100"
			on:click={() => (index += 1)}>→</button
		>
	</div>
	<div class="flex items-center justify-center">
		{#each items as _, i}
			<button class="group flex justify-center p-3 align-middle" on:click={() => (index = i)}>
				<div
					class="h-2 w-2 rounded-full bg-gray-300 transition-colors"
					class:bg-gray-500={i === index}
					class:group-hover:bg-gray-400={i !== index}
				></div>
			</button>
		{/each}
	</div>
</div>
```
