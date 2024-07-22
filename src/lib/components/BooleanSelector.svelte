<script lang="ts">
	export let value: boolean = false;

	export let left: string = 'No';
	export let right: string = 'Yes';
</script>

<div class="split">
	<button on:click={() => (value = false)} class:active={value === false}>{left}</button>
	<button on:click={() => (value = true)} class:active={value}>{right}</button>
</div>
