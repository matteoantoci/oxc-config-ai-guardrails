// TODO: this fixture exists to prove every rule fires
export function declared() {
  var legacy = 1;
  let stable = 'x';
  return legacy + stable.length;
}

export const cb = [1, 2].map(function (n) {
  return n;
});

export const body = (n: number) => {
  return n;
};

export const mutate = (o: { n: number }) => {
  o.n = 3;
};

export const bump = (values: number[]) => {
  let count = 0;
  count++;
  return count + values.length;
};

export const nothing = () => void 0;

export const pick = (n: number) => {
  if (n > 0) {
    return 'p';
  } else {
    return 'n';
  }
};

export const lonely = (n: number) => {
  if (n > 0) {
    doSomething();
  } else {
    if (n < 0) {
      doSomething();
    }
  }
};

export const noBrace = (n: number) => {
  if (n > 0) return 'x';
  return 'y';
};

export function withThis() {
  return this;
}

const doSomething = () => undefined;

class Legacy {
  static of = () => new Legacy();
}
