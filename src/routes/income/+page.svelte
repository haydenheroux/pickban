<script lang="ts">
	import { onMount } from 'svelte';
	import NumberSelector from "$lib/components/NumberSelector.svelte";
    import Section from "$lib/components/Section.svelte";
	import TimeSelector from "$lib/components/TimeSelector.svelte";
	import { Time } from '$lib/util/time';

    type Role = "Laner" | "Jungler";

    const roles: Role[] = ["Laner", "Jungler"];

    let selectedRole: Role; 

    let creepScore: number;

    let gameTime: Time = new Time();

    let resourceKeys: Resource[] = [];
    let resourceCounts: number[] = [];

    let expectedIncome: number;
    let efficiency: number;
    let actualIncome: number;

    onMount(clearResources);

    function fillResourcesUntil(time: Time) {
        let resources: Map<Resource, number> = new Map();

        if (selectedRole == "Jungler") {
            resources = spawnsUntil(Camps, time);
        } else {
            resources = spawnsUntil(Minions, time);
        }

        resourceKeys = [];
        resourceCounts = [];

        resources.forEach((count, resource, _) => {
            resourceKeys.push(resource);
            resourceCounts.push(count);
        });

        resourceKeys = resourceKeys;
        resourceCounts = resourceCounts;
    }

    function clearResources() {
        fillResourcesUntil(Time.minutes(0).seconds(0));
    }

    $: {
        let resources: Map<Resource, number> = new Map();

        resourceKeys.forEach((resource, index) => {
            let resourceCount = resourceCounts[index];
            resources.set(resource, resourceCount);
        });

        expectedIncome = calculateGoldIncome(resources);
        efficiency = coerce(creepScore / calculateCreepScore(resources));

        actualIncome = efficiency * expectedIncome;
    }

    function coerce(n: number) {
        return Number.isFinite(n) ? n : 0;
    }

    interface Resource {
        readonly startsAt: Time;
        readonly endsAt: Time | null;
        readonly respawnDelay: Time;
        readonly count: number;
        readonly gold: number;
        readonly creepScore: number;
    }

    function createResource(startsAt: Time, endsAt: Time | null, respawnDelay: Time, count: number, creepScore: number, gold: number): Resource {
        return {
            startsAt,
            endsAt,
            respawnDelay,
            count,
            creepScore,
            gold
        }
    }

    function createBasicMinion(gold: number): Resource {
        return createResource(Time.minutes(1).seconds(5), null, Time.seconds(30), 3, 1, gold);
    }

    function createCannonMinion(startsAt: Time, endsAt: Time | null, respawnDelay: Time, gold: number): Resource {
        return createResource(startsAt, endsAt, respawnDelay, 1, 1, gold);
    }

    function createStageOneCannonMinion() {
        return createCannonMinion(Time.minutes(2).seconds(5), Time.minutes(15).seconds(5), Time.minutes(1).seconds(30), 60);
    }

    function createStageTwoCannonMinion() {
        return createCannonMinion(Time.minutes(15).seconds(5), Time.minutes(25).seconds(5), Time.minutes(1), 84);
    }

    function createStageThreeCannonMinion() {
        return createCannonMinion(Time.minutes(25).seconds(5), null, Time.seconds(30), 90);
    }

    function createCamp(startsAt: Time, respawnDelay: Time, gold: number): Resource {
        return createResource(startsAt, null, respawnDelay, 1, 4, gold);
    }

    function createBuff(): Resource {
        return createCamp(Time.minutes(1).seconds(30), Time.minutes(5), 90);
    }

    function createInnerCamp(gold: number): Resource {
        return createCamp(Time.minutes(1).seconds(30), Time.minutes(2).seconds(15), gold);
    }

    function createOuterCamp(gold: number): Resource {
        return createCamp(Time.minutes(1).seconds(42), Time.minutes(2).seconds(15), gold);
    }

    const MeleeMinion = createBasicMinion(21);
    const RangedMinion = createBasicMinion(14);

    const StageOneCannonMinion = createStageOneCannonMinion();
    const StageTwoCannonMinion = createStageTwoCannonMinion();
    const StageThreeCannonMinion = createStageThreeCannonMinion();

    const Minions = [MeleeMinion, RangedMinion, StageOneCannonMinion, StageTwoCannonMinion, StageThreeCannonMinion];

    const RedBuff = createBuff();
    const BlueBuff = createBuff();

    const Krugs = createOuterCamp(15 + 10 + 6 * 14);
    const Gromp = createOuterCamp(80);

    const Raptors = createInnerCamp(35 + 5 * 8);
    const Wolves = createInnerCamp(55 + 2 * 13);

    const Camps = [RedBuff, BlueBuff, Krugs, Gromp, Raptors, Wolves];

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
            goldIncome += resource.gold * count;
        });

        return goldIncome;
    }


    function spawnsUntil(resources: Resource[], time: Time): Map<Resource, number> {
        const counts = new Map<Resource, number>();

        function numberOfSpawns(resource: Resource, time: Time): number {
            if (resource.endsAt != null) {
                time = Time.minutes(Math.min(time.totalMinutes, resource.endsAt.totalMinutes));
            }

            const elapsedMinutes = time.totalMinutes - resource.startsAt.totalMinutes;
            const respawnCount = Math.floor(elapsedMinutes / resource.respawnDelay.totalMinutes);

            return Math.max(1 + respawnCount, 0);
        }

        for (let resource of resources) {
            counts.set(resource, numberOfSpawns(resource, time) * resource.count);
        }

        return counts;
    }

    function getResourceName(resource: Resource): string {
        if (resource === MeleeMinion) return "Melee Minion";
        if (resource === RangedMinion) return "Ranged Minion";
        if (resource === StageOneCannonMinion) return "Stage 1 Cannon Minion";
        if (resource === StageTwoCannonMinion) return "Stage 2 Cannon Minion";
        if (resource === StageThreeCannonMinion) return "Stage 3 Cannon Minion";
        if (resource === RedBuff) return "Red Buff";
        if (resource === BlueBuff) return "Blue Buff";
        if (resource === Krugs) return "Krugs";
        if (resource === Raptors) return "Raptors";
        if (resource === Wolves) return "Wolves";
        if (resource === Gromp) return "Gromp";
        return "unknown resource";
    }

    function getResourceAsset(resource: Resource): string {
        if (resource === MeleeMinion) return "minions/melee.png";
        if (resource === RangedMinion) return "minions/ranged.png";
        if (resource === StageOneCannonMinion) return "minions/cannon.png";
        if (resource === StageTwoCannonMinion) return "minions/cannon.png";
        if (resource === StageThreeCannonMinion) return "minions/cannon.png";
        if (resource === RedBuff) return "camps/red.png";
        if (resource === BlueBuff) return "camps/blue.png";
        if (resource === Krugs) return "camps/krugs.png";
        if (resource === Raptors) return "camps/raptors.png";
        if (resource === Wolves) return "camps/wolves.png";
        if (resource === Gromp) return "camps/gromp.png";
        return "";
    }
