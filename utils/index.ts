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
  } else if (typeof value === 'string') {
    return value === '';
  } else if (Array.isArray(value)) {
    return value.length === 0;
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
