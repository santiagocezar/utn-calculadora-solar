
const dia_juliano = [
    17,47,75,105,135,162,198,228,258,288,318,344
]

const G_sc = 1360.8 // Irradiación global, constante Solar en Watts sobre metro cuadrado
const TO_RAD = 2*Math.PI/360

/**
 * La distancia de la tierra al sol en AU (excentricidad del elipse) (epsilon)
 * @param {number} n Día juliano (día representativo del mes, tomado de dia_juliano)
 */
function excentricidad(n) {
    return 1+0.033*Math.cos(2*Math.PI*n/365)
}

/**
 * Posición angular del sol respecto al plano del ecuador (delta)
 * @param {number} n Día juliano (día representativo del mes, tomado de dia_juliano)
 */
function declinacion(n) {
    return 23.45*TO_RAD*Math.sin(2*Math.PI*(284+n)/365)
}

/**
 * Ángulo horario en radianes (omega)
 * @param {number} h Hora del día
 */
function angulo_horario(h) {
    return (h-12)*15*TO_RAD
}

/**
 * Ángulo horario de puesta y salida del sol en superficie horizontal (omega_s)
 * @param {number} theta Latitud
 * @param {number} delta Declinación
 */
function puesta_salida(theta, delta) {
    return Math.acos(-Math.tan(delta)*Math.tan(theta))
}


/** irradiación por metro cuadrado (Wh/m²)*/
const H = [
6000,
5500,
4500,
3500,
3000,
2000,
2500,
3000,
4000,
5500,
6000,
6500
]

/**
 * Algo, en Wh/m²
 * @param {number} theta Latitud
 * @param {number} delta Declinación
 * @param {number} epsilon Eccentricidad
 */
function H_0(theta, delta, epsilon) {
    const omega_s = puesta_salida(theta, delta)
    return (24/Math.PI)*G_sc*epsilon
        * (Math.cos(theta)*Math.cos(delta)*Math.sin(omega_s)+omega_s*Math.sin(theta)*Math.sin(delta))
}

/**
 * Índice de claridad medio mensual (K_Tm, sin unidad)
 * @param {number} mes Mes de 0-11
 * @param {number} theta Latitud
 * @param {number} delta Declinación
 * @param {number} epsilon Eccentricidad
 */
function claridad_media(mes, theta, delta, epsilon) {
    return H[mes] / H_0(theta, delta, epsilon)
}

/**
 * Fracción difusa
 * @param {number} ktm índice de claridad medio mensual
 */
function fraccion_difusa(ktm) {
    return 1 - 1.13 * ktm
}

const mes = 4-1
const hora = 12

const lat = -31.4*TO_RAD // Theta
const delta = declinacion(dia_juliano[mes])
const epsilon = excentricidad(dia_juliano[mes])
const omega = angulo_horario(hora)

const hache = H_0(lat, delta, epsilon)
const ktm = claridad_media(mes, lat, delta, epsilon)
const efe_de_eme= fraccion_difusa(ktm)


console.log({lat, delta, epsilon, omega, hache, ktm, efe_de_eme})
