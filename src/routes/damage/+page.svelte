<script lang="ts">
	import NumberSelector from '$lib/components/NumberSelector.svelte';
	import Section from '$lib/components/Section.svelte';

	let level: number = 0;

	let preMitigationPhysical: number = 0;
	let preMitigationMagical: number = 0;

	let lethality: number = 0;
	let flatMagicPenetration: number = 0;

	let percentArmorPenetration: number = 0;
	let percentMagicPenetration: number = 0;

	let armor: number = 0;
	let magicResistance: number = 0;

	let postMitigationPhysical: number = 0;

	$: {
		let physicalPercentReduction = 1.0 - percentArmorPenetration / 100;
		let physicalFlatReduction = lethality * (0.6 + (0.4 * level) / 18);

		let reducedArmor = armor * physicalPercentReduction - physicalFlatReduction;

		reducedArmor = Math.max(reducedArmor, 0);

		let physicalScalar: number = 0;

		if (reducedArmor >= 0) {
			physicalScalar = 100 / (100 + reducedArmor);
		} else {
			physicalScalar = 2 - 100 / (100 - reducedArmor);
		}

		postMitigationPhysical = preMitigationPhysical * physicalScalar;
	}

	let postMitigationMagical: number = 0;

	$: {
		let magicalPercentReduction = 1.0 - percentMagicPenetration / 100;

		let reducedMagicResistance = magicResistance * magicalPercentReduction - flatMagicPenetration;

		reducedMagicResistance = Math.max(reducedMagicResistance, 0);

		let magicalScalar: number = 0;

		if (reducedMagicResistance >= 0) {
			magicalScalar = 100 / (100 + reducedMagicResistance);
		} else {
			magicalScalar = 2 - 100 / (100 - reducedMagicResistance);
		}

		postMitigationMagical = preMitigationMagical * magicalScalar;
	}
</script>

<Section>
	<h2>Level</h2>
	<NumberSelector bind:value={level} plusMinus={false} />
</Section>

<Section>
	<div class="split">
		<div>
			<h2>Pre-Mitigation Physical Damage</h2>
			<NumberSelector bind:value={preMitigationPhysical} plusMinus={false} />
		</div>
		<div>
			<h2>Pre-Mitigation Magic Damage</h2>
			<NumberSelector bind:value={preMitigationMagical} plusMinus={false} />
		</div>
	</div>
</Section>

<Section>
	<div class="split">
		<div>
			<h2>Lethality</h2>
			<NumberSelector bind:value={lethality} plusMinus={false} />
		</div>
		<div>
			<h2>Flat Magic Penetration</h2>
			<NumberSelector bind:value={flatMagicPenetration} plusMinus={false} />
		</div>
	</div>
</Section>

<Section>
	<div class="split">
		<div>
			<h2>Percent Armor Penetration</h2>
			<NumberSelector bind:value={percentArmorPenetration} plusMinus={false} />
		</div>
		<div>
			<h2>Percent Magic Penetration</h2>
			<NumberSelector bind:value={percentMagicPenetration} plusMinus={false} />
		</div>
	</div>
</Section>

<Section>
	<div class="split">
		<div>
			<h2>Target Armor</h2>
			<NumberSelector bind:value={armor} plusMinus={false} />
		</div>
		<div>
			<h2>Target Magic Resist</h2>
			<NumberSelector bind:value={magicResistance} plusMinus={false} />
		</div>
	</div>
</Section>

<Section name={'Post-Mitigation Physical Damage'}>
	<h2>{postMitigationPhysical.toFixed(0)}</h2>
</Section>

<Section name={'Post-Mitigation Magic Damage'}>
	<h2>{postMitigationMagical.toFixed(0)}</h2>
</Section>
