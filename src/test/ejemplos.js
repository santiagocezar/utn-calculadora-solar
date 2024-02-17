import { irradiacion_total } from "../solar.js"

function comparar(nombre, valores, valores_esperados, referenciaDefault = null) {
    // Título
    console.log(`
\x1b[1m=== \x1b[1;34m${nombre}:\x1b[0m`)

    for (const variable in valores_esperados) {
        let valor_esperado = valores_esperados[variable]
        let referencia = referenciaDefault
        if (Array.isArray(valor_esperado)) {
            valor_esperado = valor_esperado[0];
            referencia = valor_esperado[1];
        }

        const valor = valores[variable]

        // Error absoluto
        const error = valor - valor_esperado

        // Error relativo 0-100%
        const errorRel = Math.abs(error / (referencia ?? valor_esperado)) * 100


        const verde = '0:255:0m'
        const amarillo = '255:255:0m'
        const naranja = '255:165:0m'
        const rojo = '255:0:0m'

        // Para mostrar la diferencia un signo colorido
        const signo = error < 0
            ? '\x1b[0;31m-\x1b[0m'
            : '\x1b[0;32m+\x1b[0m'

        // <5% Verde, <10% Amarillo, <50% Naranja y el resto rojo
        const color =
            errorRel < 5 ? '\x1b[38:2:' + verde :
            errorRel < 10 ? '\x1b[38:2:' + amarillo :
            errorRel < 50 ? '\x1b[38:2:' + naranja :
            '\x1b[38:2:' + rojo

        // Lo mismo
        const bgColor =
            errorRel < 5 ? '\x1b[48:2:' + verde:
            errorRel < 10 ? '\x1b[48:2:' + amarillo:
            errorRel < 50 ? '\x1b[48:2:' + naranja:
            '\x1b[48:2:' + rojo

        console.log(`
  \x1b[1m${variable} esperado:\x1b[0m ${valor_esperado}
  \x1b[1m${variable} obtenido:\x1b[0m ${valores[variable]}

  ${bgColor}  \x1b[0m \x1b[1mε = ${color}${errorRel.toFixed(2)}%\x1b[0m
  ${bgColor}  \x1b[0m \x1b[1mΔ = ${signo}${Math.abs(error)}\x1b[0m`)
    }
}

const d2r = a => a * Math.PI / 180

comparar(
    "Irradiación total en San Francisco al mediodía en verano",
    irradiacion_total(
        d2r(-31.417),
        d2r(-31.417),
        Math.PI,
        12,
        0
    ),
    {"I_T":1}
)


comparar(
    "Ejemplo 1.6.1",
    irradiacion_total(
        d2r(43),
        d2r(45),
        d2r(15),
        10.5,
        1
    ),
    {"incid":d2r(-14)},
    Math.PI
)

comparar(
    "Ejemplo 1.6.2, Ángulo cenital",
    irradiacion_total(
        d2r(43),
        NaN,
        NaN,
        9.5,
        1
    ),
    {
        angl: d2r(-37.5),
        decl: d2r(-14),
        cos_centi: [0.398, 2],
        cenit: d2r(-66.5)
    },
    Math.PI
)

comparar(
    "Ejemplo 1.10.1",
    irradiacion_total(
        43 * Math.PI / 180,
        43 * Math.PI / 180,
        Math.PI,
        12,
        3
    ),
    {
        "H_o": 33.8 / 3.6 // para pasar a kWh
    }
)
