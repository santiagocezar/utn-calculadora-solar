// @ts-check

const { sin, cos, tan, acos, sign, abs, atan2, pow, PI } = Math

import { H, DIAS_JULIANOS, SOLAR } from "./constantes.js"

/**
 * @param {number} lati Latitud
 * @param {number} incl Inclinación del panel
 * @param {number} acim Acimut del panel
 * @param {number} hora Ángulo horario
 * @param {number} mes Mes
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

    const hora_salida = acos(-tan(decl)*tan(lati))

    /* * * * * * * * * * * * * * * * * * * * * * * * * * *
     * cenit: Ángulo cenital del sol (1.6.5) en radianes *
     * * * * * * * * * * * * * * * * * * * * * * * * * * */

    const cos_cenit = cos(lati) * cos(decl) * cos(angl) + sin(lati) * sin(decl)
    const cenit = acos(cos_cenit)

    /* * * * * * * * * * * * * * * * * * * * * * * * * * *
     * solar_acim: Ángulo acimutal del sol (1.6.6) en radianes *
     * * * * * * * * * * * * * * * * * * * * * * * * * * */

    let P = (cos_cenit * sin(lati) - sin(decl))
        / (sin(cenit) * cos(lati))

    if (P < -1) P = -1 // problemas de precisión

    const solar_acim = sign(angl) * abs(acos(P))

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

    // se convirtió de MJ/m² a kWh/m²
    const H_o = (24 / PI / 1000) * SOLAR * exce
        * (cos(lati) * cos(decl) * sin(hora_salida) + hora_salida * sin(lati)* sin(decl))

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * H_o: Irradiación horaria en superficie horizontal a tope de atmósfera  (1.10.4) en kWh/m² *
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    const hora_1 = angl - PI / 24;
    const hora_2 = angl + PI / 24;

    // se convirtió de MJ/m² a kWh/m²
    const I_o = (12 / PI / 1000) * SOLAR * exce
        * (cos(lati) * cos(decl) * (sin(hora_2) - sin(hora_1)) + (hora_2 - hora_1) * sin(lati) * sin(decl))

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * r_t: Razón entre la radiación total horaria y diaria (2.13.2) *
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    const a = 0.409 + 0.5016 * sin(hora_salida - PI/3)
    const b = 0.6609 - 0.4767 * sin(hora_salida - PI/3)

    const r_t = PI/24 * (a + b * cos(angl)) *
        (cos(angl) - cos(hora_salida)) / (sin(hora_salida) - hora_salida * cos(hora_salida))

    /* * * * * * * * * * * * * * * * * * * * * * *
     * I: Irradiación total (2.13.1) en kWh/m² *
     * * * * * * * * * * * * * * * * * * * * * * */

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

    const H_d = H[mes] * (hora_salida <= 1.42 ? fresco : calido)

    /* * * * * * * * * * * * * * * * * * * * * * *
     * I_d: Irradiación horaria difusa (2.15.1) en kWh/m² *
     * * * * * * * * * * * * * * * * * * * * * * */

    // const r_d = PI / 24 * (cos(hora) - cos(hora_salida)) / (sin(hora_salida) - hora_salida * cos(hora_salida))

    const I_d = I_o * H_d / H_o

    /* * * * * * * * * * * * * * * * * * * * * * *
     * I_T: Irradiación horaria total (2.15.1) en kWh/m² *
     * * * * * * * * * * * * * * * * * * * * * * */

    const I_b = I - I_d

    const beam = I_b * R_b
    const diffuse = I_d * (1+cos(incl)) / 2

    const I_T = beam + diffuse

    return {I_T, I_b, I_d, H_d, K_Tm,I, r_t, a, b, I_o, hora_1, hora_2, H_o, exce, R_b, cos_incid, cenit, cos_cenit, hora_salida, decl, n, angl}
}
