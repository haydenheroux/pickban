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

        let minions = countMinionSpawnsUntil(gameTime);
        let camps = Camps.until(gameTime);

        console.log(minions);

        minionEfficiency = coerce(creepScore / calculateCreepScore(minions));
        campEfficiency = coerce(creepScore / camps.creepScore);

        minionGoldEarned = minionEfficiency * calculateGoldIncome(minions);
        campGoldEarned = campEfficiency * camps.goldIncome;
    }

    function coerce(n: number) {
        return Number.isFinite(n) ? n : 0;
    }

    function calculateCreepScorePerMinute(creepsSlain: number, time: Time) {
        const result = creepsSlain / time.totalMinutes;

        return coerce(result);
    }

    interface Resource {
        readonly initialSpawn: Time;
        readonly respawnDelay: Time;
        readonly creeps: number;
        readonly gold: number;
    }

    function createResource(initialSpawn: Time, respawnDelay: Time, creeps: number, gold: number): Resource {
        return {
            initialSpawn,
            respawnDelay,
            creeps,
            gold
        }
    }

    function createWaveMinion(initialSpawn: Time, respawnDelay: Time, gold: number): Resource {
        return createResource(initialSpawn, respawnDelay, 3, 3 * gold);
    }

    function createCannonMinion(initialSpawn: Time, respawnDelay: Time, gold: number): Resource {
        return createResource(initialSpawn, respawnDelay, 1, gold);
    }

    function createCamp(initialSpawn: Time, respawnDelay: Time, gold: number): Resource {
        return createResource(initialSpawn, respawnDelay, 4, gold);
    }

    function countSpawnsUntil(resource: Resource, time: Time) {
        const elapsedMinutes = time.totalMinutes - resource.initialSpawn.totalMinutes;
        const respawnCount = Math.floor(elapsedMinutes / resource.respawnDelay.totalMinutes);

        return Math.max(1 + respawnCount, 0);
    }

    function timeAt(resource: Resource, spawnCount: number): Time {
        return Time.minutes(resource.initialSpawn.totalMinutes + (spawnCount - 1) * resource.respawnDelay.totalMinutes);
    }

    const initialWaveSpawn = Time.minutes(1).seconds(5);
    const waveRespawn = Time.seconds(30);

    const meleeMinion = createWaveMinion(initialWaveSpawn, waveRespawn, 21);
    const rangedMinion = createWaveMinion(initialWaveSpawn, waveRespawn, 14);
    const stage1Cannon = createCannonMinion(Time.minutes(2).seconds(5), Time.minutes(1).seconds(30), 60);
    const stage2Cannon = createCannonMinion(Time.minutes(15).seconds(5), Time.minutes(1), 84);
    const stage3Cannon = createCannonMinion(Time.minutes(25).seconds(5), Time.seconds(30), 90);

    function countMinionSpawnsUntil(time: Time): Map<Resource, number> {
        const minionSpawnCounts = new Map<Resource, number>();

        const add = (resource: Resource, time_: Time) => {
            minionSpawnCounts.set(resource, countSpawnsUntil(resource, time_));
        }

        add(meleeMinion, time);
        add(rangedMinion, time);

        const stage1StopsSpawning = Time.minutes(Math.min(time.totalMinutes, stage2Cannon.initialSpawn.totalMinutes));
        const stage2StopsSpawning = Time.minutes(Math.min(time.totalMinutes, stage3Cannon.initialSpawn.totalMinutes));

        add(stage1Cannon, stage1StopsSpawning);
        add(stage2Cannon, stage2StopsSpawning);
        add(stage3Cannon, time);

        return minionSpawnCounts;
    }

    function calculateCreepScore(spawnCounts: Map<Resource, number>): number {
        let creepScore = 0;

        spawnCounts.forEach((count: number, resource: Resource, _) => {
            creepScore += resource.creeps * count;
        });

        return creepScore;
    }

    function calculateGoldIncome(spawnCounts: Map<Resource, number>): number {
        let goldIncome = 0;

        spawnCounts.forEach((count: number, resource: Resource, _) => {
            goldIncome += resource.gold * count;
        });

        return goldIncome;
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