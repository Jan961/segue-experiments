import { getDateFromWeekNumber, getWeekNumsToDateMap } from './getDateFromWeekNum';
import { weekOptions } from './weekOptions';

describe('weekOptions Utility Function', () => {
  it('should create an array of 104 items', () => {
    expect(weekOptions).toHaveLength(104);
  });

  it('should correctly format the text for weeks', () => {
    expect(weekOptions[0].text).toBe('week - 52');
    expect(weekOptions[0].value).toBe(-52);

    expect(weekOptions[52].text).toBe('week + 0');
    expect(weekOptions[52].value).toBe(0);

    expect(weekOptions[103].text).toBe('week + 51');
    expect(weekOptions[103].value).toBe(51);
  });

  it('should have unique values for each option', () => {
    const values = weekOptions.map((option) => option.value);
    const uniqueValues = new Set(values);
    expect(uniqueValues.size).toBe(values.length);
  });

  describe('getDateFromWeekNum', () => {
    test('should return the correct date for a positive week number', () => {
      const result = getDateFromWeekNumber('2023-01-01', 2);
      expect(result).toBe('2023-01-15T00:00:00.000Z');
    });
    test('should return the correct date for a negative week number', () => {
      const result = getDateFromWeekNumber('2023-01-01', -2);
      expect(result).toBe('2022-12-18T00:00:00.000Z');
    });
  });

  describe('getWeekNumsToDateMap', () => {
    test('should return an object mapping week numbers to dates', () => {
      const result = getWeekNumsToDateMap('2023-01-01', '2023-01-31', [1, 2, 3]);
      expect(result).toEqual({
        1: '2023-01-08T00:00:00.000Z',
        2: '2023-01-15T00:00:00.000Z',
        3: '2023-01-22T00:00:00.000Z',
      });
    });
  });
});
