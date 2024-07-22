<script lang="ts">
	import { Time } from '$lib/util/time';

	export let time: Time = new Time();

	let minutesValue: string = '0';
	let secondsValue: string = '0';

	$: {
		time = time?.minutes(Number(minutesValue));
	}

	$: {
		time = time?.seconds(Number(secondsValue));
	}
</script>

<div class="time">
	<input bind:value={minutesValue} type="number" min="0" max="59" />
	<span>:</span>
	<input bind:value={secondsValue} type="number" min="0" max="59" />
</div>

<style>
	.time {
		display: grid;
		grid-template-columns: minmax(2rem, 1fr) min-content minmax(2rem, 1fr);
		gap: var(--section-gap);
	}
</style>
