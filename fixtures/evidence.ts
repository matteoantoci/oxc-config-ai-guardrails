// Deliberate violations of the evidence rules. Do not copy.
declare const jest: { mock: (path: string) => void; retryTimes: (count: number) => void };
declare const page: { waitForTimeout: (ms: number) => Promise<void> };
declare const owner: { name: string };
declare const operation: (value: string) => string;

// no-restricted-properties
export const reflected = Reflect.get(owner, 'name');
export const applied = Reflect.apply(operation, owner, ['x']);

jest.mock('./legacy-store');
jest.retryTimes(3);
export const waited = () => page.waitForTimeout(1000);

// typescript/no-restricted-types
export const save = (value: object) => value;
export type Metadata = Record<string, unknown>;
export type Loose = Record<string, any>;

// typescript/consistent-indexed-object-style
export type Dictionary = { [key: string]: string };

// typescript/no-empty-object-type
export type Empty = {};
