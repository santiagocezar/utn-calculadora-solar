<script context="module">
    let counter = 0
</script>
<script lang="ts">
    import Label from "./Label.svelte";

    const unitName = {
        "msquared": "{} en metros cuadrados",
        "degrees": "{} en grados",
        "celsius": "{} en grados celsius",
        "hour": "{} en horas",
        "percentage": "porcentaje de {}",
    }
    const unitSym: typeof unitName = {
        "msquared": "m²",
        "degrees": "°",
        "celsius": "°C",
        "hour": "h",
        "percentage": "%",
    }

    interface Props {
        label: string;
        prefix?: string;
        unit?: keyof (typeof unitName);
        step?: number;
        min?: number;
        max?: number;
        value: number;
    }

    let {
        label, prefix, unit, step, min, max, value = $bindable()
    }: Props = $props()

    let fullLabel = unit ? unitName[unit].replace("{}", label) : label;

    let progress = $derived(
        (min != undefined) && (max != undefined)
        ? (value - min) / (max - min)
        : undefined);

    const id = "number-input-" + (counter ++)
</script>

<Label text={label} tts={fullLabel} for={id}>
    {#if progress !== undefined}
        <input aria-hidden="true" tabindex="-1" bind:value={value} {min} {max} {step} type="range">
        <div class="progress" style="--progress: {progress}"></div>
    {/if}
    <div>
        {#if prefix}
            <span>{prefix}</span>
        {/if}
        <input {id} bind:value={value} {min} {max} {step} type="number">
        {#if unit}
            <span aria-hidden="true">{unitSym[unit]}</span>
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

    .progress {
        grid-area: label;
        width: calc(var(--progress) * 100%);
        background-color: #eeeeff;
        pointer-events: none;
        border-radius: 0 4px 4px 0;
        border-right: 2px solid #ddddf4;
    }
    input[type="range"] {
        grid-area: label;
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
