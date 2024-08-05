<script lang="ts">
import * as biomasa from "$lib/biomasa/index";

console.dir(biomasa )

let humidity = $state(60);
let temp1 = $state(12);
let temp2 = $state(20);
let volumen = $state(128);
let performance = $state(90);
let pellet = $state("pino");
let hours = $state(8);

let Q = $derived(biomasa.calorGenerado(humidity, temp1, temp2));
let m = $derived(biomasa.masaPelet(Q, performance, pellet) * hours * 3600);

</script>

<svelte:head>
<title>Calculadora Biomasa - Prototipo 0</title>
</svelte:head>

<header>
    <h1>Calculadora Biomasa</h1>
</header>
<div id="form">
    <fieldset>
        <legend>Ambiente</legend>
        <label data-suffix="%">
            <span>Humedad relativa</span>
            <input bind:value={humidity} type="number">
        </label>
        <label data-suffix="°C">
            <span>Temperatura exterior</span>
            <input bind:value={temp1} type="number">
        </label>
        <label data-suffix="°C">
            <span>Temperatura interior deseada</span>
            <input bind:value={temp2} type="number">
        </label>
    </fieldset>
    <fieldset>
        <legend>Estufa</legend>
        <label data-suffix="%">
            <span>Rendimiento de la estufa</span>
            <input bind:value={performance} type="number">
        </label>
        <label data-suffix="h">
            <span>Horas de uso</span>
            <input bind:value={hours} type="number">
        </label>
        <label for="select">
            <span>Tipo de pellet</span>
            <select bind:value={pellet} id="select">
                <option value="pino">Madera de pino</option>
                <option value="espar">Espartillo</option>
                <option value="maiz">Rastrojo de maíz</option>
                <option value="m81">Sorghum Saccharatum variedad M81</option>
            </select>
        </label>
    </fieldset>
    <!--<div class="submit-wrapper">
        <button type="submit">Calcular</button>
    </div>-->
</div>

<h1>Masa pellets = {m}kg</h1>
