<script lang="ts">
	import ChampionFrame from "$lib/components/ChampionFrame.svelte";
	import { championIDs } from "$lib/data/data_dragon";

	let previous: any | null = null;
	let selected: string | null = null;
	let selectedLocation: string | null = null

	let blueBans = [null, null, null, null, null];
	let redBans = [null, null, null, null, null];

	let bluePicks = [null, null, null, null, null];  
	let redPicks = [null, null, null, null, null];

	function handle(event: any) {
		const championID = event.detail.championID;
		const location = event.detail.location;

		if (selected == null) {
			selected = championID;
			selectedLocation = location;
		} else {
			if (previous != null) {
				previous.setChampionID(championID);
			}

			event.detail.setChampionID(selected);
			
			selected = null;
			selectedLocation = null;
		}

		previous = event.detail;

		updateSelected();
		updateDisabled();
	}

	let selectedMap: Record<string, boolean> = {};
	updateSelected();

	function updateSelected() {
		for (let championID of championIDs) {
			selectedMap["frame" + championID] = championID == selected && selectedLocation == null;
		}
		for (let i = 0; i < 5; i++) {
			selectedMap["blueBan" + i] = selectedLocation == "blueBan" + i;
			selectedMap["redBan" + i] = selectedLocation == "redBan" + i;
			selectedMap["bluePick" + i] = selectedLocation == "bluePick" + i;
			selectedMap["redPick" + i] = selectedLocation == "redPick" + i;
		}
	}

	let disabledMap: Record<string, boolean> = {};
	updateDisabled();

	function updateDisabled() {
		for (let championID of championIDs) {
			// @ts-ignore
			disabledMap["frame" + championID] = blueBans.includes(championID) || redBans.includes(championID) || bluePicks.includes(championID) || redPicks.includes(championID);
		}
	}
</script>

<div class="bans-container">
	<div class="bans">
		{#each Array(5) as _, i }
			<ChampionFrame bind:championID={blueBans[i]} on:message={handle} hideName={true} settable={true} location={"blueBan" + i} bind:selected={selectedMap["blueBan" + i]} />
		{/each}
	</div>
	<div class="bans">
		{#each Array(5) as _, i }
			<ChampionFrame bind:championID={redBans[i]} on:message={handle} hideName={true} settable={true} location={"redBan" + i} bind:selected={selectedMap["redBan" + i]} />
		{/each}
	</div>
</div>

<div class="tri">
	<div class="picks">
		{#each Array(5) as _, i}
			<div>
				<h2 class="blue {selectedMap["bluePick" + i] ? "gold" : ""}">B{i + 1}</h2>
				<ChampionFrame bind:championID={bluePicks[i]} on:message={handle} hideName={true} settable={true} big={true} location={"bluePick" + i} bind:selected={selectedMap["bluePick" + i]} />
			</div>
		{/each}
	</div>
	<div class="picker">
		{#each championIDs as championID}
			<ChampionFrame {championID} on:message={handle} bind:selected={selectedMap["frame" + championID]} bind:disabled={disabledMap["frame" + championID]} />
		{/each}
	</div>
	<div class="picks">
		{#each Array(5) as _, i}
			<div>
				<ChampionFrame bind:championID={redPicks[i]} on:message={handle} hideName={true} settable={true} big={true} location={"redPick" + i} bind:selected={selectedMap["redPick" + i]} />
				<h2 class="red {selectedMap["redPick" + i] ? "gold" : ""}">R{i + 1}</h2>
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

		height: 25rem;

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

	.gold {
		color: var(--clr-gold);
	}
</style>