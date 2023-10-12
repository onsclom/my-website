<script lang="ts">
	export let emoji: string;
	export let name: string;
	export let desc: string;
	export let url: string;
</script>

<a
	href={url}
	class="flex flex-col p-2 no-underline transition-colors border-2 rounded-lg sm:p-4 text-ellipsis whitespace-nowrap hover:bg-slate-100 dark:hover:bg-slate-800 dark:border-slate-700"
>
	<div class="flex space-x-2 font-bold">
		<div>{emoji}</div>
		<div>{name}</div>
	</div>
	<div class="text-slate-700 dark:text-slate-400">{desc}</div>
</a>
