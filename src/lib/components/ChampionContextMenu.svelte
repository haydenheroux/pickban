<script lang="ts">
	import { colors, lanes, damages } from '$lib/data/assets';
	import { getChampionNameOrNull } from '$lib/data/data_dragon';
	import {
		colors as colorStore,
		lanes as laneStore,
		damages as damageStore
	} from '$lib/data/stores';
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
		{#each lanes as { type: lane, src }}
			{#if laneStore.matches(championID, lane)}
				<li>
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<div on:click={() => laneStore.dissociate(championID, lane)}>
						<!-- svelte-ignore a11y-missing-attribute -->
						<img {src} />
						<button>Remove {lane}</button>
					</div>
				</li>
			{:else}
				<li>
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<div on:click={() => laneStore.associate(championID, lane)}>
						<!-- svelte-ignore a11y-missing-attribute -->
						<img {src} />
						<button>Add {lane}</button>
					</div>
				</li>
			{/if}
		{/each}
		{#each damages as { type: damage, src }}
			{#if damageStore.matches(championID, damage)}
				<li>
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<div on:click={() => damageStore.dissociate(championID, damage)}>
						<!-- svelte-ignore a11y-missing-attribute -->
						<img {src} />
						<button>Remove {damage}</button>
					</div>
				</li>
			{:else}
				<li>
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<div on:click={() => damageStore.associate(championID, damage)}>
						<!-- svelte-ignore a11y-missing-attribute -->
						<img {src} />
						<button>Add {damage}</button>
					</div>
				</li>
			{/if}
		{/each}
		{#each colors as { type: color, src }}
			{#if colorStore.matches(championID, color)}
				<li>
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<div on:click={() => colorStore.dissociate(championID, color)}>
						<!-- svelte-ignore a11y-missing-attribute -->
						<img class="color" {src} />
						<button>Remove {color}</button>
					</div>
				</li>
			{:else}
				<li>
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<div on:click={() => colorStore.associate(championID, color)}>
						<!-- svelte-ignore a11y-missing-attribute -->
						<img class="color" {src} />
						<button>Add {color}</button>
					</div>
				</li>
			{/if}
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
