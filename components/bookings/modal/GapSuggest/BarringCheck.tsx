import PopupModal from 'components/core-ui-lib/PopupModal';
import { useMemo, useRef, useState } from 'react';
import { barredVenueColumnDefs, styleProps } from 'components/bookings/table/tableConfig';
import Table from 'components/core-ui-lib/Table';
import Button from 'components/core-ui-lib/Button';
import { Spinner } from 'components/global/Spinner';
import Label from 'components/core-ui-lib/Label';
import { dateToSimple } from 'services/dateService';
import { useQuery } from '@tanstack/react-query';
import { fetchBarredVenues } from './request';
import { useRecoilValue } from 'recoil';
import { accessBookingsHome } from 'state/account/selectors/permissionSelector';

type BarringCheckProps = {
  visible: boolean;
  startDate: string;
  endDate: string;
  venueId: number;
  productionId: number;
  onClose: () => void;
};

const BarringCheck = ({ visible, startDate, endDate, venueId, productionId, onClose }: BarringCheckProps) => {
  const permissions = useRecoilValue(accessBookingsHome);
  const {
    data: barredVenues = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ['barringCheck' + venueId],
    queryFn: () =>
      fetchBarredVenues({
        productionId,
        venueId,
        seats: 400,
        barDistance: 25,
        includeExcluded: false,
        startDate,
        endDate,
        filterBarredVenues: true,
      }),
  });
  const [selectedVenueIds, setSelectedVenueIds] = useState<number[]>([]);
  const filteredRows = useMemo(() => {
    const filteredRows = [];
    for (const row of barredVenues || []) {
      if (!selectedVenueIds.includes(row.id)) {
        filteredRows.push({
          ...row,
          formattedDate: dateToSimple(row.date),
        });
      }
    }
    return filteredRows.sort((a, b) => a.Mileage - b.Mileage);
  }, [selectedVenueIds, barredVenues]);
  const tableRef = useRef(null);
  const exportTableData = () => {
    tableRef.current?.getApi?.()?.exportDataAsExcel?.();
  };
  const onRowSelected = (e: any) => {
    setSelectedVenueIds((prev) => [...prev, e.data.id]);
  };
  const gridOptions = {
    rowSelection: 'multiple',
    suppressRowClickSelection: true,
  };
  return (
    <PopupModal onClose={onClose} show={visible} titleClass="text-xl text-primary-navy text-bold" title="Barring Check">
      {loading && (
        <div className="w-full h-full min-h-60 min-w-60 absolute left-0 top-0 bg-white flex items-center opacity-95 z-[60]">
          <Spinner className="w-full" size="lg" />
        </div>
      )}
      {barredVenues?.length === 0 && !loading && (
        <Label
          className="py-4 text-responsive-sm text-primary-input-text"
          text={error ? 'Something went wrong.Please try again' : 'A Barring check has found no issues'}
        />
      )}
      {(barredVenues?.length && !loading && (
        <div className="flex flex-col">
          <div className="py-4 text-responsive-sm text-primary-input-text">
            A Barring Check has found potential issues
          </div>
          <div className="pb-4 text-responsive-sm text-primary-input-text">
            Check the box of venues you wish to remove from this list.
          </div>
          <div
            className="w-[634px] flex flex-col min-h-40"
            style={{ maxHeight: 'calc(100vh - 200px)', minHeight: '110px' }}
          >
            <Table
              testId="barring-check-table"
              ref={tableRef}
              onRowSelected={onRowSelected}
              columnDefs={barredVenueColumnDefs}
              rowData={filteredRows}
              styleProps={styleProps}
              gridOptions={gridOptions}
            />
          </div>
        </div>
      )) ||
        ''}
      <div className="pt-3 w-full flex items-center justify-end gap-2">
        {(barredVenues?.length && !loading && (
          <Button
            onClick={exportTableData}
            className="float-right px-4 w-33 font-normal"
            variant="primary"
            text="Export"
            iconProps={{ className: 'h-4 w-3' }}
            sufixIconName="excel"
            disabled={!permissions.includes('EXPORT_BARRING_CHECK')}
          />
        )) ||
          ''}
        <Button
          onClick={onClose}
          className="float-right px-4 font-normal w-33 text-center"
          variant="primary"
          text="OK"
        />
      </div>
    </PopupModal>
  );
};

export default BarringCheck;
