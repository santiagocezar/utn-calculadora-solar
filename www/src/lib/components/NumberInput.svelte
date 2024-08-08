<script lang="ts">
    import Label from "./Label.svelte";

    interface Props {
        label: string;
        prefix?: string;
        unit?: string;
        step?: number;
        min?: number;
        max?: number;
        value: number;
    }

    let {
        label, prefix, unit, step, min, max, value = $bindable()
    }: Props = $props() 
</script>

<Label text={label}>
    <!-- <input bind:value={value} {min} {max} {step} type="range"> -->
    <div>
        {#if prefix}
            <span>{prefix}</span>
        {/if}
        <input bind:value={value} {min} {max} {step} type="number">
        {#if unit}
            <span>{unit}</span>
        {/if}
    </div>
</Label>

<style lang="less">
    span {
        content: attr(data-suffix);
        padding: 0 .5rem;
        opacity: .75;
    }
    div {
        display: flex;
    }

    input[type="number"]::-webkit-outer-spin-button,
    input[type="number"]::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    input[type="number"] {
        -moz-appearance: textfield;
        appearance: textfield;
    }
    /*
    input[type="range"] {
        grid-area: label;
        -webkit-appearance: none;
        appearance: none;
        background: transparent;
        cursor: pointer;
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
        &::-moz-range-progress {
            background-color: red;
            height: 100%;

        }
    }
    */
</style>