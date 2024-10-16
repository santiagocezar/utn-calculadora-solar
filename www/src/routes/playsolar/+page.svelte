<script lang="ts">
    import Casita from '$lib/3d/Casita.svelte';
    import { items } from '$lib/3d/items';
    import SeasonSlider from '$lib/components/SeasonSlider.svelte';

    import { objectMap } from '../../lib/functional'

    import { horaSolar, irradiacionTotal, valoresMensuales } from '$lib/solar'

    let month = $state(1)
    let hour = $state(0)

    let mensuales = $derived(valoresMensuales(-31.4 * Math.PI / 180, month - 1))

    const itemVisible = $state(objectMap(items, () => true))
</script>

<svelte:head>
<title>Calculadora Solar</title>
</svelte:head>

<header>
    <h1>Calculadora Solar - Modo Didáctico</h1>
</header>

<main>
    <div class="view">
        <Casita visible={itemVisible}></Casita>
    </div>
    <div class="settings">
        {#each Object.keys(itemVisible) as item}
            <label>
                <input type="checkbox" bind:checked={itemVisible[item]}>
                {items[item].name}
            </label>
            <br>
        {/each}
    </div>
    <div class="slider">
        <SeasonSlider
            bind:month={month} bind:hour={hour}
            sunrise={mensuales.anguloSalida}
        ></SeasonSlider>
    </div>
</main>

<style>
main {
    display: grid;
    grid-template: "view settings" 1fr / 9fr 3fr;
    height: 100%;
}

.view {
    grid-area: view;
}

.settings {
    grid-area: settings;
}

.slider {
    grid-area: view;
    place-self: start;
    z-index: 10;
}

</style>
