import { getNextMondayDateString } from '../dateService';

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
