import { Thing } from './types';

export interface Handler {
  run(): void;
}

export const anyish = (value: any) => value;

export const bang = (thing?: Thing) => thing!.id;
