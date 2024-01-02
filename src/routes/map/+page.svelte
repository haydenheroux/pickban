<script lang="ts">
	import { getImageOrNull } from "$lib/data/data_dragon";
	import { picks } from "$lib/data/stores";
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

    let point = {x: 0, y: 0} as Point;

    function draw() {
		if (!canvasOrNull) return;
		if (!imageOrNull) return;

		const ctxOrNull = canvasOrNull.getContext('2d');
		if (!ctxOrNull) return;
		
        ctxOrNull.drawImage(imageOrNull, 0, 0, canvasOrNull.width, canvasOrNull.height);
        
        for (let redPick of picks.get().red) {
            if (redPick) {
                drawChampion(redPick, point, canvasOrNull);
            }
        }

        for (let bluePick of picks.get().blue) {
            if (bluePick) {
                drawChampion(bluePick, point, canvasOrNull);
            }
        }
    }

    type CanvasClickEvent = MouseEvent & {currentTarget: HTMLCanvasElement};

    type Point = {
        x: number;
        y: number;
    };

    function toPoint(click: CanvasClickEvent): Point {
        const width = click.currentTarget?.width;
        const height = click.currentTarget?.height;

        let point = {
            x: click.offsetX / width,
            y: click.offsetY / height
        }

        return point;
    }

    function drawChampion(championIDOrNull: string | null, point: Point, canvas: HTMLCanvasElement) {
        let image = getImageOrNull(championIDOrNull)!!;

        let position: Point = {
            x: point.x * canvas.width,
            y: point.y * canvas.height
        };

        const cropPercent = 0.1;
        const portraitSize = 120;  

        const cropAmount = portraitSize * cropPercent;
        const cropSize = portraitSize - 2 * cropAmount;

        const drawSize = 64;

		const ctxOrNull = canvas.getContext('2d');
		if (!ctxOrNull) return;

        ctxOrNull.drawImage(image, cropAmount, cropAmount, cropSize, cropSize, position.x - drawSize / 2, position.y - drawSize / 2, drawSize, drawSize);
    }

    function handle(click: CanvasClickEvent) {
        point = toPoint(click);

        draw();
    }
</script>

<section>
    <canvas bind:this={canvasOrNull} on:click={handle} />
</section>