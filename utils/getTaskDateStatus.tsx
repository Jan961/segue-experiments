export default function getTaskDateStatusColor(date) {
    const inputDate = new Date(date);
    const today = new Date();
    const differenceInDays = Math.ceil((inputDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    if (differenceInDays <= 7 && differenceInDays >= 0) {
      return ' bg-amber-300 ';
    } else if (differenceInDays < 0) {
      return ' bg-red-300 ';
    } else {
      return 'none';
    }
  }