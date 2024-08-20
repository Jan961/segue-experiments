import {
  insertAtPos,
  removeAtPos,
  replaceAtPos,
  compareStrings,
  getAllOptions,
  mapRecursive,
  isNullOrEmpty,
  isNull,
  isUndefined,
  isNullOrUndefined,
  noop,
  transformToOptions,
} from 'utils';

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

describe('transformToOptions', () => {
  it('should transform a list of objects into options using textKey and valueKey', () => {
    const list = [
      { name: 'Option 1', id: 1 },
      { name: 'Option 2', id: 2 },
    ];
    const result = transformToOptions(list, 'name', 'id');
    expect(result).toEqual([
      { text: 'Option 1', value: 1 },
      { text: 'Option 2', value: 2 },
    ]);
  });

  it('should handle missing textKey or valueKey with fallback functions', () => {
    const list = [
      { name: 'Option 1', id: 1 },
      { title: 'Option 2', identifier: 2 },
    ];
    const result = transformToOptions(
      list,
      'name',
      'id',
      (item) => item.title,
      (item) => item.identifier,
    );
    expect(result).toEqual([
      { text: 'Option 1', value: 1 },
      { text: 'Option 2', value: 2 },
    ]);
  });

  it('should prioritize textKey and valueKey over fallback functions', () => {
    const list = [{ name: 'Option 1', id: 1, title: 'Ignored Title', identifier: 'Ignored Identifier' }];
    const result = transformToOptions(
      list,
      'name',
      'id',
      (item) => item.title,
      (item) => item.identifier,
    );
    expect(result).toEqual([{ text: 'Option 1', value: 1 }]);
  });

  it('should return an empty array when the input list is empty', () => {
    const result = transformToOptions([], 'name', 'id');
    expect(result).toEqual([]);
  });

  it('should handle cases where textFn and valueFn are undefined', () => {
    const list = [{ name: 'Option 1', id: 1 }];
    const result = transformToOptions(list, 'name', 'id');
    expect(result).toEqual([{ text: 'Option 1', value: 1 }]);
  });

  it('should handle cases where textFn or valueFn returns undefined', () => {
    const list = [{ name: 'Option 1', id: 1 }, { title: 'Option 2' }];
    const result = transformToOptions(
      list,
      'name',
      'id',
      (item) => item.title,
      (item) => item.identifier,
    );
    expect(result).toEqual([
      { text: 'Option 1', value: 1 },
      { text: 'Option 2', value: undefined },
    ]);
  });

  it('should handle cases where textKey or valueKey does not exist and no fallback is provided', () => {
    const list = [{ someKey: 'someValue' }];
    const result = transformToOptions(list, 'name', 'id');
    expect(result).toEqual([{ text: undefined, value: undefined }]);
  });
});

describe('insertAtPos', () => {
  it('should insert an element at the correct position', () => {
    const array = [1, 2, 3];
    const result = insertAtPos(array, 99, 1);
    expect(result).toEqual([1, 99, 2, 3]);
  });

  it('should insert an element at the beginning if position is 0', () => {
    const array = [1, 2, 3];
    const result = insertAtPos(array, 99, 0);
    expect(result).toEqual([99, 1, 2, 3]);
  });

  it('should insert an element at the end if position is greater than the array length', () => {
    const array = [1, 2, 3];
    const result = insertAtPos(array, 99, 5);
    expect(result).toEqual([1, 2, 3, 99]);
  });

  it('should insert an element at the start if position is negative', () => {
    const array = [1, 2, 3];
    const result = insertAtPos(array, 99, -1);
    expect(result).toEqual([99, 1, 2, 3]);
  });
});

describe('removeAtPos', () => {
  it('should remove an element at the correct position', () => {
    const array = [1, 2, 3];
    const result = removeAtPos(array, 1);
    expect(result).toEqual([1, 3]);
  });

  it('should return the same array if position is out of bounds (negative)', () => {
    const array = [1, 2, 3];
    const result = removeAtPos(array, -1);
    expect(result).toEqual(array);
  });

  it('should return the same array if position is out of bounds (greater than array length)', () => {
    const array = [1, 2, 3];
    const result = removeAtPos(array, 5);
    expect(result).toEqual(array);
  });

  it('should return an empty array if the array has one element and position is 0', () => {
    const array = [1];
    const result = removeAtPos(array, 0);
    expect(result).toEqual([]);
  });
});

