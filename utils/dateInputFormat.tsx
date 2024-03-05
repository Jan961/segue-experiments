function formatInputDate(dateString:string, delimiter:string) {
  if (!dateString) {
    return null;
  }

  const usrLocale = navigator.language;

  const date = new Date(dateString);

  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  // Adjust the order based on the locale
  if (usrLocale === 'en-US') {
    return `${month}${delimiter}${day}${delimiter}${year}`;
  } else if (usrLocale === 'en-GB') {
    return `${day}${delimiter}${month}${delimiter}${year}`;
  } else {
    // Default to UK format if locale is not provided or unsupported
    return `${day}${delimiter}${month}${delimiter}${year}`;
  }
}

export default formatInputDate;