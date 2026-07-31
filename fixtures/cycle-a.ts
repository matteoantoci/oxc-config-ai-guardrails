import { fromB } from './cycle-b';

export const fromA = () => `a${fromB}`;
