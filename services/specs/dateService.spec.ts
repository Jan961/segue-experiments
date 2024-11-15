import { UTCDate } from '@date-fns/utc';
import {
  safeDate,
  getKey,
  dateStringToPerformancePair,
  simpleToDateMDY,
  dateToSimple,
  simpleToDateDMY,
  formattedDateWithDay,
  newDate,
  dateTimeToTime,
  getDateDaysAgo,
  getWeekDay,
  formattedDateWithWeekDay,
  calculateWeekNumber,
  addOneMonth,
  timeFormat,
  formatShortDateUK,
  getMonday,
} from '../dateService';

// --default()
// describe.each([
//   ["Input", "Expected"]
// ])('Default', (input, expected) => {
//   test(`Expect ${input === '' ? input : 'empty string'} to be ${expected}`, () => {
//     expect(func(input).toStrictEqual(expected));
//   })
// })

// --newDate()
describe.each([
  [{ date: '10-15-24', locale: 'US' }, '2024-10-15T00:00:00.000Z'],
  [{ date: '10-15-24T00:00:00.000Z', locale: 'US' }, '2024-10-15T00:00:00.000Z'],
  [{ date: '10-15-2024', locale: 'US' }, '2024-10-15T00:00:00.000Z'],
  [{ date: '10-15-2024T00:00:00.000Z', locale: 'US' }, '2024-10-15T00:00:00.000Z'],
  [{ date: '10/15/24', locale: 'US' }, '2024-10-15T00:00:00.000Z'],
  [{ date: '10/15/24T00:00:00.000Z', locale: 'US' }, '2024-10-15T00:00:00.000Z'],
  [{ date: '10/15/2024', locale: 'US' }, '2024-10-15T00:00:00.000Z'],
  [{ date: '10/15/2024T00:00:00.000Z', locale: 'US' }, '2024-10-15T00:00:00.000Z'],
  [{ date: '15-10-24', locale: 'UK' }, '2024-10-15T00:00:00.000Z'],
  [{ date: '15-10-24T00:00:00.000Z', locale: 'UK' }, '2024-10-15T00:00:00.000Z'],
  [{ date: '15-10-2024', locale: 'UK' }, '2024-10-15T00:00:00.000Z'],
  [{ date: '15-10-2024T00:00:00.000Z', locale: 'UK' }, '2024-10-15T00:00:00.000Z'],
  [{ date: '15/10/24', locale: 'UK' }, '2024-10-15T00:00:00.000Z'],
  [{ date: '15/10/24T00:00:00.000Z', locale: 'UK' }, '2024-10-15T00:00:00.000Z'],
  [{ date: '15/10/2024', locale: 'UK' }, '2024-10-15T00:00:00.000Z'],
  [{ date: '15/10/2024T00:00:00.000Z', locale: 'UK' }, '2024-10-15T00:00:00.000Z'],
  [{ date: '10-15-24' }, null],
  [{ date: '10-15-24T00:00:00.000Z' }, null],
  [{ date: '10/15/24' }, null],
  [{ date: '10/15/24T00:00:00.000Z' }, null],
  [{ date: '15-10-24' }, null],
  [{ date: '15-10-24T00:00:00.000Z' }, null],
  [{ date: '15/10/24' }, null],
  [{ date: '15/10/24T00:00:00.000Z' }, null],
  [{ date: '2024-10-15' }, '2024-10-15T00:00:00.000Z'],
  [{ date: '2024-10-15T00:00:00.000Z' }, '2024-10-15T00:00:00.000Z'],
  [{ date: '2024/10/15', locale: 'US' }, '2024-10-15T00:00:00.000Z'],
  [{ date: '2024/10/15T00:00:00.000Z', locale: 'US' }, '2024-10-15T00:00:00.000Z'],
  [{ date: '2024/10/15' }, '2024-10-15T00:00:00.000Z'],
  [{ date: '2024/10/15T00:00:00.000Z' }, '2024-10-15T00:00:00.000Z'],
  [{ date: '2024/10/15', locale: 'UK' }, '2024-10-15T00:00:00.000Z'],
  [{ date: '2024/10/15T00:00:00.000Z', locale: 'UK' }, '2024-10-15T00:00:00.000Z'],
  [{ date: new UTCDate('2024-10-15T00:00:00.000Z').toISOString() }, '2024-10-15T00:00:00.000Z'],
  [{ date: new UTCDate('2024-10-15T14:30:20.000Z').toISOString() }, '2024-10-15T14:30:20.000Z'],
  [{ date: 'RR Fail' }, null],
  [{ date: 'RR Fail', locale: 'UK' }, null],
  [{ date: 'RR Fail', locale: 'US' }, null],
])('newDate', (input: { date: string; locale?: 'UK' | 'US' }, expected) => {
  test(`Expect '${input.date}'${input.locale ? ` in locale '${input.locale}'` : ''} to be '${expected}'`, () => {
    const val = newDate(input.date, input?.locale);
    expect(val ? val.toISOString() : val).toStrictEqual(expected);
  });
});

