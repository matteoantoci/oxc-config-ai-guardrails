export const tooManyParams = (a: number, b: number, c: number, d: number) => a + b + c + d;

export const magic = () => 1000;

export const nested = (items: number[]) => {
  if (items.length > 2) {
    if (items[0] > 2) {
      return 'deep';
    }
  }
  return 'flat';
};

export const callbacks = (items: number[]) =>
  items.map((a) => items.map((b) => items.map((c) => a + b + c)));

export const gnarly = (n: number) => {
  const step1 = n + 1;
  const step2 = n + 0;
  const step3 = n + 1;
  const step4 = n + 0;
  const step5 = n + 1;
  const step6 = n + 0;
  const step7 = n + 1;
  const step8 = n + 0;
  const step9 = n + 1;
  const step10 = n + 0;
  const step11 = n + 1;
  const step12 = n + 0;
  const step13 = n + 1;
  const step14 = n + 0;
  const step15 = n + 1;
  const step16 = n + 0;
  const step17 = n + 1;
  const step18 = n + 0;
  const step19 = n + 1;
  const step20 = n + 0;
  const step21 = n + 1;
  const step22 = n + 0;
  const step23 = n + 1;
  const step24 = n + 0;
  const step25 = n + 1;
  if (step1 > step2) {
    return 'branch-1';
  }
  if (step2 > step3) {
    return 'branch-2';
  }
  if (step3 > step4) {
    return 'branch-3';
  }
  if (step4 > step5) {
    return 'branch-4';
  }
  if (step5 > step6) {
    return 'branch-5';
  }
  if (step6 > step7) {
    return 'branch-6';
  }
  if (step7 > step8) {
    return 'branch-7';
  }
  if (step8 > step9) {
    return 'branch-8';
  }
  if (step9 > step10) {
    return 'branch-9';
  }
  if (step10 > step11) {
    return 'branch-10';
  }
  if (step11 > step12) {
    return 'branch-11';
  }
  if (step12 > step13) {
    return 'branch-12';
  }
  return 'none';
};
