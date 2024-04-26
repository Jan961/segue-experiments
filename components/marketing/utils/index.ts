import { ActivityDTO } from 'interfaces';

export const hasActivityChanged = (oldActivity: ActivityDTO, newActivity: ActivityDTO): boolean => {
  // List all keys to be compared
  const keys = Object.keys(oldActivity) as Array<keyof ActivityDTO>;

  for (const key of keys) {
    // handle dates differently
    if (key === 'Date' || key === 'DueByDate') {
      // check for change
      if (new Date(oldActivity[key]).getTime() !== new Date(newActivity[key]).getTime()) {
        return true;
      }
      // else any other field
    } else {
      if (oldActivity[key] !== newActivity[key]) {
        return true;
      }
    }
  }

  return false;
};

export const reverseDate = (inputDt: string) => {
  if (typeof inputDt !== 'string') {
    throw new Error("Invalid input: Input must be a string in 'DD/MM/YYYY' format.");
  }

  const reversedDateStr = inputDt.split('/').reverse().join('/');
  const date = new Date(reversedDateStr);

  // Validate if the date created is valid
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date: The input does not form a valid date.');
  }

  return date;
};
