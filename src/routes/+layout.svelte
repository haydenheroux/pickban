<script>
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
</script>

<div class="app">
	<Header />

	<main>
		<div class="container">
			<slot />
		</div>
	</main>

	<Footer />
</div>