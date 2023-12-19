<script lang="ts">
	import ChampionFrame from "$lib/components/ChampionFrame.svelte";
	import { championIDs } from "$lib/data/data_dragon";

	let previous: any;
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

			previous.setChampionID(championID);

			selected = null;
		}

		previous = event.detail;

		updateSelectedMap();
	}

	let selectedMap: Record<string, boolean> = {};
	updateSelectedMap();

	function updateSelectedMap() {
		for (let championID of championIDs) {
			selectedMap[championID] = championID == selected;
		}
	}
</script>

<div class="bans-container">
	<div class="bans">
		{#each Array(5) as _, i }
			<ChampionFrame bind:championID={blueBans[i]} on:message={handle} hideName={true} settable={true} />
		{/each}
	</div>
	<div class="bans">
		{#each Array(5) as _, i }
			<ChampionFrame bind:championID={redBans[i]} on:message={handle} hideName={true} settable={true} />
		{/each}
	</div>
</div>

<div class="tri">
	<div class="picks">
		{#each Array(5) as _, i}
			<div>
				<h2 class="blue">B{i + 1}</h2>
				<ChampionFrame bind:championID={bluePicks[i]} on:message={handle} hideName={true} settable={true} big={true} />
			</div>
		{/each}
	</div>
	<div class="picker">
		{#each championIDs as championID}
			<ChampionFrame {championID} on:message={handle} bind:selected={selectedMap[championID]} />
		{/each}
	</div>
	<div class="picks">
		{#each Array(5) as _, i}
			<div>
				<ChampionFrame bind:championID={redPicks[i]} on:message={handle} hideName={true} settable={true} big={true} />
				<h2 class="red">R{i + 1}</h2>
			</div>
		{/each}
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

		height: 40rem;

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