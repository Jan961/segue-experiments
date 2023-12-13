import { useCallback, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { filterState } from 'state/booking/filterState';

const useBookingFilter = ({ Sections, rehearsalDict, gifuDict, otherDict, bookingDict }) => {
  const filter = useRecoilValue(filterState);
  const filterDateByStatus = useCallback(
    (Date: any, status: string): any => {
      if (!Date || !status) return Date;
      const { RehearsalIds, GetInFitUpIds, OtherIds, BookingIds } = Date;
      const filteredRehearsalIds = RehearsalIds.filter((id) => rehearsalDict?.[id]?.StatusCode === status);
      const filteredGetInFitUpIds = GetInFitUpIds.filter((id) => gifuDict?.[id]?.StatusCode === status);
      const filteredOtherIds = OtherIds.filter((id) => otherDict?.[id]?.StatusCode === status);
      const filteredBookingIds = BookingIds.filter((id) => bookingDict?.[id]?.StatusCode === status);
      if (
        !(
          filteredBookingIds.length ||
          filteredGetInFitUpIds.length ||
          filteredOtherIds.length ||
          filteredRehearsalIds.length
        )
      )
        return null;
      return {
        ...Date,
        RehearsalIds: filteredRehearsalIds,
        GetInFitUpIds: filteredGetInFitUpIds,
        OtherIds: filteredOtherIds,
        BookingIds: filteredBookingIds,
      };
    },
    [bookingDict, rehearsalDict, gifuDict, otherDict],
  );
  const filteredSections = useMemo(() => {
    let result = [...Sections];
    if (filter.startDate) {
      result = result
        .map((section) => ({
          ...section,
          Dates: section.Dates.filter((date) => new Date(date.Date) >= new Date(filter.startDate)),
        }))
        .filter((section) => section.Dates.length);
    }
    if (filter.endDate) {
      result = result
        .map((section) => ({
          ...section,
          Dates: section.Dates.filter((date) => new Date(date.Date) <= new Date(filter.endDate)),
        }))
        .filter((section) => section.Dates.length);
    }
    if (filter.status) {
      result = result
        .map((section) => ({
          ...section,
          Dates: section.Dates.map((date) => filterDateByStatus(date, filter.status)).filter((x) => x),
        }))
        .filter((section) => section.Dates.length);
    }
    return result;
  }, [filter, Sections, filterDateByStatus]);
  return filteredSections;
};

export default useBookingFilter;
