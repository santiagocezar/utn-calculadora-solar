// @ts-check

const { sin, cos, tan, acos, sign, abs, pow, PI } = Math


/* * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Energía que provee el sol, constante solar (W/m²) *
 * * * * * * * * * * * * * * * * * * * * * * * * * * */
const SOLAR = 1367

/* * * * * * * * * * * * * * * *
 * El día promedio de cada mes *
 * * * * * * * * * * * * * * * */
const DIAS_JULIANOS = [
    17,47,75,105,135,162,198,228,258,288,318,344
]

/* * * * * * * * * * * * * * * * * * * * *
 * Irradiación mensual promedio (ND) (kWh/m²) *
 * * * * * * * * * * * * * * * * * * * * */
export const Hs = [
    7.689, 6.804, 5.714, 4.238, 3.323, 2.821, 2.989, 3.805, 5.167, 6.224, 7.244, 7.541
]

/**
 * @param {number} latitud Latitud del lugar (en radianes)
 * @param {number} long Longitud del lugar (en radianes)
 * @param {number} zona Diferencia horaria con el GMT (-3 para Argentina)
 * @param {number} incl Inclinación del panel (en radianes)
 * @param {number} acim Acimut del panel (en radianes)
 * @param {number} h Hora del día (de 0 a 24)
 * @param {number} mes Índice del mes (enero es 0, diciembre es 11)
 */
