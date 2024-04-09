import { isNullOrEmpty } from 'utils';

export const formatUrl = (inputUrl: string): string => {
  if (isNullOrEmpty(inputUrl)) {
    return '';
  }

  if (inputUrl.startsWith('https://')) {
    return inputUrl;
  }
  return `https://${inputUrl}`;
};
