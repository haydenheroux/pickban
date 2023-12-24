<script lang="ts">
	import { onMount } from "svelte";

    let imageOrNull: HTMLImageElement | null = null;

    let canvasOrNull: HTMLCanvasElement | null;

    onMount(() => {
            imageOrNull = new Image();
            imageOrNull.src = "map.jpg";
            imageOrNull.onload = () => {
                if (!canvasOrNull) return;
                if (!imageOrNull) return;

                canvasOrNull.width = canvasOrNull.offsetWidth;
                canvasOrNull.height = canvasOrNull.offsetWidth * (imageOrNull.height / imageOrNull.width);
                draw();
            };
        });

    function draw() {
		if (!canvasOrNull) return;
		if (!imageOrNull) return;

		const ctxOrNull = canvasOrNull.getContext('2d');
		if (!ctxOrNull) return;
		
        ctxOrNull.drawImage(imageOrNull, 0, 0, canvasOrNull.width, canvasOrNull.height);
    }
</script>

<section>
    <canvas bind:this={canvasOrNull} />
</section>