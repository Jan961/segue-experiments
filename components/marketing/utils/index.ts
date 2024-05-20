import { ActivityDTO, BookingContactNoteDTO } from 'interfaces';

export const hasActivityChanged = (oldActivity: ActivityDTO, newActivity: ActivityDTO): boolean => {
  // List all keys to be compared
  const keys = Object.keys(oldActivity) as Array<keyof ActivityDTO>;

  for (const key of keys) {
    // if Id skip - we can assume the Id will be the same
    if (key === 'Id') {
      return;
    }

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

export const hasContactNoteChanged = (
  oldConNote: BookingContactNoteDTO,
  newConNote: BookingContactNoteDTO,
): boolean => {
  // List all keys to be compared
  const keys = Object.keys(oldConNote) as Array<keyof BookingContactNoteDTO>;

  for (const key of keys) {
    // if Id skip - we can assume the Id will be the same
    if (key === 'Id') {
      return;
    }

    // handle dates differently
    if (key === 'ContactDate') {
      // check for change
      if (new Date(oldConNote[key]).getTime() !== new Date(newConNote[key]).getTime()) {
        return true;
      }
      // else any other field
    } else {
      if (oldConNote[key] !== newConNote[key]) {
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