describe('replaceAtPos', () => {
  it('should replace an element at the correct position', () => {
    const array = [1, 2, 3];
    const result = replaceAtPos(array, 99, 1);
    expect(result).toEqual([1, 99, 3]);
  });

  it('should return the same array if position is out of bounds (negative)', () => {
    const array = [1, 2, 3];
    const result = replaceAtPos(array, 99, -1);
    expect(result).toEqual(array);
  });

  it('should return the same array if position is out of bounds (greater than array length)', () => {
    const array = [1, 2, 3];
    const result = replaceAtPos(array, 99, 5);
    expect(result).toEqual(array);
  });

  it('should replace the only element in the array', () => {
    const array = [1];
    const result = replaceAtPos(array, 99, 0);
    expect(result).toEqual([99]);
  });
});

describe('compareStrings', () => {
  it('should return true if string a includes string b (case insensitive)', () => {
    const result = compareStrings('Hello World', 'hello');
    expect(result).toBe(true);
  });

  it('should return false if string a does not include string b', () => {
    const result = compareStrings('Hello World', 'bye');
    expect(result).toBe(false);
  });

  it('should return false if string a is undefined', () => {
    const result = compareStrings(undefined, 'hello');
    expect(result).toBe(false);
  });

  it('should return true if string b is undefined', () => {
    const result = compareStrings('Hello World', undefined);
    expect(result).toBe(true);
  });

  it('should return true if both strings are undefined', () => {
    const result = compareStrings(undefined, undefined);
    expect(result).toBe(true);
  });
});

describe('getAllOptions', () => {
  it('should prepend the "All" option with default values', () => {
    const options = [
      { text: 'Option 1', value: 1 },
      { text: 'Option 2', value: 2 },
    ];
    const result = getAllOptions(options);
    expect(result).toEqual([{ text: 'All', value: 'all' }, ...options]);
  });

  it('should prepend the "All" option with custom label and value', () => {
    const options = [
      { text: 'Option 1', value: 1 },
      { text: 'Option 2', value: 2 },
    ];
    const result = getAllOptions(options, 'Everything', 0);
    expect(result).toEqual([{ text: 'Everything', value: 0 }, ...options]);
  });

  it('should return just the "All" option if options array is empty', () => {
    const result = getAllOptions([]);
    expect(result).toEqual([{ text: 'All', value: 'all' }]);
  });

  it('should handle undefined allLabel and allValue correctly', () => {
    const options = [{ text: 'Option 1', value: 1 }];
    const result = getAllOptions(options, undefined, undefined);
    expect(result).toEqual([{ text: 'All', value: 'all' }, ...options]);
  });
});

describe('isNull', () => {
  it('should return true if the value is null', () => {
    expect(isNull(null)).toBe(true);
  });

  it('should return false if the value is not null', () => {
    expect(isNull(undefined)).toBe(false);
    expect(isNull(0)).toBe(false);
    expect(isNull('')).toBe(false);
    expect(isNull({})).toBe(false);
  });
});

describe('isUndefined', () => {
  it('should return true if the value is undefined', () => {
    expect(isUndefined(undefined)).toBe(true);
  });

  it('should return false if the value is not undefined', () => {
    expect(isUndefined(null)).toBe(false);
    expect(isUndefined(0)).toBe(false);
    expect(isUndefined('')).toBe(false);
    expect(isUndefined({})).toBe(false);
  });
});

describe('isNullOrUndefined', () => {
  it('should return true if the value is null', () => {
    expect(isNullOrUndefined(null)).toBe(true);
  });

  it('should return true if the value is undefined', () => {
    expect(isNullOrUndefined(undefined)).toBe(true);
  });

  it('should return false if the value is neither null nor undefined', () => {
    expect(isNullOrUndefined(0)).toBe(false);
    expect(isNullOrUndefined('')).toBe(false);
    expect(isNullOrUndefined({})).toBe(false);
  });
});

describe('noop', () => {
  it('should return null when called', () => {
    expect(noop()).toBeNull();
  });

  it('should not throw an error when called', () => {
    expect(() => noop()).not.toThrow();
  });

  it('should always return the same value (null)', () => {
    expect(noop()).toBe(null);
    expect(noop()).toBe(null);
  });
});
