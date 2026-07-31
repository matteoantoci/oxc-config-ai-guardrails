// Fixture: proves the shipped test-file overrides relax the strict rules here.
export class TestDouble {
  value = 9999;
}


export const notRelaxed = () => {
  let untouched = 'prefer-const still applies here';
  return untouched;
};
export const seeded = () => {
  const first = 4242;
  const second = 7777;
  return first + second;
};

export const loose = (value: any) => value!.length;
