import { UTCDate } from '@date-fns/utc';
import {
  simpleToDateMDY,
  newDate,
  calculateWeekNumber,
  safeDateV2,
  dateTimeToTime,
  addOneMonthV2,
  dateToSimple,
  formatShortDateUKV2,
  formattedDateWithWeekDay,
  getKey,
  getMondayV2,
  getWeekDayV2,
  getDateDaysAway,
  dateStringToPerformancePairV2,
  timeFormat,
  simpleToDateDMY,
  getArrayOfDatesBetween,
  Locale,
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
    const val = safeDateV2(input.date, input.locale);
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
    expect(dateStringToPerformancePairV2(input)).toBeNull();
  });

  test('Should return null for empty string', () => {
    const input = '';
    expect(dateStringToPerformancePairV2(input)).toBeNull();
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
  test(`Expect ${input.date} to be ${expected}`, () => {
    expect(getWeekDayV2(input.date, input.format, input.locale)).toStrictEqual(expected);
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
    expect(addOneMonthV2(input.date, input.locale)).toStrictEqual(expected);
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
    expect(getMondayV2(input.date, input.locale)).toStrictEqual(expected);
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
