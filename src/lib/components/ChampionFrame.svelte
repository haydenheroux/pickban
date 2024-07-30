<script lang="ts">
	import { getChampionNameOrNull } from '$lib/data/data_dragon';
	import { hideContextMenus } from '$lib/data/stores';
	import { createEventDispatcher } from 'svelte';
	import ChampionContextMenu from './ChampionContextMenu.svelte';
	import ChampionPortrait from './ChampionPortrait.svelte';
	import ChampionName from './ChampionName.svelte';

	export let big: boolean = false;
	export let struck: boolean = false;
	export let showName: boolean = false;
	export let settable: boolean = false;

	export let disabled: boolean = false;
	export let selected: boolean = false;

	const dispatch = createEventDispatcher();

	function onClick() {
		if (disabled) return;

		dispatch('message', {
			championID: championID,
			location: location,
			settable: settable,
			setChampionID: (newChampionID: string | null) => {
				if (settable) {
					championID = newChampionID;
				}
			}
		});
	}

	export let championID: string | null = null;
	export let location: string;

	let name: string;

	$: name = getChampionNameOrNull(championID);

	let menu = { x: 0, y: 0 };

	let showContextMenu: boolean = false;

	hideContextMenus.onTrigger(() => {
		showContextMenu = false;
	});

	function openContextMenu(event: any) {
		hideContextMenus.trigger();

		showContextMenu = true;

		menu.x = event.pageX;
		menu.y = event.pageY;
	}

	function closeContextMenu() {
		showContextMenu = false;
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class="{big ? 'big' : ''} {disabled ? 'disabled' : ''}"
	on:contextmenu|preventDefault={openContextMenu}
	on:click|preventDefault={onClick}
>
	<ChampionPortrait {championID} {selected} {disabled} {struck} />
	{#if showName}
		<ChampionName {championID} {selected} {disabled} />
	{/if}
</div>

{#if showContextMenu}
	<ChampionContextMenu {championID} x={menu.x} y={menu.y} />
{/if}

<svelte:window on:click={closeContextMenu} on:message={() => (showContextMenu = false)} />

<style>
	div {
		width: 5rem;

		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;

		cursor: pointer;
	}

	div.disabled {
		cursor: default;
	}

	div.big {
		width: 7rem;
	}
</style>
