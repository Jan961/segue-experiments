import {
  getNextMondayDateString,
  getTimeFromDateAndTime,
  addDurationToDate,
  isValidDate,
  compareDatesWithoutTime,
} from '../dateService';

// ----------------- getNextMondayDateString -----------------
describe('getNextMondayDateString Utility Function', () => {
  // Test Case 1: Testing with a date that is before Monday
  test('getNextMondayDateString - Before Monday', () => {
    const result = getNextMondayDateString('2023-12-11');
    expect(result).toEqual('2023-12-11T00:00:00.000Z');
  });

  // Test Case 2: Testing with a date that is already a Monday
  test('getNextMondayDateString - On Monday', () => {
    const result = getNextMondayDateString('2023-12-18');
    expect(result).toEqual('2023-12-18T00:00:00.000Z');
  });

  // Test Case 3: Testing with a date that is after Monday
  test('getNextMondayDateString - After Monday', () => {
    const result = getNextMondayDateString('2023-12-20');
    expect(result).toEqual('2023-12-25T00:00:00.000Z');
  });

  // Additional Test Case: Testing with an invalid date - need to re-think
  /*  test('getNextMondayDateString - Invalid Date', () => {
    const result = getNextMondayDateString('invalid-date');
    expect(result).toEqual('');
  }); */
});

// ----------------- getTimeFromDateAndTime -----------------
describe('getTimeFromDateAndTime', () => {
  test('should return the correct time for a valid date string', () => {
    const inputDt = '2023-05-23T14:30:00Z';
    const expectedTime = '14:30';
    expect(getTimeFromDateAndTime(inputDt)).toBe(expectedTime);
  });

  test('should pad single digit hours and minutes with leading zeros', () => {
    const inputDt = '2023-05-23T04:05:00Z';
    const expectedTime = '04:05';
    expect(getTimeFromDateAndTime(inputDt)).toBe(expectedTime);
  });

  test('should return "00:00" for midnight UTC', () => {
    const inputDt = '2023-05-23T00:00:00Z';
    const expectedTime = '00:00';
    expect(getTimeFromDateAndTime(inputDt)).toBe(expectedTime);
  });

  test('should handle date strings without explicit time', () => {
    const inputDt = '2023-05-23';
    const expectedTime = '00:00';
    expect(getTimeFromDateAndTime(inputDt)).toBe(expectedTime);
  });

  test('should return an empty string for invalid date strings', () => {
    const inputDt = 'invalid-date';
    const expectedTime = '';
    expect(getTimeFromDateAndTime(inputDt)).toBe(expectedTime);
  });

  test('should return an empty string if inputDate is undefined', () => {
    const inputDt = undefined;
    const expectedTime = '';
    expect(getTimeFromDateAndTime(inputDt)).toBe(expectedTime);
  });
});

// ----------------- addDurationToDate -----------------
describe('addDurationToDate', () => {
  test('adds duration to the date when add is true', () => {
    const startingDate = new Date('2024-05-30');
    const duration = 10;
    const result = addDurationToDate(startingDate, duration, true);
    const expectedDate = new Date('2024-06-09');

    expect(result.getFullYear()).toBe(expectedDate.getFullYear());
    expect(result.getMonth()).toBe(expectedDate.getMonth());
    expect(result.getDate()).toBe(expectedDate.getDate());
  });

  test('subtracts duration from the date when add is false', () => {
    const startingDate = new Date('2024-05-30');
    const duration = 10;
    const result = addDurationToDate(startingDate, duration, false);
    const expectedDate = new Date('2024-05-20');

    expect(result.getFullYear()).toBe(expectedDate.getFullYear());
    expect(result.getMonth()).toBe(expectedDate.getMonth());
    expect(result.getDate()).toBe(expectedDate.getDate());
  });

  test('returns the same date when duration is 0', () => {
    const startingDate = new Date('2024-05-30');
    const duration = 0;
    const resultAdd = addDurationToDate(startingDate, duration, true);
    const resultSubtract = addDurationToDate(startingDate, duration, false);

    expect(resultAdd.getFullYear()).toBe(startingDate.getFullYear());
    expect(resultAdd.getMonth()).toBe(startingDate.getMonth());
    expect(resultAdd.getDate()).toBe(startingDate.getDate());

    expect(resultSubtract.getFullYear()).toBe(startingDate.getFullYear());
    expect(resultSubtract.getMonth()).toBe(startingDate.getMonth());
    expect(resultSubtract.getDate()).toBe(startingDate.getDate());
  });

  test('handles crossing month boundaries correctly', () => {
    const startingDate = new Date('2024-01-30');
    const duration = 5;
    const result = addDurationToDate(startingDate, duration, true);
    const expectedDate = new Date('2024-02-04');

    expect(result.getFullYear()).toBe(expectedDate.getFullYear());
    expect(result.getMonth()).toBe(expectedDate.getMonth());
    expect(result.getDate()).toBe(expectedDate.getDate());
  });

  test('handles crossing year boundaries correctly', () => {
    const startingDate = new Date('2024-12-25');
    const duration = 10;
    const result = addDurationToDate(startingDate, duration, true);
    const expectedDate = new Date('2025-01-04');

    expect(result.getFullYear()).toBe(expectedDate.getFullYear());
    expect(result.getMonth()).toBe(expectedDate.getMonth());
    expect(result.getDate()).toBe(expectedDate.getDate());
  });
});

