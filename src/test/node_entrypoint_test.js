// @ts-check

import { irradiacion_total } from "../solar.js"


/**
 * Una función que devuelve los MINUTOS del día para cierta posición del sol.
 * Basado en https://gml.noaa.gov/grad/solcalc/solareqns.PDF
 * @param {number} latitud Latitud en radianes
 * @param {number} longitud Longitud en radianes
 * @param {number} zona Diferencia horaria con el UTC (-3 para Argentina)
 * @param {number} dia El día del año (0-365)
 * @param {number} angulo El ángulo del sol (de 0 a π)
 * @returns {number} El minuto del día, número entero (0-1440)
 */
export function util_angulo_a_tiempo(latitud, longitud, zona, dia, angulo) {
    // convertir a grados
    longitud *= 180/PI

    // console.log({latitud, longitud, zona, dia, angulo})

    const frac_year = 2*PI / 365 * (dia-1) // suponemos mediodia
    const eqOfTime = 229.18*(0.000075 + 0.001868*cos(frac_year) - 0.032077*sin(frac_year) - 0.014615*cos(2*frac_year) - 0.040849*sin(2*frac_year) )

    const decl = mensuales.declinacion_preciso(frac_year)
    const angulo_puesta_salida = mensuales.puesta_salida_preciso(latitud, decl) / PI * 180
        
    const salida_mins = 720 - 4*(longitud+angulo_puesta_salida) - eqOfTime + zona * 60
    const puesta_mins = 720 - 4*(longitud-angulo_puesta_salida) - eqOfTime + zona * 60
    
    return Math.round(salida_mins + (puesta_mins - salida_mins) * angulo / PI)

    // const tst = (ha/PI*180+180)*4
    // const timeOffset = eqOfTime+4*longitud-60*zona
    // return tst - timeOffset    

    /*
    */
    // const salida = 720
}

// Semi-constantes
const lat = -31.417*Math.PI / 180 // Phi
const incl = lat         // Beta

// Ingresa el usuario
const mes = 5
const hora = 12

const valores1 = irradiacion_total(lat, incl, Math.PI, hora, mes)
const valores2 = irradiacion_total(lat, incl, Math.PI, hora-.001, mes)

const epsilon = .1

for (const v in valores1) {
    const delta = valores1[v] - valores2[v]
    const color = Math.abs(delta) < epsilon ? '\x1b[0;32m' : '\x1b[0;31m'
    console.log(`${v}: ${color}${delta.toFixed(10)}\x1b[0m (${valores1[v]} - ${valores2[v]})`)
}
