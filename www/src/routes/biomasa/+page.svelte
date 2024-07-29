<script lang="ts">
import * as biomasa from "$lib/biomasa.ts";

let humedad = $state(60);
let temp1 = $state(12);
let temp2 = $state(20);

let ancho = $state(8);
let largo = $state(8);
let alto = $state(8);
let volumen = $state(128);

interface Opening {
    id: number;
    w: number;
    h: number;
}

function defaultOpening(): Ventana {
    console.log(defaultOpening.lastID)
    return {
        id: defaultOpening.lastID++,
        w: 8,
        h: 8,
    }
}
defaultOpening.lastID = 0

let windows = $state([
    defaultOpening()
]);

let doors = $state([
    defaultOpening()
]);

function addWindow() {
    windows.push(defaultOpening())
}
function deleteWindow(i: number) {
    windows.splice(i, 1)
}
function addDoor() {
    doors.push(defaultOpening())
}
function deleteDoor(i: number) {
    doors.splice(i, 1)
}

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
    <!--<fieldset>
        <legend>Espacio</legend>
        <label data-suffix="m">
            <span>Altura</span>
            <input value="0" name="altura" type="text">
        </label>
    </fieldset>-->
    <h2>Ambiente</h2>
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
    <h2>Habitación</h2>
    <label data-suffix="m">
        <span>Ancho</span>
        <input bind:value={ancho} type="number">
    </label>
    <label data-suffix="m">
        <span>Largo</span>
        <input bind:value={largo} type="number">
    </label>
    <label data-suffix="m">
        <span>Alto</span>
        <input bind:value={alto} type="number">
    </label>
    <h3>Ventanas</h3>
    <button class="add btn" onclick={addWindow}> Agregar </button>
    <div class="opening-list">
    {#each windows as ven, i (ven.id)}
        <div class="opening">
            <header>
                <h4>Ventana {i + 1}</h4>
                <button class="delete btn" onclick={() => deleteWindow(i)}>Borrar</button>
            </header>
            <label data-suffix="m">
                <span>Ancho</span>
                <input bind:value={ven.w} step="0.01" type="number">
            </label>
            <label data-suffix="m">
                <span>Alto</span>
                <input bind:value={ven.h} step="0.01" type="number">
            </label>
        </div>
    {/each}
    </div>
    <h3>Puertas</h3>
    <button class="add btn" onclick={addDoor}> Agregar </button>
    <div class="opening-list">
    {#each doors as pue, i (pue.id)}
        <div class="opening">
            <header>
                <h4>Puerta {i + 1}</h4>
                <button class="delete btn" onclick={() => deleteWindow(i)}>Borrar</button>
            </header>
            <label data-suffix="m">
                <span>Ancho</span>
                <input bind:value={pue.w} step="0.01" type="number">
            </label>
            <label data-suffix="m">
                <span>Alto</span>
                <input bind:value={pue.h} step="0.01" type="number">
            </label>
        </div>
    {/each}
    </div>
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
