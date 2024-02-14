// @ts-check

import * as constantes from "./formulas/constantes.js"
import * as mensuales from "./formulas/mensuales.js"
import * as horarias from "./formulas/horarias.js"
import { irradiacion_total } from "./formulas/todo.js"

const { sin, cos, tan, acos, sign, abs, atan2, PI } = Math

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
const lat = -31.417*constantes.A_RADIAN // Phi
const incl = lat         // Beta

// Ingresa el usuario
const mes = 5
const hora = 13

// Dependen de lo ingresado
const delta = mensuales.declinacion(constantes.DIAS_JULIANOS[mes])
const epsilon = mensuales.excentricidad(constantes.DIAS_JULIANOS[mes])
const omega_s = mensuales.puesta_salida(lat, delta)
const H_0 = mensuales.irradiacion_ecuador_diaria(lat, delta, epsilon, omega_s)
const K_Tm = mensuales.claridad_media(mes, H_0)
const F_Dm= mensuales.fraccion_difusa(K_Tm) // ok!
const H_d= mensuales.irradiacion_difusa_diaria(mes, omega_s, K_Tm)

const omega = horarias.angulo_horario(hora)
const cos_theta_z = horarias.cos_cenit(lat, delta, omega)
const gamma_s = horarias.acimutal_desmos(omega, lat, delta, cos_theta_z)

const I_0= horarias.irradiacion_horaria(lat, delta, epsilon, omega, cos_theta_z)
const I_d = horarias.irradiacion_horaria_difusa(I_0, H_0, H_d)
const I = horarias.irradiacion_horaria_global(mes, omega, omega_s)
const I_bn= horarias.irradiacion_directa_normal(I, I_d, cos_theta_z)

const I_final = horarias.irradiacion_horaria_media(I, I_d, Math.acos(cos_theta_z), incl, gamma_s, Math.PI)

const I_T = irradiacion_total(lat, incl, Math.PI, hora, mes)

console.log(I_final)
console.log(I_T)


// console.log({lat, delta, epsilon, gamma_s, omega_s, cos_theta_z, omega, H: constantes.H[mes], H_0, K_Tm, F_Dm, H_d, I_0, I_d, I, I_bn, I_final})

