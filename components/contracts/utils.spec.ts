import { parseAndSortDates } from './utils';

jest.mock('nanoid', () => ({
  nanoid: jest.fn(() => 'test-id'), // Mock nanoid to return 'test-id'
}));

describe('parseAndSortDates', () => {
  it('should parse and sort dates correctly when time is included', () => {
    const input = ['12:00? 2023-08-21', '10:00? 2023-08-21', '15:00? 2023-08-20'];
    const result = parseAndSortDates(input);
    console.log(result);

    expect(result).toEqual([
      { formattedDate: '2023-08-20 15:00', id: 'test-id' },
      { formattedDate: '2023-08-21 10:00 12:00', id: 'test-id' },
    ]);
  });

  it('should handle entries without time correctly', () => {
    const input = ['? 2023-08-21', '10:00? 2023-08-21', '? 2023-08-20'];
    const result = parseAndSortDates(input);

    expect(result).toEqual([
      { formattedDate: '2023-08-20', id: 'test-id' },
      { formattedDate: '2023-08-21 10:00', id: 'test-id' },
    ]);
  });

  it('should handle empty input array', () => {
    const input = [];
    const result = parseAndSortDates(input);

    expect(result).toEqual([]);
  });

  it('should handle a single entry correctly', () => {
    const input = ['? 2023-08-21'];
    const result = parseAndSortDates(input);

    expect(result).toEqual([{ formattedDate: '2023-08-21', id: 'test-id' }]);
  });

  it('should handle multiple dates correctly and sort them', () => {
    const input = ['10:00? 2023-08-22', '09:00? 2023-08-21', '10:00? 2023-08-21', '12:00? 2023-08-20'];
    const result = parseAndSortDates(input);

    expect(result).toEqual([
      { formattedDate: '2023-08-20 12:00', id: 'test-id' },
      { formattedDate: '2023-08-21 09:00 10:00', id: 'test-id' },
      { formattedDate: '2023-08-22 10:00', id: 'test-id' },
    ]);
  });
});
