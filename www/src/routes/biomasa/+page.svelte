<script lang="ts">
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
<div id="form">
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
    <!--<div class="submit-wrapper">
        <button type="submit">Calcular</button>
    </div>-->
</div>

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
form {
    display: flex;
    flex-direction: column;
}
h2 {
    font-size: 2em;
}
h3 {
    font-size: 1.5em;
}
h4 {
    font-size: 1.25em;
}
.opening-list {
    display: flex;
    gap: 1em;
/*     overflow-x: auto; */
    max-width: 100%;
}
.opening header {
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: .5em;
}
.opening {
    display: flex;
    flex-direction: column;
    gap: .5em;
    flex-shrink: 0;
    padding: 1em;
    padding-top: 0;
    border: 1px solid #ccc;
    border-bottom-width: 2px;
    border-radius: 4px;
    box-shadow: #f0f0f0 0 -2px 8px inset;
    width: 15em;
}
.opening label {
    width: 100%;
}
.opening .add {
    align-self: end;
}
.opening .delete {
    --c: #dd44a0;
    padding: .25em .5em;
    color: white;
}
</style>
