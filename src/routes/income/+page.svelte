<script lang="ts">
	import BooleanSelector from '$lib/components/BooleanSelector.svelte';
	import NumberSelector from "$lib/components/NumberSelector.svelte";
    import Section from "$lib/components/Section.svelte";
	import TimeSelector from "$lib/components/TimeSelector.svelte";
	import { Time } from '$lib/util/time';

    let creepScore: number;

    let gameTime: Time = new Time();

    let minions: Map<Resource, number>;
    let camps: Map<Resource, number>;

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

        minions = countMinionSpawnsUntil(gameTime);
        camps = countCampSpawnsUntil(gameTime);

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

    function getResourceName(resource: Resource): string {
        if (resource === meleeMinion) return "Melee Minion";
        if (resource === rangedMinion) return "Ranged Minion";
        if (resource === stage1Cannon) return "Stage 1 Cannon Minion";
        if (resource === stage2Cannon) return "Stage 2 Cannon Minion";
        if (resource === stage3Cannon) return "Stage 3 Cannon Minion";
        return "WIP";
    }

    function getResourceAsset(resource: Resource): string {
        if (resource === meleeMinion) return "minions/melee.png";
        if (resource === rangedMinion) return "minions/ranged.png";
        if (resource === stage1Cannon) return "minions/cannon.png";
        if (resource === stage2Cannon) return "minions/cannon.png";
        if (resource === stage3Cannon) return "minions/cannon.png";
        return "";
    }
</script>

<Section>
    <div>
        <h2>Game Time</h2>
        <TimeSelector bind:time={gameTime} />
    </div>
    <div>
        <h2>Role</h2>
        <BooleanSelector bind:value={isJungler} left={"Laner"} right={"Jungler"} />
    </div>
</Section>

{#if !isJungler}
    <Section>
        <div>
            <h2>Counts</h2>
            {#each minions as [resource, number]}
                {@const name=getResourceName(resource)}
                <div class="resource-container">
                    <img src={getResourceAsset(resource)} title={name} alt={name}>
                    <NumberSelector bind:value={number} plusMinus={false} />
                </div>
            {/each}
        </div>
        <div class="gold-container">
            <h2>{calculateGoldIncome(minions).toFixed()}</h2>
            <img src="ui/gold.png" alt="Gold">
        </div>
    </Section>
{/if}

<Section>
    <div class="split">
        <div>
            <h2>Creep Score</h2>
            <NumberSelector bind:value={creepScore} plusMinus={false} />
        </div>
        <div>
            {#if isJungler}
                <h2>Jungle Camps Slain Per Minute</h2>
                <NumberSelector value={campsSlainPerMinute} plusMinus={false} />
            {:else}
                <h2>Minions Slain Per Minute</h2>
                <NumberSelector value={minionsSlainPerMinute} plusMinus={false} />
            {/if}
        </div>
    </div>
    <div class="actual-gold-container">
        <div class="gold-container">
            <h2>{calculateGoldIncome(minions).toFixed()}</h2>
            <img src="ui/gold.png" alt="Gold">
        </div>
        <p>×</p>
        {#if isJungler}
            <h2>{(100 * campEfficiency).toFixed(2)}%</h2>
        {:else}
            <h2>{(100 * minionEfficiency).toFixed(2)}%</h2>
        {/if}
        <p>=</p>
        <div class="gold-container">
            <h2>{(calculateGoldIncome(minions) * minionEfficiency).toFixed()}</h2>
            <img src="ui/gold.png" alt="Gold">
        </div>
    </div>
</Section>

<style>
    h2 {
        margin-bottom: 0.5rem;
    }

    .resource-container {
        display: grid;
        grid-template-columns: 4rem 1fr;
        gap: var(--section-gap);
    }

    .resource-container img {
        height: 3rem;
        width: auto;
        margin: auto;
    }

    .gold-container {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 4rem;
    }

    .gold-container * {
        margin: auto;
    }

    .gold-container h2 {
        text-align: center;
    }

    .gold-container img {
        height: 1.5rem;
        width: auto;
    }

    .actual-gold-container {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        align-items: center;
        justify-content: center;
        width: 24rem;
        text-align: center;
    }

    .actual-gold-container h2 {
        margin-bottom: 0;
    }
</style>