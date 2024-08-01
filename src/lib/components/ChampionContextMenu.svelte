<script lang="ts">
	import { getChampionNameOrNull } from '$lib/data/data_dragon';
	import { entries } from '$lib/data/stores';
	import { open } from '$lib/data/assets';
	export let championID: string | null = null;

	export let x: number;
	export let y: number;

	let name: string;
	let url: string;

	$: name = getChampionNameOrNull(championID);
	$: url = formatURL(name);

	function formatURL(name: string): string {
		const formatted = name.replace(/[^\x00-\x7F]/g, '').toLowerCase();

		return `https://lolalytics.com/lol/${formatted}/build/`;
	}
</script>

<nav style="position: absolute; left: {x}px; top: {y}px;" on:contextmenu|preventDefault={() => {}}>
	<ul>
		<li class="title">
			<a href={url} target="_blank">
				<span>{name ? name : ''}</span>
				<!-- svelte-ignore a11y-missing-attribute -->
				<img src={open} />
			</a>
		</li>
		<div class="separator"></div>
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
			<div class="separator"></div>
		{/each}
	</ul>
</nav>

<style>
	nav {
		display: inline-flex;
		border: 1px solid var(--clr-border);
		background-color: var(--clr-background);
		border-radius: var(--radius-layout);
		overflow: hidden;
		display: flex;
		flex-direction: column;

		z-index: 1;
	}

	nav ul {
		margin: 0.5rem;
		padding: 0;
	}

	nav ul li {
		display: block;
		list-style-type: none;
		color: var(--clr-foreground);
	}

	nav ul li.title a {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--header-gap);
	}

	nav ul li.title a img {
		height: auto;
	}

	nav ul li div {
		display: flex;
		gap: 0.25rem;
		align-items: center;
	}

	nav ul .separator:not(:last-of-type) {
		border-bottom: 1px solid var(--clr-neutral-800);
		border-radius: var(--radius-element);

		margin-block: 0.25rem;
	}

	img {
		height: 1rem;
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

	nav ul li div:hover button {
		color: var(--clr-foreground);
	}

	nav ul li div:hover img {
		color: var(--clr-foreground);
		filter: grayscale() brightness(200%);
	}
</style>
