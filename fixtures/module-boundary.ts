type Double = (value: number) => number;

const helper = (value: number) => value * 2;

export const untyped = (value: number) => helper(value);

export const unknownArgument = (value): number => value;

export const typed: Double = (value) => value * 2;
