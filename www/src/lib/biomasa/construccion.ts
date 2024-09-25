import * as f from '../functional'

/*
 * const HABITACIONES = [
 *  [3.0, 2.5, 2.6], // dormitorio
 *  [4.5, 4.0, 2.6], // cocina - comedor
 *  [2.0, 1.5, 2.6], // baño
 *  [1.0, .82, 2.6], // hall acceso
 * ]
 */


/** 
 * Resistencia térmica de un elemento constructivo
 * @param supInt        (R_si) resistencia térmica superficial interior (m²K/W)
 * @param supExt        (R_se) resistencia térmica superficial exterior (m²K/W)
 * @param supASup       (R_t) resistencia térmica total de superficie a superficie (m²K /W)
 * @param recubrimiento (e, lambda) capas extra, su espesor en metros y conductividad en (W/mK)
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

// (K) Valores obtenidos de IRAM-11601 (2002)
export const TRANSMITANCIA_PARED = 1 / resistenciaTermica(
    0.13, 0.04, // Tabla 2
    0.46, // Tabla A.3 (Ladrillo cerámico portante de 18cm)
    [
        [0.02, 0.93],
        [0.02, 1.16],
    ],
)

export const TRANSMITANCIA_TECHO = 1 / resistenciaTermica(
    0.10, 0.04, // Tabla 2
    0, // Tabla A.3 (Ladrillo cerámico portante de 18cm)
    [
        [0.1, 0.93],
        [0.17, 0.35],
        [0.025, 0.70],
    ],
)

export const TRANSMITANCIA_PUERTA = 5.82
// Tabla A.5 Ventana corrediza marco y hoja de chapa doblada.
// Doble vidriado hermético compuesto por 2 vidrios comunes incoloros...
export const TRANSMITANCIA_VENTANA = 3.23

export const ancho = 8, 
             largo = 5.52,
             alto = 2.60;

export const VOL_BAÑO = 2 * 1.5 * alto
export const VOL_LIVING = 4.5 * 4 * alto
export const VOL_DORMI = 3 * 2.5 * alto

export const REV_BAÑO = 1.5
export const REV_LIVING = 2
export const REV_DORMI = 1.5

export const VOLUMEN = VOL_BAÑO + VOL_LIVING + VOL_DORMI

export const PUERTAS: [number, number][] = [
    [0.90, 2.05], // Puerta exterior
    [0.80, 2.05], // Puerta ventana exterior
]

export const VENTANAS: [number, number][] = [
    [1.00, 2.05], // Ventana dormitorio (exterior)
    [0.60, 1.10], // Ventana cocina (exterior)
    [0.60, 1.25], // Ventana baño (exterior)
    [2.50, 2.05], // Ventana Living doble hoja (exterior)
]

export const AREA_PUERTAS = PUERTAS.reduce(
    (total, [ancho, alto]) => (
        total + ancho * alto
    ), 0
)
export const AREA_VENTANAS = VENTANAS.reduce(
    (total, [ancho, alto]) => (
        total + ancho * alto
    ), 0
)
export const AREA_PARED = 2 * (ancho + largo) * alto - AREA_PUERTAS - AREA_VENTANAS // TODO: revisar esto
export const AREA_TECHO = 33.05
