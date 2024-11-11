import { UTCDate } from '@date-fns/utc';
import {
  safeDate,
  getKey,
  dateStringToPerformancePair,
  simpleToDate,
  dateToSimple,
  simpleToDateDMY,
  formattedDateWithDay,
  dateTimeToTime,
} from '../dateService';

// --default()
// describe('default', () => {
//   test('', () => {
//   });
// });

// -- safeDate()
describe('safeDate', () => {
  test('Should return correct date for a valid dateTime string', () => {
    const input = '2023-05-23T14:30:00Z';
    const expectedResult = new UTCDate('2023-05-23T14:30:00Z');
    expect(safeDate(input).toISOString()).toStrictEqual(expectedResult);
  });

  test('Should return correct date for a valid dateTime', () => {
    const input = new UTCDate('2023-05-23T14:30:00Z');
    const expectedResult = new UTCDate('2023-05-23T14:30:00Z');
    expect(safeDate(input)).toStrictEqual(expectedResult);
  });

  test('Should return correct date for a valid date string', () => {
    const input = '2023-05-23';
    const expectedResult = new UTCDate('2023-05-23T00:00:00Z');
    expect(safeDate(input)).toStrictEqual(expectedResult);
  });

  test('Should return correct date for a valid date', () => {
    const input = new UTCDate('2023-05-23');
    const expectedResult = new UTCDate('2023-05-23T00:00:00Z');
    expect(safeDate(input)).toStrictEqual(expectedResult);
  });

  test('Should return null for an invalid date string', () => {
    const input = '77 fail';
    expect(safeDate(input)).toBeNull();
  });

  test('Should return null for an invalid date', () => {
    const input = new UTCDate('77 fail');
    expect(safeDate(input)).toBeNull();
  });

  test('Should return null for null', () => {
    const input = null;
    expect(safeDate(input)).toBeNull();
  });

  test('Should return null for empty string', () => {
    const input = '';
    expect(safeDate(input)).toBeNull();
  });
});

// --getKey()
describe('getKey', () => {
  test('Should return correct date string without time for a valid date string with time (yyyy-mm-dd)', () => {
    const input = '2023-05-23T14:30:00Z';
    const expectedResult = '2023-05-23';
    expect(getKey(input)).toStrictEqual(expectedResult);
  });

  test('Should return correct date string without time for a valid date string without time (yyyy-mm-dd)', () => {
    const input = '2023-05-23';
    const expectedResult = '2023-05-23';
    expect(getKey(input)).toStrictEqual(expectedResult);
  });

  test('Should return null for an invalid date string', () => {
    const input = 'RR fail';
    expect(getKey(input)).toBeNull();
  });

  test('Should return null for null', () => {
    const input = null;
    expect(getKey(input)).toBeNull();
  });

  test('Should return null for empty string', () => {
    const input = '';
    expect(getKey(input)).toBeNull();
  });
});

// --dateStringToperformancePair()
describe('dateStringToperformancePair', () => {
  test('Test', () => {
    const input = '10/10/10';
    console.log(input);
    const output = {
      Time: null,
      Date: new UTCDate('10-10-10'),
    };
    expect(dateStringToPerformancePair(input)).toStrictEqual(output);
  });

  test('Should return null for null', () => {
    const input = null;
    expect(dateStringToPerformancePair(input)).toBeNull();
  });

  test('Should return null for empty string', () => {
    const input = '';
    expect(dateStringToPerformancePair(input)).toBeNull();
  });
});

// --simpleToDate()
describe('simpleToDate', () => {
  test('Should return a Date for a date string mm/dd/yy', () => {
    const input = '12/15/23';
    const expectedResult = new UTCDate('2023-12-15T00:00:00Z');
    expect(simpleToDate(input)).toStrictEqual(expectedResult);
  });

  test('Should return null for a date string mm-dd-yy', () => {
    const input = '13-10-23';
    expect(simpleToDate(input)).toBeNull();
  });

  test('Should return null for null', () => {
    const input = null;
    expect(simpleToDate(input)).toBeNull();
  });

  test('Should return null for empty string', () => {
    const input = '';
    expect(simpleToDate(input)).toBeNull();
  });
});

