export const validateUrl = (url: string) => {
  try {
    const urlValidationRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;
    return urlValidationRegex.test(url);
  } catch (e) {
    console.log(e);
    return false;
  }
};
