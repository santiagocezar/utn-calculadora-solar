<script lang="ts">
    import Label from '$lib/components/Label.svelte';
    import NumberInput from '$lib/components/NumberInput.svelte';
    import SelectInput from '$lib/components/SelectInput.svelte';
import { horaSolar, irradiacionTotal, valoresMensuales } from '$lib/solar'
import {Chart, registerables} from 'chart.js'

const monthName = (m: number) => new Date(2000, m, 1).toLocaleString(undefined, {month: "long"})
const TO_RAD = Math.PI / 180

let latitudDeg = $state(-31.4);
let longitudDeg = $state(-62.1);
let zona = $state(-3);
let mesString = $state("0");
let mes = $derived(parseFloat(mesString));

$effect(() => {
    console.log(mesString)
})

let inclinacionDeg = $state(31.4);
let acimutDeg = $state(180);
let cantidad = $state(1);
let superficie = $state(1.64);

let eficienciaPanel100 = $state(15.15);
let eficienciaInversor100 = $state(98);

let latitudRad = $derived(latitudDeg * TO_RAD);
let longitudRad = $derived(longitudDeg * TO_RAD);
let inclinacionRad = $derived(inclinacionDeg * TO_RAD);
let acimutRad = $derived(acimutDeg * TO_RAD);
let eficienciaPanel = $derived(eficienciaPanel100 / 100);
let eficienciaInversor = $derived(eficienciaInversor100 / 100);

const hourAxis = Array.from({length: 24}, (_, i) => i)
const monthAxis = Array.from({length: 12}, (_, i) => i)

console.log(monthAxis)

let hourlyCanvas = $state<HTMLCanvasElement | undefined>()
let monthlyCanvas = $state<HTMLCanvasElement | undefined>()

let hourlyChart = $state<Chart | undefined>()
let monthlyChart = $state<Chart | undefined>()

$effect (() => {
    Chart.register(...registerables)

    hourlyChart = new Chart(hourlyCanvas!, {
        type: 'bar',
        data: {
            labels: hourAxis,
            datasets: [{
                label: "kWh generados",
                data: hourAxis.map(() => 1),
                borderWidth: 1,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 200,
            },
            plugins: {
                title: {
                    display: true,
                    text: "Irradiación total a lo largo de un día promedio del mes"
                }
            },
            scales: {
                y: {
                    min: 0,
                }
            }
        }
    })

    monthlyChart = new Chart(monthlyCanvas!, {
        type: 'bar',
        data: {
            labels: monthAxis.map((_, i) => monthName(i)),
            datasets: [{
                label: "kWh generados",
                data: monthAxis.map(() => 0),
                borderWidth: 1,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 200,
            },
            plugins: {
                title: {
                    display: true,
                    text: "Irradiación total al mediodía a lo largo de todo el año"
                }
            },
            scales: {
                y: {
                    min: 0,
                }
            }
        }
    })
})

$effect (() => {
    const eficienciaInstalacion = .90 // fija
    
    const superficieTotal = cantidad * superficie
    
    const factorGeneracion = superficieTotal * eficienciaPanel * eficienciaInversor * eficienciaInstalacion

    const mensuales = valoresMensuales(latitudRad, mes)
    const generacionTotalHoraria = hourAxis.map(h => (
        irradiacionTotal(
            latitudRad, inclinacionRad, acimutRad, horaSolar(h, longitudRad, zona, mensuales.ecTiempo), mensuales
        ).IT * factorGeneracion
    ))

    console.log(hourAxis)


    const generacionTotalMensual = monthAxis.map(m => {
        const mensuales = valoresMensuales(latitudRad, m);
        return irradiacionTotal(
            latitudRad, inclinacionRad, acimutRad, 12, mensuales,
        ).IT * factorGeneracion
    })

    // tomar un máximo teórico para la ubicación para que se note la diferencia entre los meses
    const maximoVerano = mensuales.H * factorGeneracion * 1.2 // un poquito más por las dudas

    hourlyChart!.data.datasets[0].data = generacionTotalHoraria
    monthlyChart!.data.datasets[0].data = generacionTotalMensual
    hourlyChart!.options.scales!.y!.max = maximoVerano
    monthlyChart!.options.scales!.y!.max = maximoVerano
    
    hourlyChart!.update()
    monthlyChart!.update()
})

</script>


<svelte:head>
<title>Calculadora Solar - Prototipo EMCI</title>
</svelte:head>

<header>
    <h1>Calculadora Solar - Modo técnico</h1>
</header>
<div id="form">
    <fieldset>
        <legend>Espacio y tiempo</legend>
        <NumberInput
            label="Latitud"
            bind:value={latitudDeg} 
            unit="degrees" step={0.1}
            min={-90} max={90}
        />
        <NumberInput
            label="Longitud"
            bind:value={longitudDeg} 
            unit="degrees" step={0.1}
            min={-180} max={180}
        />
        <NumberInput
            label="Huso horario"
            bind:value={zona} 
            min={-12} max={12}
        />
        <SelectInput
            label="Mes"
            bind:value={mesString} 
        >
            <option value="0" selected>Enero</option>
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
        </SelectInput>
    </fieldset>
    <fieldset>
        <legend>Disposición de los paneles</legend>
        <NumberInput
            label="Inclinación"
            bind:value={inclinacionDeg} unit="degrees" min={0} max={90}
        />
        <NumberInput
            label="Ángulo acimutal"
            bind:value={acimutDeg} unit="degrees" min={-180} max={180}
        />
        <NumberInput
            label="Cantidad de paneles"
            bind:value={cantidad} min={0} max={100}
        />
        <NumberInput
            label="Superficie del panel"
            bind:value={superficie} unit="msquared" step={0.01} min={0} max={1000}
        />
    </fieldset>
    <fieldset>
        <legend>Eficiencia eléctrica</legend>
        <NumberInput
            label="Eficiencia de los paneles"
            bind:value={eficienciaPanel100} unit="percentage" step={0.01} min={0} max={100}
        />
        <NumberInput
            label="Eficiencia del inversor"
            bind:value={eficienciaInversor100} unit="percentage" step={0.01} min={0} max={100}
        />
    </fieldset>
</div>
<div class="chart-group">
    <div class="chart-wrapper">
        <canvas bind:this={hourlyCanvas}></canvas>
    </div>
    <div class="chart-wrapper">
        <canvas bind:this={monthlyCanvas}></canvas>
    </div>
</div>