// --simpleToDateDMY()
describe('simpleToDateDMY', () => {
  test('Should return a Date for a valid date string dd/mm/yy', () => {
    const input = '15/10/23';
    const expectedResult = new UTCDate('2023-10-15T00:00:00Z');
    expect(simpleToDateDMY(input)).toStrictEqual(expectedResult);
  });

  test('Should return a null date string dd-mm-yy', () => {
    const input = '12-10-23';
    expect(simpleToDateDMY(input)).toBeNull();
  });

  test('Should return null for null', () => {
    const input = null;
    expect(simpleToDateDMY(input)).toBeNull();
  });

  test('Should return null for empty string', () => {
    const input = '';
    expect(simpleToDateDMY(input)).toBeNull();
  });
});

// --dateToSimple()
describe('dateToSimple', () => {
  test('Should return a date string dd/mm/yy from a date string of mm/dd/yy', () => {
    const input = '01/02/03';
    const expectedResult = '02/01/03';
    expect(dateToSimple(input)).toStrictEqual(expectedResult);
  });

  test('Should return a date string dd/mm/yy from a date format mm/dd/yy', () => {
    const input = new UTCDate('01/02/03');
    const expectedResult = '02/01/03';
    expect(dateToSimple(input)).toStrictEqual(expectedResult);
  });

  test('Should return a date string dd/mm/yy from a date format mm/dd/yyyy', () => {
    const input = new UTCDate('01/02/2003');
    const expectedResult = '02/01/03';
    expect(dateToSimple(input)).toStrictEqual(expectedResult);
  });

  test('Should return a date string dd/mm/yy from a date string format mm/dd/yyyy', () => {
    const input = '01/02/2003';
    const expectedResult = '02/01/03';
    expect(dateToSimple(input)).toStrictEqual(expectedResult);
  });

  test('Should return null for a date string of format mm-dd-yyyy', () => {
    const input = '02-02-2003';
    const expectedResult = '02/02/03';
    expect(dateToSimple(input)).toStrictEqual(expectedResult);
  });

  test('Should return null for a date string of format dd/mm/yyyy', () => {
    const input = '20/02/2003';
    expect(dateToSimple(input)).toBeNull();
  });

  test('Should return null for a date string of format dd-mm-yyyy', () => {
    const input = '20-02-2003';
    expect(dateToSimple(input)).toBeNull();
  });

  test('Should return null for null', () => {
    const input = null;
    expect(dateToSimple(input)).toBeNull();
  });

  test('Should return null for empty string', () => {
    const input = '';
    expect(dateToSimple(input)).toBeNull();
  });
});

// --formattedDateWithDay()
describe('formattedDateWithDay', () => {
  test('', () => {
    const input = new UTCDate('01/02/03');
    const expectedResult = 'Thu/01/03';
    expect(formattedDateWithDay(input)).toStrictEqual(expectedResult);
  });
});

// --dateTimeToTime()
describe('dateTimeToTime', () => {
  test('Should return correct time for a date time string', () => {
    const input = '2023-10-15T01:01:00Z';
    const output = '01:01';
    expect(dateTimeToTime(input)).toStrictEqual(output);
  });

  test('Should return correct time for a date time ISOString', () => {
    const input = new UTCDate('2023-10-15T01:01:00Z').toISOString();
    const output = '01:01';
    expect(dateTimeToTime(input)).toStrictEqual(output);
  });

  test('Should return correct time for a date', () => {
    const input = new UTCDate('2023-10-15T01:01:00Z');
    const output = '01:01';
    expect(dateTimeToTime(input)).toStrictEqual(output);
  });

  test('Should return null for invalid date input', () => {
    const input = 'RR Fail';
    expect(simpleToDateDMY(input)).toBeNull();
  });

  test('Should return null for null', () => {
    const input = null;
    expect(simpleToDateDMY(input)).toBeNull();
  });

  test('Should return null for empty string', () => {
    const input = '';
    expect(simpleToDateDMY(input)).toBeNull();
  });
});

// // ----------------- getTimeFromDateAndTime -----------------
// describe('getTimeFromDateAndTime', () => {
//   test('should return the correct time for a valid date string', () => {
//     const inputDt = '2023-05-23T14:30:00Z';
//     const expectedTime = '14:30';
//     expect(getTimeFromDateAndTime(inputDt)).toBe(expectedTime);
//   });

//   test('should pad single digit hours and minutes with leading zeros', () => {
//     const inputDt = '2023-05-23T04:05:00Z';
//     const expectedTime = '04:05';
//     expect(getTimeFromDateAndTime(inputDt)).toBe(expectedTime);
//   });

