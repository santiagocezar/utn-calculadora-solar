import { irradiacion_total } from "./solar.js"

const cantidadPaneles = 12 // cambiable
const superficiePorPanel = 1.653*0.992 // tecnica

const eficienciaPanel = .1515 // tecnica
const eficienciaInversor = .98 // tecnica

const eficienciaInstalacion = .90 // fija

const superficie = cantidadPaneles * superficiePorPanel

const I_T = 1 // irradiacion_total()

const generacionTotal = I_T * superficie * eficienciaPanel * eficienciaInversor * eficienciaInstalacion
console.log({superficie,generacionTotal})
