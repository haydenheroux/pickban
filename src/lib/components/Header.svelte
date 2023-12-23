<script>
	import { base } from '$app/paths';
	import HeaderLink from './HeaderLink.svelte';
</script>

<header>
	<div class="container">
		<nav>
			<a href="{base}/"><em>drafting</em></a>
			<HeaderLink href="{base}/income">income</HeaderLink>
		</nav>
	</div>
</header>