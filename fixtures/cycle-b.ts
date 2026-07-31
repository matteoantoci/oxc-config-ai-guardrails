import { fromA } from './cycle-a';

export const fromB = () => `b${fromA}`;
