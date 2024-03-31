import { irradiacionTotal } from './solar.js'

irradiacionTotal

/**
 * @param {Event} ev
 */
function calcular(ev) {
    ev.preventDefault()

    const data = new FormData(ev.target)

    const
        latitud = parseFloat(data.get("latitud")),
        longitud = parseFloat(data.get("longitud")),
        zona = parseInt(data.get("zona")),
        inclinacion = data.get("inclinacion"),
        acimut = parseFloat(data.get("acimut")),
        cantidad = parseInt(data.get("cantidad")),
        superficie = parseFloat(data.get("superficie")),
        eficienciaPanel = parseFloat(data.get("efiPanel")) / 100,
        eficienciaInversor = parseFloat(data.get("efiInversor")) / 100;


    const { IT } = irradiacionTotal(
        latitud, longitud, zona, inclinacion, acimut,  12, 6
    )

    const eficienciaInstalacion = .90 // fija

    const superficieTotal = cantidad * superficie

    const generacionTotal = IT * superficieTotal * eficienciaPanel * eficienciaInversor * eficienciaInstalacion

    alert(`${generacionTotal} kWh`)
}


document.getElementById("solar-form").addEventListener("submit", calcular)
