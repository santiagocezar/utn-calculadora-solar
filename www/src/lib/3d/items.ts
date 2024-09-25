import microondasModel from './models/microondas.obj?url'
import lavarropasModel from './models/lavarropas.obj?url'
import tvModel from './models/tv.obj?url'

import sillonModel from './models/sillon.obj?url'
import muebleTvModel from './models/mueble-tv.obj?url'
import mesaModel from './models/mesa.obj?url'

export interface Item {
    url: string;
    position: [number, number, number];
    rotation: [number, number, number];
}

export interface ElectricItem extends Item {
    wattage: number;
}

export const items: Record<string, ElectricItem> = {
    microondas: {
        url: microondasModel,
        wattage: 2,
        position: [2750, 1100, 4500],
        rotation: [0, 180, 0],
    },
    lavarropas: {
        url: lavarropasModel,
        wattage: 2,
        position: [1940, 200, 4600],
        rotation: [0, 90, 0],
    },
    tv: {
        url: tvModel,
        wattage: 2,
        position: [4500, 700, 1400],
        rotation: [0, -90, 0],
    },
} as const

export const cosmeticItems: Record<string, Item> = {
    sillon: {
        url: sillonModel,
        position: [150, 200, 3500],
        rotation: [0, 90, 0],
    },
    muebleTv: {
        url: muebleTvModel,
        position: [4600, 200, 1250],
        rotation: [0, -90, 0],
    },
    mesa: {
        url: mesaModel,
        position: [2000, 200, 2300],
        rotation: [0, 0, 0],
    },
} as const
