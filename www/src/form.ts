import { irradiacionTotal } from './solar.js'

import {Chart, registerables} from 'chart.js'

Chart.register(...registerables)


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
    plot: HTMLCanvasElement | null = null
    previousChart: Chart | null = null

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
        const chartWrapper = document.createElement("div")
        chartWrapper.className = "chart-wrapper"
        this.plot = document.createElement("canvas")
        chartWrapper.appendChild(this.plot)
        this.appendChild(chartWrapper)

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

        const ejeX: number[] = []
        for (let h = 0; h < 24; h++) ejeX.push(h)

        const generacionTotal = ejeX.map(h => (
            // TODO: evitar recalcular todas las variables independientes de la hora
            irradiacionTotal(
                this.latitud, this.longitud, this.zona, this.inclinacion, this.acimut, h, this.mes
            ).IT * factorGeneracion
        ))

        // tomar un máximo teórico para la ubicación para que se note la diferencia entre los meses
        const maximoVerano = irradiacionTotal(
            this.latitud, this.longitud, this.zona, this.inclinacion, this.acimut, 12, 0
        ).IT * factorGeneracion * 1.2 // un poquito más por las dudas

        if (this.previousChart) this.previousChart.destroy()
        this.previousChart = new Chart(this.plot!, {
            type: 'bar',
            data: {
                labels: ejeX,
                datasets: [{
                    label: "kWh generados",
                    data: generacionTotal,
                    borderWidth: 1,
                }],
            },
            options: {
                responsive: true,
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
