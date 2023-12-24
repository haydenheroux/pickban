<script lang="ts">
	import { onMount } from "svelte";

    let imageOrNull: HTMLImageElement | null = null;

    let canvas: HTMLCanvasElement;

    onMount(() => {
            imageOrNull = new Image();
            imageOrNull.src = "map.jpg";
            imageOrNull.onload = () => {
                if (!imageOrNull) return;

                canvas.width = canvas.offsetWidth;
                canvas.height = canvas.offsetWidth * (imageOrNull.height / imageOrNull.width);
                draw();
            };
        });

    function draw() {
		if (!canvas) return;
		if (!imageOrNull) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		
        ctx.drawImage(imageOrNull, 0, 0, canvas.width, canvas.height);
    }
</script>

<section>
    <canvas bind:this={canvas} />
</section>