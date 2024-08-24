
<script lang="ts">
    import type { Snippet } from "svelte";

    interface Props {
        text: string;
        tts?: string;
        for?: string;
        children: Snippet;
    }

    let { text: label, tts, for: for_, children }: Props = $props()
</script>

<div class="labeled">
    <label for={for_} aria-label={tts ?? label}>
        <span aria-hidden="true">{label}</span>
    </label>
    {@render children()}
</div>

<style lang="less">
.labeled {
    display: grid;
    grid-template: 
        "label" auto
        "input" auto
        / 1fr;
    height: 3rem;
    
    border: 1px solid #ccd;
    border-top-width: 2px;
    background-color: #fff;
    border-radius: 4px;
    overflow: hidden;

    --shadow: #f0f0fa 0 2px 8px inset;
    box-shadow: var(--shadow);

    &:focus-within {
        border-color: rgb(33 118 245);
        box-shadow: var(--shadow), 0 0 2px 2px rgb(33 118 245 / 50%);
    }
    
    label {
        user-select: none;
        grid-area: label;
        flex-basis: 100%;
        align-self: center;
        font-size: .75rem;
        height: 1rem;
        padding: 0 .5rem;
        opacity: .75;
        pointer-events: none;
    }

    :global(input),
    :global(textarea),
    :global(select) {
        outline: none !important;
        background-color: transparent;
        padding: 0 .5rem;
        width: 100%;
    }
    // textarea {
    //     height: 6rem;
    //     resize: none;
    //     background: none;
    // }
}
</style>
