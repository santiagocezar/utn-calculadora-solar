<script lang="ts">
    import * as T from 'three';

    interface Props {
        onResize(width: number, height: number): void;
        onLoop(renderer: T.WebGLRenderer): void;
        onInit(renderer: T.WebGLRenderer): void;
    }

    const { onLoop: emitLoop, onResize: emitResize, onInit: emitInit }: Props = $props()

    let canvasRef = $state<HTMLCanvasElement | undefined>()
    let wrapperRef = $state<HTMLElement | undefined>()

    $effect(() => {
        const canvas = canvasRef!;
        const wrapper = wrapperRef!;

        const renderer = new T.WebGLRenderer({
            canvas,
            powerPreference: "high-performance",
            antialias: false,
            stencil: false,
            depth: false
        });

        emitInit(renderer)

        function resizeListener() {
            canvas.width = wrapper.offsetWidth
            canvas.height = wrapper.offsetHeight

            emitResize(wrapper.offsetWidth, wrapper.offsetHeight)

            renderer.setSize(wrapper.offsetWidth, wrapper.offsetHeight);
        }

        new ResizeObserver(() => resizeListener()).observe(wrapper)

        function animate() {
            emitLoop(renderer)
        }

        renderer.setAnimationLoop(animate)
    })
</script>

<div bind:this={wrapperRef} class="wrapper">
    <canvas bind:this={canvasRef}></canvas>
</div>

<style>
canvas {
    position: absolute;
    inset: 0;
}
.wrapper {
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 100%;
}
</style>
