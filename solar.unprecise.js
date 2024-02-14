// @ts-check

const { sin, cos, tan, acos, sign, abs, PI } = Math

const dia_juliano = [
    17,47,75,105,135,162,198,228,258,288,318,344
]

/**
 * Te da el día juliano para cierto mes
 * @param {number} mes Del 0 al 11
 */
export function get_dia_juliano(mes) {
    return dia_juliano[mes]
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
const G_sc = 1360.8 // Irradiación global, constante Solar en Watts sobre metro cuadrado
const TO_RAD = 2*PI/360

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
    // return 23.45*TO_RAD*sin(2*PI*(284+n)/365)

    const frac_year = 2*PI / 365 * (n-1) // suponemos mediodia
    return declinacion_preciso(frac_year)

}

/**
 * Ángulo horario en radianes (omega)
 * -π/2 a las 06:00, 0 al mediodía, +π/2 a las 18:00
 * @param {number} h Hora del día
 */
export function angulo_horario(h) {
    return (h-12)*15*TO_RAD
}


/**
 * Coseno del Ángulo cenital (estación) (theta_z, radianes).
 * @param {number} phi Latitud
 * @param {number} delta Declinación
 * @param {number} omega Ángulo horario
 */
export function cos_cenit(phi, delta, omega) {
    return sin(phi)*sin(delta)+cos(delta)*cos(phi)*cos(omega)
}


/**
 * Ángulo acimutal (gamma, radianes).
 * @param {number} phi Latitud
 * @param {number} delta Declinación
 * @param {number} cos_theta_z Coseno del cenit
 * @param {number} omega Ángulo horario
 */
export function acimutal(phi, delta, cos_theta_z, omega) {
    const theta_z = acos(cos_theta_z)
    const sin_theta_z = sin(theta_z)
    // console.log({phi, delta, cos_theta_z, omega, sin_theta_z})


    const cosine_value = tan(phi)/tan(theta_z) - sin(delta) / (sin_theta_z * cos(phi))

    // let cosine_value = (cos_theta_z * sin(phi) - sin(delta)) / (sin_theta_z * cos(phi))
    // cosine_value = Math.fround(cosine_value) // hopefully this stops NaN from appearing

    return sign(omega) * abs(
        acos(cosine_value)
    )
}

/**
 * Ángulo acimutal mejorado (gamma, radianes).
 * Basado en https://www.sciencedirect.com/science/article/pii/S0960148121004031
 * @param {number} phi Latitud
 * @param {number} delta Declinación
 * @param {number} omega Ángulo horario
 */
export function acimutal(phi, delta, omega) {
    const theta_z = acos(cos_theta_z)
    const sin_theta_z = sin(theta_z)
    // console.log({phi, delta, cos_theta_z, omega, sin_theta_z})


    const cosine_value = tan(phi)/tan(theta_z) - sin(delta) / (sin_theta_z * cos(phi))

    // let cosine_value = (cos_theta_z * sin(phi) - sin(delta)) / (sin_theta_z * cos(phi))
    // cosine_value = Math.fround(cosine_value) // hopefully this stops NaN from appearing

    return sign(omega) * abs(
        acos(cosine_value)
    )
}


/**
 * Ángulo horario de puesta y salida del sol en superficie horizontal (omega_s)
 * @param {number} phi Latitud
 * @param {number} delta Declinación
 */
export function puesta_salida(phi, delta) {
    // return puesta_salida_preciso(phi, delta)
    return acos(tan(delta)*tan(phi))
}


/**
 * Ángulo horario de puesta y salida del sol en superficie horizontal (omega_s)
 * La función puesta_salida() le erra por MÁS DE 1 HORA, pero esta no :D
 * @param {number} phi Latitud
 * @param {number} delta Declinación
 */
export function puesta_salida_preciso(phi, delta) {
    return acos(cos(90.833*TO_RAD)/(cos(phi)*cos(delta))-tan(delta)*tan(phi))
}

/**
 * Irradiación solar global diaria en una superficie orientada hacia el ecuador (H_0, en Wh/m²)
 * @param {number} phi Latitud
 * @param {number} delta Declinación
 * @param {number} epsilon Eccentricidad
 * @param {number} omega_s Ángulo horario de puesta y salida del sol
 */
