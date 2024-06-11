import charCodeToCurrency from '../charCodeToCurrency';

describe('charCodeToCurrency', () => {
  it('will return a £ when given the correct unicode input', () => {
    expect(charCodeToCurrency('00a3')).toBe('£');
  });
  it('will return a € when given the correct unicode input', () => {
    expect(charCodeToCurrency('20ac')).toBe('€');
  });
  it('will return a $ when given the correct unicode input', () => {
    expect(charCodeToCurrency('0024')).toBe('$');
  });
  it('will return a ₱ when given the correct unicode input', () => {
    expect(charCodeToCurrency('20b1')).toBe('₱');
  });
});
