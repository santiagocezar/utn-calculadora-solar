const toKelvin = t => + 273.15

// TODO: Si se usa solo para ΔT no debería hacer falta convertir a K, pero bueno, no hace daño
const T_INVIERNO_PROMEDIO = toKelvin(5) //TODO: preguntar que valor va
const T_INTERIOR_PROMEDIO = toKelvin(20)


const MATERIALES = {
    //TODO: todo
}

/**
 * La transmitancia térmica de un elemento constructivo.
 * @param supInt        resistencia térmica superficial interior (m²K/W)
 * @param supExt        resistencia térmica superficial exterior (m²K/W)
 * @param supASup       resistencia térmica total de superficie a superficie (m²K /W)
 * @param espesor       espesor (m)
 * @param conductividad conductividad térmica (W/mK)
 */
const transmitanciaTermica =
    (supInt: number, supExt: number, supASup: number, espesor: number, conductividad: number) =>
        supInt + supExt + supASup
        + espesor / conductividad //TODO: esto ultimo es una sumatoria de no se que
