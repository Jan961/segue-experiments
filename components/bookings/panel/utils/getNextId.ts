export const getNextId = (sorted: any[], current: number) => {
  let found = false;

  for (const b of sorted) {
    if (found) return b.Id;
    if (current === b.Id) found = true;
  }
  return undefined;
};
