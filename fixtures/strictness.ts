// Deliberate violations of the strictness rules. Do not copy.

// eqeqeq
export const loose = (a: number, b: number) => a == b;

// no-throw-literal
export const fail = () => {
  throw 'boom';
};

// array-callback-return
export const lengths = (values: string[]) =>
  values.map((value) => {
    console.log(value);
  });

// no-fallthrough
export const describeKind = (kind: number) => {
  switch (kind) {
    case 1:
      console.log('one');
    case 2:
      return 'two';
    default:
      return 'other';
  }
};

// no-nested-ternary
export const grade = (score: number) => (score > 90 ? 'a' : score > 50 ? 'b' : 'c');

// promise/prefer-await-to-then
export const next = (pending: Promise<number>) => pending.then((value) => value + 1);

// promise/no-multiple-resolved: proves the promise plugin loads its category rules
export const settle = () =>
  new Promise<number>((resolve) => {
    resolve(1);
    resolve(2);
  });
