<script lang="ts">
    import type { Snippet } from "svelte";

    interface Props {
        value: number;
        class?: string;
        min?: number;
        max?: number;
        step?: number;
        ticks?: number;
        children?: Snippet;
    }

    let {
        class: className = "",
        value = $bindable(1),
        min = 0,
        max = 100,
        step = 1,
        ticks = 0,
        children,
    }: Props = $props()

    let progress = $derived((value - min) / (max - min));
</script>
<div class="custom-slider {className}" style="--progress: {progress}; --ticks: {ticks}">
    <div class="slider">
        <div class="track seasons"></div>
        <div class="thumb"></div>
        <input bind:value={value} {min} {max} {step} type="range">
    </div>
    <div class="ticks">
        {@render children?.()}
    </div>
</div>

<style lang="less">
    .custom-slider {
        display: flex;
        flex-direction: column;

        --track-width: .5rem;
        --thumb-width: .5rem;
    }

    .slider {
        display: grid;
        grid-template: "track" 1fr / 1fr;
        position: relative;
/*             #ff619e 100%, #ffea39 100%, */
    }

    .track {
        grid-area: track;
        height: var(--track-width);
        margin: var(--thumb-width) 0;
        border-radius: var(--track-width);
        background-color: royalblue;
    }

    .ticks {
        display: grid;
        grid-template-rows: 1fr;
        grid-auto-columns: minmax(0, 1fr);
        grid-auto-flow: column;
        margin: 0 calc(-50% / var(--ticks) + var(--track-width) / 2 + 1px);

        > :global(*) {
            display: block;
/*             width: 0; */
/*             min-width: 24px; */
            text-align: center;
            place-content: center;
        }
        :global(hr) {
            display: inline-block;
            border: none;
            border-left: 1px solid currentColor;
            height: .5rem;
        }
    }

    .thumb {
        position: absolute;
        grid-area: track;
        display: block;
        box-sizing: content-box;
        border: var(--thumb-width) solid white;
        box-shadow: 0 .25rem 1rem #0004;
        border-radius: calc(var(--thumb-width) + var(--track-width));
        width: var(--track-width);
        height: var(--track-width);
        left: calc(
            var(--progress)
            * (100% - var(--track-width) - 2px)
            - var(--thumb-width) + 1px);
        pointer-events: none;
    }

    input[type="range"] {
        grid-area: track;
        -webkit-appearance: none;
        appearance: none;
        background: transparent;
        cursor: ew-resize;
        width: 100%;
        padding: 0;

        &::-webkit-slider-runnable-track, &::-moz-range-track {
            background: transparent;
            height: 100%;
        }
        &::webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
        }
        &::-moz-range-thumb {
            visibility: hidden;
        }
    }

</style>
