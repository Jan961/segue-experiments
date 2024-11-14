import { TreeItemOption } from 'components/global/TreeSelect/types';
import {
  insertAtPos,
  removeAtPos,
  replaceAtPos,
  compareStrings,
  getAllOptions,
  mapRecursive,
  isNullOrEmpty,
  checkDecimalStringFormat,
  isNull,
  isUndefined,
  isNullOrUndefined,
  noop,
  transformToOptions,
  formatDecimalValue,
  numberToOrdinal,
  mapObjectValues,
  flattenHierarchicalOptions,
  tidyString,
  replaceTemplateString,
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

describe('formatDecimalValue', () => {
  test('should return an empty string if input is null', () => {
    expect(formatDecimalValue(null)).toBe('');
  });

  test('should return an empty string if input is undefined', () => {
    expect(formatDecimalValue(undefined)).toBe('');
  });

  test('should return an empty string if input is not a valid number', () => {
    expect(formatDecimalValue('abc')).toBe('');
    expect(formatDecimalValue('')).toBe('');
  });

  test('should return a string formatted to 2 decimal places for valid number inputs', () => {
    expect(formatDecimalValue('123')).toBe('123.00');
    expect(formatDecimalValue('123.456')).toBe('123.46');
    expect(formatDecimalValue('0.1')).toBe('0.10');
    expect(formatDecimalValue('0')).toBe('0.00');
  });

  test('should handle negative numbers correctly', () => {
    expect(formatDecimalValue('-123.456')).toBe('-123.46');
    expect(formatDecimalValue('-0.1')).toBe('-0.10');
  });
});

// number to ordinal tests
describe('numberToOrdinal', () => {
  test('should return "1st" for 1', () => {
    expect(numberToOrdinal(1)).toBe('1st');
  });
  test('should return "2nd" for 2', () => {
    expect(numberToOrdinal(2)).toBe('2nd');
  });
  test('should return "3rd" for 3', () => {
    expect(numberToOrdinal(3)).toBe('3rd');
  });
  test('should return "4th" for 4', () => {
    expect(numberToOrdinal(4)).toBe('4th');
  });
  test('should return "11th" for 11', () => {
    expect(numberToOrdinal(11)).toBe('11th');
  });
  test('should return "12th" for 12', () => {
    expect(numberToOrdinal(12)).toBe('12th');
  });
  test('should return "13th" for 13', () => {
    expect(numberToOrdinal(13)).toBe('13th');
  });
  test('should return "21st" for 21', () => {
    expect(numberToOrdinal(21)).toBe('21st');
  });
  test('should return "22nd" for 22', () => {
    expect(numberToOrdinal(22)).toBe('22nd');
  });
  test('should return "23rd" for 23', () => {
    expect(numberToOrdinal(23)).toBe('23rd');
  });
  test('should return "101st" for 101', () => {
    expect(numberToOrdinal(101)).toBe('101st');
  });
  test('should return "111th" for 111', () => {
    expect(numberToOrdinal(111)).toBe('111th');
  });
  test('should return "0th" for 0', () => {
    expect(numberToOrdinal(0)).toBe('0th');
  });
  test('should return "100th" for 100', () => {
    expect(numberToOrdinal(100)).toBe('100th');
  });
  test('should return "1000th" for 1000', () => {
    expect(numberToOrdinal(1000)).toBe('1000th');
  });
});

// map object to values test
describe('mapObjectValues', () => {
  it('should apply the transformer to all values of the object', () => {
    const obj = { a: 1, b: 2, c: 3 };
    const transformer = (key: string, value: any) => value * 2;

    const result = mapObjectValues(obj, transformer);

    expect(result).toEqual({ a: 2, b: 4, c: 6 });
  });

  it('should handle an empty object', () => {
    const obj = {};
    const transformer = (key: string, value: any) => value;

    const result = mapObjectValues(obj, transformer);

    expect(result).toEqual({});
  });

  it('should pass the correct key to the transformer function', () => {
    const obj = { a: 1, b: 2 };
    const transformer = jest.fn();

    mapObjectValues(obj, transformer);

    expect(transformer).toHaveBeenCalledWith('a', 1);
    expect(transformer).toHaveBeenCalledWith('b', 2);
  });

  it('should handle different types of values', () => {
    const obj = { a: 1, b: 'test', c: true, d: null, e: undefined };
    const transformer = (key: string, value: any) => typeof value;

    const result = mapObjectValues(obj, transformer);

    expect(result).toEqual({ a: 'number', b: 'string', c: 'boolean', d: 'object', e: 'undefined' });
  });

  it('should apply custom transformation logic based on key', () => {
    const obj = { a: 1, b: 2, specialKey: 3 };
    const transformer = (key: string, value: any) => (key === 'specialKey' ? value + 10 : value);

    const result = mapObjectValues(obj, transformer);

    expect(result).toEqual({ a: 1, b: 2, specialKey: 13 });
  });
});

describe('Tests for flattenHierarchicalOptions', () => {
  const mockResults = [
    {
      id: '1',
      value: 'A',
      label: 'A',
      checked: false,
      options: [
        {
          id: '2',
          value: 'A1',
          label: 'A1',
          checked: false,
          options: [
            {
              id: '3',
              value: 'A11',
              label: 'A11',
              checked: false,
              options: [],
            },
          ],
        },
      ],
    },
    {
      id: '2',
      value: 'A1',
      label: 'A1',
      checked: false,
      options: [
        {
          id: '3',
          value: 'A11',
          label: 'A11',
          checked: false,
          options: [],
        },
      ],
    },
    {
      id: '3',
      value: 'A11',
      label: 'A11',
      checked: false,
      options: [],
    },
    {
      id: '4',
      value: 'B',
      label: 'B',
      checked: false,
      options: [
        {
          id: '5',
          value: 'B1',
          label: 'B1',
          checked: false,
          options: [],
        },
        {
          id: '6',
          value: 'B2',
          label: 'B2',
          checked: false,
          options: [],
        },
      ],
    },
    {
      id: '5',
      value: 'B1',
      label: 'B1',
      checked: false,
      options: [],
    },
    {
      id: '6',
      value: 'B2',
      label: 'B2',
      checked: false,
      options: [],
    },
  ];

  const options: TreeItemOption[] = [
    {
      id: '1',
      value: 'A',
      label: 'A',
      checked: false,
      options: [
        {
          id: '2',
          value: 'A1',
          label: 'A1',
          checked: false,
          options: [
            {
              id: '3',
              value: 'A11',
              label: 'A11',
              checked: false,
              options: [],
            },
          ],
        },
      ],
    },
    {
      id: '4',
      value: 'B',
      label: 'B',
      checked: false,
      options: [
        {
          id: '5',
          value: 'B1',
          label: 'B1',
          checked: false,
          options: [],
        },
        {
          id: '6',
          value: 'B2',
          label: 'B2',
          checked: false,
          options: [],
        },
      ],
    },
  ];

  it('tests for null, undefined and empty options', () => {
    let flattened = flattenHierarchicalOptions(null);
    expect(flattened).toEqual([]);

    flattened = flattenHierarchicalOptions(undefined);
    expect(flattened).toEqual([]);

    flattened = flattenHierarchicalOptions([]);
    expect(flattened).toEqual([]);
  });

  it('test for flattening hierarchical options', () => {
    const flattened = flattenHierarchicalOptions(options);
    expect(flattened).toEqual(mockResults);
  });
});

describe('tidyString', () => {
  it('should return an empty string if the value is null', () => {
    expect(tidyString(null)).toBe('');
  });

  it('should return an empty string if the value is undefined', () => {
    expect(tidyString(undefined)).toBe('');
  });

  it('should return the original string if the value is a non-null, non-undefined string', () => {
    expect(tidyString('test')).toBe('test');
  });

  it('should return an empty string for an empty string input', () => {
    expect(tidyString('')).toBe('');
  });

  it('should return the original string if the value contains spaces', () => {
    expect(tidyString('   spaces   ')).toBe('   spaces   ');
  });
});

describe('replaceTemplateString', () => {
  it('should return an empty string if template is null', () => {
    expect(replaceTemplateString(null, { NAME: 'John' }, null, null)).toBe('');
  });

  it('should return the template if data is null', () => {
    expect(replaceTemplateString('This a [template]', null, null, null)).toBe('This a [template]');
  });

  it('should return Hello, John!', () => {
    expect(replaceTemplateString('Hello, {name}!', { name: 'John' }, '{', '}')).toBe('Hello, John!');
  });

  it('should replace all instances of  [DB_NAME] by frtxigoo_dev', () => {
    const template = 'CREATE DATABASE [DB_NAME] WHERE [DB_NAME] IS NOT NULL; RETURN [DB_NAME];';
    const replacements = { DB_NAME: 'frtxigoo_dev' };
    const result = replaceTemplateString(template, replacements, '[', ']');
    expect(result.split('frtxigoo_dev').length).toBe(4);
  });
});
