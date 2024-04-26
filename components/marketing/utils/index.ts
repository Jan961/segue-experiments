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
  if (typeof inputDt !== 'string' || inputDt === undefined || inputDt === null) {
    return '';
  }

  const reversedDateStr = inputDt.split('/').reverse().join('/');
  const date = new Date(reversedDateStr);

  return date;
};
