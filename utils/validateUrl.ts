import { isNullOrEmpty } from './index';

export const validateUrl = (url: string) => {
  try {
    const urlValidationRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;
    const protocolMatch = /^(https?:\/\/)/;
    if (urlValidationRegex.test(url)) {
      url = (protocolMatch.test(url) ? '' : 'https://') + url;
    }

    return !isNullOrEmpty(new URL(url));
  } catch (e) {
    console.log(e);
    return false;
  }
};
