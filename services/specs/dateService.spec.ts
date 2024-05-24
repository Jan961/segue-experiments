import { getNextMondayDateString, getTimeFromDateAndTime } from '../dateService';

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
