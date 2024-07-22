<script>
	import { base } from '$app/paths';
	import HeaderLink from './HeaderLink.svelte';
</script>

<header>
	<div class="container">
		<nav>
			<a href="{base}/"><em>drafting</em></a>
			<HeaderLink href="{base}/map">map</HeaderLink>
			<HeaderLink href="{base}/income">income</HeaderLink>
			<HeaderLink href="{base}/damage">damage</HeaderLink>
		</nav>
	</div>
</header>
