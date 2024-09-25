import * as casa from "./construccion"
import * as psicro from "./psicro"

export const PC_INFERIOR = {
    pino:  16530000, // TODO: ANTES 17875000 revisar
    espar: 18124500,
    maiz:  16354500,
    m81:   16310250,
} 

/**
 * (Q̇_c) Perdidas por conducción y convección, en W
 */
export function perdidaCondConv(deltaT: number) {
    // Da 696.634 pero debería dar 696.478
    const Qm = casa.TRANSMITANCIA_PARED * casa.AREA_PARED * deltaT
    const Qv = casa.TRANSMITANCIA_VENTANA * casa.AREA_VENTANAS * deltaT
    const Qp = casa.TRANSMITANCIA_PUERTA * casa.AREA_PUERTAS * deltaT
    const Qt = casa.TRANSMITANCIA_TECHO * casa.AREA_TECHO * deltaT

    const Qtotal = 1.1 * (Qm + Qv + Qp + Qt)

    console.log({Qtotal})

    return Qtotal
}

/** W */
export function perdidaInfiltracionRenovacion(
    deltaT: number,
) {
    const C = CALOR_ESPECIFICO_AIRE * DENSIDAD_AIRE / 3600
    const Qbaño = C * deltaT * casa.VOL_BAÑO * casa.REV_BAÑO;
    const Qliving = C * deltaT * casa.VOL_LIVING * casa.REV_LIVING;
    const Qdormi = C * deltaT * casa.VOL_DORMI * casa.REV_DORMI;

    const Qinf = Qbaño + Qliving + Qdormi
    console.log({Qinf})
    return Qinf
}

/** J/kg K */
export const CALOR_ESPECIFICO_AIRE = 1005
/** kg/m³ */
export const DENSIDAD_AIRE = 1.20

function perdidaTotal(deltaT: number) {
    return perdidaCondConv(deltaT) + perdidaInfiltracionRenovacion(deltaT)
}

/**
 * Calor necesario para calentar el aire de la vivienda en J
 */
export function calorCalefaccion(
    volumen: number,
    humedadRelativa: number,
    tempBulboSeco1: number,
    tempBulboSeco2: number,
) {
    const Patm = psicro.presionEnAltitud(0);
    const rho = psicro.densidadAire(Patm, tempBulboSeco1);
    const deltaH = psicro.deltaEntalpia(Patm, humedadRelativa, tempBulboSeco1, tempBulboSeco2);
    const Qc = deltaH * volumen * rho
    console.log({Qc})
    return Qc;
}

/** kg/s */
export function masaPelet(calor: number, rendimiento: number, tipo: keyof typeof PC_INFERIOR) {
    return calor / (PC_INFERIOR[tipo] * (rendimiento / 100))
}

export function calorGenerado(
    humedadRelativa: number,
    tempBulboSeco1: number,
    tempBulboSeco2: number
) {

}

// 1820 W

// NO USADO


// https://www.tutiempo.net/meteorologia/ecuaciones.html#2
//
// https://docs.vaisala.com/r/M212417ES-G/es-ES/GUID-4A85CA9F-5E9F-4B22-BD03-454653BE904D
