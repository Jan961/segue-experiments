import { dateTimeToTime } from 'services/dateService';
import formatInputDate from './dateInputFormat';
import { isNullOrUndefined } from 'utils';
/**
 *
 * @param templateData
 * @returns Formatted Object
 *
 * This function is primarily used for formatting data in preparation for exporting
 * to a file with  Easy-template-x.
 *
 * The following formatting is handled:
 * (PLEASE add to this comment if you add additional formatting clauses)
 *
 * 1. Dates - if object key begins DT_,
 *            date value will be converted to our system wide date display format dd/mm/yy
 *
 * 2. Durations (e.g. Production running time)
 *    Some durations are entered as hh:mm and stored as a date object with nulled time.
 *    e.g. if the running time was entered as 2:45, it would be stored in the db as 2024-10-02T02:45:00.000Z
 *    When the TM_LONG_ prefix is added in front of the object key, the time would be returned as
 *    2 hour(s) 45 minutes
 *
 * 3. Times
 *    Times are stored as 2024-10-02T02:45:00.000Z in the db.
 *    When the TM_ prefix is added to the front of the object key, the hh:mm representation of the value
 *    will be returned.
 */
export const formatTemplateObj = (templateData: any) => {
  return {
    ...Object.fromEntries(
      Object.entries(templateData).map(([key, value]) => {
        // Skip keys with values that are arrays or if value is null or undefined
        if (Array.isArray(value) || isNullOrUndefined(value)) {
          return [key, value];
        }

        // Apply transformations for specific keys
        if (key.startsWith('DT_')) {
          return [key, formatInputDate(value)];
        } else if (key.startsWith('TM_LONG_')) {
          const tmLongDt = new Date(value.toString()).toISOString();
          const hrMinArray = dateTimeToTime(tmLongDt.toString()).split(':');
          return [key, `${hrMinArray[0]} hour(s) ${hrMinArray[1]} minutes`];
        } else if (key.startsWith('TM_')) {
          const tmDt = new Date(value.toString()).toISOString();
          return [key, dateTimeToTime(tmDt.toString())];
        }

        // Return the unchanged key-value pair for other cases
        return [key, value];
      }),
    ),
  };
};
