export const scan = async (items: string[], record: Record<string, string>) => {
  outer: for (const item of items) {
    if (item === '') {
      continue outer;
    }
    await Promise.resolve(item);
  }

  const keys: string[] = [];
  for (const key in record) {
    keys.push(record[key]);
  }

  const fns: (() => number)[] = [];
  for (var index = 0; index < items.length; index += 1) {
    fns.push(() => index);
  }

  return { keys, fns };
};
