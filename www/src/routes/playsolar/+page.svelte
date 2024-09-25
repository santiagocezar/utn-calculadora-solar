<script lang="ts">
    import Casita from '$lib/3d/Casita.svelte';
</script>

<svelte:head>
<title>Calculadora Solar</title>
</svelte:head>

<header>
    <h1>Calculadora Solar - Modo Didáctico</h1>
</header>

<main>
    <div class="3dview">
        <Casita></Casita>
    </div>
    <!--<div class="settings">
        <label>
            <input type="checkbox">
            Microondas
        </label>
    </div>-->
</main>

<style>
main {
    display: grid;
    grid-template-columns: 12fr;
    height: 100%;
}
</style>
