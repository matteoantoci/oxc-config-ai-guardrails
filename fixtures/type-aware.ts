/** @deprecated use freshCall */
export const legacyCall = () => 'legacy';

export const freshCall = () => 'fresh';

const load = async () => 'payload';

export const floating = () => {
  load();
};

export const misused = (run: () => Promise<void>) => {
  [1, 2].filter(async () => {
    await run();
    return true;
  });
};

export const awaited = async (value: string) => await value;

export const alwaysTruthy = (value: string) => {
  if (value !== undefined) {
    return value;
  }
  return '';
};

export const useless = (value: string) => value as string;

export const coalesce = (value: string | undefined) => (value ? value : 'fallback');

export const chained = (thing?: { id?: string }) => thing && thing.id && thing.id.length;

export const deprecated = () => legacyCall();

export const asserted = (value: string) => value as unknown as number;

type Kind = 'a' | 'b' | 'c';

export const byKind = (kind: Kind) => {
  switch (kind) {
    case 'a':
      return 1;
    case 'b':
      return 2;
  }
  return 0;
};

const untyped = JSON.parse('{}');

export const unsafeAssignment = () => {
  const value = untyped;
  return value;
};

const takesString = (value: string) => value.length;

export const unsafeArgument = () => takesString(untyped);

export const impliedEval = () => setTimeout('doStuff()', 0);

export const unsafeMember = () => untyped.name;

export const unsafeCall = () => untyped();

export const unsafeReturn = (): string => untyped;
