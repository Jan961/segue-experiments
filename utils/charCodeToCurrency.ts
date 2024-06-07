export const charCodeToCurrency = (charCode: string) => {
  return String.fromCharCode(Number('0x' + charCode));
};

export default charCodeToCurrency;
