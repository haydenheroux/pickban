<script lang="ts">
	import { getChampionNameOrNull } from '$lib/data/data_dragon';
	import { entries } from '$lib/data/stores';
	export let championID: string | null = null;

	export let x: number;
	export let y: number;

	let name: string;

	$: name = getChampionNameOrNull(championID);
</script>

<nav
	class="context-menu"
	style="position: absolute; left: {x}px; top: {y}px;"
	on:contextmenu|preventDefault={() => {}}
>
	<ul>
		<li><p>{name ? name : ''}</p></li>
		{#each entries as entry}
			{#each entry.assets as { type, src }}
				{#if entry.filter.matches(championID, type)}
					<li>
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<div on:click={() => entry.filter.dissociate(championID, type)}>
							<!-- svelte-ignore a11y-missing-attribute -->
							<img {src} />
							<button>Remove {type}</button>
						</div>
					</li>
				{:else}
					<li>
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<div on:click={() => entry.filter.associate(championID, type)}>
							<!-- svelte-ignore a11y-missing-attribute -->
							<img {src} />
							<button>Add {type}</button>
						</div>
					</li>
				{/if}
			{/each}
		{/each}
	</ul>
</nav>

<style>
	.context-menu {
		display: inline-flex;
		border: 1px solid var(--clr-border);
		background-color: var(--clr-background);
		border-radius: var(--radius-layout);
		overflow: hidden;
		display: flex;
		flex-direction: column;

		z-index: 1;
	}

	.context-menu ul {
		margin: 0.5rem;
		padding: 0;
	}

	.context-menu ul li {
		display: block;
		list-style-type: none;
		color: var(--clr-foreground);
	}

	.context-menu ul li div {
		display: flex;
		gap: 0.25rem;
		align-items: center;
	}

	img {
		height: 1rem;
		filter: grayscale();
	}

	img.color {
		filter: none;
	}

	button {
		font-size: 1rem;
		width: 100%;
		text-align: left;
		border: 0px;
		background-color: var(--clr-background);
		color: var(--clr-muted);
		white-space: nowrap;
		padding: 0;
	}

	.context-menu ul li div:hover button {
		color: var(--clr-foreground);
	}

	.context-menu ul li div:hover img {
		color: var(--clr-foreground);
		filter: grayscale() brightness(200%);
	}
</style>
