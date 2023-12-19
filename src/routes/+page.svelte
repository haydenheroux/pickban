<script>
	import ChampionFrame from "$lib/components/ChampionFrame.svelte";
	import { championIDs } from "$lib/data/data_dragon";
</script>

<div class="bans-container">
	<div class="bans">
		<ChampionFrame />
		<ChampionFrame />
		<ChampionFrame />
		<ChampionFrame />
		<ChampionFrame />
	</div>
	<div class="bans">
		<ChampionFrame />
		<ChampionFrame />
		<ChampionFrame />
		<ChampionFrame />
		<ChampionFrame />
	</div>
</div>

<div class="tri">
	<div class="picks">
		<div>
			<h2 class="blue">B1</h2>
			<ChampionFrame />
		</div>
		<div>
			<h2 class="blue">B2</h2>
			<ChampionFrame />
		</div>
		<div>
			<h2 class="blue">B3</h2>
			<ChampionFrame />
		</div>
		<div>
			<h2 class="blue">B4</h2>
			<ChampionFrame />
		</div>
		<div>
			<h2 class="blue">B5</h2>
			<ChampionFrame />
		</div>
	</div>
	<div class="picker">
		{#each championIDs as championID}
			<ChampionFrame {championID}/>
		{/each}
	</div>
	<div class="picks">
		<div>
			<ChampionFrame />
			<h2 class="red">R1</h2>
		</div>
		<div>
			<ChampionFrame />
			<h2 class="red">R2</h2>
		</div>
		<div>
			<ChampionFrame />
			<h2 class="red">R3</h2>
		</div>
		<div>
			<ChampionFrame />
			<h2 class="red">R4</h2>
		</div>
		<div>
			<ChampionFrame />
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