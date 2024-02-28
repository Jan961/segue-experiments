export function getNumericalOptions(optionsLength: number) {
  return Array.from({ length: optionsLength }, (_, i) => {
    if (i === 0) {
      return { text: '-', value: null };
    } else {
      return { text: String(i), value: i };
    }
  });
}