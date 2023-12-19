<script lang="ts">
	import ChampionFrame from "$lib/components/ChampionFrame.svelte";
	import { championIDs } from "$lib/data/data_dragon";

	let selected: string | null = null;

	let blueBans: Array<string | null> = [null, null, null, null, null];
	let redBans = [null, null, null, null, null];

	let bluePicks = [null, null, null, null, null];
	let redPicks = [null, null, null, null, null];

	function handle(event: any) {
		const championID = event.detail.championID;

		const selectionIsEmpty = selected == null;
		const selectionIsNotEmpty = !selectionIsEmpty;
		const clickedIsEmpty = championID == null;
		const clickedIsNotEmpty = !clickedIsEmpty;

		if (selectionIsEmpty) {
			selected = championID;
		} else if (selectionIsNotEmpty && clickedIsEmpty) {
			event.detail.setChampionID(selected);
			selected = null;
		} else if (selectionIsNotEmpty && clickedIsNotEmpty) {
			// Try to swap
			event.detail.setChampionID(selected);
			selected = null;
		}

		generateSelectedMap();
	}

	let selectedMap: Record<string, boolean> = {};
	generateSelectedMap();

	function generateSelectedMap() {
		for (let championID of championIDs) {
			selectedMap[championID] = championID == selected;
		}
	}
</script>

<div class="bans-container">
	<div class="bans">
		<ChampionFrame bind:championID={blueBans[0]} on:message={handle} hideName={true} />
		<ChampionFrame bind:championID={blueBans[1]} on:message={handle} hideName={true} />
		<ChampionFrame bind:championID={blueBans[2]} hideName={true} />
		<ChampionFrame bind:championID={blueBans[3]} hideName={true} />
		<ChampionFrame bind:championID={blueBans[4]} hideName={true} />
	</div>
	<div class="bans">
		<ChampionFrame bind:championID={redBans[0]} hideName={true} />
		<ChampionFrame bind:championID={redBans[1]} hideName={true} />
		<ChampionFrame bind:championID={redBans[2]} hideName={true} />
		<ChampionFrame bind:championID={redBans[3]} hideName={true} />
		<ChampionFrame bind:championID={redBans[4]} hideName={true} />
	</div>
</div>

<div class="tri">
	<div class="picks">
		<div>
			<h2 class="blue">B1</h2>
			<ChampionFrame bind:championID={bluePicks[0]} hideName={true} />
		</div>
		<div>
			<h2 class="blue">B2</h2>
			<ChampionFrame bind:championID={bluePicks[1]} hideName={true} />
		</div>
		<div>
			<h2 class="blue">B3</h2>
			<ChampionFrame bind:championID={bluePicks[2]} hideName={true} />
		</div>
		<div>
			<h2 class="blue">B4</h2>
			<ChampionFrame bind:championID={bluePicks[3]} hideName={true} />
		</div>
		<div>
			<h2 class="blue">B5</h2>
			<ChampionFrame bind:championID={bluePicks[4]} hideName={true} />
		</div>
	</div>
	<div class="picker">
		{#each championIDs as championID}
			<ChampionFrame {championID} on:message={handle} bind:selected={selectedMap[championID]}/>
		{/each}
	</div>
	<div class="picks">
		<div>
			<ChampionFrame bind:championID={redPicks[0]} hideName={true} />
			<h2 class="red">R1</h2>
		</div>
		<div>
			<ChampionFrame bind:championID={redPicks[1]} hideName={true} />
			<h2 class="red">R2</h2>
		</div>
		<div>
			<ChampionFrame bind:championID={redPicks[2]} hideName={true} />
			<h2 class="red">R3</h2>
		</div>
		<div>
			<ChampionFrame bind:championID={redPicks[3]} hideName={true} />
			<h2 class="red">R4</h2>
		</div>
		<div>
			<ChampionFrame bind:championID={redPicks[4]} hideName={true} />
			<h2 class="red">R5</h2>
		</div>
	</div>
</div>


<style>
	.bans-container {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.tri {
		display: grid;
		grid-template-columns: min-content 1fr min-content;

		height: 30rem;

		gap: var(--section-gap);
	}

	.bans {
		display: flex;
		flex: 0 1 auto;
		flex-direction: row;
		justify-content: center;
		flex-wrap: wrap;
		gap: var(--section-gap);
	}

	.picks {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--section-gap);
	}

	.picks > div {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: var(--section-gap);
	}

	.picks > div > h2 {
		width: auto;
		height: auto;
	}

	.picker {
		display: flex;
		flex-direction: row;
		justify-content: center;
		flex-wrap: wrap;
		gap: var(--section-gap);

		height: 100%;
		overflow-y: scroll;
	}

	.blue {
		color: var(--clr-blue);
	}

	.red {
		color: var(--clr-red);
	}
</style>