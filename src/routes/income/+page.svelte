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

        let minions = Minions.until(totalMinutes);

        minionEfficiency = coerce(creepScore / minions.getCreepScore());
        campEfficiency = 0;

        minionGoldEarned = minionEfficiency * minions.getGoldIncome();
        campGoldEarned = 0;
    }

    function coerce(n: number) {
        return Number.isFinite(n) ? n : 0;
    }

    const initialWaveSpawnDelayMinutes: number = 1 + (5 / 60);
    const minutesPerWave: number = (30 / 60);
    const wavesPerMinute: number = 1 / minutesPerWave;

    function calculateCreepScorePerMinute(creepsSlain: number, minutes: number) {
        const result = creepsSlain / minutes; 

        return coerce(result);
    }

    class Minions {
        melees!: number;
        ranged!: number;
        stage1Cannons!: number;
        stage2Cannons!: number;
        stage3Cannons!: number;

        static until(minutes: number) {
            const minions: Minions = new Minions(); 

            // The "+ 1" includes the initial wave that spawns at initialWaveSpawnDelayMinutes
            const waves = Math.floor(1 + (minutes - initialWaveSpawnDelayMinutes) * wavesPerMinute);

            minions.melees = waves * 3;
            minions.ranged = waves * 3;

            for (let wave = 1; wave <= waves; wave++) {
                let minute = initialWaveSpawnDelayMinutes + (wave - 1) * minutesPerWave;

                if (minute <= 15 && wave % 3 == 0) {
                    minions.stage1Cannons++;
                } else if (minute > 15 && minute <= 25 && wave % 2 == 0) {
                    minions.stage2Cannons++;
                } else if (minutes > 25) {
                    minions.stage3Cannons++;
                }
            }

            return minions;
        }

        constructor() {
            this.melees = 0;
            this.ranged = 0;
            this.stage1Cannons = 0;
            this.stage2Cannons = 0;
            this.stage3Cannons = 0;
        }

        getCreepScore(): number {
            return this.melees + this.ranged + this.stage1Cannons + this.stage2Cannons + this.stage3Cannons;
        }

        getGoldIncome(): number {
            return this.melees * 21 + this.ranged * 14 + this.stage1Cannons * 60 + this.stage2Cannons * 84 + this.stage3Cannons * 90;
        }
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