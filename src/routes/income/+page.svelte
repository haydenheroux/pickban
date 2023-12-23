<script lang="ts">
	import BooleanSelector from '$lib/components/BooleanSelector.svelte';
	import NumberSelector from "$lib/components/NumberSelector.svelte";
    import Section from "$lib/components/Section.svelte";
	import TimeSelector from "$lib/components/TimeSelector.svelte";

    let creepsSlain: number;

    let minutes: number;
    let seconds: number;

    let isJungler: boolean = false;

    let creepsSlainPerMinute: number;
    let campsSlainPerMinute: number;

    $: {
        let totalMinutes = minutes + seconds / 60;

        creepsSlainPerMinute = calculateCreepsSlainPerMinute(creepsSlain, totalMinutes);
        campsSlainPerMinute = calculateCreepsSlainPerMinute(creepsSlain / 4, totalMinutes);
    }

    function calculateCreepsSlainPerMinute(creepsSlain: number, minutes: number) {
        const result = creepsSlain / minutes; 

        if (Number.isFinite(result)) {
            return result;
        }

        return 0;
    }
</script>

<Section>
    <div class="split">
        <div>
            <h2>Creeps Slain</h2>
            <NumberSelector bind:value={creepsSlain} plusMinus={false} />
        </div>
        <div>
            <h2>Game Time</h2>
            <TimeSelector bind:minutes bind:seconds />
        </div>
    </div>
    <div>
        <h2>Role</h2>
        <BooleanSelector bind:value={isJungler} left={"Laner"} right={"Jungler"} />
    </div>
</Section>
{#if isJungler}
    <Section name={"Camps Slain Per Minute"}>
        <h2>{campsSlainPerMinute.toFixed(2)}</h2>
    </Section>
{:else}
    <Section name={"Creeps Slain Per Minute"}>
        <h2>{creepsSlainPerMinute.toFixed(2)}</h2>
    </Section>
{/if}

<style>
    h2 {
        margin-bottom: 0.5rem;
    }
</style>