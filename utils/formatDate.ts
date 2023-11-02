function formatDate(inputDate) {
  if (inputDate) {
    const newDate = new Date(inputDate);
    return newDate.toLocaleDateString();
  } else {
    return null;
  }
}

export default formatDate;
