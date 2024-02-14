// @ts-check
import * as constantes from "./constantes.js"

/** Estas cambian a lo largo del día */

const { sin, cos, tan, acos, sign, abs, atan2, PI } = Math

/**
 * Ángulo horario en radianes (omega)
 * -π/2 a las 06:00, 0 al mediodía, +π/2 a las 18:00
 * @param {number} h Hora del día
 */
export function angulo_horario(h) {
    return (h-12)*15*constantes.A_RADIAN
}


/**
 * Coseno del Ángulo cenital (estación) (theta_z, radianes).
 * @param {number} phi Latitud
 * @param {number} delta Declinación
 * @param {number} omega Ángulo horario
 */
export function cos_cenit(phi, delta, omega) {
    console.log({
        "senoseno": sin(phi)*sin(delta),
        "cosenocoseno": cos(delta)*cos(phi)*cos(omega),
        "omega":cos(omega)
    })
    // return sin(delta)*sin(phi)+cos(delta)*cos(phi)*cos(omega)
    return Math.max(sin(delta)*sin(phi)+cos(delta)*cos(phi)*cos(omega), 0)
}


/**
 * Ángulo acimutal (gamma, radianes).
 * @param {number} omega Ángulo horario
 * @param {number} phi Latitud
 * @param {number} delta Declinación
 * @param {number} cos_theta_z Coseno del cenit
 */
export function acimutal_desmos(omega, phi, delta, cos_theta_z) {
    return sign(omega) * abs(acos(
        (cos_theta_z * sin(phi) -sin(delta))
        / (sin(acos(cos_theta_z))*cos(phi))
    ))
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


    // const cosine_value = tan(phi)/tan(theta_z) - sin(delta) / (sin_theta_z * cos(phi))

    let cosine_value = (cos_theta_z * sin(phi) - sin(delta)) / (sin_theta_z * cos(phi))
    cosine_value = Math.fround(cosine_value) // hopefully this stops NaN from appearing

    return sign(omega) * abs(
        acos(cosine_value)
    )
}

/**
 * Ángulo acimutal usando atan2 (gamma, radianes).
 * Basado en https://www.sciencedirect.com/science/article/pii/S0960148121004031
 * @param {number} lat Latitud
 * @param {number} lon Longitud
 * @param {number} decl Declinación
 * @param {number} omega Ángulo horario
 */
export function acimutal_atan2(lat, lon, decl, omega) {
    const lat_o = lat // * TO_RAD
    const lon_o = lon // * TO_RAD
    const lat_s = decl
    const lon_s = -omega

    const x = cos(lat_s)*sin(lon_s-lon_o)
    const y = cos(lat_o)*sin(lat_s)-sin(lat_o)*cos(lat_s)*cos(lon_s-lon_o)
    // const z = sin(lat_o)*cos(lat_s)+cos(lat_o)*cos(lat_s)*cos(lon_s-lon_o)

    return atan2(-x, -y)
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
 * Irradiación horaria a tope de atmósfera sobre la superficie horizontal, media mensual (I_0, en kWh/m²).
 * @param {number} phi Latitud
 * @param {number} delta Declinación
 * @param {number} epsilon Eccentricidad
 * @param {number} omega Ángulo horario
 * @param {number} cos_theta_z Se usa para el control de los valores
 */
export function irradiacion_horaria(phi, delta, epsilon, omega, cos_theta_z) {
    if (cos_theta_z == 0) return 0;
    const omega_1 = omega - PI / 24;
    const omega_2 = omega + PI / 24;
    // se sacó el múltiplo 3600 para convertir el valor de J/m² a kWh/m²
    // console.log({
    //     M54: cos_theta_z, C$4: G_sc, G$41: epsilon, C$6: phi, H54: delta, J55: omega_2, J54: omega
    // })
    return (12/PI/1000)*constantes.SOLAR*epsilon
        * (cos(phi)*cos(delta)*(sin(omega_2) - sin(omega_1))+(omega_2 - omega_1)*sin(phi)*sin(delta))
}

/**
 * Irradiación horaria difusa (I_d, en kWh/m²).
 * @param {number} I_0
 * @param {number} H_0
 * @param {number} H_d
 */
export function irradiacion_horaria_difusa(I_0, H_0, H_d) {
    return I_0 / H_0 * H_d
}

/**
 * Irradiación horaria global horizontal (I, en kWh/m²).
 * @param {number} mes Mes
 * @param {number} omega_i Ángulo horario
 * @param {number} omega_s Ángulo horario de puesta y salida del sol
 */
export function irradiacion_horaria_global(mes, omega_i, omega_s) {
    const a = 0.409 + 0.5016 * sin(omega_s - PI/3)
    const b = 0.6609 - 0.4767 * sin(omega_s - PI/3)
    // const rtm =
    // M54=0;0;(PI()/24)*(Z$41+(AA$41*COS(RADIANES(J54))))*((COS(RADIANES(J54)))-(COS(I$41)))/
    // (SEN(I$41)-(I$41)*(COS(I$41)))
    // (a+b*cos(omega_i))*(cos(omega_i)-cos(omega_s))/(sin(omega_s)-omega_s*cos(omega_s))

    const rtm = PI/24*(a+b*cos(omega_i))*(cos(omega_i)-cos(omega_s))/(sin(omega_s)-omega_s*cos(omega_s))
    console.log({a,b, mes, omega_i, omega_s, rtm})

    return constantes.H[mes] * rtm
}

/**
 * Irradiación directa normal (I_bn, en kWh/m²).
 * @param {number} I Global
 * @param {number} I_d Difusa
 * @param {number} cos_theta_z Coseno del cénit
 */
export function irradiacion_directa_normal(I, I_d, cos_theta_z) {
    if (cos_theta_z == 0) return 0;
    const I_b = I - I_d

    console.log({I, I_d, I_b})

    return I_b / cos_theta_z
}

/**
 * I_T: Irradiación total (2.15.1) en kWh/m²
 * @param {number} I Irradiación a tope de atmósfera en superficie horizontal (media horaria, 1.10.4)
 * @param {number} I_d Irradiación difusa horaria
 * @param {number} theta_z
 * @param {number} beta
 * @param {number} gamma_s
 * @param {number} gamma
 */
export function irradiacion_horaria_media(I, I_d, theta_z, beta, gamma_s, gamma) {
    const { sin, cos } = Math

    // Irradiación directa horaria sobre el plano horizontal
    const I_b = I - I_d
    const cos_theta_i = cos(theta_z) * cos(beta) + sin(theta_z) * sin(beta) * cos(gamma_s - gamma)

    const beam = I_b * cos_theta_i / cos(theta_z)
    const diffuse = I_d * (1+cos(beta)) / 2

    return beam + diffuse
}

