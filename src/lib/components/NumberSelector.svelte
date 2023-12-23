<script lang="ts">
	export let plusMinus: boolean = false;

	export let value: number = 0;

	function minus() {
		if (value > 0) value--;
	}

	function plus() {
		value++;
	}
</script>

{#if plusMinus}
	<div>
		<button class="primary minus" on:click={minus}>-</button>
		<input type="number" min="0" bind:value />
		<button class="primary plus" on:click={plus}>+</button>
	</div>
{:else}
	<input type="number" min="0" bind:value />
{/if}

<style>
	div {
		display: flex;
		flex-direction: row;

		gap: var(--section-gap);
	}

	.minus,
	.plus {
		font-size: var(--fs-300);
		font-weight: var(--fw-main);

		width: 2.5rem;
	}
</style>
