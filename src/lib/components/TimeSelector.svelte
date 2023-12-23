<script lang="ts">
    export let minutes: number = 0;
    export let seconds: number = 0;
</script>

<div class="time">
    <input bind:value={minutes} type="number" min="0" max="59">
    <span>:</span>
    <input bind:value={seconds} type="number" min="0" max="59">
</div>

<style>

    .time {
        display: grid;
        grid-template-columns: minmax(8rem, 1fr) min-content minmax(8rem, 1fr);
        gap: var(--section-gap);
    }
</style>