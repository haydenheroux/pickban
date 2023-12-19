<script lang="ts">
	import { getChampionNameByID, getImageURL } from "$lib/data/data_dragon";
	import { Lane, addFavorite, hideContextMenus, hasFavorite, removeFavorite } from "$lib/data/stores";
	import { createEventDispatcher } from "svelte";

    export let big: boolean = false;
    export let hideName: boolean = false;
    export let settable: boolean = false;

    export let selected: boolean = false;

    const dispatch = createEventDispatcher();

    function onClick() {
        if (disabled) return;

        dispatch("message", {
            championID: championID,
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

    function getContextMenuDimension(node: HTMLElement) {
        menuDimension = {
            h: node.offsetHeight,
            w: node.offsetWidth
        }
    }

    let mouse = {x: 0, y: 0};
    let menu = {x: 0, y: 0};
    let menuDimension = {h: 0, w: 0};
    let browser = {x: 0, y: 0, w: 0, h: 0};

    let showContextMenu: boolean = false;

    hideContextMenus.onTrigger(() => {
        showContextMenu = false;
    });

    function openContextMenu(e: any) {
        hideContextMenus.trigger();

        showContextMenu = true;

        mouse = {
            x: e.pageX,
            y: e.pageY
        }
        browser = {
            x: window.scrollX,
            y: window.scrollY,
            w: window.innerWidth,
            h: window.innerHeight
        }

        menu.x = mouse.x;
        menu.y = mouse.y;
    }

    function closeContextMenu() {
        showContextMenu = false;
    }

    const lanes = [
        {lane: Lane.Top, src: "top.png"},
        {lane: Lane.Jungle, src: "jungle.png"},
        {lane: Lane.Middle, src: "middle.png"},
        {lane: Lane.Bottom, src: "bottom.png"},
        {lane: Lane.Support, src: "support.png"},
    ];
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
    <nav use:getContextMenuDimension class="context-menu" style="position: absolute; left: {menu.x}px; top: {menu.y}px;" on:contextmenu|preventDefault={() => {}}>
        <ul>
            <li><p>{name}</p></li>
            <li><hr></li>
            {#each lanes as {lane, src}}
                {#if hasFavorite(lane, championID)}
                    <li>
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <!-- svelte-ignore a11y-no-static-element-interactions -->
                        <div on:click={() => removeFavorite(lane, championID)}>
                            <!-- svelte-ignore a11y-missing-attribute -->
                            <img {src}>
                            <button>Unfavorite for {lane}</button>
                        </div>
                    </li>
                {:else}
                    <li>
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <!-- svelte-ignore a11y-no-static-element-interactions -->
                        <div on:click={() => addFavorite(lane, championID)}>
                            <!-- svelte-ignore a11y-missing-attribute -->
                            <img {src}>
                            <button>Favorite for {lane}</button>
                        </div>
                    </li>
                {/if}
            {/each}
        </ul>
    </nav>
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

    .context-menu {
        display: inline-flex;
        border: 1px solid var(--clr-border);
        background-color: var(--clr-background);
        border-radius: var(--radius-layout);
        overflow: hidden;
        display: flex;
        flex-direction: column;
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

    .context-menu ul li div img {
        height: 1rem;
        filter: grayscale();
    }

    .context-menu ul li div button {
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