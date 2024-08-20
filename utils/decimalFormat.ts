const checkDecimalStringFormat = (decimalString: string, precision: number, scale: number) => {
  const regex = /^$|^\d+(\.\d*)?$/;
  const [integerPart, fractionalPart] = decimalString.split('.');
  if (
    integerPart.length > precision - scale ||
    (fractionalPart && fractionalPart.length > scale) ||
    !regex.test(decimalString)
  )
    return false;
  return true;
};

export default checkDecimalStringFormat;
