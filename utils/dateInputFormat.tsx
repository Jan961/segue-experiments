function formatInputDate(dateString) {
  if (!dateString) {
    return null;
  }

  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

<<<<<<< Updated upstream
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
  return `${year}/${month}/${day}`;
=======
=======
>>>>>>> 6849499 (merged main into VenueHistory and added final modal with column grouping - UI still needs tweaked and code needs tidied)
=======
>>>>>>> e349e74 (SK-49 venue history - venue select complete, comparision modal in progress - no-verify used as this is mid-dev)
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
<<<<<<< HEAD
>>>>>>> e349e74 (SK-49 venue history - venue select complete, comparision modal in progress - no-verify used as this is mid-dev)
=======
>>>>>>> 6849499 (merged main into VenueHistory and added final modal with column grouping - UI still needs tweaked and code needs tidied)
=======
>>>>>>> e349e74 (SK-49 venue history - venue select complete, comparision modal in progress - no-verify used as this is mid-dev)
=======
  return `${year}/${month}/${day}`;
>>>>>>> 8a88ade007900e868d3fa39b3cd647ad1df005b7
=======
  return `${day}/${month}/${year}`;
>>>>>>> Stashed changes
}

export default formatInputDate;
