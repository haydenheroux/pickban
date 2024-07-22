<script lang="ts">
	export let name: string = '';
	export let help: string = '';
</script>

<section>
	{#if name || help}
		<div class="header">
			<h2>{name}</h2>
			{#if help}
				<div class="help">
					<span class="icon">?</span>
					<div class="body">
						{@html help}
					</div>
				</div>
			{/if}
		</div>
	{/if}
	<slot />
</section>

<style>
	.header {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
	}

	.help {
		position: relative;
		width: fit-content;
	}

	.icon {
		color: var(--clr-border);

		font-family: var(--ff-main);
		font-weight: var(--fw-main);
		font-size: var(--fs-400);

		border: 1px solid var(--clr-border);
		border-radius: var(--radius-element);

		display: flex;
		justify-content: center;
		align-items: center;

		aspect-ratio: 1;
		width: calc(var(--section-input-height) - 0.5rem);
		height: calc(var(--section-input-height) - 0.5rem);
	}

	.body {
		background-color: var(--clr-background);
		color: var(--clr-muted);

		font-family: var(--ff-main);
		font-weight: var(--fw-main);
		font-size: var(--fs-100);

		border: 1px solid var(--clr-border);
		border-radius: var(--radius-element);

		visibility: hidden;

		width: max-content;
		/* TODO: max-width: 24em; */

		position: absolute;
		top: 0;
		right: calc(100% + var(--section-gap));

		padding-inline: var(--button-padding-inline);
		padding-block: var(--button-padding-block);
	}

	.icon:hover + .body,
	.icon:active + .body {
		visibility: visible;
	}
</style>
