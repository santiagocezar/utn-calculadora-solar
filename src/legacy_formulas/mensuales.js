// @ts-check
import * as constantes from "./constantes.js"

/** Estas formulas solo cambian a lo largo del año y/o con la ubiación del panel */

const { sin, cos, tan, acos, sign, abs, atan2, PI } = Math

/**
 * La distancia de la tierra al sol en AU (excentricidad del elipse) (epsilon)
 * @param {number} n Día juliano (día representativo del mes, tomado de dia_juliano)
 */
export function excentricidad(n) {
    return 1+0.033*cos(2*PI*n/365)
}

/**
 * Posición angular del sol respecto al plano del ecuador (delta)
 * @param {number} n Día juliano (día representativo del mes, tomado de dia_juliano)
 */
export function declinacion(n) {
    return 23.45*constantes.A_RADIAN*sin(2*PI*(284+n)/365)

    //const frac_year = 2*PI / 365 * (n-1) // suponemos mediodia
    // return declinacion_preciso(frac_year)
}

/**
 * Posición angular del sol respecto al plano del ecuador (delta)
 * Disminuye el error de 4 a 1 minuto a calcular el tiempo
 * @param {number} gamma Año fraccionario
 */
export function declinacion_preciso(gamma) {
    return 0.006918 - 0.399912*cos(gamma) + 0.070257*sin(gamma) - 0.006758*cos(2*gamma)
            + 0.000907*sin(2*gamma) - 0.002697*cos(3*gamma) + 0.00148*sin(3*gamma)
}

/**
 * Ángulo horario de puesta y salida del sol en superficie horizontal (omega_s)
 * @param {number} phi Latitud
 * @param {number} delta Declinación
 */
export function puesta_salida(phi, delta) {
    // return puesta_salida_preciso(phi, delta)
    return acos(-tan(delta)*tan(phi))
}

/**
 * Ángulo horario de puesta y salida del sol en superficie horizontal (omega_s)
 * La función puesta_salida() le erra por MÁS DE 1 HORA, pero esta no :D
 * @param {number} phi Latitud
 * @param {number} delta Declinación
 */
export function puesta_salida_preciso(phi, delta) {
    return acos(cos(90.833*constantes.A_RADIAN)/(cos(phi)*cos(delta))-tan(delta)*tan(phi))
}

/**
 * Irradiación solar global diaria en una superficie orientada hacia el ecuador (H_0, en kWh/m²)
 * @param {number} phi Latitud
 * @param {number} delta Declinación
 * @param {number} epsilon Eccentricidad
 * @param {number} omega_s Ángulo horario de puesta y salida del sol
 */
export function irradiacion_ecuador_diaria(phi, delta, epsilon, omega_s) {
    // se sacó el múltiplo 3600 para convertir el valor de J/m² a Wh/m²
    return (24/PI/1000)*constantes.SOLAR*epsilon
        * (cos(phi)*cos(delta)*sin(omega_s)+omega_s*sin(phi)*sin(delta))
}

/**
 * Índice de claridad medio mensual (K_Tm, sin unidad)
 * @param {number} mes Mes de 0-11
 * @param {number} H_0 Irradiación en una superficie orientada hacia el ecuador
 */
export function claridad_media(mes, H_0) {
    return constantes.H[mes] / H_0
}

/**
 * Fracción difusa (f_Dm)
 * @param {number} ktm índice de claridad medio mensual
 */
export function fraccion_difusa(ktm) {
    return 1 - 1.13 * ktm
}

/**
 * Irradiación solar diaria global difusa (media mensual, H_d)
 * @param {number} mes Mes de 0-11
 * @param {number} omega_s Ángulo horario de puesta y salida del sol
 * @param {number} K_Tm índice de claridad medio mensual
 */
export function irradiacion_difusa_diaria(mes, omega_s, K_Tm) {

    const invierno = 1.391 - 3.560 * K_Tm + 4.189 * K_Tm * K_Tm - 2.137 * K_Tm * K_Tm * K_Tm
    const el_resto = 1.311 - 3.022 * K_Tm + 3.427 * K_Tm * K_Tm - 1.821 * K_Tm * K_Tm * K_Tm
    return constantes.H[mes] * (omega_s <= 1.42 ? invierno : el_resto)
}
