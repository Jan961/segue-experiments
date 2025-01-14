const formatInputDate = (dateString) => {
  if (!dateString) {
    return null;
  }

  const date = new Date(dateString);

  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${day}/${month}/${year}`;
};

export default formatInputDate;
