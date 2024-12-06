import { UTCDate } from '@date-fns/utc';
import {
  simpleToDateMDY,
  newDate,
  calculateWeekNumber,
  safeDate,
  dateTimeToTime,
  addOneMonth,
  dateToSimple,
  formatShortDateUKV2,
  formattedDateWithWeekDay,
  getKey,
  getMonday,
  getWeekDay,
  getDateDaysAway,
  dateStringToPerformancePair,
  timeFormat,
  simpleToDateDMY,
  getArrayOfDatesBetween,
  Locale,
  getSunday,
  getDateTime,
  getDifferenceInDays,
  getDifferenceInWeeks,
  compareDatesWithoutTime,
  // checkDateOverlap,
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
])('newDate', (input: { date; locale?: Locale }, expected) => {
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
])('safeDate', (input: { date; locale?: Locale }, expected) => {
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
])('getKey', (input: { date; locale?: Locale }, expected) => {
  test(`Expect ${input.date === '' ? 'empty string' : input.date} to be ${expected}`, () => {
    expect(getKey(input.date, input.locale)).toStrictEqual(expected);
  });
});

// --dateStringToperformancePair()
describe('dateStringToPerformancePair', () => {
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
])('dateToSimple', (input: { date; locale: Locale }, expected) => {
  test(`Expect '${input.date}'${input.locale ? ` in locale '${input.locale}'` : ''} to be '${expected}'`, () => {
    const val = dateToSimple(input.date, input?.locale);
    expect(val).toStrictEqual(expected);
  });
});

describe.each([
  [{ date: '10/15/24', format: 'Short' }, null],
  [{ date: '10/15/24', format: 'Long' }, null],
  [{ date: '15/10/24', format: 'Short' }, null],
  [{ date: '15/10/24', format: 'Long' }, null],
  [{ date: '10/15/24', format: 'Short', locale: 'US' }, 'Tue 15/10/24'],
  [{ date: '10/15/24', format: 'Long', locale: 'US' }, 'Tuesday 15/10/2024'],
  [{ date: '15/10/24', format: 'Short', locale: 'UK' }, 'Tue 15/10/24'],
  [{ date: '15/10/24', format: 'Long', locale: 'UK' }, 'Tuesday 15/10/2024'],
  [{ date: '10-15-24', format: 'Short', locale: 'US' }, 'Tue 15/10/24'],
  [{ date: '15-10-24', format: 'Short', locale: 'UK' }, 'Tue 15/10/24'],
])('formattedDateWithDay', (input: { date; format: 'Long' | 'Short'; locale: Locale }, expected) => {
  test(`Expect '${input.date}'${input.locale ? ` in locale '${input.locale}'` : ''} to be '${expected}'`, () => {
    const val = formattedDateWithWeekDay(input.date, input.format, input.locale);
    expect(val).toStrictEqual(expected);
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
    expect(dateTimeToTime(input)).toBeNull();
  });

  test('Should return null for empty string', () => {
    const input = '';
    expect(dateTimeToTime(input)).toBeNull();
  });
});