//   test('should return "00:00" for midnight UTC', () => {
//     const inputDt = '2023-05-23T00:00:00Z';
//     const expectedTime = '00:00';
//     expect(getTimeFromDateAndTime(inputDt)).toBe(expectedTime);
//   });

//   test('should handle date strings without explicit time', () => {
//     const inputDt = '2023-05-23';
//     const expectedTime = '00:00';
//     expect(getTimeFromDateAndTime(inputDt)).toBe(expectedTime);
//   });

//   test('should return an empty string for invalid date strings', () => {
//     const inputDt = 'invalid-date';
//     const expectedTime = '';
//     expect(getTimeFromDateAndTime(inputDt)).toBe(expectedTime);
//   });

//   test('should return an empty string if inputDate is undefined', () => {
//     const inputDt = undefined;
//     const expectedTime = '';
//     expect(getTimeFromDateAndTime(inputDt)).toBe(expectedTime);
//   });
// });

// // ----------------- addDurationToDate -----------------
// describe('addDurationToDate', () => {
//   test('adds duration to the date when add is true', () => {
//     const startingDate = new UTCDate('2024-05-30');
//     const duration = 10;
//     const result = addDurationToDate(startingDate, duration, true);
//     const expectedDate = new UTCDate('2024-06-09');

//     expect(result.getFullYear()).toBe(expectedDate.getFullYear());
//     expect(result.getMonth()).toBe(expectedDate.getMonth());
//     expect(result.getDate()).toBe(expectedDate.getDate());
//   });

//   test('subtracts duration from the date when add is false', () => {
//     const startingDate = new UTCDate('2024-05-30');
//     const duration = 10;
//     const result = addDurationToDate(startingDate, duration, false);
//     const expectedDate = new UTCDate('2024-05-20');

//     expect(result.getFullYear()).toBe(expectedDate.getFullYear());
//     expect(result.getMonth()).toBe(expectedDate.getMonth());
//     expect(result.getDate()).toBe(expectedDate.getDate());
//   });

//   test('returns the same date when duration is 0', () => {
//     const startingDate = new UTCDate('2024-05-30');
//     const duration = 0;
//     const resultAdd = addDurationToDate(startingDate, duration, true);
//     const resultSubtract = addDurationToDate(startingDate, duration, false);

//     expect(resultAdd.getFullYear()).toBe(startingDate.getFullYear());
//     expect(resultAdd.getMonth()).toBe(startingDate.getMonth());
//     expect(resultAdd.getDate()).toBe(startingDate.getDate());

//     expect(resultSubtract.getFullYear()).toBe(startingDate.getFullYear());
//     expect(resultSubtract.getMonth()).toBe(startingDate.getMonth());
//     expect(resultSubtract.getDate()).toBe(startingDate.getDate());
//   });

//   test('handles crossing month boundaries correctly', () => {
//     const startingDate = new UTCDate('2024-01-30');
//     const duration = 5;
//     const result = addDurationToDate(startingDate, duration, true);
//     const expectedDate = new UTCDate('2024-02-04');

//     expect(result.getFullYear()).toBe(expectedDate.getFullYear());
//     expect(result.getMonth()).toBe(expectedDate.getMonth());
//     expect(result.getDate()).toBe(expectedDate.getDate());
//   });

//   test('handles crossing year boundaries correctly', () => {
//     const startingDate = new UTCDate('2024-12-25');
//     const duration = 10;
//     const result = addDurationToDate(startingDate, duration, true);
//     const expectedDate = new UTCDate('2025-01-04');

//     expect(result.getFullYear()).toBe(expectedDate.getFullYear());
//     expect(result.getMonth()).toBe(expectedDate.getMonth());
//     expect(result.getDate()).toBe(expectedDate.getDate());
//   });
// });

// // ----------------- isValidDate -----------------
// describe('isValidDate', () => {
//   test('returns false for null', () => {
//     expect(isValidDate(null)).toBe(false);
//   });

//   test('returns true for valid date string', () => {
//     expect(isValidDate('2023-07-30')).toBe(true);
//   });

//   test('returns true for valid date object', () => {
//     expect(isValidDate(new UTCDate())).toBe(true);
//   });

//   test('returns true for valid Unix timestamp in milliseconds', () => {
//     expect(isValidDate(1627696800000)).toBe(true);
//   });

//   test('returns false for invalid date string', () => {
//     expect(isValidDate('Invalid date string')).toBe(false);
//   });

//   test('returns false for undefined', () => {
//     expect(isValidDate(undefined)).toBe(false);
//   });

