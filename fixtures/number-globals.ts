export const invalid = (value: number) => isNaN(value) || !window.isFinite(value);

export const squared = (value: number) => Math.pow(value, 2);
