import { ScheduleViewModel } from 'state/booking/selectors/scheduleSelector';

export const getDateBlockId = (schedule: ScheduleViewModel, dateToFind: string): number => {
  for (const section of schedule.Sections) {
    for (const date of section.Dates) {
      if (date.Date === dateToFind) {
        return section.Id;
      }
    }
  }
  return undefined;
};
