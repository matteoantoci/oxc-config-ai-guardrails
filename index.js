import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const configsDir = join(dirname(fileURLToPath(import.meta.url)), 'configs');

const load = (name) => JSON.parse(readFileSync(join(configsDir, `${name}.json`), 'utf8'));

export const base = load('base');
export const typescript = load('typescript');
export const react = load('react');
export const oxfmt = load('oxfmt');

export default { base, typescript, react, oxfmt };