describe('newDate', (date = '') => {
  test(`Expect '${date}' to be 'Not Null'`, () => {
    const val = newDate(date);
    expect(val ? val.toISOString() : val).toBeDefined();
  });

  test(`Expect 'null' to be 'Not Null'`, () => {
    const val = newDate(null);
    expect(val ? val.toISOString() : val).toBeDefined();
  });
});

// -- safeDate()
describe.each([
  [{ date: '05/23/23', locale: 'US' }, '2023-05-23T00:00:00.000Z'],
  [{ date: '05-23-23', locale: 'US' }, '2023-05-23T00:00:00.000Z'],
  [{ date: '05-23-2023', locale: 'US' }, '2023-05-23T00:00:00.000Z'],
  [{ date: '2023-05-23' }, '2023-05-23T00:00:00.000Z'],
  [{ date: '2023/05/23' }, '2023-05-23T00:00:00.000Z'],
  [{ date: '2023-05-23T14:30:00.000Z' }, '2023-05-23T14:30:00.000Z'],
  [{ date: new UTCDate('2023-05-23T14:30:00Z') }, '2023-05-23T14:30:00.000Z'],
  [{ date: new UTCDate('2023-05-23') }, '2023-05-23T00:00:00.000Z'],
  [{ date: '77 Fail' }, null],
])('safeDate', (input: { date: string; locale?: 'UK' | 'US' }, expected) => {
  test(`Expect ${input.date === '' ? 'empty string' : input.date} to be ${expected}`, () => {
    const val = safeDate(input.date, input.locale);
    expect(val ? val.toISOString() : val).toStrictEqual(expected);
  });
});

// --getKey()
describe.each([
  [{ date: '2023-05-23T14:30:00.000Z' }, '2023-05-23'],
  [{ date: '2023-05-23' }, '2023-05-23'],
  [{ date: new Date('2023-05-23').toISOString() }, '2023-05-23'],
  [{ date: 'RR fail' }, null],
  [{ date: null }, null],
  [{ date: '' }, null],
])('getKey', (input: { date: string; locale?: 'UK' | 'US' }, expected) => {
  test(`Expect ${input.date === '' ? 'empty string' : input.date} to be ${expected}`, () => {
    expect(getKey(input.date, input.locale)).toStrictEqual(expected);
  });
});

// --dateStringToperformancePair()
describe('dateStringToperformancePair', () => {
  test('Should return null for null', () => {
    const input = null;
    expect(dateStringToPerformancePair(input)).toBeNull();
  });

  test('Should return null for empty string', () => {
    const input = '';
    expect(dateStringToPerformancePair(input)).toBeNull();
  });
});

