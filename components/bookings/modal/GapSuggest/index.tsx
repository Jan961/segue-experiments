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

type GapSuggestProps = {
  startDate: string;
  endDate: string;
  onOkClick?: () => void;
};

const gridOptions = {
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
  // const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState(null);
  const [selectedVenueIds, setSelectedVenueIds] = useState([]);
  const tableRef = useRef(null);
  const filteredRows = useMemo(
    () => rows?.filter((row) => !selectedVenueIds.includes(row.VenueId)),
    [selectedVenueIds, rows],
  );
  const canGapSuggest = useMemo(
    () => hasContinuosGap(bookingDict, startDate, endDate),
    [startDate, endDate, bookingDict],
  );
  const [prevVenueId, nextVenueId] = useMemo(() => {
    const { previousBooking, nextBooking } = findPreviosAndNextBookings(bookings, startDate, endDate);
    return [previousBooking?.venueId, nextBooking?.venueId];
  }, [bookings, startDate, endDate]);
  const getSuggestions = async (data: Partial<GapSuggestionUnbalancedProps>) => {
    // setLoading(true);
    try {
      const response = await axios.post<GapSuggestionReponse>('/api/venue/read/distance', {
        ...data,
        StartVenue: prevVenueId,
        EndVenue: nextVenueId,
      });
      if (response.status >= 200 && response.status < 400) {
        setRows(response.data?.VenueInfo);
      }
    } catch (error) {
      setRows([]);
    }
    // setLoading(false);
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
    <div className="text-primary-input-text w-[700px]">
      <Form onSave={getSuggestions} />
      {rows !== null && (
        <div className="w-full h-60 flex flex-col pt-4">
          <Table
            onRowSelected={onRowSelected}
            ref={tableRef}
            columnDefs={gapSuggestColumnDefs}
            rowData={filteredRows?.slice(0, 30)}
            styleProps={styleProps}
            gridOptions={gridOptions}
          />
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
