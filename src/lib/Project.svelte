<script lang="ts">
	export let emoji: string;
	export let name: string;
	export let desc: string;
	export let url: string;
</script>

<a
	href={url}
	class="flex flex-col p-4 no-underline transition-colors border-2 rounded-lg hover:bg-slate-200"
>
	<div class="flex space-x-2 font-bold">
		<div>{emoji}</div>
		<div>{name}</div>
	</div>
	<div class="text-slate-500">{desc}</div>
</a>
