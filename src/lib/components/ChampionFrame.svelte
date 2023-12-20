<script lang="ts">
	import { getChampionNameByID, getImageURL } from "$lib/data/data_dragon";
	import { hideContextMenus } from "$lib/data/stores";
	import { createEventDispatcher } from "svelte";
	import ChampionContextMenu from "./ChampionContextMenu.svelte";

    export let big: boolean = false;
    export let hideName: boolean = false;
    export let settable: boolean = false;

    export let selected: boolean = false;
    export let location: string | null = null;

    const dispatch = createEventDispatcher();

    function onClick() {
        if (disabled) return;

        dispatch("message", {
            championID: championID,
            location: location,
            setChampionID: (newChampionID: string | null) => {
                if (settable) {
                    championID = newChampionID;
                }
            }
        });
    }

    export let disabled: boolean = false;

    export let championID: string | null = null;

    let name: string;
    let imageURL: string;

    $: {
        name = getChampionNameByID(championID);
        imageURL = getImageURL(championID);
    }

    let menu = {x: 0, y: 0};

    let showContextMenu: boolean = false;

    hideContextMenus.onTrigger(() => {
        showContextMenu = false;
    });

    function openContextMenu(e: any) {
        hideContextMenus.trigger();

        showContextMenu = true;

        menu.x = e.pageX;
        menu.y = e.pageY;
    }

    function closeContextMenu() {
        showContextMenu = false;
    }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="champion-frame {big ? "big" : ""} {disabled ? "disabled" : ""}" on:contextmenu|preventDefault={openContextMenu} on:click|preventDefault={onClick}>
    {#if imageURL.length > 0 }
        <div class="portrait {selected ? "gold" : ""} {disabled ? "disabled" : ""}" style="background-image: url({imageURL});" />
    {:else}
        <div class="portrait" style="border: 1px solid var(--clr-neutral-800);" />
    {/if}
    {#if name.length > 0 && !hideName}
        <p class="name {selected ? "gold": ""} {disabled ? "disabled" : ""}">
            {name}
        </p>
    {/if}
</div>

{#if showContextMenu}
    <ChampionContextMenu {championID} x={menu.x} y={menu.y}/>
{/if}

<svelte:window on:click={closeContextMenu} on:message={() => showContextMenu = false}/>

<style>
    .champion-frame {
        width: 4rem;

        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;

        cursor: pointer;
    }

    .champion-frame.disabled {
        cursor: default;
    }

    .champion-frame.big {
        width: 5rem;
    }

    .portrait {
        width: 100%;
        aspect-ratio: 1 / 1; /* Enforce squareness. */

        background-size: 120% 120%; /* Crop in to remove vignette.  */
        background-position: center;
        background-repeat: no-repeat;

        border-width: 1px;
        border-style: solid;
        border-color: transparent;
        border-radius: var(--radius-element);
    }

    .portrait.gold {
        border-color: var(--clr-gold);
    }

    .portrait.disabled {
        filter: grayscale(100%);
    }

    .name {
        font-size: var(--fs-100);
        white-space: nowrap;
    }

    .name.gold {
        color: var(--clr-gold);
    }

    .name.disabled {
        color: var(--clr-border);
    }
</style>