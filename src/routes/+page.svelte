<script>
	import ChampionFrame from "$lib/components/ChampionFrame.svelte";
	import { championIDs } from "$lib/data/data_dragon";
</script>

<div>
	{#each championIDs as championID}
		<ChampionFrame {championID}/>
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