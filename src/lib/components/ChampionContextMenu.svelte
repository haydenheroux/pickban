<script lang="ts">
	import { getChampionNameOrNull } from "$lib/data/data_dragon";
	import { Lane, addFavorite, isFavorite, removeFavorite } from "$lib/data/stores";
    export let championID: string | null = null;

    export let x: number;
    export let y: number;

    let name: string;

    $: name = getChampionNameOrNull(championID);

    const lanes = [
        {lane: Lane.Top, src: "top.png"},
        {lane: Lane.Jungle, src: "jungle.png"},
        {lane: Lane.Middle, src: "middle.png"},
        {lane: Lane.Bottom, src: "bottom.png"},
        {lane: Lane.Support, src: "support.png"},
    ];
</script>

<nav class="context-menu" style="position: absolute; left: {x}px; top: {y}px;" on:contextmenu|preventDefault={() => {}}>
    <ul>
        <li><p>{name ? name : ""}</p></li>
        <li><hr></li>
        {#each lanes as {lane, src}}
            {#if isFavorite(lane, championID)}
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