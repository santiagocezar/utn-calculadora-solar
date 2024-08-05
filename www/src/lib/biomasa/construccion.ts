import * as f from '../functional'

/** J/kg K */
const CALOR_ESPECIFICO_AIRE = 1005
/** kg/m³ */
const DENSIDAD_AIRE = 1.20

/*
 * const HABITACIONES = [
 *  [3.0, 2.5, 2.6], // dormitorio
 *  [4.5, 4.0, 2.6], // cocina - comedor
 *  [2.0, 1.5, 2.6], // baño
 *  [1.0, .82, 2.6], // hall acceso
 * ]
 */
enum Limite {
    Pared, Puerta, Ventana
}


/** 
 * Resistencia térmica de un elemento constructivo
 * @param supInt        resistencia térmica superficial interior (m²K/W)
 * @param supExt        resistencia térmica superficial exterior (m²K/W)
 * @param supASup       resistencia térmica total de superficie a superficie (m²K /W)
 * @param recubrimiento capas extra, su espesor en metros y conductividad en (W/mK)
 */
const resistenciaTermica = (
    supInt: number,
    supExt: number,
    supASup: number,
    recubrimiento: [espesor: number, conductividad: number][],
) => (
    supInt + supExt + supASup +
    recubrimiento
    .map(([espesor, conductividad]) => espesor / conductividad)
    .reduce(f.sum, 0)
)

// Valores obtenidos de IRAM-11601 (2002)
const TRANSMITANCIA = {
    [Limite.Pared]: 1 / resistenciaTermica(
        0.13, 0.04, // Tabla 2
        0.22, // Tabla A.3 (Hormigón)
    [],
    ),
    [Limite.Puerta]: 1, // Ni idea...
    [Limite.Ventana]: 5.00, // Tabla A.5 (Vidrio incoloro común con cortinas) internas
}

export const ancho = 8, 
             largo = 5.52,
             alto = 2.60;
export const volumen = ancho * largo * alto

/** W */
export function perdidaCondConv(deltaT: number) {
    const aperturas: [Limite, number, number][] = [
        [Limite.Puerta,  0.90, 2.05], // Puerta exterior
        [Limite.Puerta,  0.80, 2.05], // Puerta ventana exterior
        [Limite.Ventana, 1.00, 2.05], // Ventana dormitorio (exterior)
        [Limite.Ventana, 0.60, 1.10], // Ventana cocina (exterior)
        [Limite.Ventana, 0.60, 1.25], // Ventana baño (exterior)
        [Limite.Ventana, 2.50, 2.05], // Ventana Living doble hoja (exterior)
    ]
    
    const aperturaConAreas = aperturas
    .map(([tipo, ancho, alto]) => [tipo, ancho * alto])
    
    const a = aperturaConAreas.map(f.get(1))
    const areaParedes = 2 * (ancho + largo) * alto
    - aperturaConAreas
    .map(f.get(1))
    .reduce(f.sum)
    
    return deltaT * (
        areaParedes * TRANSMITANCIA[Limite.Pared]
        + aperturaConAreas
        .map(([tipo, area]) => area * TRANSMITANCIA[tipo])
        .reduce(f.sum)
    ) * 1.1
}

/** W */
export function perdidaInfiltracionRenovacion(
    n: number,
    deltaTemperatura: number,
) {
    return (
        CALOR_ESPECIFICO_AIRE * deltaTemperatura * DENSIDAD_AIRE * (ancho * alto * largo) * n * (1 / 3600)
    )  
}