export function irradiacion_ecuador_diaria(phi, delta, epsilon, omega_s) {
    // se sacó el múltiplo 3600 para convertir el valor de J/m² a Wh/m²
    return (24/PI)*G_sc*epsilon
        * (cos(phi)*cos(delta)*sin(omega_s)+omega_s*sin(phi)*sin(delta))
}

/**
 * Índice de claridad medio mensual (K_Tm, sin unidad)
 * @param {number} mes Mes de 0-11
 * @param {number} H_0 Irradiación en una superficie orientada hacia el ecuador
 */
export function claridad_media(mes, H_0) {
    return H[mes] / H_0
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
 * @param {number} fdm Fracción difusa
 */
export function irradiacion_difusa_diaria(mes, fdm) {
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
//     const dif_incl = theta-sign(theta)*beta
//
//     const omega_s_prima = min(omega_s, acos(-tan(delta)*tan(dif_incl)))
//
//     const R_b = (omega_s_prima*sin(delta)*sin(dif_incl)+cos(delta)*cos(dif_incl)*sin(omega_s_prima))
//     /(omega_s*sin(delta)*sin(theta)+cos(delta)*cos(delta)*sin(omega_s))
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
export function irradiacion_horaria(phi, delta, epsilon, omega_2) {
    const omega_1 = omega_2 - 15*TO_RAD;
    // se sacó el múltiplo 3600 para convertir el valor de J/m² a Wh/m²
    return (12/PI)*G_sc*epsilon
        * (cos(phi)*cos(delta)*(sin(omega_2) - sin(omega_1))+(omega_2 - omega_1)*sin(phi)*sin(delta))
}

/**
 * Irradiación horaria difusa (I_d, en Wh/m²).
 * @param {number} I_0
 * @param {number} H_0
 * @param {number} H_d
 */
export function irradiacion_horaria_difusa(I_0, H_0, H_d) {
    return I_0 / H_0 * H_d
}

/**
 * Irradiación horaria global horizontal (I, en Wh/m²).
 * @param {number} mes Mes
 * @param {number} omega_i Ángulo horario
 * @param {number} omega_s Ángulo horario de puesta y salida del sol
 */
export function irradiacion_horaria_global(mes, omega_i, omega_s) {
    const a = 0.409 + 0.5016 * sin(omega_s - PI/3)
    const b = 0.6609 - 0.4767 * sin(omega_s - PI/3)

    // console.log({a,b, mes, omega_i, omega_s})

    return H[mes] * PI/24*(a+b * cos(omega_i))*(cos(omega_i)- cos(omega_s))/(sin(omega_s)-omega_s*cos(omega_s))
}

/**
 * Irradiación directa normal (I_b, en Wh/m²).
 * @param {number} I Global
 * @param {number} I_d Difusa
 * @param {number} cos_theta_z Coseno del cénit
 */
export function irradiacion_directa_normal(I, I_d, cos_theta_z) {
    const I_b = I - I_d

    // console.log({I, I_d, I_b})

    return I_b * 1 / cos_theta_z
}

/**
 * Irradiación horaria media (I_b, en Wh/m²).
 * @param {number} I_bn
 * @param {number} I_d
 * @param {number} phi Latitud
 * @param {number} beta Inclinación
 * @param {number} delta Declinación
 * @param {number} gamma Ángulo acimutal
 * @param {number} omega Ángulo horario
 */
export function irradiacion_horaria_media(I_bn, I_d, phi, beta, delta, gamma, omega) {
    const { sin, cos } = Math


    const cos_theta = sin(delta)*sin(phi)*cos(beta)
    - sin(delta)*cos(phi)*sin(beta)*cos(gamma)
    + cos(delta)*cos(phi)*cos(beta)*cos(omega)
    + cos(delta)*sin(phi)*sin(beta)*cos(gamma)*cos(omega)
    + cos(delta)*sin(gamma)*sin(beta)*sin(omega)


    return I_bn * cos_theta + I_d * (1+cos(beta)) / 2
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

    const decl = declinacion_preciso(frac_year)
    const angulo_puesta_salida = puesta_salida_preciso(latitud, decl) / PI * 180
        
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
const lat = -31.4*TO_RAD // Phi
const incl = lat         // Beta

// Ingresa el usuario
const mes = 0
const hora = 12

// Dependen de lo ingresado
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



// console.log({lat, delta, epsilon, gamma, omega_s, cos_theta_z, omega, H_0, K_Tm, F_Dm, H_d, I_0, I_d, I, I_bn, I_final})