</script>

<Section>
    <div class="split">
        <div>
            <h2>Game Time</h2>
            <TimeSelector bind:time={gameTime} />
        </div>
        <div>
            <h2>Role</h2>
            <select bind:value={selectedRole} on:change={clearResources}>
                {#each roles as role}
                    <option>{role}</option>
                {/each}
            </select>
        </div>
    </div>
    <div class="split">
        <button class="active" on:click={() => fillResourcesUntil(gameTime)}>Fill</button>
        <button class="active" on:click={clearResources}>Clear</button>
    </div>
</Section>

<Section>
    {#each resourceKeys as resource, index}
        {@const name=getResourceName(resource)}
        <div class="resource-container">
            <img src={getResourceAsset(resource)} title={name} alt={name}>
            <NumberSelector bind:value={resourceCounts[index]} plusMinus={true} />
        </div>
    {/each}
    <div class="gold-container">
        <h2>{expectedIncome.toFixed()}</h2>
        <img src="ui/gold.png" alt="Gold">
    </div>
</Section>

<Section name={"Creep Score"}>
        <NumberSelector bind:value={creepScore} plusMinus={true} />
    <div class="actual-gold-container">
        <div class="gold-container">
            <h2>{expectedIncome.toFixed()}</h2>
            <img src="ui/gold.png" alt="Gold">
        </div>
        <p>×</p>
        <h2>{(100 * efficiency).toFixed(2)}%</h2>
        <p>=</p>
        <div class="gold-container">
            <h2>{actualIncome.toFixed()}</h2>
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
        width: fit-content;
        max-width: 6rem;
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

    .actual-gold-container * {
        margin: auto;
    }

    @media screen and (max-width: 40rem) {
        .actual-gold-container {
            grid-template-columns: 1fr;
            grid-template-rows: repeat(5, 1fr);
        }
    }

    .actual-gold-container h2 {
        margin-bottom: 0;
    }
</style>