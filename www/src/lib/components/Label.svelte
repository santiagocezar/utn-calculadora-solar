
<script lang="ts">
    import type { Snippet } from "svelte";

    interface Props {
        text: string;
        for?: string;
        children: Snippet;
    }

    let { text: label, for: for_, children }: Props = $props() 
</script>

<label for={for_}>
    <span>{label}</span>
    {@render children()}
</label>

<style lang="less">
label {
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

    --shadow: #f0f0fa 0 2px 8px inset;
    box-shadow: var(--shadow);

    &:focus-within {
        border-color: rgb(33 118 245);
        box-shadow: var(--shadow), 0 0 2px 2px rgb(33 118 245 / 50%);
    }
    
    span {
        user-select: none;
        grid-area: label;
        flex-basis: 100%;
        font-size: .75rem;
        height: 1rem;
        padding: 0 .5rem;
        opacity: .75;
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