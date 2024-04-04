function comparar<T extends Record<string, number>>
    (nombre: string, variable: keyof T, valores: T, valor_esperado: number): void
