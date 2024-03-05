// import { findPrevAndNextBookings } from 'components/bookings/panel/utils/findPrevAndNextBooking';
import axios from 'axios';
import { findPreviosAndNextBookings, hasContinuosGap } from 'components/bookings/panel/utils/findClosestBooking';
import { gapSuggestColumnDefs, styleProps } from 'components/bookings/table/tableConfig';
import Button from 'components/core-ui-lib/Button';
import Table from 'components/core-ui-lib/Table';
import { GapSuggestionReponse, GapSuggestionUnbalancedProps } from 'pages/api/venue/read/distance';
import { useMemo, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { bookingState } from 'state/booking/bookingState';
import { rowsSelector } from 'state/booking/selectors/rowsSelector';
import Form from './Form';
import { formatMinutes } from 'utils/booking';

type GapSuggestProps = {
  startDate: string;
  endDate: string;
  onOkClick?: () => void;
};

export const gridOptions = {
  autoSizeStrategy: {
    type: 'fitGridWidth',
    defaultMinWidth: 50,
  },
  rowSelection: 'multiple',
  suppressRowClickSelection: true,
};

const GapSuggest = ({ startDate, endDate, onOkClick = () => null }: GapSuggestProps) => {
  const bookingDict = useRecoilValue(bookingState);
  const { rows: bookings } = useRecoilValue(rowsSelector);
  const [rows, setRows] = useState(null);
  const [selectedVenueIds, setSelectedVenueIds] = useState([]);
  const tableRef = useRef(null);
  const filteredRows = useMemo(() => {
    const filteredRows = [];
    for (const row of rows || []) {
      if (!selectedVenueIds.includes(row.VenueId)) {
        filteredRows.push({ ...row, TravelTime: formatMinutes(row.MinsFromStart) });
      }
    }
    return filteredRows.sort((a, b) => a.MinsFromStart - b.MinsFromStart);
  }, [selectedVenueIds, rows]);

  const canGapSuggest = useMemo(
    () => hasContinuosGap(bookingDict, startDate, endDate),
    [startDate, endDate, bookingDict],
  );

  const [prevVenueId, nextVenueId] = useMemo(() => {
    const { previousBooking, nextBooking } = findPreviosAndNextBookings(bookings, startDate, endDate);
    return [previousBooking?.venueId, nextBooking?.venueId];
  }, [bookings, startDate, endDate]);

  const getSuggestions = async (
    data: Partial<GapSuggestionUnbalancedProps>,
    onSuccess: (res: any) => void,
    onError: (err: any) => void,
  ) => {
    try {
      const response = await axios.post<GapSuggestionReponse>('/api/venue/read/distance', {
        ...data,
        StartVenue: prevVenueId,
        EndVenue: nextVenueId,
      });
      if (response.status >= 200 && response.status < 400) {
        setSelectedVenueIds([]);
        setRows(response.data?.VenueInfo);
        onSuccess(response.data);
      }
    } catch (error) {
      onError(error);
      setRows([]);
    }
  };

  const exportTableData = () => {
    tableRef.current?.getApi?.()?.exportDataAsExcel?.();
  };

  const onRowSelected = (e: any) => {
    setSelectedVenueIds((prev) => [...prev, e.data.VenueId]);
  };

  if (!canGapSuggest) {
    return (
      <p className="text-primary font-medium my-1 mb-10 w-[370px]">
        Selected Date Range contains confirmed bookings.
        <br /> To get suggestions, please select range without bookings
      </p>
    );
  }

  return (
    <div className="text-primary-input-text w-[700px] flex-col">
      <div className="flex flex-col">
        <Form onSave={getSuggestions} />
      </div>
      {rows !== null && (
        <div className="block">
          <div className="text-md my-2">Check the box of venues you wish to remove from this list.</div>
          <div className="w-full overflow-hidden flex flex-col" style={{ maxHeight: 'calc(100vh - 400px)' }}>
            <Table
              onRowSelected={onRowSelected}
              ref={tableRef}
              columnDefs={gapSuggestColumnDefs}
              rowData={filteredRows?.slice(0, 30)}
              styleProps={styleProps}
              gridOptions={gridOptions}
            />
          </div>
        </div>
      )}
      {rows?.length && (
        <div className="flex gap-2 justify-end items-center mt-3">
          <Button
            onClick={exportTableData}
            className="float-right px-4 w-33 font-normal"
            variant="primary"
            text="Export"
            iconProps={{ className: 'h-4 w-3' }}
            sufixIconName={'excel'}
          />
          <Button
            onClick={onOkClick}
            className="float-right px-4 font-normal w-33 text-center"
            variant="primary"
            text="OK"
          />
        </div>
      )}
    </div>
  );
};

export default GapSuggest;
