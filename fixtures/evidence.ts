// Deliberate violations of the evidence rules. Do not copy.
declare const vi: { mock: (path: string) => void; doMock: (path: string) => void };
declare const jest: { mock: (path: string) => void };
declare const owner: { name: string };
declare const operation: (value: string) => string;

// no-restricted-properties
export const reflected = Reflect.get(owner, 'name');
export const applied = Reflect.apply(operation, owner, ['x']);

vi.mock('./user-store');
vi.doMock('./config-store');
jest.mock('./legacy-store');

// typescript/no-restricted-types
export const save = (value: object) => value;
export type Metadata = Record<string, unknown>;
export type Loose = Record<string, any>;

// typescript/consistent-indexed-object-style
export type Dictionary = { [key: string]: string };

// typescript/no-empty-object-type
export type Empty = {};
