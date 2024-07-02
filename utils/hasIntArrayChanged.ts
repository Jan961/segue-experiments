import { isNullOrEmpty } from 'utils';

/**
 *
 * @param {Array<number>} arr1
 * @param {Array<number>} arr2
 * @returns
 *
 * The purpose of this function is to analyse an integer array for changes.
 * If changed, the function will return true else it will return false.
 *
 * e.g.
 *
 * hasIntArrayChanged([1, 2, 3], [1, 2, 3]) - expected result = false
 * hasIntArrayChanged([1, 2, 3, 4], [1, 2, 3]) - expected result = true
 * hasIntArrayChanged([1, 2, 3], [1, 2, 4]) - expected result = true
 *
 */
export const hasIntArrayChanged = (arr1: Array<number>, arr2: Array<number>) => {
  // handle undefined
  if (arr1 === undefined || arr2 === undefined) {
    return false;
  }

  // handle null
  if (isNullOrEmpty(arr1) || isNullOrEmpty(arr2)) {
    return false;
  }

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
};
