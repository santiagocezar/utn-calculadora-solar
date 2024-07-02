<script>
import * as biomasa from "$lib/biomasa.ts";

let humedad = $state(60);
let temp1 = $state(12);
let temp2 = $state(20);

let volumen = $state(128);

const Patm = biomasa.presionEnAltitud(104);
let rho = $derived(biomasa.densidadAire(Patm, temp1));
let deltaH = $derived(biomasa.deltaEntalpia(Patm, humedad, temp1, temp2));
let Q = $derived(biomasa.calorCalefaccion(Patm, volumen, humedad, temp1, temp2));

// document.getElementById("form").addEventListener("submit", calc)
</script>

<svelte:head>
<title>Calculadora Biomasa - Prototipo 0</title>
</svelte:head>


<h1>Calculadora Biomasa</h1>
<form id="form">
    <!--<fieldset>
        <legend>Espacio</legend>
        <label data-suffix="m">
            <span>Altura</span>
            <input value="0" name="altura" type="text">
        </label>
    </fieldset>-->
    <fieldset>
        <legend>Ambiente</legend>
        <label data-suffix="%">
            <span>Humedad relativa</span>
            <input bind:value={humedad} type="number">
        </label>
        <label data-suffix="°C">
            <span>Temperatura de bulbo seco 1</span>
            <input bind:value={temp1} type="number">
        </label>
        <label data-suffix="°C">
            <span>Temperatura de bulbo seco 2</span>
            <input bind:value={temp2} type="number">
        </label>
    </fieldset>
    <fieldset>
        <legend>Habitación</legend>
        <label data-suffix="m³">
            <span>Volumen</span>
            <input bind:value={volumen} type="number">
        </label>
    </fieldset>
    <!--<div class="submit-wrapper">
        <button type="submit">Calcular</button>
    </div>-->
</form>

<table>
<tbody>
<tr>
<th>Variable</th>
<th>Valor</th>
</tr>
<tr>
<td>ρ</td>
<td>{rho}</td>
</tr>
<tr>
<td>ΔH</td>
<td>{deltaH}</td>
</tr>
<tr>
<td>Q</td>
<td>{Q}</td>
</tr>
</tbody>
</table>

<style>
table td, table th {
    border: 1px solid #0004;
    padding: .1em .5em;
}
table th {
    background-color: #0002;
}
</style>
