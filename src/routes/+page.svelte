<script>
	import ChampionFrame from "$lib/components/ChampionFrame.svelte";
	import { champions } from "$lib/data/data_dragon";
</script>

<div>
	{#each Object.keys(champions) as champion}
		<ChampionFrame {champion}/>
	{/each}
</div>

<style>
	div {
		display: flex;
		flex: 0 1 auto;
		flex-direction: row;
		justify-content: center;
		flex-wrap: wrap;
		gap: var(--section-gap);
	}
</style>