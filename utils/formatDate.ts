function formatDate(inputDate) {
  if (inputDate) {
    let newDate = new Date(inputDate);
    return newDate.toLocaleDateString();
  } else {
    return null;
  }
}

export default formatDate;
