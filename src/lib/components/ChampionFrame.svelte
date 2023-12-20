<script lang="ts">
	import { getChampionNameByID, getImageURL } from "$lib/data/data_dragon";
	import { hideContextMenus } from "$lib/data/stores";
	import { createEventDispatcher } from "svelte";
	import ChampionContextMenu from "./ChampionContextMenu.svelte";

    export let big: boolean = false;
    export let struck: boolean = false;
    export let showName: boolean = false;
    export let settable: boolean = false;
    export let gap: boolean = false;

    export let disabled: boolean = false;
    export let selected: boolean = false;

    const dispatch = createEventDispatcher();

    function onClick() {
        if (disabled) return;

        dispatch("message", {
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
<div class="champion-frame {big ? "big" : ""} {disabled ? "disabled" : ""} {gap ? "gap" : ""}" on:contextmenu|preventDefault={openContextMenu} on:click|preventDefault={onClick}>
    {#if imageURL.length > 0 }
        <div class="portrait {selected ? "gold" : ""} {disabled ? "disabled" : ""} {struck ? "struck" : ""}" style="background-image: url({imageURL});" />
    {:else}
        <div class="portrait" style="border: 1px solid var(--clr-neutral-800);" />
    {/if}
    {#if name.length > 0 && showName}
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
        width: 5rem;

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
        width: 7rem;
    }

    .champion-frame.gap {
        /* TODO Check if 1x or 2x looks better */
        margin-right: calc(1 * var(--section-gap));
    }

    .portrait {
        width: 100%;
        aspect-ratio: 1 / 1; /* Enforce squareness. */

        position: relative;

        background-size: 120% 120%; /* Crop in to remove vignette.  */
        background-position: center;
        background-repeat: no-repeat;

        border-width: 2px;
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

    .portrait.struck:after {
        --span: 80%;
        --inset: calc((100% - var(--span)) / 2);
        content: "";
        height: 2px;
        width: calc(sqrt(2) * var(--span));
        background-color: var(--clr-foreground);
        position: absolute;
        left: calc(var(--inset) + 0.5px);
        top: calc(var(--inset) - 0.5px);
        transform: rotate(45deg);
        transform-origin: 0px 0px;
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