<script>
	import ChampionFrame from "$lib/components/ChampionFrame.svelte";
	import { champions } from "$lib/data/data_dragon";
</script>

{#each Object.keys(champions) as champion}
	<ChampionFrame {champion}/>
{/each}