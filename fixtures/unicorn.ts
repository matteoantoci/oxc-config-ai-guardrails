const names = ['a', 'b', 'c'];

export const last = (values: number[]) => values[values.length - 1];

export const tail = (values: number[]) => values.slice(values.length - 2);

export const firstBig = (values: number[]) => values.filter((n) => n > 2)[0];

export const wrapped = (values: number[]) => values.map((n) => [n]).flat();

export const hasThree = (values: number[]) => values.indexOf(3) !== -1;

export const known = (name: string) => names.includes(name);

export const safe = () => {
  try {
    return JSON.parse('{}');
  } catch (error) {
    return undefined;
  }
};

export const boom = () => {
  throw Error('boom');
};

export const nonEmpty = (values: number[]) => {
  if (values.length) {
    return true;
  }
  return false;
};

export const copied = [...[3, 4]];
