export const charCodeToCurrency = (charCode: string) => {
  if (isNaN(parseInt(charCode, 16))) {
    return '';
  }

  return String.fromCharCode(Number('0x' + charCode));
};

export default charCodeToCurrency;
