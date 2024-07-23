import { mapRecursive, isNullOrEmpty } from '../index';

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
    expect(isNullOrEmpty('Hello')).toBe(false);
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
