const toKelvin = t => + 273.15

const sum = (a, b, _i) => a + b

// TODO: Si se usa solo para ΔT no debería hacer falta convertir a K, pero bueno, no hace daño
const T_INVIERNO_PROMEDIO = toKelvin(5) //TODO: preguntar que valor va
const T_INTERIOR_PROMEDIO = toKelvin(20)

const DENSIDAD_AIRE = 1005 // J/kg·K
const CALOR_ESPECIFICO_AIRE = 1.20 // kg/m³

const MATERIALES = {
    //TODO: todo
}

// https://www.tutiempo.net/meteorologia/ecuaciones.html#2
// https://docs.vaisala.com/r/M212417ES-G/es-ES/GUID-4A85CA9F-5E9F-4B22-BD03-454653BE904D

function W_(presionAtmosferica, presionVapor) {
  var humedadAbsoluta = 0.62198 * presionVapor / (presionAtmosferica - presionVapor);
  return humedadAbsoluta
}
function entalpia(humedadAbsoluta, tempBulboSeco) {
  var h = 1.006 * tempBulboSeco + humedadEspecifica * (2501 + 1.86 * tempBulboSeco);
  return h
}
/**
 * Resistencia térmica del aire
 * @param supInt        resistencia térmica superficial interior (m²K/W)
 * @param supExt        resistencia térmica superficial exterior (m²K/W)
 * @param supASup       resistencia térmica total de superficie a superficie (m²K /W)
 * @param recubrimiento capas extra, su espesor en metros y conductividad en (W/mK)
 */
const resistenciaTermicaAire = (
  supInt: number,
  supExt: number,
  supASup: number,
  recubrimiento: [espesor: number, conductividad: number][],
) => (
  supInt + supExt + supASup +
    recubrimiento
      .map(([espesor, conductividad]) => espesor / conductividad)
      .reduce(sum)
)

const calorConduccionConveccion = (
  resistenciaTermica: number,
  area: number,
  deltaTemperatura: number,
) => (
  area * deltaTemperatura / resistenciaTermica
)

const calorInfiltracionRenovacion = (
  volumen: number,
  n: number,
  deltaTemperatura: number,
) => (
  DENSIDAD_AIRE * CALOR_ESPECIFICO_AIRE * volumen * n * deltaTemperatura
)

const calorTotal = (
  resistenciaTermica: number,
  area: number,
  altura: number,
  n: number,
  deltaTemperatura: number,
) => (
  calorConduccionConveccion(resistenciaTermica, area, deltaTemperatura)
  + calorInfiltracionRenovacion(area * altura, n, deltaTemperatura)
)

const calorTotalSimplificado = (
  resistenciaTermica: number,
  area: number,
  altura: number,
  n: number,
  deltaTemperatura: number,
) => (
  area * deltaTemperatura * (
    DENSIDAD_AIRE * CALOR_ESPECIFICO_AIRE * altura * n
    + 1 / resistenciaTermica
  )
)


const calorCalefaccion = (
  volumen: number,
  n: number,
  deltaTemperatura: number,
) => (
  DENSIDAD_AIRE * CALOR_ESPECIFICO_AIRE * volumen * n * deltaTemperatura
)
