<script lang="ts">
	import BooleanSelector from '$lib/components/BooleanSelector.svelte';
	import NumberSelector from "$lib/components/NumberSelector.svelte";
    import Section from "$lib/components/Section.svelte";
	import TimeSelector from "$lib/components/TimeSelector.svelte";
	import { Time } from '$lib/util/time';

    let creepScore: number;

    let gameTime: Time = new Time();

    let isJungler: boolean = false;

    let minionsSlainPerMinute: number;
    let campsSlainPerMinute: number;

    let minionEfficiency: number;
    let campEfficiency: number;

    let minionGoldEarned: number;
    let campGoldEarned: number;

    $: {
        minionsSlainPerMinute = calculateCreepScorePerMinute(creepScore, gameTime);
        campsSlainPerMinute = calculateCreepScorePerMinute(creepScore / 4, gameTime);

        let minions = Minions.until(gameTime);
        let camps = Camps.until(gameTime);

        minionEfficiency = coerce(creepScore / minions.creepScore);
        campEfficiency = coerce(creepScore / camps.creepScore);

        minionGoldEarned = minionEfficiency * minions.goldIncome;
        campGoldEarned = campEfficiency * camps.goldIncome;
    }

    function coerce(n: number) {
        return Number.isFinite(n) ? n : 0;
    }

    function calculateCreepScorePerMinute(creepsSlain: number, time: Time) {
        const result = creepsSlain / time.totalMinutes;

        return coerce(result);
    }

    class Minions {
        private static initialWaveSpawnDelay = Time.minutes(1).seconds(5);
        private static timePerWave = Time.seconds(30);

        private static wavesUntil(time: Time) {
            // The "+ 1" includes the initial wave that spawns at initialWaveSpawnDelayMinutes
            return Math.floor(1 + (time.totalMinutes - this.initialWaveSpawnDelay.totalMinutes) / this.timePerWave.totalMinutes);
        }

        private static minutesAt(wave: number) {
            return this.initialWaveSpawnDelay.totalMinutes + (wave - 1) * this.timePerWave.totalMinutes;
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

        public static until(time: Time): Minions {
            const minions: Minions = new Minions(); 

            const waves = this.wavesUntil(time);

            minions.melees = waves * 3;
            minions.ranged = waves * 3;

            for (let wave = 1; wave <= waves; wave++) {
                let minute = this.minutesAt(wave);

                if (minute <= 15 && wave % 3 == 0) {
                    minions.stage1Cannons++;
                } else if (minute > 15 && minute <= 25 && wave % 2 == 0) {
                    minions.stage2Cannons++;
                } else if (minute > 25) {
                    minions.stage3Cannons++;
                }
            }

            return minions;
        }

        public get creepScore(): number {
            return this.melees + this.ranged + this.stage1Cannons + this.stage2Cannons + this.stage3Cannons;
        }

        public get goldIncome(): number {
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

        private static spawns(time: Time, initialSpawnMinutes: number, respawnDelayMinutes: number): number {
            return 1 + (time.totalMinutes - initialSpawnMinutes) / respawnDelayMinutes;
        }

        public static until(time: Time): Camps {
            const camps: Camps = new Camps();

            camps.redBuffs = Camps.spawns(time, this.redBuffInitialSpawnMinutes, this.redBuffRespawnDelayMinutes);
            camps.krugs = Camps.spawns(time, this.krugsInitialSpawnMinutes, this.krugsRespawnDelayMinutes);
            camps.raptors = Camps.spawns(time, this.raptorsInitialSpawnMinutes, this.raptorsRespawnDelayMinutes);
            camps.wolves = Camps.spawns(time, this.wolvesInitialSpawnMinutes, this.wolvesRespawnDelayMinutes);
            camps.blueBuffs = Camps.spawns(time, this.blueBuffInitialSpawnMinutes, this.blueBuffRespawnDelayMinutes);
            camps.gromps = Camps.spawns(time, this.grompInitialSpawnMinutes, this.grompRespawnDelayMinutes);

            return camps;
        }

        public get creepScore() {
            return this.redBuffs * Camps.redBuffCreepScore
                + this.krugs * Camps.krugsCreepScore
                + this.raptors * Camps.raptorsCreepScore
                + this.wolves * Camps.wolvesCreepScore
                + this.blueBuffs * Camps.blueBuffCreepScore
                + this.gromps * Camps.grompCreepScore;
        }

        public get goldIncome() {
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
            <TimeSelector bind:time={gameTime} />
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