import { useEffect, useMemo, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { filterState } from 'state/booking/filterState';
import { productionJumpState } from 'state/booking/productionJumpState';
import { rowsSelector } from 'state/booking/selectors/rowsSelector';

const useBookingFilter = () => {
  const [filter, setFilter] = useRecoilState(filterState);
  const { selected } = useRecoilValue(productionJumpState);
  const rows = useRecoilValue(rowsSelector);
  const [rowsForProduction, setRowsForProduction] = useState([]);

  const filteredRows = useMemo(() => {
    const filteredRowList = rowsForProduction.filter(({ dateTime, status, venue, town }) => {
      return (
        (!filter.endDate || new Date(dateTime) <= filter.endDate) &&
        (!filter.startDate || new Date(dateTime) >= filter.startDate) &&
        (filter.status === 'all' || status === filter.status) &&
        (!filter.venueText ||
          venue?.toLowerCase?.().includes?.(filter.venueText?.toLowerCase()) ||
          town?.toLowerCase?.().includes?.(filter.venueText?.toLowerCase()))
      );
    });
    return filteredRowList;
  }, [rowsForProduction, filter.endDate, filter.startDate, filter.status, filter.venueText]);

  useEffect(() => {
    if (rows && rows.length > 0) {
      const filteredRowList = rows
        .filter(({ productionId }) => {
          return selected === -1 || productionId === selected;
        })
        .sort((a, b) => {
          return new Date(a.dateTime).valueOf() - new Date(b.dateTime).valueOf();
        });
      setRowsForProduction(filteredRowList);

      if (filteredRowList.length > 0) {
        const minDate = new Date(filteredRowList[0].dateTime);
        const maxDate = new Date(filteredRowList[filteredRowList.length - 1].dateTime);
        setFilter({ ...filter, productionStartDate: minDate, productionEndDate: maxDate });
      }
    } else {
      setRowsForProduction([]);
    }
  }, [rows, selected]);

  return filteredRows;
};

export default useBookingFilter;
