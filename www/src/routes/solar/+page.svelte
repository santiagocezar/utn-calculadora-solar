---
import Layout from '../layouts/Default.astro';
---
<svelte:head>
<title>Calculadora Solar - Prototipo EMCI</title>
</svelte:head>


<script src="../lib/form.ts"></script>
<h1>Calculadora Solar - Modo técnico</h1>
<solar-form>
    <form>
        <fieldset>
            <legend>Espacio y tiempo</legend>
            <label data-suffix="°">
                <span>Latitud</span>
                <input value="-31.4" name="latitud" type="text">
            </label>
            <label data-suffix="°">
                <span>Longitud</span>
                <input value="-62.1" name="longitud" type="text">
            </label>
            <label>
                <span>Huso horario</span>
                <input value="-3" name="zona" type="text">
            </label>
            <label for="select">
                <span>Mes</span>
                <select name="mes" id="select">
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
                <input value="31.4" name="inclinacion" type="text">
            </label>
            <label data-suffix="°">
                <span>Ángulo acimutal</span>
                <input value="180" name="acimut" type="text">
            </label>
            <label>
                <span>Cantidad de paneles</span>
                <input value="1" name="cantidad" type="number">
            </label>
            <label data-suffix="m²">
                <span>Superficie del panel</span>
                <input value="1.64" name="superficie" type="text">
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
            <button type="submit">Calcular</button>
        </div>
    </form>
</solar-form>

</Layout>