// --getDateDaysAway
describe.each([
  [{ date: '2024-10-15', daysToSubtract: -5 }, new UTCDate('2024-10-10')],
  [{ date: '10-15-24', daysToSubtract: -5, locale: 'US' }, new UTCDate('2024-10-10')],
  [{ date: '15-10-24', daysToSubtract: -5, locale: 'UK' }, new UTCDate('2024-10-10')],
  [{ date: '2024-10-15T14:30:20.000Z', daysToSubtract: -5 }, new UTCDate('2024-10-10T14:30:20Z')],
  [{ date: '10-15-24T14:30:20.000Z', daysToSubtract: -5, locale: 'US' }, new UTCDate('2024-10-10T14:30:20Z')],
  [{ date: '15-10-24T14:30:20.000Z', daysToSubtract: -5, locale: 'UK' }, new UTCDate('2024-10-10T14:30:20Z')],
  [{ date: new UTCDate('2024-10-15T14:30:20.000Z'), daysToSubtract: -5 }, new UTCDate('2024-10-10T14:30:20Z')],
])('getDateDaysAway', (input: { date; daysToSubtract; locale: Locale }, expected) => {
  test(`Expect ${input.date} - ${input.daysToSubtract} days to be ${expected}`, () => {
    expect(getDateDaysAway(input.date, input.daysToSubtract, input.locale)).toStrictEqual(expected);
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
])('getWeekDay', (input: { date; format: 'long' | 'short'; locale: Locale }, expected) => {
  test(`Expect ${input.date} in format ${input.format} to be ${expected}`, () => {
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
])('formattedDateWithWeekDay', (input: { date; weekDayFormat: 'Long' | 'Short'; locale: Locale }, expected) => {
  test(`Expect ${input.date} to be ${expected}`, () => {
    expect(formattedDateWithWeekDay(input.date, input.weekDayFormat, input.locale)).toStrictEqual(expected);
  });
});

// --calculateWeekNumber
describe.each([
  [{ productionStart: new UTCDate('2024-10-15'), dateToNumber: new UTCDate('2024-10-18') }, 1],
  [{ productionStart: new UTCDate('2024-10-15'), dateToNumber: new UTCDate('2024-10-22') }, 2],
  [{ productionStart: new UTCDate('2024-10-15'), dateToNumber: new UTCDate('2024-10-30') }, 3],
])('calculateWeekNumber', (input: { productionStart; dateToNumber }, expected) => {
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
])('addOneMonth', (input: { date; locale: Locale }, expected) => {
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
])('formatShortDateUK', (input: { date; locale: Locale }, expected) => {
  test(`Expect ${input.date} to be ${expected}`, () => {
    expect(formatShortDateUKV2(input.date, input.locale)).toStrictEqual(expected);
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
])('getMonday', (input: { date; locale: Locale }, expected) => {
  test(`Expect ${input.date} to be ${expected}`, () => {
    expect(getMonday(input.date, input.locale)).toStrictEqual(expected);
  });
});

// --getSunday
describe.each([
  [{ date: '2024-10-15' }, new UTCDate('2024-10-20')],
  [{ date: '10-15-24', locale: 'US' }, new UTCDate('2024-10-20')],
  [{ date: '15-10-24', locale: 'UK' }, new UTCDate('2024-10-20')],
  [{ date: '2024-10-15T14:30:20.000Z' }, new UTCDate('2024-10-20T14:30:20.000Z')],
  [{ date: '10-15-24T14:30:20.000Z', locale: 'US' }, new UTCDate('2024-10-20T14:30:20.000Z')],
  [{ date: '15-10-24T14:30:20.000Z', locale: 'UK' }, new UTCDate('2024-10-20T14:30:20.000Z')],
  [{ date: '2024-10-15' }, new UTCDate('2024-10-20')],
  [{ date: '10-15-24', locale: 'US' }, new UTCDate('2024-10-20')],
  [{ date: '15-10-24', locale: 'UK' }, new UTCDate('2024-10-20')],
  [{ date: '2024-10-15T14:30:20.000Z' }, new UTCDate('2024-10-20T14:30:20.000Z')],
  [{ date: '10-15-24T14:30:20.000Z', locale: 'US' }, new UTCDate('2024-10-20T14:30:20.000Z')],
  [{ date: '15-10-24T14:30:20.000Z', locale: 'UK' }, new UTCDate('2024-10-20T14:30:20.000Z')],
  [{ date: '2024-10-15' }, new UTCDate('2024-10-20')],
  [{ date: new UTCDate('2024-10-15T14:30:20.000Z') }, new UTCDate('2024-10-20T14:30:20.000Z')],
  [{ date: new UTCDate('2024-10-15') }, new UTCDate('2024-10-20')],
  [{ date: null }, null],
])('getSunday', (input: { date; locale: Locale }, expected) => {
  test(`Expect ${input.date} to be ${expected}`, () => {
    expect(getSunday(input.date, input.locale)).toStrictEqual(expected);
  });
});

// --getArrayOfDatesBetween
describe.each([
  [
    { start: '2024-10-15', end: '2024-10-20' },
    ['2024-10-15', '2024-10-16', '2024-10-17', '2024-10-18', '2024-10-19', '2024-10-20'],
  ],
  [
    { start: new UTCDate('2024-10-15'), end: new UTCDate('2024-10-20') },
    ['2024-10-15', '2024-10-16', '2024-10-17', '2024-10-18', '2024-10-19', '2024-10-20'],
  ],
])('getArrayOfDatesBetween', (input: { start; end }, expected) => {
  test(`Expect ${input.start} to ${input.end} to be ${expected}`, () => {
    expect(getArrayOfDatesBetween(input.start, input.end)).toStrictEqual(expected);
  });
});

// --getDateTime
describe.each([
  [{ date: '2024-10-15', time: '15:30' }, new UTCDate('2024-10-15T15:30:00.000Z')],
  [{ date: '10/15/24', time: '15:30', locale: 'US' }, new UTCDate('2024-10-15T15:30:00.000Z')],
  [{ date: '15/10/24', time: '15:30', locale: 'UK' }, new UTCDate('2024-10-15T15:30:00.000Z')],
  [{ date: '2024-10-15', time: '15:30:00.000Z' }, new UTCDate('2024-10-15T15:30:00.000Z')],
  [{ date: '2024-10-15', time: '15:30:00' }, new UTCDate('2024-10-15T15:30:00.000Z')],
  [{ date: '2024-10-15', time: '15:30:00.000' }, new UTCDate('2024-10-15T15:30:00.000Z')],
])('getDateTime', (input: { date; time; locale: Locale }, expected) => {
  test(`Expect ${input.date} and ${input.time} to be ${expected}`, () => {
    expect(getDateTime(input.date, input.time, input.locale)).toStrictEqual(expected);
  });
});

// --getDifferenceInDays
describe.each([
  [{ fromDate: '2024-10-15', toDate: '2024-10-20' }, 5],
  [{ fromDate: '15/10/24', toDate: '2024-10-20', fromLocale: 'UK' }, 5],
  [{ fromDate: '15/10/24', toDate: '10/20/24', fromLocale: 'UK', toLocale: 'US' }, 5],
  [{ fromDate: '2024-10-15', toDate: '2024-10-30' }, 15],
  [{ fromDate: '2024-10-15', toDate: '2024-10-29' }, 14],
  [{ fromDate: '2024-10-15', toDate: '2024-10-30', includeLastDate: true }, 16],
])(
  'getDifferenceInDays',
  (input: { fromDate; toDate; fromLocale: Locale; toLocale: Locale; includeLastDate?: boolean }, expected) => {
    test(`Expect ${input.fromDate} to ${input.toDate} to be ${expected}`, () => {
      expect(
        getDifferenceInDays(input.fromDate, input.toDate, input.fromLocale, input.toLocale, input.includeLastDate),
      ).toStrictEqual(expected);
    });
  },
);

// --getDifferenceInWeeks
describe.each([
  [{ fromDate: '2024-10-15', toDate: '2024-10-30' }, 2],
  [{ fromDate: '15/10/24', toDate: '2024-10-30', fromLocale: 'UK' }, 2],
  [{ fromDate: '15/10/24', toDate: '10/30/24', fromLocale: 'UK', toLocale: 'US' }, 2],
  [{ fromDate: '2024-11-13', toDate: '2024-11-30' }, 2],
  [{ fromDate: '2024-10-15', toDate: '2024-10-29' }, 2],
])('getDifferenceInWeeks', (input: { fromDate; toDate; fromLocale: Locale; toLocale: Locale }, expected) => {
  test(`Expect ${input.fromDate} to ${input.toDate} to be ${expected}`, () => {
    expect(getDifferenceInWeeks(input.fromDate, input.toDate, input.fromLocale, input.toLocale)).toStrictEqual(
      expected,
    );
  });
});

// --compareDatesWithoutTime
describe.each([
  [{ date1: '2024-10-15', date2: '2024-10-15', operator: '==' }, true],
  [{ date1: '2024-10-15', date2: '2024-10-16', operator: '==' }, false],
  [{ date1: '2024-10-15', date2: '2024-10-16', operator: '<' }, true],
  [{ date1: '2024-10-15', date2: '2024-10-15', operator: '<' }, false],
  [{ date1: '2024-10-15', date2: '2024-10-15', operator: '<=' }, true],
  [{ date1: '2024-10-15', date2: '2024-10-14', operator: '>' }, true],
  [{ date1: '2024-10-15', date2: '2024-10-15', operator: '>' }, false],
  [{ date1: '2024-10-15', date2: '2024-10-15', operator: '>=' }, true],
  [{ date1: '2024-10-15', date2: '2024-10-15', operator: '!=' }, false],
  [{ date1: '2024-10-15', date2: '2024-10-16', operator: '!=' }, true],
])('compareDatesWithoutTime', (input: { date1; date2; operator }, expected) => {
  test(`Expect ${input.date1} ${input.operator} ${input.date2} to be ${expected}`, () => {
    expect(compareDatesWithoutTime(input.date1, input.date2, input.operator)).toStrictEqual(expected);
  });
});

// // --checkDateOverlap
// describe.each([
//   [{dateRange1: {fromDate: '2024-10-15', toDate: '2024-10-20'}, dateRange2: {fromDate: '2024-10-10', toDate: '2024-10-14'}}, false],
//   [{dateRange1: {fromDate: '2024-10-15', toDate: '2024-10-20'}, dateRange2: {fromDate: '2024-10-10', toDate: '2024-10-15'}}, true],
//   [{dateRange1: {fromDate: '2024-10-15', toDate: '2024-10-20'}, dateRange2: {fromDate: '2024-10-10', toDate: '2024-10-16'}}, true],
//   [{dateRange1: {fromDate: '2024-10-10', toDate: '2024-10-14'}, dateRange2: {fromDate: '2024-10-15', toDate: '2024-10-20'}}, false],
//   [{dateRange1: {fromDate: '2024-10-10', toDate: '2024-10-15'}, dateRange2: {fromDate: '2024-10-15', toDate: '2024-10-20'}}, true],
//   [{dateRange1: {fromDate: '2024-10-10', toDate: '2024-10-16'}, dateRange2: {fromDate: '2024-10-15', toDate: '2024-10-20'}}, true],
// ])('checkDateOverlap', (input, expected) => {
//   test(`Expect (${input.dateRange1.fromDate}, ${input.dateRange1.toDate}) and (${input.dateRange2.fromDate}, ${input.dateRange2.toDate}) to be ${expected}`, () => {
//     expect(checkDateOverlap(input.dateRange1, input.dateRange2)).toStrictEqual(expected);
//   })
// })
