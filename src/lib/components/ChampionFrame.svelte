<script lang="ts">
	import { getChampionName, getImageURL } from "$lib/data/data_dragon";
	import { Lane, addFavorite, hideContextMenus, hasFavorite, removeFavorite } from "$lib/data/stores";

    export let champion: string;

    let name: string = getChampionName(champion);
    let imageURL: string = getImageURL(champion);

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
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="champion-frame" on:contextmenu|preventDefault={openContextMenu}>
    <div class="portrait" style="background-image: url({imageURL})">
    </div>
    <p class="name">
        {name}
    </p>
</div>

{#if showContextMenu}
    <nav use:getContextMenuDimension class="context-menu" style="position: absolute; left: {menu.x}px; top: {menu.y}px;" on:contextmenu|preventDefault={() => {}}>
        <ul>
            <li><p>{name}</p></li>
            <li><hr></li>
            {#each [Lane.Top, Lane.Jungle, Lane.Middle, Lane.Bottom, Lane.Support] as lane}
                {#if hasFavorite(lane, champion)}
                    <li><button on:click={() => removeFavorite(lane, champion)}>Unfavorite for {lane}</button></li>
                {:else}
                    <li><button on:click={() => addFavorite(lane, champion)}>Favorite for {lane}</button></li>
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

    .portrait {
        width: 100%;
        aspect-ratio: 1 / 1; /* Enforce squareness. */

        background-size: 120% 120%; /* Crop in to remove vignette.  */
        background-position: center;
        background-repeat: no-repeat;

        border-radius: var(--radius-element);
    }

    .name {
        font-size: var(--fs-100);
        white-space: nowrap;
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

    .context-menu ul li button {
        font-size: 1rem;
        width: 100%;
        text-align: left;
        border: 0px;
        background-color: var(--clr-background);
        color: var(--clr-muted);
        white-space: nowrap;
        padding: 0;
    }

    .context-menu ul li button:hover {
        color: var(--clr-foreground);
    }
</style>