<script lang="ts">
	import BooleanSelector from '$lib/components/BooleanSelector.svelte';
	import NumberSelector from "$lib/components/NumberSelector.svelte";
    import Section from "$lib/components/Section.svelte";
	import TimeSelector from "$lib/components/TimeSelector.svelte";

    let creepScore: number;

    let minutes: number;
    let seconds: number;

    let isJungler: boolean = false;

    let minionsSlainPerMinute: number;
    let campsSlainPerMinute: number;

    let minionEfficiency: number;
    let campEfficiency: number;

    let minionGoldEarned: number;
    let campGoldEarned: number;

    $: {
        let totalMinutes = minutes + seconds / 60;

        minionsSlainPerMinute = calculateCreepScorePerMinute(creepScore, totalMinutes);
        campsSlainPerMinute = calculateCreepScorePerMinute(creepScore / 4, totalMinutes);

        minionEfficiency = coerce(creepScore / calculateTotalMinionSpawns(totalMinutes));
        campEfficiency = 0;

        minionGoldEarned = minionEfficiency * calculateTotalMinionGoldEarned(totalMinutes);
        campGoldEarned = 0;
    }

    function coerce(n: number) {
        return Number.isFinite(n) ? n : 0;
    }

    const initialWaveSpawnDelayMinutes = 1 + (5 / 60);
    const minutesPerWave = (30 / 60);
    const wavesPerMinute = 1 / minutesPerWave;

    function calculateCreepScorePerMinute(creepsSlain: number, minutes: number) {
        const result = creepsSlain / minutes; 

        return coerce(result);
    }

    function calculateTotalWaveSpawns(minutes: number) {
        // The "+ 1" includes the initial wave that spawns at initialWaveSpawnDelayMinutes
        return Math.floor(1 + (minutes - initialWaveSpawnDelayMinutes) * wavesPerMinute);
    }

    function calculateTotalMeleeSpawns(waves: number) {
        return waves * 3;
    }

    function calculateTotalRangedSpawns(waves: number) {
        return waves * 3;
    }

    function calculateTotalCannonSpawns(waves: number) {
        let cannons = 0;

        for (let wave = 1; wave <= waves; wave++) {
            let minute = initialWaveSpawnDelayMinutes + (wave - 1) * minutesPerWave;

            if (minute <= 15 && wave % 3 == 0) {
                cannons++;
            } else if (minute > 15 && minute <= 25 && wave % 2 == 0) {
                cannons++;
            } else if (minutes > 25) {
                cannons++;
            }
        }

        return cannons;
    }

    function calculateTotalMinionSpawns(minutes: number) {
        const waves = calculateTotalWaveSpawns(minutes);

        return calculateTotalMeleeSpawns(waves) + calculateTotalRangedSpawns(waves) + calculateTotalCannonSpawns(waves);
    }

    const goldPerMelee = 21;
    const goldPerRanged = 14;
    const goldPerCannon = 60;

    function calculateTotalMinionGoldEarned(minutes: number) {
        const waves = calculateTotalWaveSpawns(minutes);

        return goldPerMelee * calculateTotalMeleeSpawns(waves) + goldPerRanged * calculateTotalRangedSpawns(waves) + goldPerCannon * calculateTotalCannonSpawns(waves);
    }
</script>

<Section>
    <div class="split">
        <div>
            <h2>Creep Score</h2>
            <NumberSelector bind:value={creepScore} plusMinus={false} />
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
    <Section name={"Jungle Camps Slain Per Minute"}>
        <h2>{campsSlainPerMinute.toFixed(2)}</h2>
    </Section>
{:else}
    <Section name={"Minions Slain Per Minute"}>
        <h2>{minionsSlainPerMinute.toFixed(2)}</h2>
    </Section>
{/if}

{#if isJungler}
    <Section name={"Jungle Camp Efficiency"}>
        <h2>{(100 * campEfficiency).toFixed(2)}%</h2>
    </Section>
{:else}
    <Section name={"Minion Efficiency"}>
        <h2>{(100 * minionEfficiency).toFixed(2)}%</h2>
    </Section>
{/if}

{#if isJungler}
    <Section name={"Jungle Camp Gold Earned"}>
        <h2>{campGoldEarned.toFixed()}</h2>
    </Section>
{:else}
    <Section name={"Minion Gold Earned"}>
        <h2>{minionGoldEarned.toFixed()}</h2>
    </Section>
{/if}

<style>
    h2 {
        margin-bottom: 0.5rem;
    }
</style>