export function irradiacion_total(latitud, long, zona, incl, acim, h, mes) {
    const H = Hs[mes]

    /* * * * * * * * * * * * * * * * * * * * * * *
     * n: Día juliano para tal mes (Tabla 1.6.1) *
     * * * * * * * * * * * * * * * * * * * * * * */

    const n = DIAS_JULIANOS[mes]

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * declinacion: Posición angular del sol respecto al plano del ecuador (1.6.1a) en radianes *
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    const declinacion = (23.45 * PI / 180) * sin(2 * PI * (284 + n) /365) //

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * exce: La distancia de la tierra al sol en AU (1.4.1*) *
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    /*
     * En la review de Maleki (energies), usa un factor de 0.0033, citando al artículo de Beckman.
     * Esto debe ser un error, porque en el artículo se usa un valor 0.033, así que tomamos eso
     */
    const excentricidad = 1 + 0.033 * cos(2 * PI * n / 365)

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * hora_salida: Ángulo horario de puesta y salida del sol (1.6.10) en radianes *
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    const anguloSalida = acos(-tan(latitud)*tan(declinacion))

    /* * * * * * * * * * * * * * * * * * * *
     * anio_frac: Año fraccionario (1.4.2) *
     * * * * * * * * * * * * * * * * * * * */
    const anioFrac = (n - 1) * 2 * PI / 365

    /* * * * * * * * * * * * * * * * * * * *
     * ec_tiempo: Año fraccionario (1.4.2) *
     * * * * * * * * * * * * * * * * * * * */
    const ecTiempo = 229.2 * (0.000075 + 0.001868 * cos(anioFrac) - 0.032077 * sin(anioFrac) - 0.014615 * cos(2 * anioFrac) - 0.04089 * sin(2 * anioFrac))

    // Hora solar
    const hSolar = (h * 60 + 4 * (zona * PI/12 - long) + ecTiempo) / 60 - .5


    /* * * * * * * * * * * * * * * * * * * * * *
     * Ángulo horario centrado en el mediodía  *
     * * * * * * * * * * * * * * * * * * * * * */
    const anguloHorario = (hSolar - 12) * (PI / 12)

    /* * * * * * * * * * * * * * * * * * * * * * * * * * *
     * cenit: Ángulo cenital del sol (1.6.5) en radianes *
     * * * * * * * * * * * * * * * * * * * * * * * * * * */

    const cosAnguloCenital = cos(latitud) * cos(declinacion) * cos(anguloHorario) + sin(latitud) * sin(declinacion)
    const anguloCenital = acos(cosAnguloCenital)

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * solar_acim: Ángulo acimutal del sol (1.6.6) en radianes *
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    let acimutSolarParam = (cosAnguloCenital * sin(latitud) - sin(declinacion))
        / (sin(anguloCenital) * cos(latitud))

    if (acimutSolarParam < -1) acimutSolarParam = -1 // problemas de precisión

    // La función tiene el mismo signo que el ángulo horario, excepto en 0 para asegurar que al operar trigonométricamente el valor sea el mismo que el de los límites por izquiera y por derecha
    const acimutSolar = (anguloHorario < 0 ? -1 : 1) * abs(acos(acimutSolarParam))

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * Io: Irradiación horaria en superficie horizontal a tope de atmósfera  (1.10.4) en kWh/m² *
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    // Equivalente en radianes de un intervalo de 1 hora simétrico,
    const angulo1 = anguloHorario - PI / 24;
    const angulo2 = anguloHorario + PI / 24;

    // En MJ/m²
    const IoJ = (12 * 3600 / PI) * SOLAR * excentricidad * (cos(latitud) * cos(declinacion) * (sin(angulo2) - sin(angulo1)) + (angulo2 - angulo1) * sin(latitud) * sin(declinacion));

    // En kW/m²
    const Io = IoJ / 3600000

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * r_t: Razón entre la radiación total horaria y diaria (2.13.2) *
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    const a = 0.409 + 0.5016 * sin(anguloSalida - PI/3)
    const b = 0.6609 - 0.4767 * sin(anguloSalida - PI/3)

    const r_t = PI/24 * (a + b * cos(anguloHorario)) * (cos(anguloHorario) - cos(anguloSalida)) / (sin(anguloSalida) - anguloSalida * cos(anguloSalida))


    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * cos_incid: Coseno del ángulo de incidencia del sol y el panel (1.6.3) en radianes *
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    const cos_incid = cosAnguloCenital * cos(incl) + sin(anguloCenital) * sin (incl) * cos(acimutSolar - acim)
    const incid = acos(cos_incid)

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * R_b: Razón de la radiación directa en superficie inclinada y horizontal (1.8.1) *
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    const R_b = cos_incid / cosAnguloCenital

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * H_o: Irradiación diaria en superficie horizontal a tope de atmósfera (1.10.3) en kWh/m² *
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    // en J/m²
    const H_o_joules = (24 * 3600 / PI) * SOLAR * excentricidad
        * (cos(latitud) * cos(declinacion) * sin(anguloSalida) + anguloSalida * sin(latitud)* sin(declinacion))

    // convertido a kWh/m²
    const H_o = H_o_joules / 3600000

    /* * * * * * * * * * * * * * * * * * * * * *
     * I: Irradiación total en superficie horizontal (2.13.1) en kWh/m² *
     * * * * * * * * * * * * * * * * * * * * * */

    const I = H * r_t

    /* * * * * * * * * * * * * * * * * * * * * * * * * *
     * k_T: Índice de claridad horario (2.9.3) *
     * * * * * * * * * * * * * * * * * * * * * * * * * */

    const k_T = I / Io

    /* * * * * * * * * * * * * * * * * * * * * * * * * * *
     * I_d: Irradiación horaria difusa (2.10.1) en kWh/m² *
     * * * * * * * * * * * * * * * * * * * * * * * * * * */

    const I_d_param = (
        k_T <= 0.22 ?
            1 - 0.09 * k_T
        :
        k_T <= 0.80 ?
            0.9511 - 0.1604 * k_T + 4.388 * pow(k_T, 2)
            - 16.638 * pow(k_T, 3) + 12.336 * pow(k_T, 4)
        :
        0.165
    )

    const I_d = I_d_param * I

    /* * * * * * * * * * * * * * * * * * * * * * * * * * *
     * I_T: Irradiación horaria total (2.15.1) en kWh/m² *
     * * * * * * * * * * * * * * * * * * * * * * * * * * */

    const I_b = I - I_d

    const beam = I_b * R_b
    const diffuse = I_d * (1+cos(incl)) / 2

    const I_T = (beam + diffuse) // * 4/3

    return {
        angl: anguloHorario, n, decl: declinacion, hora_salida: anguloSalida, solar_acim: acimutSolar, cos_cenit: cosAnguloCenital, cenit: anguloCenital, cos_incid, incid, R_b, exce: excentricidad, H_o, angl_2: angulo2, angl_1: angulo1, I_o: Io, b, a, r_t, I, k_T, I_d_param, I_d, I_b, I_T}
}
