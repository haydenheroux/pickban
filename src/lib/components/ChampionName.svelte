<script lang="ts">
	import { getChampionNameOrNull } from "$lib/data/data_dragon";

    export let championID: string | null = null;

    $: championName = getChampionNameOrNull(championID);

    export let selected: boolean = false;
    export let disabled: boolean = false;

</script>

{#if championName != null}
    <p class="{selected ? "selected": ""} {disabled ? "disabled" : ""}">
        {championName}
    </p>
{/if}

<style>
    p {
        font-size: var(--fs-100);
        white-space: nowrap;
    }

    p.selected {
        color: var(--clr-gold);
    }

    p.disabled {
        color: var(--clr-neutral-700);
    }
</style>