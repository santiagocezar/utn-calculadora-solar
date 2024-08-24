<script context="module">
    let counter = 0
</script>
<script lang="ts">
    import type { Snippet } from "svelte";
    import Label from "./Label.svelte";

    interface Props {
        label: string;
        value: string | number;
        children: Snippet;
    }
    
    let {
        label, value = $bindable(), children
    }: Props = $props();

    const id = "select-" + (counter ++)
</script>

<Label text={label} for={id}>
    <select {id} bind:value={value}>
        {@render children()}
    </select>
</Label>
    
<style lang="less">
    select {
        z-index: 2;
        grid-area: input;
        line-height: 100%;
    }
</style>
