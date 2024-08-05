import { irradiacionTotal, valoresMensuales } from './solar'

import {Chart, registerables} from 'chart.js'

Chart.register(...registerables)

const monthName = (m: number) => new Date(2000, m, 1).toLocaleString(undefined, {month: "long"})

const addChart = (parent: HTMLElement) => {
    const chartWrapper = document.createElement("div")
    chartWrapper.className = "chart-wrapper"
    const canvas = document.createElement("canvas")
    chartWrapper.appendChild(canvas)
    parent.appendChild(chartWrapper)
    return canvas
}
// -

class SolarForm extends HTMLElement {
    latitud: number;
    longitud: number;
    zona: number;
    mes: number;
    inclinacion: number;
    acimut: number;
    cantidad: number;
    superficie: number;
    eficienciaPanel: number;
    eficienciaInversor: number;

    form: HTMLFormElement | null = null
    hourlyPlot: HTMLCanvasElement | null = null
    monthlyPlot: HTMLCanvasElement | null = null
    hourlyChart: Chart | null = null
    monthlyChart: Chart | null = null

    convertirDatos() {
        const data = new FormData(this.form!)

        this.latitud = parseFloat(data.get("latitud") as string)
            * Math.PI / 180;
        this.longitud = parseFloat(data.get("longitud") as string)
            * Math.PI / 180;
        this.zona = parseInt(data.get("zona") as string);
        this.mes = parseInt(data.get("mes") as string);
        this.inclinacion = parseFloat(data.get("inclinacion") as string)
            * Math.PI / 180;
        this.acimut = parseFloat(data.get("acimut") as string)
            * Math.PI / 180;
        this.cantidad = parseInt(data.get("cantidad") as string);
        this.superficie = parseFloat(data.get("superficie") as string);
        this.eficienciaPanel = parseFloat(data.get("efiPanel") as string)
            / 100;
        this.eficienciaInversor = parseFloat(data.get("efiInversor") as string)
            / 100;
    }

    connectedCallback() {
        this.form = this.getElementsByTagName("form")[0]
        const chartGroup = document.createElement("div")
        chartGroup.className = "chart-group"
        this.hourlyPlot = addChart(chartGroup)
        this.monthlyPlot = addChart(chartGroup)
        this.appendChild(chartGroup)

        this.form.addEventListener("submit", ev => {
            ev.preventDefault()

            this.convertirDatos()
            this.calcular()
        })

        this.convertirDatos()
        this.calcular()
    }

    calcular() {
        const eficienciaInstalacion = .90 // fija

        const superficieTotal = this.cantidad * this.superficie

        const factorGeneracion = superficieTotal * this.eficienciaPanel * this.eficienciaInversor * eficienciaInstalacion

        const ejeHoras: number[] = []
        const ejeMeses: number[] = []
        for (let h = 0; h < 24; h++) ejeHoras.push(h)
        for (let m = 0; m < 12; m++) ejeMeses.push(m)

        const mensuales = valoresMensuales(this.latitud, this.mes)
        const generacionTotalHoraria = ejeHoras.map(h => (
            irradiacionTotal(
                this.latitud, this.longitud, this.zona, this.inclinacion, this.acimut, h, mensuales
            ).IT * factorGeneracion
        ))

        const generacionTotalMensual = ejeMeses.map(m => (
            irradiacionTotal(
                this.latitud, this.longitud, this.zona, this.inclinacion, this.acimut, 12, valoresMensuales(this.latitud, m)
            ).IT * factorGeneracion
        ))

        // tomar un máximo teórico para la ubicación para que se note la diferencia entre los meses
        const maximoVerano = generacionTotalMensual[0] * 1.2 // un poquito más por las dudas

        if (this.monthlyChart) this.monthlyChart.destroy()
        if (this.hourlyChart) this.hourlyChart.destroy()

        this.hourlyChart = new Chart(this.hourlyPlot!, {
            type: 'bar',
            data: {
                labels: ejeHoras,
                datasets: [{
                    label: "kWh generados",
                    data: generacionTotalHoraria,
                    borderWidth: 1,
                }],
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: `Irradiación total a lo largo de un día promedio del mes de ${monthName(this.mes)}`
                    }
                },
                scales: {
                    y: {
                        min: 0,
                        max: maximoVerano,
                    }
                }
            }
        })
        this.monthlyChart = new Chart(this.monthlyPlot!, {
            type: 'bar',
            data: {
                labels: ejeMeses.map(monthName),
                datasets: [{
                    label: "kWh generados",
                    data: generacionTotalMensual,
                    borderWidth: 1,
                }],
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: "Irradiación total al mediodía a lo largo de todo el año"
                    }
                },
                scales: {
                    y: {
                        min: 0,
                        max: maximoVerano,
                    }
                }
            }
        })
    }
}

customElements.define("solar-form", SolarForm)
