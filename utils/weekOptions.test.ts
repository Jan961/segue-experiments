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
});