//   test('returns false for empty string', () => {
//     expect(isValidDate('')).toBe(false);
//   });

//   test('returns true for date object as a string', () => {
//     expect(isValidDate(new UTCDate().toString())).toBe(true);
//   });
// });

// // ----------------- compare dates -----------------
// describe('compareDatesWithoutTime', () => {
//   test('should return true when date1 < date2', () => {
//     expect(compareDatesWithoutTime('2023-01-01', '2023-01-02', '<')).toBe(true);
//   });

//   test('should return false when date1 >= date2 with operator "<"', () => {
//     expect(compareDatesWithoutTime('2023-01-02', '2023-01-01', '<')).toBe(false);
//   });

//   test('should return true when date1 <= date2 with the same date', () => {
//     expect(compareDatesWithoutTime('2023-01-01', '2023-01-01', '<=')).toBe(true);
//   });

//   test('should return true when date1 > date2', () => {
//     expect(compareDatesWithoutTime('2023-01-02', '2023-01-01', '>')).toBe(true);
//   });

//   test('should return false when date1 <= date2 with operator ">"', () => {
//     expect(compareDatesWithoutTime('2023-01-01', '2023-01-02', '>')).toBe(false);
//   });

//   test('should return true when date1 >= date2 with the same date', () => {
//     expect(compareDatesWithoutTime('2023-01-01', '2023-01-01', '>=')).toBe(true);
//   });

//   test('should return true when date1 == date2', () => {
//     expect(compareDatesWithoutTime('2023-01-01', '2023-01-01', '==')).toBe(true);
//   });

//   test('should return false when date1 != date2 with same date', () => {
//     expect(compareDatesWithoutTime('2023-01-01', '2023-01-01', '!=')).toBe(false);
//   });

//   test('should return true when date1 != date2 with different dates', () => {
//     expect(compareDatesWithoutTime('2023-01-01', '2023-01-02', '!=')).toBe(true);
//   });

//   test('should work correctly with Date objects as inputs', () => {
//     expect(compareDatesWithoutTime(new UTCDate('2023-01-01'), new UTCDate('2023-01-02'), '<')).toBe(true);
//   });

//   test('should work correctly with numeric timestamps as inputs', () => {
//     const date1 = new UTCDate('2023-01-01').getTime();
//     const date2 = new UTCDate('2023-01-02').getTime();
//     expect(compareDatesWithoutTime(date1, date2, '<')).toBe(true);
//   });

//   test('should normalize time correctly and only compare dates', () => {
//     const date1 = new UTCDate('2023-01-01T12:00:00');
//     const date2 = new UTCDate('2023-01-01T08:00:00');
//     expect(compareDatesWithoutTime(date1, date2, '==')).toBe(true);
//   });
// });

// // ----------------- getDateWithOffset -----------------
// describe('getDateWithOffset', () => {
//   test('should return a correctly formatted date with offset', () => {
//     const inputDate = new UTCDate('2024-10-31T12:00:00Z');
//     const result = getDateWithOffset(inputDate);

//     // Use date string as expected output to ensure we match format
//     const expectedDateString = 'October 31st 2024, 12:00:00 PM';
//     const expectedDate = parse(expectedDateString, 'MMMM do yyyy, h:mm:ss a', new UTCDate());

//     expect(result.toDateString()).toBe(expectedDate.toDateString());
//   });

//   test('should handle an invalid date input gracefully', () => {
//     const invalidDate = new UTCDate('Invalid Date');
//     const result = getDateWithOffset(invalidDate);

//     expect(result.toString()).toBe('Invalid Date');
//   });

//   test('should return the same date when timezone offset is zero', () => {
//     const inputDate = new UTCDate('2024-10-31T12:00:00Z');
//     const result = getDateWithOffset(inputDate);

//     expect(result.toDateString()).toBe(inputDate.toDateString());
//   });

//   test('should correctly parse a known date string back into a Date object', () => {
//     const inputDate = new UTCDate('2024-10-31T14:00:00Z');
//     const result = getDateWithOffset(inputDate);

//     // Adjust expectation to align with specific date-time results
//     const expectedParsedDateString = 'October 31st 2024, 2:00:00 PM';
//     const parsedDate = parse(expectedParsedDateString, 'MMMM do yyyy, h:mm:ss a', new UTCDate());

//     expect(result.toISOString()).toBe(parsedDate.toISOString());
//   });
// });
