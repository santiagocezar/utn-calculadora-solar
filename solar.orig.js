// @ts-check
const dia_juliano = [
    17,47,75,105,135,162,198,228,258,288,318,344
]

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
 * Coseno del Ángulo cenital (estación) (theta_z, radianes).
 * @param {number} phi Latitud
 * @param {number} delta Declinación
 * @param {number} omega Ángulo horario
 */
function cos_cenit(phi, delta, omega) {
    return Math.sin(delta)*Math.sin(phi)+Math.cos(delta)*Math.cos(phi)*Math.cos(omega)
}


/**
 * Ángulo azimutal (gamma, radianes).
 * @param {number} phi Latitud
 * @param {number} delta Declinación
 * @param {number} cos_theta_z Coseno del cenit
 * @param {number} omega Ángulo horario
 */
function acimutal(phi, delta, cos_theta_z, omega) {
    const sin_theta_z = Math.sin(Math.acos(cos_theta_z))
    return Math.sign(omega)*Math.abs(Math.acos((cos_theta_z * Math.sin(phi)-Math.sin(delta))/(sin_theta_z*Math.cos(phi)) ))
}


/**
 * Ángulo horario de puesta y salida del sol en superficie horizontal (omega_s)
 * @param {number} phi Latitud
 * @param {number} delta Declinación
 */
function puesta_salida(phi, delta) {
    return Math.acos(-Math.tan(delta)*Math.tan(phi))
}

/**
 * Irradiación solar global diaria en una superficie orientada hacia el ecuador (H_0, en Wh/m²)
 * @param {number} phi Latitud
 * @param {number} delta Declinación
 * @param {number} epsilon Eccentricidad
 * @param {number} omega_s Ángulo horario de puesta y salida del sol
 */
function irradiacion_ecuador_diaria(phi, delta, epsilon, omega_s) {
    // se sacó el múltiplo 3600 para convertir el valor de J/m² a Wh/m²
    return (24/Math.PI)*G_sc*epsilon
        * (Math.cos(phi)*Math.cos(delta)*Math.sin(omega_s)+omega_s*Math.sin(phi)*Math.sin(delta))
}

/**
 * Índice de claridad medio mensual (K_Tm, sin unidad)
 * @param {number} mes Mes de 0-11
 * @param {number} H_0 Irradiación en una superficie orientada hacia el ecuador
 */
function claridad_media(mes, H_0) {
    return H[mes] / H_0
}

/**
 * Fracción difusa (f_Dm)
 * @param {number} ktm índice de claridad medio mensual
 */
function fraccion_difusa(ktm) {
    return 1 - 1.13 * ktm
}

/**
 * Irradiación solar diaria global difusa (media mensual, H_d)
 * @param {number} mes Mes de 0-11
 * @param {number} fdm Fracción difusa
 */
function irradiacion_difusa_diaria(mes, fdm) {
    return fdm * H[mes]
}


/**
 * Irradiación directa en el plano orientado hacia el ecuador (media mensual, H_b(beta,0))
 * @param {number} mes Mes
 * @param {number} H_d Irradiación solar diaria global difusa
 * @param {number} theta Latitud
 * @param {number} delta Declinación
 * @param {number} beta Inclinación de la instalación
 * @param {number} omega_s Ángulo horario de puesta y salida del sol
 */

// no se usa
// function irradiación_directa(mes, H_d, theta, delta, beta, omega_s) {
//     /** Diferencia entre la inclinación de la instalación y la latitud */
//     const dif_incl = theta-Math.sign(theta)*beta
//
//     const omega_s_prima = Math.min(omega_s, Math.acos(-Math.tan(delta)*Math.tan(dif_incl)))
//
//     const R_b = (omega_s_prima*Math.sin(delta)*Math.sin(dif_incl)+Math.cos(delta)*Math.cos(dif_incl)*Math.sin(omega_s_prima))
//     /(omega_s*Math.sin(delta)*Math.sin(theta)+Math.cos(delta)*Math.cos(delta)*Math.sin(omega_s))
//
//     return (H[mes] - H_d) * R_b
// }


/**
 * Irradiación horaria a tope de atmósfera sobre la superficie horizontal, media mensual (I_0, en Wh/m²).
 * @param {number} phi Latitud
 * @param {number} delta Declinación
 * @param {number} epsilon Eccentricidad
 * @param {number} omega_2 Ángulo horario
 */
