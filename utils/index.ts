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

type RecursiveObject<T> = T & {
  options?: RecursiveObject<T>[];
};
/**
 * Flattens an array of hierarchical objects into a flat array of objects.
 * @param values - The array of hierarchical objects.
 * @returns The flattened array of objects.
 */
export const flattenHierarchicalOptions = <T>(values: RecursiveObject<T>[]): RecursiveObject<T>[] => {
  if (isNullOrEmpty(values)) {
    return [];
  }
  const flattenedOptions = values.reduce((acc, item) => {
    acc.push(item);

    if (!isNullOrEmpty(item.options)) {
      acc.push(...flattenHierarchicalOptions(item.options));
    }
    return acc;
  }, []);
  return flattenedOptions;
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

export const checkDecimalStringFormat = (decimalString: string, precision: number, scale: number, pattern?: RegExp) => {
  const [integerPart, fractionalPart] = decimalString.split('.');

  // Check regex pattern if provided
  if (pattern && !pattern.test(decimalString)) return false;

  // Check if the integer part length is within allowed precision minus the scale
  if (integerPart.length > precision - scale) return false;

  // Check if fractional part length is within allowed scale
  if (fractionalPart && fractionalPart.length > scale) return false;

  return true;
};

export const formatDecimalValue = (decimalString: any) => {
  if (isNullOrEmpty(decimalString)) {
    return '';
  }

  const floatValue = parseFloat(decimalString);

  if (isNaN(floatValue)) {
    return '';
  }

  return (Math.round(floatValue * 100) / 100).toFixed(2);
};

export const formatDecimalOnBlur = (event: any) => {
  const value = event.target.value;
  return formatDecimalValue(value);
};

export const formatPercentageValue = (percentageString: any) => {
  if (isNullOrEmpty(percentageString)) {
    return '';
  }

  const floatValue = parseFloat(percentageString);

  if (isNaN(floatValue)) {
    return '';
  }

  return parseFloat((Math.round(floatValue * 100) / 100).toString());
};

export const validateWhat3Words = (input: string) => {
  const wordParts = input.replace('/', '').split('.');
  if (wordParts.length === 3) {
    return true;
  } else {
    return false;
  }
};

// Helper function to check if a value is a valid number
export const isValidNumber = (value: string) => !isNaN(parseInt(value, 10));

// used to export number with the appriate ending (th, st, nd, rd)
export const numberToOrdinal = (n) => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

// used to map through an object and apply a transformer to all values - e.g. isUndefined
export const mapObjectValues = (obj: any, transformer: (key: string, value: any) => any) => {
  return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, transformer(key, value)]));
};

// used to return the value if not null or undefined - otherwise the function will return an empty string
export const tidyString = (value: string) => (isNullOrUndefined(value) ? '' : value);

/**
 * Replaces all the palceholders in the template string with the corresponding values in the data object.
 * @returns {string}
 * @param template - The template string containing placeholders. e.g. 'Hello, {name}!'
 * @param data - The data object containing key-value pairs to replace the placeholders. e.g. {name: 'John'}
 * @param prefix - The prefix used to identify the placeholders in the template string. Default is '{'.
 * @param suffix - The suffix used to identify the placeholders in the template string. Default is '}'.
 */
export const replaceTemplateString = (template, data, prefix = '{', suffix = '}') => {
  if (!template) return '';
  if (isNullOrEmpty(data)) return template;

  // Escape any special regex characters in prefix and suffix
  const ESCAPE_REGEX = /[-/\\^$*+?.()|[\]{}]/g;
  const escapedPrefix = prefix.replace(ESCAPE_REGEX, '\\$&');
  const escapedSuffix = suffix.replace(ESCAPE_REGEX, '\\$&');
  const pattern = new RegExp(`${escapedPrefix}(.*?)${escapedSuffix}`, 'g');

  return template.replace(pattern, (match, key) => {
    return key in data ? data[key] : match;
  });
};

export const getSegueMicroServiceUrl = (endpoint: string) => {
  const currEnvironment: string = isUndefined(process.env.DEPLOYMENT_ENV)
    ? process.env.NEXT_PUBLIC_DEPLOYMENT_ENV
    : process.env.DEPLOYMENT_ENV;

  const baseUrl: string = isUndefined(process.env.FASTHOST_BASE_URL)
    ? process.env.NEXT_PUBLIC_FASTHOST_BASE_URL
    : process.env.FASTHOST_BASE_URL;

  // if either DEPLOYMENT_ENV or FASTHOST_BASE_URL are undefined return an error
  if (isUndefined(currEnvironment) || isUndefined(baseUrl)) {
    console.error('either DEPLOYMENT_ENV or FASTHOST_BASE_URL is not set in the environment variables');
    return;
  }

  let deploymentRoute = '';

  // if active environment is production, remove the
  if (currEnvironment === 'prod') {
    deploymentRoute = '/api';

    // otherwise, prepend the url with a slash
  } else {
    deploymentRoute = '/' + currEnvironment + '/api';
  }

  // concatenate the parts of the URL to form the complete api endpoint
  return baseUrl + deploymentRoute + endpoint;
};
