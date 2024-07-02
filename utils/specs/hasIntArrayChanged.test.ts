// compare.test.js

// The compare function
function compare(arr1, arr2) {
  // Check if the lengths are different
  if (arr1.length !== arr2.length) {
    return true;
  }

  // Check each element for differences
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return true;
    }
  }

  // If no differences were found, return false
  return false;
}

// Jest tests for the compare function
describe('compare function', () => {
  test('should return false for identical arrays', () => {
    expect(compare([1, 2, 3], [1, 2, 3])).toBe(false);
  });

  test('should return true for arrays with different lengths', () => {
    expect(compare([1, 2, 3], [1, 2, 3, 4])).toBe(true);
  });

  test('should return true for arrays with different elements', () => {
    expect(compare([1, 2, 3], [1, 2, 4])).toBe(true);
    expect(compare([1, 2, 3], [4, 5, 6])).toBe(true);
  });

  test('should return true for arrays where only one element is different', () => {
    expect(compare([1, 2, 3], [1, 2, 4])).toBe(true);
  });

  test('should return true for arrays where elements are in different order', () => {
    expect(compare([1, 2, 3], [3, 2, 1])).toBe(true);
  });

  test('should return false for empty arrays', () => {
    expect(compare([], [])).toBe(false);
  });

  test('should return true when one array is empty and the other is not', () => {
    expect(compare([], [1, 2, 3])).toBe(true);
    expect(compare([1, 2, 3], [])).toBe(true);
  });
});
