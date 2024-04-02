import getNumericalOptions from 'utils/getNumericalOptions';

describe('getNumericalOptions', () => {
  it('returns correct array length with no omissions', () => {
    const options = getNumericalOptions(5, []);
    // Expect 5 because 5 options have been requested - there is no longer a '-' option
    expect(options.length).toBe(5);
  });

  it('omits specified values correctly', () => {
    const omitList = [2, 4];
    const options = getNumericalOptions(5, omitList);
    // Expect 4 because two values are omitted and '0' option is included
    expect(options.length).toBe(3);
    // Ensure omitted values are not in the array
    omitList.forEach((omitValue) => expect(options.some((option) => option.value === omitValue)).toBeFalsy());
  });

  it('includes the first item with text "" and value null', () => {
    const options = getNumericalOptions(1, []);
    expect(options[0]).toEqual({ text: '', value: null });
  });

  it('handles negative optionsLength gracefully', () => {
    const options = getNumericalOptions(-1, []);
    // Expecting only the '0' option with text '-'
    expect(options.length).toBe(1);
    expect(options[0]).toEqual({ text: '', value: null });
  });

  it('returns items with correct structure', () => {
    const options = getNumericalOptions(2, [2]);
    // Test the structure of one of the returned items
    options.forEach((option) => {
      expect(option).toHaveProperty('text');
      expect(option).toHaveProperty('value');
      expect(typeof option.text).toBe('string');
      expect(option.value === null || typeof option.value === 'number').toBeTruthy();
    });
  });
});
