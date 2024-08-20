const checkDecimalStringFormat = (decimalString: string, precision: number, scale: number) => {
  const [integerPart, fractionalPart] = decimalString.split('.');
  if (integerPart.length > precision - scale || (fractionalPart && fractionalPart.length > scale)) return false;
  return true;
};

export default checkDecimalStringFormat;
