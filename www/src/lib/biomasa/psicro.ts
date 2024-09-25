const K = 273.15

function memoize<P extends any[], R>(fn: (...p: P) => R) {
    const cache = new Map<string, R>()
    return function (...args: P): R {
        const key = args.join(",")
        let v: R | undefined
        if (v = cache.get(key)) return v;
        v = fn(...args)
        cache.set(key, v)
        return v
    }
}

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
