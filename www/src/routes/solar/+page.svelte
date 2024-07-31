<script>

let latitud = $state(-31.4);
let longitud = $state(-62.1);
let zona = $state(-3);
let mesString = $state("0");
let mes = $derived(parseFloat(mesString));

let inclinacion = $state(31.4);
let acimut = $state(180);
let cantidad = $state(1);
let superficie = $state(1.64);

let eficienciaPanel = $state(0);
let eficienciaInversor = $state(0);

</script>


<svelte:head>
<title>Calculadora Solar - Prototipo EMCI</title>
</svelte:head>


<h1>Calculadora Solar - Modo técnico</h1>
<div id="form">
    <fieldset>
        <legend>Espacio y tiempo</legend>
        <label data-suffix="°">
            <span>Latitud</span>
            <input bind:value={latitud} type="number">
        </label>
        <label data-suffix="°">
            <span>Longitud</span>
            <input bind:value={longitud} type="number">
        </label>
        <label>
            <span>Huso horario</span>
            <input bind:value={zona} type="number">
        </label>
        <label for="select">
            <span>Mes</span>
            <select bind:value={mesString} id="select">
                <option value="0">Enero</option>
                <option value="1">Febrero</option>
                <option value="2">Marzo</option>
                <option value="3">Abril</option>
                <option value="4">Mayo</option>
                <option value="5">Junio</option>
                <option value="6">Julio</option>
                <option value="7">Agosto</option>
                <option value="8">Septiembre</option>
                <option value="9">Octubre</option>
                <option value="10">Noviembre</option>
                <option value="11">Diciembre</option>
            </select>
        </label>
    </fieldset>
    <fieldset>
        <legend>Disposición de los paneles</legend>
        <label data-suffix="°">
            <span>Inclinación</span>
            <input bind:value={inclinacion} type="number">
        </label>
        <label data-suffix="°">
            <span>Ángulo acimutal</span>
            <input bind:value={acimut} type="number">
        </label>
        <label>
            <span>Cantidad de paneles</span>
            <input bind:value={cantidad} type="number">
        </label>
        <label data-suffix="m²">
            <span>Superficie del panel</span>
            <input value={superficie} type="text">
        </label>
    </fieldset>
    <fieldset>
        <legend>Datos eléctricos</legend>
        <label data-suffix="%">
            <span>Eficiencia de los paneles</span>
            <input value="15.15" name="efiPanel" type="text">
        </label>
        <label data-suffix="%">
            <span>Eficiencia del inversor</span>
            <input value="98" name="efiInversor" type="text">
        </label>
    </fieldset>
    <div class="submit-wrapper">
        <button class="btn" type="submit">Calcular</button>
    </div>
</div>

