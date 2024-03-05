function formatInputDate(dateString:string, delimiter:string) {
  if (!dateString) {
    return null;
  }

  const usrLocale = navigator.language;

  const date = new Date(dateString);

  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

<<<<<<< HEAD
<<<<<<< HEAD
  return `${year}/${month}/${day}`;
=======
=======
>>>>>>> 6849499 (merged main into VenueHistory and added final modal with column grouping - UI still needs tweaked and code needs tidied)
  // Adjust the order based on the locale
  if (usrLocale === 'en-US') {
    return `${month}${delimiter}${day}${delimiter}${year}`;
  } else if (usrLocale === 'en-GB') {
    return `${day}${delimiter}${month}${delimiter}${year}`;
  } else {
    // Default to UK format if locale is not provided or unsupported
    return `${day}${delimiter}${month}${delimiter}${year}`;
  }
<<<<<<< HEAD
>>>>>>> e349e74 (SK-49 venue history - venue select complete, comparision modal in progress - no-verify used as this is mid-dev)
=======
>>>>>>> 6849499 (merged main into VenueHistory and added final modal with column grouping - UI still needs tweaked and code needs tidied)
}

export default formatInputDate;