// --simpleToDateMDY()
describe('simpleToDateMDY', () => {
  test('Should return a Date for a date string mm/dd/yy', () => {
    const input = '12/15/23';
    const expectedResult = new UTCDate('2023-12-15T00:00:00Z');
    expect(simpleToDateMDY(input)).toStrictEqual(expectedResult);
  });

  test('Should return null for a date string mm-dd-yy', () => {
    const input = '12-15-23';
    const expectedResult = new UTCDate('2023-12-15T00:00:00Z');
    expect(simpleToDateMDY(input)).toStrictEqual(expectedResult);
  });

  test('Should return null for null', () => {
    const input = null;
    expect(simpleToDateMDY(input)).toBeNull();
  });

  test('Should return null for empty string', () => {
    const input = '';
    expect(simpleToDateMDY(input)).toBeNull();
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
    const input = '12-15-23';
    const expectedResult = new UTCDate('2023-12-15T00:00:00Z');
    expect(simpleToDateMDY(input)).toStrictEqual(expectedResult);
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
describe.each([
  [{ date: '10/15/24' }, null],
  [{ date: '10-15-24' }, null],
  [{ date: '10/15/2024' }, null],
  [{ date: '10-15-2024' }, null],
  [{ date: '10/15/24', locale: 'US' }, '15/10/24'],
  [{ date: '10-15-24', locale: 'US' }, '15/10/24'],
  [{ date: '15/10/24', locale: 'UK' }, '15/10/24'],
  [{ date: '15-10-24', locale: 'UK' }, '15/10/24'],
])('dateToSimple', (input: { date: string; locale: 'UK' | 'US' }, expected) => {
  test(`Expect '${input.date}'${input.locale ? ` in locale '${input.locale}'` : ''} to be '${expected}'`, () => {
    const val = dateToSimple(input.date, input?.locale);
    expect(val).toStrictEqual(expected);
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
    const input = '2023-10-15T01:01:00.000Z';
    const output = '01:01';
    expect(dateTimeToTime(input)).toStrictEqual(output);
  });

  test('Should return correct time for a date time ISOString', () => {
    const input = new UTCDate('2023-10-15T01:01:00.000Z').toISOString();
    const output = '01:01';
    expect(dateTimeToTime(input)).toStrictEqual(output);
  });

  test('Should return correct time for a date', () => {
    const input = new UTCDate('2023-10-15T01:01:00.000Z');
    const output = '01:01';
    expect(dateTimeToTime(input)).toStrictEqual(output);
  });

  test('Should return null for invalid date input', () => {
    const input = 'RR Fail';
    expect(dateTimeToTime(input)).toBeNull();
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

// --getDateDaysAgo
describe.each([
  [{ date: '2024-10-15', daysToSubtract: 5 }, new UTCDate('2024-10-10')],
  [{ date: '10-15-24', daysToSubtract: 5, locale: 'US' }, new UTCDate('2024-10-10')],
  [{ date: '15-10-24', daysToSubtract: 5, locale: 'UK' }, new UTCDate('2024-10-10')],
  [{ date: '2024-10-15T14:30:20.000Z', daysToSubtract: 5 }, new UTCDate('2024-10-10T14:30:20Z')],
  [{ date: '10-15-24T14:30:20.000Z', daysToSubtract: 5, locale: 'US' }, new UTCDate('2024-10-10T14:30:20Z')],
  [{ date: '15-10-24T14:30:20.000Z', daysToSubtract: 5, locale: 'UK' }, new UTCDate('2024-10-10T14:30:20Z')],
  [{ date: new UTCDate('2024-10-15T14:30:20.000Z'), daysToSubtract: 5 }, new UTCDate('2024-10-10T14:30:20Z')],
])('getDateDaysAgo', (input: { date: string; daysToSubtract: number; locale: 'UK' | 'US' }, expected) => {
  test(`Expect ${input.date} - ${input.daysToSubtract} days to be ${expected}`, () => {
    expect(getDateDaysAgo(input.date, input.daysToSubtract, input.locale)).toStrictEqual(expected);
  });
});

// --getWeekDay
describe.each([
  [{ date: '2024-10-15', format: 'long' }, 'Tuesday'],
  [{ date: '10-15-24', format: 'long', locale: 'US' }, 'Tuesday'],
  [{ date: '15-10-24', format: 'long', locale: 'UK' }, 'Tuesday'],
  [{ date: '2024-10-15T14:30:20.000Z', format: 'long' }, 'Tuesday'],
  [{ date: '10-15-24T14:30:20.000Z', format: 'long', locale: 'US' }, 'Tuesday'],
  [{ date: '15-10-24T14:30:20.000Z', format: 'long', locale: 'UK' }, 'Tuesday'],
  [{ date: '2024-10-15', format: 'short' }, 'Tue'],
  [{ date: '10-15-24', format: 'short', locale: 'US' }, 'Tue'],
  [{ date: '15-10-24', format: 'short', locale: 'UK' }, 'Tue'],
  [{ date: '2024-10-15T14:30:20.000Z', format: 'short' }, 'Tue'],
  [{ date: '10-15-24T14:30:20.000Z', format: 'short', locale: 'US' }, 'Tue'],
  [{ date: '15-10-24T14:30:20.000Z', format: 'short', locale: 'UK' }, 'Tue'],
  [{ date: null }, null],
])('getWeekDay', (input: { date: string; format: 'long' | 'short'; locale: 'UK' | 'US' }, expected) => {
  test(`Expect ${input.date} to be ${expected}`, () => {
    expect(getWeekDay(input.date, input.format, input.locale)).toStrictEqual(expected);
  });
});

// --formattedDateWithWeekDay
describe.each([
  [{ date: '2024-10-15', weekDayFormat: 'Long' }, 'Tuesday 15/10/2024'],
  [{ date: '10-15-24', weekDayFormat: 'Long', locale: 'US' }, 'Tuesday 15/10/2024'],
  [{ date: '15-10-24', weekDayFormat: 'Long', locale: 'UK' }, 'Tuesday 15/10/2024'],
  [{ date: '2024-10-15T14:30:20.000Z', weekDayFormat: 'Long' }, 'Tuesday 15/10/2024'],
  [{ date: '10-15-24T14:30:20.000Z', weekDayFormat: 'Long', locale: 'US' }, 'Tuesday 15/10/2024'],
  [{ date: '15-10-24T14:30:20.000Z', weekDayFormat: 'Long', locale: 'UK' }, 'Tuesday 15/10/2024'],
  [{ date: '2024-10-15', weekDayFormat: 'Short' }, 'Tue 15/10/24'],
  [{ date: '10-15-24', weekDayFormat: 'Short', locale: 'US' }, 'Tue 15/10/24'],
  [{ date: '15-10-24', weekDayFormat: 'Short', locale: 'UK' }, 'Tue 15/10/24'],
  [{ date: '2024-10-15T14:30:20.000Z', weekDayFormat: 'Short' }, 'Tue 15/10/24'],
  [{ date: '10-15-24T14:30:20.000Z', weekDayFormat: 'Short', locale: 'US' }, 'Tue 15/10/24'],
  [{ date: '15-10-24T14:30:20.000Z', weekDayFormat: 'Short', locale: 'UK' }, 'Tue 15/10/24'],
  [{ date: null }, null],
])(
  'formattedDateWithWeekDay',
  (input: { date: string; weekDayFormat: 'Long' | 'Short'; locale: 'UK' | 'US' }, expected) => {
    test(`Expect ${input.date} to be ${expected}`, () => {
      expect(formattedDateWithWeekDay(input.date, input.weekDayFormat, input.locale)).toStrictEqual(expected);
    });
  },
);

// --calculateWeekNumber
describe.each([
  [{ productionStart: new UTCDate('2024-10-15'), dateToNumber: new UTCDate('2024-10-18') }, 1],
  [{ productionStart: new UTCDate('2024-10-15'), dateToNumber: new UTCDate('2024-10-22') }, 2],
  [{ productionStart: new UTCDate('2024-10-15'), dateToNumber: new UTCDate('2024-10-30') }, 3],
])('calculateWeekNumber', (input: { productionStart: UTCDate; dateToNumber: UTCDate }, expected) => {
  test(`Expect ${input.productionStart} start at week ${input.dateToNumber} to be week ${expected}`, () => {
    expect(calculateWeekNumber(input.productionStart, input.dateToNumber)).toStrictEqual(expected);
  });
});

// --addOneMonth
describe.each([
  [{ date: '2024-10-15' }, new UTCDate('2024-11-15')],
  [{ date: '10-15-24', locale: 'US' }, new UTCDate('2024-11-15')],
  [{ date: '15-10-24', locale: 'UK' }, new UTCDate('2024-11-15')],
  [{ date: '2024-10-15T14:30:20.000Z' }, new UTCDate('2024-11-15T14:30:20Z')],
  [{ date: '10-15-24T14:30:20.000Z', locale: 'US' }, new UTCDate('2024-11-15T14:30:20Z')],
  [{ date: '15-10-24T14:30:20.000Z', locale: 'UK' }, new UTCDate('2024-11-15T14:30:20Z')],
  [{ date: new UTCDate('2024-10-15T14:30:20.000Z') }, new UTCDate('2024-11-15T14:30:20Z')],
])('addOneMonth', (input: { date: string; locale: 'UK' | 'US' }, expected) => {
  test(`Expect ${input.date} add one month to be ${expected}`, () => {
    expect(addOneMonth(input.date, input.locale)).toStrictEqual(expected);
  });
});

// --timeFormat
describe.each([
  [32, '0:32'],
  [15, '0:15'],
  [62, '1:02'],
  [125, '2:05'],
  [0, null],
  [960, '16:00'],
  [1920, null],
  [, null],
  [-60, '-1:00'],
  [-1920, null],
  [-1440, '-24:00'],
  [1440, '24:00'],
])('timeFormat', (input, expected) => {
  test(`Expect ${input} to be ${expected}`, () => {
    expect(timeFormat(input)).toStrictEqual(expected);
  });
});

// --formatShortDateUK
describe.each([
  [{ date: '2024-10-15' }, '15/10/24'],
  [{ date: '10-15-24', locale: 'US' }, '15/10/24'],
  [{ date: '15-10-24', locale: 'UK' }, '15/10/24'],
  [{ date: '2024-10-15T14:30:20.000Z' }, '15/10/24'],
  [{ date: '10-15-24T14:30:20.000Z', locale: 'US' }, '15/10/24'],
  [{ date: '15-10-24T14:30:20.000Z', locale: 'UK' }, '15/10/24'],
  [{ date: '2024-10-15' }, '15/10/24'],
  [{ date: '10-15-24', locale: 'US' }, '15/10/24'],
  [{ date: '15-10-24', locale: 'UK' }, '15/10/24'],
  [{ date: '2024-10-15T14:30:20.000Z' }, '15/10/24'],
  [{ date: '10-15-24T14:30:20.000Z', locale: 'US' }, '15/10/24'],
  [{ date: '15-10-24T14:30:20.000Z', locale: 'UK' }, '15/10/24'],
  [{ date: '2024-10-15' }, '15/10/24'],
  [{ date: null }, null],
])('formatShortDateUK', (input: { date: string; locale: 'UK' | 'US' }, expected) => {
  test(`Expect ${input.date} to be ${expected}`, () => {
    expect(formatShortDateUK(input.date, input.locale)).toStrictEqual(expected);
  });
});

// --getMonday
describe.each([
  [{ date: '2024-10-15' }, new UTCDate('2024-10-14')],
  [{ date: '10-15-24', locale: 'US' }, new UTCDate('2024-10-14')],
  [{ date: '15-10-24', locale: 'UK' }, new UTCDate('2024-10-14')],
  [{ date: '2024-10-15T14:30:20.000Z' }, new UTCDate('2024-10-14T14:30:20.000Z')],
  [{ date: '10-15-24T14:30:20.000Z', locale: 'US' }, new UTCDate('2024-10-14T14:30:20.000Z')],
  [{ date: '15-10-24T14:30:20.000Z', locale: 'UK' }, new UTCDate('2024-10-14T14:30:20.000Z')],
  [{ date: '2024-10-15' }, new UTCDate('2024-10-14')],
  [{ date: '10-15-24', locale: 'US' }, new UTCDate('2024-10-14')],
  [{ date: '15-10-24', locale: 'UK' }, new UTCDate('2024-10-14')],
  [{ date: '2024-10-15T14:30:20.000Z' }, new UTCDate('2024-10-14T14:30:20.000Z')],
  [{ date: '10-15-24T14:30:20.000Z', locale: 'US' }, new UTCDate('2024-10-14T14:30:20.000Z')],
  [{ date: '15-10-24T14:30:20.000Z', locale: 'UK' }, new UTCDate('2024-10-14T14:30:20.000Z')],
  [{ date: '2024-10-15' }, new UTCDate('2024-10-14')],
  [{ date: new UTCDate('2024-10-15T14:30:20.000Z') }, new UTCDate('2024-10-14T14:30:20.000Z')],
  [{ date: new UTCDate('2024-10-15') }, new UTCDate('2024-10-14')],
  [{ date: null }, null],
])('getMonday', (input: { date: string; locale: 'UK' | 'US' }, expected) => {
  test(`Expect ${input.date} to be ${expected}`, () => {
    expect(getMonday(input.date, input.locale)).toStrictEqual(expected);
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
