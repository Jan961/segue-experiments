import axios from 'axios';
import { findPreviosAndNextBookings, hasContinuosGap } from 'components/bookings/panel/utils/findClosestBooking';
import { gapSuggestColumnDefs, styleProps } from 'components/bookings/table/tableConfig';
import Button from 'components/core-ui-lib/Button';
import Table from 'components/core-ui-lib/Table';
import { GapSuggestionReponse, GapSuggestionUnbalancedProps } from 'pages/api/venue/read/distance';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { bookingState } from 'state/booking/bookingState';
import { rowsSelector } from 'state/booking/selectors/rowsSelector';
import Form from './Form';
import { formatMinutes } from 'utils/booking';
import BarringCheck from './BarringCheck';
import { isNull } from 'utils';
import { exportToExcel } from 'utils/export';
import { BookingRow } from 'types/BookingTypes';
import { formattedDateWithWeekDay } from 'services/dateService';

type GapSuggestProps = {
  booking: BookingRow;
  startDate: string;
  endDate: string;
  productionId: number;
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

const GapSuggest = ({ startDate, endDate, productionId, onOkClick = () => null, booking }: GapSuggestProps) => {
  const bookingDict = useRecoilValue(bookingState);
  const { rows: bookings } = useRecoilValue(rowsSelector);
  const [rows, setRows] = useState(null);
  const [selectedVenueIds, setSelectedVenueIds] = useState<number[]>([]);
  const [barringCheckContext, setBarringCheckContext] = useState<number | null>(null);
  const [excelFilename, setExcelFilename] = useState<string>('');
  const tableRef = useRef(null);

  useEffect(() => {
    const newDate = `${formattedDateWithWeekDay(booking.dateTime, 'Short').replaceAll('/', '.')}`;
    setExcelFilename(`Venue Gap Suggestion ${booking.production} ${newDate}.xlsx`);
  }, [booking]);

  const filteredRows = useMemo(() => {
    const filteredRows = [];
    for (const row of rows || []) {
      if (!selectedVenueIds.includes(row.VenueId)) {
        filteredRows.push({
          ...row,
          TravelTimeTo: formatMinutes(row.MinsFromStart),
          MilesTo: row.MileageFromStart,
          TravelTimeFrom: formatMinutes(row.MinsFromEnd),
          MilesFrom: row.MileageFromEnd,
        });
      }
    }
    // getExcelFilename();
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

  const onCellClicked = (e: any) => {
    const { column, data } = e;
    if (column.colId === 'barringCheck') {
      setBarringCheckContext(data.VenueId);
    }
  };

  const exportTableData = () => {
    // tableRef.current?.getApi?.()?.exportDataAsExcel?.();
    exportToExcel(tableRef, { fileName: excelFilename });
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
  const gapSuggestTableOptions = {
    ...gridOptions,

    onRowDataUpdated: (params) => {
      params.api.forEachNode((rowNode) => {
        rowNode.id = rowNode.data.Name;
      });
    },
    getRowId: (data) => {
      return data.data.Name;
    },
    getRowNodeId: (data) => {
      return data.id;
    },
  };

  return (
    <div className="text-primary-input-text w-[900px] flex-col">
      <div className="flex flex-col">
        <Form onSave={getSuggestions} />
      </div>
      {rows?.length > 0 ? (
        <div>
          <div className="block">
            <div className="text-md my-2">Check the box of venues you wish to remove from this list.</div>
            <div className="w-full overflow-hidden flex flex-col" style={{ maxHeight: 'calc(100vh - 400px)' }}>
              <Table
                testId="gap-suggest-table"
                onRowSelected={onRowSelected}
                ref={tableRef}
                columnDefs={gapSuggestColumnDefs}
                onCellClicked={onCellClicked}
                rowData={filteredRows?.slice(0, 30)}
                styleProps={styleProps}
                gridOptions={gapSuggestTableOptions}
                headerHeight={80}
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end items-center mt-3">
            <Button
              onClick={exportTableData}
              className="float-right px-4 w-33 font-normal"
              variant="primary"
              text="Export"
              iconProps={{ className: 'h-4 w-3' }}
              sufixIconName="excel"
            />
            <Button
              onClick={onOkClick}
              className="float-right px-4 font-normal w-33 text-center"
              variant="primary"
              text="OK"
            />
          </div>
        </div>
      ) : (
        !isNull(rows) && (
          <div className="absolute left-1/2 bottom-5 -translate-x-1/2 text-primary-red">
            No venues to suggest. Please widen Search Criteria.
          </div>
        )
      )}
      {barringCheckContext && (
        <BarringCheck
          visible={!!barringCheckContext}
          startDate={startDate}
          endDate={endDate}
          venueId={barringCheckContext}
          productionId={productionId}
          onClose={() => setBarringCheckContext(null)}
        />
      )}
    </div>
  );
};

export default GapSuggest;
