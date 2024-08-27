import { ActivityDTO, BookingContactNoteDTO } from 'interfaces';
import { GlobalActivity } from '../modal/GlobalActivityModal';
import ExcelJS from 'exceljs';

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

export const hasAllocSeatsChanged = (oldAllocSeat: any, newAllocSeat: any): boolean => {
  // Remove the 'Id, AvailableCompId' key if it exists
  delete oldAllocSeat.AvailableCompId;
  delete newAllocSeat.AvailableCompId;
  delete oldAllocSeat.Id;
  delete newAllocSeat.Id;

  // List all keys to be compared
  const keys = Object.keys(oldAllocSeat) as Array<keyof typeof oldAllocSeat>;

  // Check if any key values (other than 'Id') do not match
  const hasChanged = keys.some((key) => {
    return oldAllocSeat[key] !== newAllocSeat[key];
  });

  return hasChanged;
};

export const reverseDate = (inputDt: string) => {
  if (typeof inputDt !== 'string' || inputDt === undefined || inputDt === null) {
    return '';
  }

  const reversedDateStr = inputDt.split('/').reverse().join('/');
  const date = new Date(reversedDateStr);

  return date;
};

export const hasGlobalActivityChanged = (oldActivity: GlobalActivity, newActivity: GlobalActivity): boolean => {
  // List all keys to be compared
  const keys = Object.keys(oldActivity) as Array<keyof GlobalActivity>;

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
    } else if (key === 'VenueIds') {
      const venueIdsEqual = JSON.stringify(oldActivity[key]) === JSON.stringify(newActivity[key]);
      if (!venueIdsEqual) {
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

export const validateSpreadsheetFile = async (file) => {
  // file[0].file = new File([], file[0].file.name)
  // note that the check when hitting the ok/upload button uses the selectedfiles list to check for progress and updating the file name here and not there cause issue

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(file[0].file);

  workbook.eachSheet((worksheet) => {
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        if (typeof cell.value === 'string') {
          cell.value = cell.value.toUpperCase();
        }
      });
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: file[0].file.type });

  const newFile = new File([blob], file[0].file.name, {
    type: file[0].file.type,
  });

  console.log('new file:', newFile);
  console.log('old file:', file[0].file);

  file[0].file = newFile;

  console.log(file);
  return file;
};