function irradiacion_horaria(phi, delta, epsilon, omega_2) {
    const omega_1 = omega_2 - 15*TO_RAD;
    // se sacó el múltiplo 3600 para convertir el valor de J/m² a Wh/m²
    return (12/Math.PI)*G_sc*epsilon
        * (Math.cos(phi)*Math.cos(delta)*(Math.sin(omega_2) - Math.sin(omega_1))+(omega_2 - omega_1)*Math.sin(phi)*Math.sin(delta))
}

/**
 * Irradiación horaria difusa (I_d, en Wh/m²).
 * @param {number} I_0
 * @param {number} H_0
 * @param {number} H_d
 */
function irradiacion_horaria_difusa(I_0, H_0, H_d) {
    return I_0 / H_0 * H_d
}

/**
 * Irradiación horaria global horizontal (I, en Wh/m²).
 * @param {number} mes Mes
 * @param {number} omega_i Ángulo horario
 * @param {number} omega_s Ángulo horario de puesta y salida del sol
 */
function irradiacion_horaria_global(mes, omega_i, omega_s) {
    const a = 0.409 + 0.5016 * Math.sin(omega_s - Math.PI/3)
    const b = 0.6609 - 0.4767 * Math.sin(omega_s - Math.PI/3)

    console.log({a,b, mes, omega_i, omega_s})

    return H[mes] * Math.PI/24*(a+b * Math.cos(omega_i))*(Math.cos(omega_i)- Math.cos(omega_s))/(Math.sin(omega_s)-omega_s*Math.cos(omega_s))
}

/**
 * Irradiación directa normal (I_b, en Wh/m²).
 * @param {number} I Global
 * @param {number} I_d Difusa
 * @param {number} cos_theta_z Coseno del cénit
 */
function irradiacion_directa_normal(I, I_d, cos_theta_z) {
    const I_b = I - I_d

    console.log({I, I_d, I_b})

    return I_b * 1 / cos_theta_z
}

/**
 * Irradiación directa normal (I_b, en Wh/m²).
 * @param {number} I_bn
 * @param {number} I_d
 * @param {number} phi Latitud
 * @param {number} beta Inclinación
 * @param {number} delta Declinación
 * @param {number} gamma Ángulo acimutal
 * @param {number} omega Ángulo horario
 */
function irradiacion_horaria_media(I_bn, I_d, phi, beta, delta, gamma, omega) {
    const { sin, cos } = Math


    const cos_theta = sin(delta)*sin(phi)*cos(beta)
    - sin(delta)*cos(phi)*sin(beta)*cos(gamma)
    + cos(delta)*cos(phi)*cos(beta)*cos(omega)
    + cos(delta)*sin(phi)*sin(beta)*cos(gamma)*cos(omega)
    + cos(delta)*sin(gamma)*sin(beta)*sin(omega)


    return I_bn * cos_theta + I_d * (1+cos(beta)) / 2
}

const mes = 0
const hora = 12

const lat = -31.4*TO_RAD // Phi
const incl = lat // Beta
const delta = declinacion(dia_juliano[mes])
const epsilon = excentricidad(dia_juliano[mes])

const omega = angulo_horario(hora)
const cos_theta_z = cos_cenit(lat, delta, omega)
const gamma = acimutal(lat, delta, cos_theta_z, omega)

const omega_s = puesta_salida(lat, delta)
const H_0 = irradiacion_ecuador_diaria(lat, delta, epsilon, omega_s)
const K_Tm = claridad_media(mes, H_0)
const F_Dm= fraccion_difusa(K_Tm) // ok!
const H_d= irradiacion_difusa_diaria(mes, F_Dm)
const I_0= irradiacion_horaria(lat, delta, epsilon, omega)
const I_d = irradiacion_horaria_difusa(I_0, H_0, H_d)
const I = irradiacion_horaria_global(mes, omega, omega_s)
const I_bn= irradiacion_directa_normal(I, I_d, cos_theta_z)

const I_final= irradiacion_horaria_media(I_bn, I_d, lat, lat, delta, gamma, omega)



console.log({lat, delta, epsilon, gamma, omega_s, H_0, K_Tm, F_Dm, H_d, omega, I_0, I_d, I, I_bn, I_final})

