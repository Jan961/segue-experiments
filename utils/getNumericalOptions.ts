function getNumericalOptions(optionsLength: number, omitList: number[]) {
  if (optionsLength <= 1) {
    return [{ text: '', value: null }];
  }

  return Array.from({ length: optionsLength }, (_, i) => {
    return { text: String(i + 1), value: i + 1 };
  }).filter((option) => !omitList.includes(option.value));
}

export default getNumericalOptions;