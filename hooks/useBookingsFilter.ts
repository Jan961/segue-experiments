import { useCallback, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { filterState } from 'state/booking/filterState';
import { productionJumpState } from 'state/booking/productionJumpState';
import { rowsSelector } from 'state/booking/selectors/rowsSelector';

const useBookingFilter = ({ Sections, rehearsalDict, gifuDict, otherDict, bookingDict }) => {
  const filter = useRecoilValue(filterState);
  const { selected } = useRecoilValue(productionJumpState);
  const rows = useRecoilValue(rowsSelector);
  console.table(rows);
  const filteredRows = useMemo(() => {
    const filteredRowList = [];
    for (const row of rows) {
      const { dateTime, status, productionId } = row;
      let filtered = false;
      if (selected !== -1) {
        filtered = productionId !== selected;
      }
      if (filter.endDate) {
        filtered = new Date(dateTime) >= new Date(filter.endDate);
      }
      if (filter.startDate) {
        filtered = new Date(dateTime) <= new Date(filter.startDate);
      }
      if (filter.status) {
        filtered = status !== filter.status;
      }
      if (!filtered) {
        filteredRowList.push(row);
      }
    }
    return filteredRowList.sort((a, b) => {
      return new Date(a.date).valueOf() - new Date(b.date).valueOf();
    });
  }, [rows, filter]);
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
  return { filteredSections, rows: filteredRows };
};

export default useBookingFilter;
