<script lang="ts">
	import Project from '$lib/Project.svelte';
	export let data;

	const posts = import.meta.glob('/src/posts/*.md');
	console.log(posts);
</script>

<main class="max-w-2xl px-4 pt-20 pb-10 m-auto prose">
	<h1>Austin Merrick</h1>

	<!-- 
	<p>I am Software Engineer who enjoys programming and designing things.</p> -->

	<!-- <h2>About me</h2>
	<ul>
		<li>I am 25 years old</li>
		<li>I enjoy programming and making stuff</li>
		<li>I enjoy learning new tech</li>
	</ul> -->

	<h2>Projects</h2>

	<div class="grid gap-3 sm:grid-cols-2">
		<Project
			emoji="💧"
			name="H2OPowerPro.com"
			desc="Power washing site"
			url="https://www.h2opowerpro.com/"
		/>

		<Project
			emoji="🔎"
			name="TypeScript JSON Parser"
			desc="RFC 8259 compliant parser"
			url="https://github.com/onsclom/ts-json-parser"
		/>

		<Project
			emoji="🕦"
			name="Circle Clock"
			desc="Minimalist timing game"
			url="https://circle-clock.onsclom.net/"
		/>

		<Project
			emoji="🧩"
			name="Holy Matri(x)mony"
			desc="Finalist in GMTK 2021"
			url="https://onsclom.github.io/html5-snake/"
		/>

		<Project
			emoji="🐍"
			name="HTML5 snake"
			desc="Snake built with vanilla JS"
			url="https://onsclom.github.io/html5-snake/"
		/>

		<Project
			emoji="♟️"
			name="Blunder Puzzles"
			desc="Reverse chess puzzles"
			url="https://onsclom.github.io/blunder-chess/"
		/>
	</div>

	<h2>Writing</h2>

	<footer class="italic text-center">Website made with ❤️ by me.</footer>
</main>
