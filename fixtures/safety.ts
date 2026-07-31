export const runEval = (source: string) => eval(source);

export const built = () => new Function('a', 'return a');

export const link = 'javascript:void 0';
