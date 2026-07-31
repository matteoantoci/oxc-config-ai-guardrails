import * as path from 'node:path';
import { join } from 'node:path';
export let mutable = 'a';
import { sep } from 'node:path';

export const p = path.join(sep, 'a') + join('b', 'c') + mutable;
