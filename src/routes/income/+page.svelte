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
        let camps = countCampSpawnsUntil(gameTime);

        console.log(camps);

        minionEfficiency = coerce(creepScore / calculateCreepScore(minions));
        campEfficiency = coerce(creepScore / calculateCreepScore(camps));

        minionGoldEarned = minionEfficiency * calculateGoldIncome(minions);
        campGoldEarned = campEfficiency * calculateGoldIncome(camps);
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
        readonly count: number;
        readonly gold: number;
        readonly creepScore: number;
    }

    function createResource(initialSpawn: Time, respawnDelay: Time, count: number, creepScore: number, gold: number): Resource {
        return {
            initialSpawn,
            respawnDelay,
            count,
            creepScore,
            gold
        }
    }

    function createWaveMinion(initialSpawn: Time, respawnDelay: Time, gold: number): Resource {
        return createResource(initialSpawn, respawnDelay, 3, 3, gold);
    }

    function createCannonMinion(initialSpawn: Time, respawnDelay: Time, gold: number): Resource {
        return createResource(initialSpawn, respawnDelay, 1, 1, gold);
    }

    function createCamp(initialSpawn: Time, respawnDelay: Time, gold: number): Resource {
        return createResource(initialSpawn, respawnDelay, 1, 4, gold);
    }

    function countSpawnsUntil(resource: Resource, time: Time) {
        const elapsedMinutes = time.totalMinutes - resource.initialSpawn.totalMinutes;
        const respawnCount = Math.floor(elapsedMinutes / resource.respawnDelay.totalMinutes);

        return Math.max(1 + respawnCount, 0);
    }

    function calculateCreepScore(resourceCounts: Map<Resource, number>): number {
        let creepScore = 0;

        resourceCounts.forEach((count: number, resource: Resource, _) => {
            creepScore += resource.creepScore * count;
        });

        return creepScore;
    }

    function calculateGoldIncome(resourceCounts: Map<Resource, number>): number {
        let goldIncome = 0;

        resourceCounts.forEach((count: number, resource: Resource, _) => {
            goldIncome += resource.gold * resource.count * count;
        });

        return goldIncome;
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

    const innerCampsSpawn = Time.minutes(1).seconds(30);
    const outerCampsSpawn = Time.minutes(1).seconds(42);

    const buffsRespawn = Time.minutes(5);
    const campsRespawn = Time.minutes(2).seconds(15);

    const redBuff = createCamp(innerCampsSpawn, buffsRespawn, 90);
    const blueBuff = createCamp(innerCampsSpawn, buffsRespawn, 90);

    const krugs = createCamp(outerCampsSpawn, campsRespawn, 15 + 10 + 6 * 14);
    const raptors = createCamp(innerCampsSpawn, campsRespawn, 35 + 5 * 8);
    const wolves = createCamp(innerCampsSpawn, campsRespawn, 55 + 2 * 13);
    const gromp = createCamp(outerCampsSpawn, campsRespawn, 80);

    function countCampSpawnsUntil(time: Time): Map<Resource, number> {
        const campSpawnCounts = new Map<Resource, number>();

        const add = (resource: Resource, time_: Time) => {
            campSpawnCounts.set(resource, countSpawnsUntil(resource, time_));
        }

        add(redBuff, time);
        add(blueBuff, time);
        add(krugs, time);
        add(raptors, time);
        add(wolves, time);
        add(gromp, time);

        return campSpawnCounts;
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