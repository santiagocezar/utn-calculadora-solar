// @ts-check

const { sin, cos, tan, acos, sign, abs, pow, PI } = Math


/* * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Energía que provee el sol, constante solar (W/m²) *
 * * * * * * * * * * * * * * * * * * * * * * * * * * */
const SOLAR = 1360.8

/* * * * * * * * * * * * * * * *
 * El día promedio de cada mes *
 * * * * * * * * * * * * * * * */
const DIAS_JULIANOS = [
    17,47,75,105,135,162,198,228,258,288,318,344
]

/* * * * * * * * * * * * * * * * * * * * *
 * Irradiación mensual promedio (kWh/m²) *
 * * * * * * * * * * * * * * * * * * * * */
export const H = [
    6,5.5,4.5,3.5,3,2,2.5,3,4,5.5,6,6.5
]

/**
 * @param {number} lati Latitud del lugar (en radianes)
 * @param {number} incl Inclinación del panel (en radianes)
 * @param {number} acim Acimut del panel (en radianes)
 * @param {number} hora Hora del día (de 0 a 24)
 * @param {number} mes Índice del mes (enero es 0, diciembre es 11)
 */
export function irradiacion_total(lati, incl, acim, hora, mes) {
    const angl = (hora - 12) / 12 * PI

    /* * * * * * * * * * * * * * * * * * * * * * *
     * n: Día juliano para tal mes (Tabla 1.6.1) *
     * * * * * * * * * * * * * * * * * * * * * * */

    const n = DIAS_JULIANOS[mes]

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * decl: Posición angular del sol respecto al plano del ecuador (1.6.1a) en radianes *
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    const decl = (23.45 * PI / 180) * sin(2 * PI * (284 + n) /365)

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * hora_salida: Ángulo horario de puesta y salida del sol (1.6.10) en radianes *
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    const angl_salida = acos(-tan(decl)*tan(lati))

    /* * * * * * * * * * * * * * * * * * * * * * * * * * *
     * cenit: Ángulo cenital del sol (1.6.5) en radianes *
     * * * * * * * * * * * * * * * * * * * * * * * * * * */

    const cos_cenit = cos(lati) * cos(decl) * cos(angl) + sin(lati) * sin(decl)
    const cenit = acos(cos_cenit)

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * solar_acim: Ángulo acimutal del sol (1.6.6) en radianes *
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    let P = (cos_cenit * sin(lati) - sin(decl))
        / (sin(cenit) * cos(lati))

    if (P < -1) P = -1 // problemas de precisión

    // sign(...) puede dar 0, lo que causa que se formen picos al mediodía en las formulas siguientes
    const solar_acim = (angl < 0 ? -1 : 1) * abs(acos(P))

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * cos_incid: Coseno del ángulo de incidencia del sol y el panel (1.6.3) en radianes *
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    const cos_incid = cos_cenit * cos(incl) + sin(cenit) * sin (incl) * cos(solar_acim - acim)

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * R_b: Razón de la radiación directa en superficie inclinada y horizontal (1.8.1) *
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    const R_b = cos_incid / cos_cenit

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * exce: La distancia de la tierra al sol en AU (1.4.1*) *
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    const exce = 1 + 0.033 * cos(2 * PI * n / 365)

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * H_o: Irradiación diaria en superficie horizontal a tope de atmósfera (1.10.3) en kWh/m² *
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    // MJ/m²
    const H_o_joules = (24 * 3600 / PI) * SOLAR * exce
        * (cos(lati) * cos(decl) * sin(angl_salida) + angl_salida * sin(lati)* sin(decl))

    // kW/m²
    const H_o = H_o_joules / 3.6

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * I_o: Irradiación horaria en superficie horizontal a tope de atmósfera  (1.10.4) en kWh/m² *
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    // Equivalente en radianes de un intervalo de 1 hora simétrico,
    const angl_1 = angl - PI / 24;
    const angl_2 = angl + PI / 24;

    // MJ/m²
    const I_o_joules = (12 * 3600 / PI) * SOLAR * exce
        * (cos(lati) * cos(decl) * (sin(angl_2) - sin(angl_1)) + (angl_2 - angl_1) * sin(lati) * sin(decl))

    // kW/m²
    const I_o = I_o_joules / 3.6

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * r_t: Razón entre la radiación total horaria y diaria (2.13.2) *
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    const a = 0.409 + 0.5016 * sin(angl_salida - PI/3)
    const b = 0.6609 - 0.4767 * sin(angl_salida - PI/3)

    const r_t = PI/24 * (a + b * cos(angl)) *
        (cos(angl) - cos(angl_salida)) / (sin(angl_salida) - angl_salida * cos(angl_salida))

    /* * * * * * * * * * * * * * * * * * * * * *
     * I: Irradiación total (2.13.1) en kWh/m² *
     * * * * * * * * * * * * * * * * * * * * * */

    const I = H[mes] * r_t

    /* * * * * * * * * * * * * * * * * * * * * * * * * *
     * K_Tm: Índice de claridad medio mensual  (2.12?) *
     * * * * * * * * * * * * * * * * * * * * * * * * * */

    const K_Tm = H[mes] / H_o

    /* * * * * * * * * * * * * * * * * * * * * * * * * * *
     * H_d: Irradiación diaria difusa (2.12.1) en kWh/m² *
     * * * * * * * * * * * * * * * * * * * * * * * * * * */

    const fresco = 1.391 - 3.560 * K_Tm + 4.189 * pow(K_Tm, 2) - 2.137 * pow(K_Tm, 3)
    const calido = 1.311 - 3.022 * K_Tm + 3.427 * pow(K_Tm, 2) - 1.821 * pow(K_Tm, 3)

    const H_d = H[mes] * (angl_salida <= 1.42 ? fresco : calido)

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * I_d: Irradiación horaria difusa (2.15.1) en kWh/m²  *
     * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    const r_d = PI / 24 * (cos(angl) - cos(angl_salida)) / (sin(angl_salida) - angl_salida * cos(angl_salida))

    const I_d = r_d * H_d
    // const I_d = I_o * H_d / H_o

    /* * * * * * * * * * * * * * * * * * * * * * * * * * *
     * I_T: Irradiación horaria total (2.15.1) en kWh/m² *
     * * * * * * * * * * * * * * * * * * * * * * * * * * */

    const I_b = I - I_d

    const beam = I_b * R_b
    const diffuse = I_d * (1+cos(incl)) / 2

    const I_T = (beam + diffuse) // * 4/3

    return {
        angl, n, decl, hora_salida: angl_salida, solar_acim, cos_cenit, cenit, cos_incid, R_b, exce, H_o, angl_2, angl_1, I_o, b, a, r_t, I, K_Tm, H_d, I_d, I_b, I_T}
}
