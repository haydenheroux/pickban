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
        let camps = Camps.until(totalMinutes);

        minionEfficiency = coerce(creepScore / minions.getCreepScore());
        campEfficiency = coerce(creepScore / camps.getCreepScore());

        minionGoldEarned = minionEfficiency * minions.getGoldIncome();
        campGoldEarned = campEfficiency * camps.getGoldIncome();
    }

    function coerce(n: number) {
        return Number.isFinite(n) ? n : 0;
    }

    function calculateCreepScorePerMinute(creepsSlain: number, minutes: number) {
        const result = creepsSlain / minutes; 

        return coerce(result);
    }

    class Minions {
        private static initialWaveSpawnDelayMinutes: number = 1 + (5 / 60);
        private static minutesPerWave: number = (30 / 60);
        private static wavesPerMinute: number = 1 / this.minutesPerWave;

        private static wavesUntil(minutes: number) {
            // The "+ 1" includes the initial wave that spawns at initialWaveSpawnDelayMinutes
            return Math.floor(1 + (minutes - this.initialWaveSpawnDelayMinutes) * this.wavesPerMinute);
        }

        private static minutesAt(wave: number) {
            return this.initialWaveSpawnDelayMinutes + (wave - 1) * this.minutesPerWave;
        }

        private melees!: number;
        private static goldPerMelee: number = 21;

        private ranged!: number;
        private static goldPerRanged: number = 14;

        private stage1Cannons!: number;
        private static goldPerStage1Cannon: number = 60;
        
        private stage2Cannons!: number;
        private static goldPerStage2Cannon: number = 84;

        private stage3Cannons!: number;
        private static goldPerStage3Cannon: number = 90;

        private constructor() {
            this.melees = 0;
            this.ranged = 0;
            this.stage1Cannons = 0;
            this.stage2Cannons = 0;
            this.stage3Cannons = 0;
        }

        public static until(minutes: number): Minions {
            const minions: Minions = new Minions(); 

            const waves = this.wavesUntil(minutes);

            minions.melees = waves * 3;
            minions.ranged = waves * 3;

            for (let wave = 1; wave <= waves; wave++) {
                let minute = this.minutesAt(wave);

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

        public getCreepScore(): number {
            return this.melees + this.ranged + this.stage1Cannons + this.stage2Cannons + this.stage3Cannons;
        }

        public getGoldIncome(): number {
            return this.melees * Minions.goldPerMelee 
                + this.ranged * Minions.goldPerRanged
                + this.stage1Cannons * Minions.goldPerStage1Cannon 
                + this.stage2Cannons * Minions.goldPerStage2Cannon 
                + this.stage3Cannons * Minions.goldPerStage3Cannon;
        }
    }

    class Camps {
        private redBuffs!: number;
        private static redBuffInitialSpawnMinutes: number = 1 + (30 / 60);
        private static redBuffRespawnDelayMinutes: number = 5;
        private static redBuffCreepScore: number = 4;
        private static redBuffGold: number = 90;

        private krugs!: number;
        private static krugsInitialSpawnMinutes: number = 1 + (42 / 60);
        private static krugsRespawnDelayMinutes: number = 2 + (15 / 60);
        private static krugsCreepScore: number = 4;
        private static krugsGold: number = 15 + 10 + 6 * 14;

        private raptors!: number;
        private static raptorsInitialSpawnMinutes: number = 1 + (30 / 60);
        private static raptorsRespawnDelayMinutes: number = 2 + (15 / 60);
        private static raptorsCreepScore: number = 4;
        private static raptorsGold: number = 35 + 5 * 8;

        private wolves!: number;
        private static wolvesInitialSpawnMinutes: number = 1 + (30 / 60);
        private static wolvesRespawnDelayMinutes: number = 2 + (15 / 60);
        private static wolvesCreepScore: number = 4;
        private static wolvesGold: number = 55 + 2 * 13;

        private blueBuffs!: number;
        private static blueBuffInitialSpawnMinutes: number = 1 + (30 / 60);
        private static blueBuffRespawnDelayMinutes: number = 5;
        private static blueBuffCreepScore: number = 4;
        private static blueBuffGold: number = 90;

        private gromps!: number;
        private static grompInitialSpawnMinutes: number = 1 + (42 / 60);
        private static grompRespawnDelayMinutes: number = 2 + (15 / 60);
        private static grompCreepScore: number = 4;
        private static grompGold: number = 80;

        private constructor() {
            this.redBuffs = 0;
            this.krugs = 0;
            this.raptors = 0;
            this.wolves = 0;
            this.blueBuffs = 0;
            this.gromps = 0;
        }

        private static spawns(minutes: number, initialSpawnMinutes: number, respawnDelayMinutes: number): number {
            return 1 + (minutes - initialSpawnMinutes) / respawnDelayMinutes;
        }

        public static until(minutes: number): Camps {
            const camps: Camps = new Camps();

            camps.redBuffs = Camps.spawns(minutes, this.redBuffInitialSpawnMinutes, this.redBuffRespawnDelayMinutes);
            camps.krugs = Camps.spawns(minutes, this.krugsInitialSpawnMinutes, this.krugsRespawnDelayMinutes);
            camps.raptors = Camps.spawns(minutes, this.raptorsInitialSpawnMinutes, this.raptorsRespawnDelayMinutes);
            camps.wolves = Camps.spawns(minutes, this.wolvesInitialSpawnMinutes, this.wolvesRespawnDelayMinutes);
            camps.blueBuffs = Camps.spawns(minutes, this.blueBuffInitialSpawnMinutes, this.blueBuffRespawnDelayMinutes);
            camps.gromps = Camps.spawns(minutes, this.grompInitialSpawnMinutes, this.grompRespawnDelayMinutes);

            return camps;
        }

        public getCreepScore() {
            return this.redBuffs * Camps.redBuffCreepScore
                + this.krugs * Camps.krugsCreepScore
                + this.raptors * Camps.raptorsCreepScore
                + this.wolves * Camps.wolvesCreepScore
                + this.blueBuffs * Camps.blueBuffCreepScore
                + this.gromps * Camps.grompCreepScore;
        }

        public getGoldIncome() {
            return this.redBuffs * Camps.redBuffGold
                + this.krugs * Camps.krugsGold
                + this.raptors * Camps.raptorsGold
                + this.wolves * Camps.wolvesGold
                + this.blueBuffs * Camps.blueBuffGold
                + this.gromps * Camps.grompGold;
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