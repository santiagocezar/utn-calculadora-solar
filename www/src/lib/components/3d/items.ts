import microondasModel from './microondas.obj?url'

export interface Item {
    url: string;
    wattage: number;
    position: [number, number, number];
    rotation: [number, number, number];
}

export const items: Record<string, Item> = {
    microondas: {
        url: microondasModel,
        wattage: 2,
        position: [0, 0, 0],
        rotation: [0, 0, 0],
    }
} as const
