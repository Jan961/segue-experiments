import { SelectOption } from 'components/core-ui-lib/Select/Select';
export const safeJsonParse = (jsonString: string): any => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return null;
  }
};

export const mapRecursive = <T>(
  oldArray: Array<T & { options?: T[] }>,
  callback: (item: T) => T,
  newArray: T[] = [],
): T[] => {
  if (oldArray.length <= 0) {
    // if all items have been processed return the new array
    return newArray;
  } else {
    // destructure the first item from old array and put remaining in a separate array
    let [item, ...theRest] = oldArray;
    if (item.options) {
      // item with options is cloned to avoid mutating the original object
      item = { ...item, options: mapRecursive<T>(item.options, callback) };
    }
    // create an array of the current new array and the result of the current item and the callback function
    const interimArray = [...newArray, callback(item)];
    // return a recursive call to to map to process the next item.
    return mapRecursive<T>(theRest, callback, interimArray);
  }
};

export const isNullOrEmpty = (value: any) => {
  if (!value || value === null) {
    return true;
  } else if (Array.isArray(value)) {
    return value.length === 0;
  } else if (typeof value === 'object') {
    return Object.keys(value).length === 0;
  }
};

export const transformToOptions = (
  list: any[],
  textKey: string,
  valueKey: string,
  textFn?: (listItem: any) => string,
  valueFn?: (listItem: any) => string,
): SelectOption[] => {
  return list.map((listItem) => ({
    text: listItem?.[textKey] || textFn?.(listItem),
    value: listItem?.[valueKey] || valueFn?.(listItem),
  }));
};

export const capitalCaseToCamelCase = (str: string) => {
  return str
    .replace(/\s(.)/g, function (match) {
      return match.toUpperCase();
    })
    .replace(/\s/g, '')
    .replace(/^(.)/, function (match) {
      return match.toLowerCase();
    });
};

export const convertObjectKeysToCamelCase = (obj: any) => {
  const newObj = {};
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      newObj[capitalCaseToCamelCase(key)] =
        typeof obj[key] === 'object' ? convertObjectKeysToCamelCase(obj[key]) : obj[key];
    }
  }
  return newObj;
};

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export function fileSizeFormatter(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} bytes`;
  } else if (bytes < 1048576) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  } else if (bytes < 1073741824) {
    return `${(bytes / 1048576).toFixed(2)} MB`;
  } else {
    return `${(bytes / 1073741824).toFixed(2)} GB`;
  }
}

export const getStatusFromProgress = (progress?: number) => {
  if (!progress) return;

  if (progress > 0 && progress < 100) {
    return 'Uploading';
  } else if (progress === 100) {
    return 'Uploaded';
  }
};

export const isNull = (value: unknown): boolean => value === null;

export const isUndefined = (value: unknown): boolean => value === undefined;

export const isNullOrUndefined = (value: unknown): boolean => isNull(value) || isUndefined(value);

export const noop = () => null;

export const insertAtPos = <T>(array: T[], element: T, position: number): T[] => {
  // Ensure the position is within bounds
  if (position < 0) {
    position = 0;
  } else if (position > array.length) {
    position = array.length;
  }

  // Insert the element at the specified position
  return [...array.slice(0, position), element, ...array.slice(position)];
};

export const removeAtPos = <T>(array: T[], position: number): T[] => {
  // Ensure the position is within bounds
  if (position < 0 || position >= array.length) {
    // If the position is out of bounds, return the original array
    return array;
  }

  // Remove the element at the specified position
  return [...array.slice(0, position), ...array.slice(position + 1)];
};

export const replaceAtPos = <T>(array: T[], element: T, position: number): T[] => {
  // Ensure the position is within bounds
  if (position < 0 || position >= array.length) {
    // If the position is out of bounds, return the original array
    return array;
  }

  // Replace the element at the specified position
  return [...array.slice(0, position), element, ...array.slice(position + 1)];
};

export const compareStrings = (a = '', b = '') => a?.toLowerCase?.().includes(b?.toLowerCase?.());

export const getAllOptions = (options: SelectOption[], allLabel?: string, allValue?: string | number) => [
  { text: allLabel ?? 'All', value: allValue ?? 'all' },
  ...options,
];

export const checkDecimalStringFormat = (decimalString: string, precision: number, scale: number, regex?: RegExp) => {
  const [integerPart, fractionalPart] = decimalString.split('.');
  if (regex && !regex.test(decimalString)) return false;
  if (integerPart.length > precision - scale || (fractionalPart && fractionalPart.length > scale)) return false;
  return true;
};
