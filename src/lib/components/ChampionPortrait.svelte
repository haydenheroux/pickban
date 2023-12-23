<script lang="ts">
	import { getImageURLOrNull } from "$lib/data/data_dragon";

    export let championID: string | null = null;

    $: championPortraitURLOrNull = getImageURLOrNull(championID);

    export let selected = false;
    export let disabled = false;
    export let struck = false;
</script>

{#if championPortraitURLOrNull != null}
    <div class="{selected ? "selected" : ""} {disabled ? "disabled" : ""} {struck ? "struck" : ""}" style="background-image: url({championPortraitURLOrNull});" />
{:else}
    <div class="empty"/>
{/if}

<style>
    div {
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

    div.selected {
        border-color: var(--clr-gold);
    }

    div.disabled {
        filter: grayscale(100%);
    }

    div.struck:after {
        --span: 80%;
        --inset: calc((100% - var(--span)) / 2);
        content: "";
        height: 2px;
        width: calc(sqrt(2) * var(--span));
        background-color: var(--clr-foreground);
        border-radius: 1px;
        position: absolute;
        left: calc(var(--inset) + 0.5px);
        top: calc(var(--inset) - 0.5px);
        transform: rotate(45deg);
        transform-origin: 0px 0px;
    }

    div.empty {
        border: 1px solid var(--clr-neutral-800);
    }
</style>