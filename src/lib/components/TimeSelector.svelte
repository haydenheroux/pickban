<script lang="ts">
    export let minutes: number = 0;
    export let seconds: number = 0;

    let minutesValue: string = "0";
    let secondsValue: string = "00";

    $: {
        minutes = Number(minutesValue);
    }

    $: {
        seconds = Number(secondsValue);
    }

    function format(event: Event) {
        const target = event.target;

        if (!target) return;

        const input = target as HTMLInputElement;

        const value = input.value;

        let result;

        if (value.length == 1) {
            result = "0" + value;
        } else if (value == "0") {
            result = "00";
        } else {
            result = value;
        }

        input.value = result;
    }
</script>

<div class="time">
    <input bind:value={minutesValue} type="number" min="0" max="59">
    <span>:</span>
    <input bind:value={secondsValue} type="number" min="0" max="59" on:input={format}>
</div>

<style>

    .time {
        display: grid;
        grid-template-columns: minmax(8rem, 1fr) min-content minmax(8rem, 1fr);
        gap: var(--section-gap);
    }
</style>