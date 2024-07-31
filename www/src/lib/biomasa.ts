import * as f from './functional'

/*
const HABITACIONES = [
  [3.0, 2.5, 2.6], // dormitorio
  [4.5, 4.0, 2.6], // cocina - comedor
  [2.0, 1.5, 2.6], // baño
  [1.0, .82, 2.6], // hall acceso
]
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
  .reduce(sum)
)

// Valores obtenidos de IRAM-11601 (2002)
const transmitancias = {
  [Limite.Pared]: 1 / resistenciaTermica(
    0.13, 0.04, // Tabla 2
    0.22, // Tabla A.2 (Hormigón)
  [],
  ),
  [Limite.Puerta]: 1, // Ni idea...
  [Limite.Ventana]: 5.00, // Tabla A.5 (Vidrio incoloro común con cortinas) internas
}

function perdidaCondConv(t1: number, t2: number) {
  const ancho = 8, largo = 5.52, alto = 2.60
  
  const aperturas: [Limite, number, number][] = [
    [Limite.Puerta,  0.90, 2.05], // Puerta exterior
    [Limite.Puerta,  0.80, 2.05], // Puerta ventana exterior
    [Limite.Ventana, 1.00, 2.05], // Ventana dormitorio (exterior)
    [Limite.Ventana, 0.60, 1.10], // Ventana cocina (exterior)
    [Limite.Ventana, 0.60, 1.25], // Ventana baño (exterior)
    [Limite.Ventana, 2.50, 2.05], // Ventana Living doble hoja (exterior)
  ]
  
  const aperturaConAreas = aperturas
    .map(([tipo, ancho, alto]) => [tipo, ancho * alto]  [const])
  
    const a = aperturaConAreas.map(f.get(1))
  const areaParedes = 2 * (ancho + largo) * alto
    - aperturaConAreas
      .map(f.get(1))
      .reduce(f.sum)
  
  const deltaT = t2 - t1
  return deltaT * (
    areaParedes * transmitancias[Limite.Pared]
    + aperturaConAreas
      .map(([tipo, area]) => area * transmitancias[tipo])
      .reduce(f.sum)
  )
}




const K = 273.15

/**
 * Densiadad del aire seco [kg/m³]
 * @param Patm Presión atmosférica [Pa]
 * @param t Temperatura de bulbo seco [°C]
 */
export function densidadAire(Patm: number, t: number) {
  return Patm / (287.05 * (t + K));
}

/**
 * Presión atmosférica para una altura sobre el nivel del mar [Pa]
 * @param altura Altura sobre el nivel del mar [m]
 */
export function presionEnAltitud(altura: number){
  if (altura < -500 || altura > 11000) throw new Error('Valor')

  return 101325 * Math.pow(1 - 0.0000225577 * altura, 5.2559);
}

/**
 * Presión de vapor acuoso a cierta temperatura [Pa]
 * @param t Temperatura de bulbo seco [°C]
 */
function presionVaporDeSaturación(t: number) {
  if (t < -60 || t > 200) throw new Error('La temperatura tiene que estar entre -60ºC y 200ºC');

  // Temperatura en kelvin
  const tK = t + K;

  if (t >= 0) {
    // Presión de vapor acuoso de agua a temperatura t [Pa]
    const b_1 = -5800.2206;
    const b0 = 1.3914993;
    const b1 = -0.048640239;
    const b2 = 0.000041764768;
    const b3 = -1.4452093e-8;
    const b4 = 6.5459673;
    return Math.exp(
      b_1 / tK + b0 + b1 * tK + b2 * tK * tK + b3 * tK * tK * tK + b4 * Math.log(tK)
    )
  } else {
    // Presión de vapor acuoso de hielo a temperatura t [Pa]
    const a0 = -5674.5359;
    const a1 = 6.3925247;
    const a2 = -0.009677843;
    const a3 = 6.2215701e-7;
    const a4 = 2.0747825e-9;
    const a5 = -9.484024e-13;
    const a6 = 4.1635019;
    return Math.exp(
      a0 / tK + a1 + a2 * tK + a3 * tK * tK + a4 * tK * tK * tK + a5 * tK * tK * tK * tK + a6 * Math.log(tK)
    )
  }
}

/**
 * Presión de vapor a cierta temperatura y humedad [Pa]
 * @param t Temperatura de bulbo seco [°C]
 * @param humRel Humedad relativa [sin unidad]
 */
export function presionVapor(t: number, humRel: number) {
  var Psat = presionVaporDeSaturación(t);
  var presionVapor = humRel * Psat;
  return presionVapor
}


export function humedadAbsoluta(presionAtmosferica: number, presionVapor: number) {
  var w = 0.62198 * presionVapor / (presionAtmosferica - presionVapor);
  return w
}
export function entalpia(ratioVaporAire: number, tempBulboSeco: number) {
  var h = 1.006 * tempBulboSeco + ratioVaporAire * (2501 + 1.86 * tempBulboSeco);
  return h
}

export function deltaEntalpia(
  Patm: number,
  humedadRelativa: number,
  tempBulboSeco1: number,
  tempBulboSeco2: number,
) {
  const omega = humedadAbsoluta(Patm, presionVapor(tempBulboSeco1, humedadRelativa)) / 1000;
  return entalpia(omega, tempBulboSeco2) - entalpia(omega, tempBulboSeco1);
}

export function calorCalefaccion(
  Patm: number,
  volumen: number,
  humedadRelativa: number,
  tempBulboSeco1: number,
  tempBulboSeco2: number,
) {
  const rho = densidadAire(Patm, tempBulboSeco1);
  const deltaH = deltaEntalpia(Patm, humedadRelativa, tempBulboSeco1, tempBulboSeco2);
  return deltaH * volumen * rho;
}

// NO USADO



// TODO: Si se usa solo para ΔT no debería hacer falta convertir a K, pero bueno, no hace daño
const T_INVIERNO_PROMEDIO = 5 + K; //TODO: preguntar que valor va
const T_INTERIOR_PROMEDIO = 20 + K;

// const DENSIDAD_AIRE = 1005 // J/kg·K
const CALOR_ESPECIFICO_AIRE = 1.20 // kg/m³

const MATERIALES = {
    //TODO: todo
}

// https://www.tutiempo.net/meteorologia/ecuaciones.html#2
//
// https://docs.vaisala.com/r/M212417ES-G/es-ES/GUID-4A85CA9F-5E9F-4B22-BD03-454653BE904D

console.log(deltaEntalpia(presionEnAltitud(104), 60, 12, 20))

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
