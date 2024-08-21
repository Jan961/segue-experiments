import { mapRecursive, isNullOrEmpty, checkDecimalStringFormat } from '../index';

describe('Tests for utility functions', () => {
  it('tests mapRecursive function', () => {
    const arr = [
      {
        name: 'A',
        status: 'off',
        options: [{ name: 'B', status: 'off', options: [{ name: 'C', status: 'off' }] }],
      },
    ];
    const updated = mapRecursive(arr, (i) => ({ ...i, status: 'on' }));

    expect(updated[0].status).toBe('on');
    expect(updated[0].options[0].status).toBe('on');
    expect(updated[0].options[0].options[0].status).toBe('on');
  });
});

describe('Check for null or Empty', () => {
  it('returns true for null', () => {
    expect(isNullOrEmpty(null)).toBe(true);
  });

  it('returns true for undefined', () => {
    expect(isNullOrEmpty(undefined)).toBe(true);
  });

  it('returns false for a non-empty string', () => {
    expect(isNullOrEmpty('')).toBe(true);
  });

  it('returns true for an empty array', () => {
    expect(isNullOrEmpty([])).toBe(true);
  });

  it('returns false for a non-empty array', () => {
    expect(isNullOrEmpty([1, 2, 3])).toBe(false);
  });

  it('returns true for an empty object', () => {
    expect(isNullOrEmpty({})).toBe(true);
  });

  it('returns false for a non-empty object', () => {
    expect(isNullOrEmpty({ key: 'value' })).toBe(false);
  });
});

describe('checkDecimalStringFormat', () => {
  it('should return true for valid decimal strings within precision and scale', () => {
    expect(checkDecimalStringFormat('123.45', 5, 2)).toBe(true);
    expect(checkDecimalStringFormat('123', 5, 2)).toBe(true);
    expect(checkDecimalStringFormat('0', 5, 2)).toBe(true);
    expect(checkDecimalStringFormat('123.4', 5, 2)).toBe(true);
  });

  it('should return false for invalid decimal strings that exceed precision', () => {
    expect(checkDecimalStringFormat('123456', 5, 0)).toBe(false);
    expect(checkDecimalStringFormat('1234.78', 5, 2)).toBe(false);
  });

  it('should return false for invalid decimal strings that exceed scale', () => {
    expect(checkDecimalStringFormat('12.3456', 6, 3)).toBe(false);
    expect(checkDecimalStringFormat('1.234', 4, 2)).toBe(false);
  });

  it('should return false for decimal strings that do not match the regex pattern', () => {
    const customRegex = /^[0-9]{1,3}(\.[0-9]{1,2})?$/;
    expect(checkDecimalStringFormat('1234.56', 6, 2, customRegex)).toBe(false);
    expect(checkDecimalStringFormat('12.345', 5, 3, customRegex)).toBe(false);
    expect(checkDecimalStringFormat('abc.def', 7, 3, customRegex)).toBe(false);
  });

  it('should handle cases where there is no fractional part', () => {
    expect(checkDecimalStringFormat('123', 5, 2)).toBe(true);
    expect(checkDecimalStringFormat('1234', 4, 0)).toBe(true);
    expect(checkDecimalStringFormat('12345', 5, 0)).toBe(true);
  });
});
