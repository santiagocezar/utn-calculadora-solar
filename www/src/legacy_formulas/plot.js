// @ts-check

import * as constantes from "./formulas/constantes.js"
import * as mensuales from "./formulas/mensuales.js"
import * as horarias from "./formulas/horarias.js"

import {Chart, registerables} from 'chart.js'

Chart.register(...registerables)

function chartEl() {
    const chart = document.createElement("canvas")
    document.body.appendChild(chart)
    return chart
}

export function plotEverything() {

    const lat = -31.4/180*Math.PI // Phi
    const lon = -62.1/180*Math.PI // Phi
    const incl = lat         // Beta
    const mes = 0
    const n = constantes.DIAS_JULIANOS[mes]

    const delta = mensuales.declinacion(n)
    const epsilon = mensuales.excentricidad(n)
    const omega_s = mensuales.puesta_salida(lat, delta)

    const H_0 = mensuales.irradiacion_ecuador_diaria(lat, delta, epsilon, omega_s)
    const K_Tm = mensuales.claridad_media(mes, H_0)
    const F_Dm= mensuales.fraccion_difusa(K_Tm) // ok!
    const H_d= mensuales.irradiacion_difusa_diaria(mes, F_Dm)


    const step = 1/180*Math.PI

    const from = -omega_s
    const to = omega_s

    /** @type {number[]} */
    const xValues = []


    for (let i = from; i < to; i += step) {
        xValues.push(i)
    }

    const Is = xValues.map(omega => horarias.irradiacion_horaria_global(mes, omega, omega_s))

    const cos_theta_zs = xValues.map(omega => horarias.cos_cenit(lat, delta, omega))

    const I_0s = xValues.map((omega, i) => {
        const cos_theta_z = cos_theta_zs[i]
        return horarias.irradiacion_horaria(lat, delta, epsilon, omega, cos_theta_z)
    })
    const I_ds = I_0s.map(I_0 => horarias.irradiacion_horaria_difusa(I_0, H_0, H_d))



    const I_bs = xValues.map((_, i) => {
        const I = Is[i]
        const I_d = I_ds[i]
        return I - I_d
    })

    const I_bns = xValues.map((_, i) => {
        const I = Is[i]
        const I_d = I_ds[i]
        const cos_theta_z = cos_theta_zs[i]
        return horarias.irradiacion_directa_normal(I, I_d, cos_theta_z)
    })

    const gammas_excel = xValues.map((_, i) => {
        const cos_theta_z = cos_theta_zs[i]
        return horarias.acimutal_excel(lat, delta, cos_theta_z)
    })

    const gammas_atan2 = xValues.map((omega) => {
        return horarias.acimutal_atan2(lat, lon, delta, omega)
    })

    const gammas_acos  = xValues.map((omega, i) => {
        const cos_theta_z = cos_theta_zs[i]
        return horarias.acimutal(lat, delta, cos_theta_z, omega)
    })

    const quad  = xValues.map(omega => {
        return Math.max(-1/2*omega*omega+.66, 0)
    })

    const gammas = gammas_acos


    const I_finales = xValues.map((omega, i) => {
        const I_d = I_ds[i]
        const I_bn = I_bns[i]
        const gamma = gammas[i]
        return horarias.irradiacion_horaria_media(I_bn, I_d, lat, incl, delta, gamma, omega)
    })

    console.log(I_finales)

    /**
     * @param {string} label
     * @param {number[]} ys
     */
    function points(label, ys) {
        return {
            label,
            data: xValues.map((x, i) => {
                const y = ys[i]
                return {x, y}
            })
        }
    }

    /**
     * @param {string} label
     * @param {(mes: number)=> number} fn
     */
    function pointsMes(label, fn) {
        const data = []
        for (let i = 0; i < 12; i++)
            data.push({x: i, y: fn(i)})
        return {
            label,
            data,
        }
    }

    new Chart(chartEl(), {
        id: "solar",
        type: 'line',
        data: {
            datasets: [
                points("Coseno del Ángulo cenital", cos_theta_zs),
                // points("Ángulo acimutal (acos)", gammas_acos),
                // points("Ángulo acimutal (atan2)", gammas_atan2),
                // points("Ángulo acimutal (excel)", gammas_acos),
                // points("Irradiación horaria global horizontal", Is),
                // points("Irradiación horaria a tope de atmósfera", I_0s),
                // points("Irradiación horaria difusa", I_ds),
                points("Irradiación b", I_bs),
                // points("Irradiación directa normal", I_bns),
                points("Irradiación horaria media", I_finales),
                // points("aproximación", quad),
            ],
            labels: xValues.map(a => Math.round(a / Math.PI * 18000) / 100),
        },
    })


    new Chart(chartEl(), {
        type: 'line',
        data: {
            datasets: [
                pointsMes("Ángulo de puesta del sol (aprox.)", (mes) => {
                        const n = constantes.DIAS_JULIANOS[mes]
                        const delta = mensuales.declinacion(n)
                        return mensuales.puesta_salida(lat, delta)*180/Math.PI
                }),
                pointsMes("Ángulo de puesta del sol (preciso)", (mes) => {
                        const n = constantes.DIAS_JULIANOS[mes]
                        const delta = mensuales.declinacion(n)
                        return mensuales.puesta_salida_preciso(lat, delta)*180/Math.PI
                }),
            ],
            labels: [0,1,2,3,4,5,6,7,8,9,10,11,12]
        },
    })
}

