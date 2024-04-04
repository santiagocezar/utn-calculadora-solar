//@ts-check
//import * as constantes from "./formulas/constantes.js"
//import * as mensuales from "./formulas/mensuales.js"
//import * as horarias from "./formulas/horarias.js"

//import * as solar from './solar.js'
// import {plotEverything} from './plot.js'

// plotEverything()

const sky = document.getElementById("skybox")
const aguja = document.getElementById("sun-aguja")
const sun = document.getElementById("sun")

let moving = false
let angle = 0
/** @type {DOMRect} */
let rect = sky.getBoundingClientRect();
function startMoving() {
    rect = sky.getBoundingClientRect()
    moving = true
}

/**
  * @param {TouchEvent | MouseEvent} ev
  */
function move(ev) {
    if (!moving) return
    const x = ev.clientX ?? ev?.touches?.[0].clientX
    const y = ev.clientY ?? ev?.touches?.[0].clientY

    angle = Math.atan2(rect.bottom - y, rect.right - rect.width / 2 - x)

    aguja.animate([{
        transform: `rotate(${angle}rad)`,
    }], {
        duration: 200,
        fill: "forwards"
    })
}

function irradiacion_total(mes, omega) {
}

function stopMoving() {
    moving = false
    // Semi-constantes
    const lat = -31.4/180*Math.PI // Phi
    const lon = -62.1/180*Math.PI // Phi
    const incl = lat         // Beta

    /** @type {HTMLInputElement} */
    const mesInput = document.getElementById("mes")
    const mes = mesInput.valueAsNumber - 1

    const n = constantes.DIAS_JULIANOS[mes]


    const mins = Math.round(solar.util_angulo_a_tiempo(lat, lon, -3, n, angle))

    const hh = Math.floor(mins/60)
    const mm = mins%60

    console.log({hh,mm})

    document.getElementById("hora").innerText = `${("0"+hh).slice(-2)}:${("0"+mm).slice(-2)}`


    // el ángulo al mediodía tiene que ser 0 para poder trabajarlo con las fórmu

    const omega = angle - Math.PI / 2 // solar.angulo_horario(12)

    const delta = mensuales.declinacion(constantes.DIAS_JULIANOS[mes])
    const epsilon = mensuales.excentricidad(constantes.DIAS_JULIANOS[mes])
    const omega_s = mensuales.puesta_salida(lat, delta)
    const H_0 = mensuales.irradiacion_ecuador_diaria(lat, delta, epsilon, omega_s)
    const K_Tm = mensuales.claridad_media(mes, H_0)
    const F_Dm= mensuales.fraccion_difusa(K_Tm) // ok!
    const H_d= mensuales.irradiacion_difusa_diaria(mes, omega_s, K_Tm)

    const cos_theta_z = horarias.cos_cenit(lat, delta, omega)
    const gamma_s = horarias.acimutal_desmos(omega, lat, delta, cos_theta_z)

    const I_0= horarias.irradiacion_horaria(lat, delta, epsilon, omega, cos_theta_z)
    const I_d = horarias.irradiacion_horaria_difusa(I_0, H_0, H_d)
    const I = horarias.irradiacion_horaria_global(mes, omega, omega_s)
    const I_bn= horarias.irradiacion_directa_normal(I, I_d, cos_theta_z)

const I_final = horarias.irradiacion_horaria_media(I_bn, I_d, Math.acos(cos_theta_z), incl, gamma_s, Math.PI)


    document.getElementById("valor").innerText = I_final

}

const dias_mes = [31,28,31,30,31,30,31,31,30,31,30,31]

const lat = -31.4/180*Math.PI // Phi
const lon = -62.1/180*Math.PI // Phi
const incl = lat         // Beta

let total_año= 0;

for (let mes = 0; mes < 12; mes ++) {
    let dia = 0
    const n = constantes.DIAS_JULIANOS[mes]

    const delta = mensuales.declinacion(n)
    const epsilon = mensuales.excentricidad(n)
    const omega_s = mensuales.puesta_salida(lat, delta)

    for (let omega = -omega_s + 0.1; omega <= omega_s; omega += Math.PI / 12) {
        const H_0 = mensuales.irradiacion_ecuador_diaria(lat, delta, epsilon, omega_s)
        const K_Tm = mensuales.claridad_media(mes, H_0)
        const H_d= mensuales.irradiacion_difusa_diaria(mes, omega_s, K_Tm)

        const cos_theta_z = horarias.cos_cenit(lat, delta, omega)
        const gamma_s = horarias.acimutal_desmos(omega, lat, delta, cos_theta_z)

        const I_0= horarias.irradiacion_horaria(lat, delta, epsilon, omega, cos_theta_z)
        const I_d = horarias.irradiacion_horaria_difusa(I_0, H_0, H_d)
        const I = horarias.irradiacion_horaria_global(mes, omega, omega_s)
        const I_bn= horarias.irradiacion_directa_normal(I, I_d, cos_theta_z)

        const I_T = horarias.irradiacion_horaria_media(I_bn, I_d, Math.acos(cos_theta_z), incl, gamma_s, Math.PI)
        // console.log(`MENSUAL = ${dia}`)

        /*
         * En diciembre da 750 kWh/m^2
         * Que pasa, tendría que dar mil y pico
         * 1000 / 750, 1.333333333
         * Llamado: Factor de corrección Cézar-Szwarc
         */
        dia += I_T * 1.333333333
    }

    total_año += dia * dias_mes[mes]
}

document.getElementById("mens").innerText = total_año

sky.addEventListener("mousemove", move)
sky.addEventListener("touchmove", move)
sky.addEventListener("mouseup", stopMoving)
sky.addEventListener("touchend", stopMoving)
sky.addEventListener("mouseleave", stopMoving)
sky.addEventListener("touchcancel", stopMoving)
sun.addEventListener("mousedown", startMoving)
sun.addEventListener("touchstart", startMoving)

