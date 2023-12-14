<script lang="ts">
	import { getChampionName, getImageURL } from "$lib/data/data_dragon";
	import { Lane, addFavorite, contextMenu as hideContextMenus, hasFavorite, removeFavorite } from "$lib/data/stores";

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

    hideContextMenus.subscribe(() => {
        showContextMenu = false;
    });

    function openContextMenu(e: any) {
        hideContextMenus.publish();

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

        if (mouse.x + menu.x > browser.x + browser.w) {
            menu.x = mouse.x - menu.x;
        } else {
            menu.x = mouse.x;
        }

        if (mouse.y + menu.y > browser.y + browser.y) {
            menu.y  = mouse.y - menu.y;
        } else {
            menu.y = mouse.y;
        }
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
            {#if hasFavorite(Lane.Top, champion)}
                <li><button on:click={() => removeFavorite(Lane.Top, champion)}>Unfavorite for Top</button></li>
            {:else}
                <li><button on:click={() => addFavorite(Lane.Top, champion)}>Favorite for Top</button></li>
            {/if}
            {#if hasFavorite(Lane.Jungle, champion)}
                <li><button on:click={() => removeFavorite(Lane.Jungle, champion)}>Unfavorite for Jungle</button></li>
            {:else}
                <li><button on:click={() => addFavorite(Lane.Jungle, champion)}>Favorite for Jungle</button></li>
            {/if}
            {#if hasFavorite(Lane.Middle, champion)}
                <li><button on:click={() => removeFavorite(Lane.Middle, champion)}>Unfavorite for Middle</button></li>
            {:else}
                <li><button on:click={() => addFavorite(Lane.Middle, champion)}>Favorite for Middle</button></li>
            {/if}
            {#if hasFavorite(Lane.Bottom, champion)}
                <li><button on:click={() => removeFavorite(Lane.Bottom, champion)}>Unfavorite for Bottom</button></li>
            {:else}
                <li><button on:click={() => addFavorite(Lane.Bottom, champion)}>Favorite for Bottom</button></li>
            {/if}
            {#if hasFavorite(Lane.Support, champion)}
                <li><button on:click={() => removeFavorite(Lane.Support, champion)}>Unfavorite for Support</button></li>
            {:else}
                <li><button on:click={() => addFavorite(Lane.Support, champion)}>Favorite for Support</button></li>
            {/if}
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