// ----------------- isValidDate -----------------
describe('isValidDate', () => {
  test('returns false for null', () => {
    expect(isValidDate(null)).toBe(false);
  });

  test('returns true for valid date string', () => {
    expect(isValidDate('2023-07-30')).toBe(true);
  });

  test('returns true for valid date object', () => {
    expect(isValidDate(new Date())).toBe(true);
  });

  test('returns true for valid Unix timestamp in milliseconds', () => {
    expect(isValidDate(1627696800000)).toBe(true);
  });

  test('returns false for invalid date string', () => {
    expect(isValidDate('Invalid date string')).toBe(false);
  });

  test('returns false for undefined', () => {
    expect(isValidDate(undefined)).toBe(false);
  });

  test('returns false for empty string', () => {
    expect(isValidDate('')).toBe(false);
  });

  test('returns true for date object as a string', () => {
    expect(isValidDate(new Date().toString())).toBe(true);
  });
});

// ----------------- compare dates -----------------
describe('compareDatesWithoutTime', () => {
  test('should return true when date1 < date2', () => {
    expect(compareDatesWithoutTime('2023-01-01', '2023-01-02', '<')).toBe(true);
  });

  test('should return false when date1 >= date2 with operator "<"', () => {
    expect(compareDatesWithoutTime('2023-01-02', '2023-01-01', '<')).toBe(false);
  });

  test('should return true when date1 <= date2 with the same date', () => {
    expect(compareDatesWithoutTime('2023-01-01', '2023-01-01', '<=')).toBe(true);
  });

  test('should return true when date1 > date2', () => {
    expect(compareDatesWithoutTime('2023-01-02', '2023-01-01', '>')).toBe(true);
  });

  test('should return false when date1 <= date2 with operator ">"', () => {
    expect(compareDatesWithoutTime('2023-01-01', '2023-01-02', '>')).toBe(false);
  });

  test('should return true when date1 >= date2 with the same date', () => {
    expect(compareDatesWithoutTime('2023-01-01', '2023-01-01', '>=')).toBe(true);
  });

  test('should return true when date1 == date2', () => {
    expect(compareDatesWithoutTime('2023-01-01', '2023-01-01', '==')).toBe(true);
  });

  test('should return false when date1 != date2 with same date', () => {
    expect(compareDatesWithoutTime('2023-01-01', '2023-01-01', '!=')).toBe(false);
  });

  test('should return true when date1 != date2 with different dates', () => {
    expect(compareDatesWithoutTime('2023-01-01', '2023-01-02', '!=')).toBe(true);
  });

  test('should return false when given an invalid operator', () => {
    expect(compareDatesWithoutTime('2023-01-01', '2023-01-02', 'invalid')).toBe(false);
  });

  test('should work correctly with Date objects as inputs', () => {
    expect(compareDatesWithoutTime(new Date('2023-01-01'), new Date('2023-01-02'), '<')).toBe(true);
  });

  test('should work correctly with numeric timestamps as inputs', () => {
    const date1 = new Date('2023-01-01').getTime();
    const date2 = new Date('2023-01-02').getTime();
    expect(compareDatesWithoutTime(date1, date2, '<')).toBe(true);
  });

  test('should normalize time correctly and only compare dates', () => {
    const date1 = new Date('2023-01-01T12:00:00');
    const date2 = new Date('2023-01-01T08:00:00');
    expect(compareDatesWithoutTime(date1, date2, '==')).toBe(true);
  });
});
