export function getNumericalOptions(optionsLength: number, omitList: number[]) {
  return Array.from({ length: optionsLength + 1 }, (_, i) => {
    if (i === 0) {
      return { text: '-', value: null };
    } else {
      return { text: String(i), value: i };
    }
  }).filter(option => !omitList.includes(option.value));;
}