// @ts-ignore
export const ignored: number = 'text';

// @ts-expect-error
export const undescribed: number = 'text';

// @ts-expect-error: the fixture must assign a string to a number
export const described: number = 'text';

// oxlint-disable-next-line
export const blanket = eval('1');

// eslint-disable-next-line no-eval
export const named = eval('2');
