import * as construccion from "./construccion.ts"
import * as psicro from "./psicro.ts"

export const PC_INFERIOR = {
    pino:  17875000,
    espar: 18124500,
    maiz:  16354500,
    m81:   16310250,
} 

function perdidaTotal(t1: number, t2: number) {
    return construccion.perdidaCondConv(t2-t1)
         + construccion.perdidaInfiltracionRenovacion(5, t2-t1)
}

/** kg/s */
export function masaPelet(calor: number, rendimiento: number, tipo: string) {
    return calor / (PC_INFERIOR[tipo] * (rendimiento / 100))
}

export function calorGenerado(
    humedadRelativa: number,
    tempBulboSeco1: number,
    tempBulboSeco2: number
) {
    return perdidaTotal(tempBulboSeco1, 
                        tempBulboSeco2) 
         + calorCalefaccion(construccion.volumen,
                            humedadRelativa, 
                            tempBulboSeco1, 
                            tempBulboSeco2)
}

export function calorCalefaccion(
    volumen: number,
    humedadRelativa: number,
    tempBulboSeco1: number,
    tempBulboSeco2: number,
) {
    const Patm = psicro.presionEnAltitud(104);
    const rho = psicro.densidadAire(Patm, tempBulboSeco1);
    const deltaH = psicro.deltaEntalpia(Patm, humedadRelativa, tempBulboSeco1, tempBulboSeco2);
    return deltaH * volumen * rho;
}

// NO USADO


// https://www.tutiempo.net/meteorologia/ecuaciones.html#2
//
// https://docs.vaisala.com/r/M212417ES-G/es-ES/GUID-4A85CA9F-5E9F-4B22-BD03-454653BE904D
