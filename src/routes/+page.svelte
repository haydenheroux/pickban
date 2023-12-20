<script lang="ts">
	import ChampionFrame from "$lib/components/ChampionFrame.svelte";
	import { championIDs } from "$lib/data/data_dragon";
	import { Lane, isMarked } from "$lib/data/stores";

	let previousEvent: any | null = null;
	let selectedChampionID: string | null = null;
	let selectedLocation: string | null = null

	let blueBans = new Array(5).fill(null);
	let redBans = new Array(5).fill(null);

	let bluePicks = new Array(5).fill(null);
	let redPicks = new Array(5).fill(null);

	function handle(event: any) {
		const championID = event.detail.championID;
		const location = event.detail.location;

		if (selectedChampionID == null) {
			selectedChampionID = championID;
			selectedLocation = location;
		} else {
			if (previousEvent != null) {
				previousEvent.setChampionID(championID);
			}

			event.detail.setChampionID(selectedChampionID);
			
			selectedChampionID = null;
			selectedLocation = null;
		}

		previousEvent = event.detail;

		updateSelected();
		updateDisabled();
	}

	let selectedMap: Record<string, boolean> = {};
	updateSelected();

	function updateSelected() {
		for (let championID of championIDs) {
			selectedMap["frame" + championID] = championID == selectedChampionID && selectedLocation == null;
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

    const lanes = [
        {lane: Lane.Top, src: "top.png"},
        {lane: Lane.Jungle, src: "jungle.png"},
        {lane: Lane.Middle, src: "middle.png"},
        {lane: Lane.Bottom, src: "bottom.png"},
        {lane: Lane.Support, src: "support.png"},
    ];

	let laneFilterOrNull: string | null = null;

	function toggleLaneFilter(lane: Lane) {
		if (laneFilterOrNull != lane) {
			laneFilterOrNull = lane;
			paletteChampionIDs = paletteChampionIDs.filter((championID) => isMarked(lane, championID));
		} else {
			laneFilterOrNull = null;
			paletteChampionIDs = championIDs;
		}

		updateLaneFilterMap();
	}

	let laneFilterMap: Record<string, boolean> = {};
	updateLaneFilterMap();

	function updateLaneFilterMap() {
		for (let lane of lanes) {
			laneFilterMap[lane.lane] = laneFilterOrNull == lane.lane;
		}
	} 

	let paletteChampionIDs = championIDs;
</script>

<div class="bans-container">
	<div class="bans">
		{#each Array(5) as _, i }
			<ChampionFrame bind:championID={blueBans[i]} on:message={handle} struck={true} hideName={true} settable={true} location={"blueBan" + i} bind:selected={selectedMap["blueBan" + i]} />
		{/each}
	</div>
	<div class="bans">
		{#each Array(5) as _, i }
			<ChampionFrame bind:championID={redBans[i]} on:message={handle} struck={true} hideName={true} settable={true} location={"redBan" + i} bind:selected={selectedMap["redBan" + i]} />
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
		<div class="filter">
			{#each lanes as {lane, src}}
				<!-- svelte-ignore a11y-missing-attribute -->
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
				<img {src} class="{laneFilterMap[lane] ? "selected" : ""}" on:click={() => toggleLaneFilter(lane)}>
			{/each}
		</div>
		<div class="palette">
			{#each paletteChampionIDs as championID}
				<ChampionFrame {championID} on:message={handle} bind:selected={selectedMap["frame" + championID]} bind:disabled={disabledMap["frame" + championID]} />
			{/each}
		</div>
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
		flex-direction: column;
		gap: var(--section-gap);

		height: 40rem;
	}

	.picker .filter {
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		gap: 0.25rem;
	}

	.picker .filter img {
		height: 2rem;
		filter: grayscale();
	}

	.picker .filter img.selected {
		filter: grayscale() brightness(200%);
	}

	.palette {
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