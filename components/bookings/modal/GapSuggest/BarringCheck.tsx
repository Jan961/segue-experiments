import PopupModal from 'components/core-ui-lib/PopupModal';
import { useEffect, useMemo, useRef, useState } from 'react';
import { BarredVenue } from 'pages/api/productions/venue/barred';
import { barredVenueColumnDefs, styleProps } from 'components/bookings/table/tableConfig';
import Table from 'components/core-ui-lib/Table';
import Button from 'components/core-ui-lib/Button';
import { Spinner } from 'components/global/Spinner';
import Label from 'components/core-ui-lib/Label';
import useAxios from 'hooks/useAxios';
import { defaultGridOptions } from 'components/core-ui-lib/Table/Table';
import moment from 'moment';

type BarringCheckProps = {
  visible: boolean;
  startDate: string;
  endDate: string;
  venueId: number;
  productionId: number;
  onClose: () => void;
};

const BarringCheck = ({ visible, startDate, endDate, venueId, productionId, onClose }: BarringCheckProps) => {
  const [barredVenues, setBarredVenues] = useState<BarredVenue[]>([]);
  const [selectedVenueIds, setSelectedVenueIds] = useState<number[]>([]);
  const filteredRows = useMemo(() => {
    const filteredRows = [];
    console.log('barredVenues', barredVenues);
    for (const row of barredVenues || []) {
      if (!selectedVenueIds.includes(row.Id)) {
        filteredRows.push({
          ...row,
          FormattedDate: moment(row.Date).format('DD/MM/YY'),
        });
      }
    }
    return filteredRows.sort((a, b) => a.Mileage - b.Mileage);
  }, [selectedVenueIds, barredVenues]);
  const tableRef = useRef(null);
  const { loading, fetchData: api } = useAxios();
  useEffect(() => {
    fetchBarredVenues();
  }, []);
  const fetchBarredVenues = () => {
    api({
      url: '/api/productions/venue/barred',
      method: 'POST',
      data: {
        productionId,
        venueId,
        seats: 400,
        barDistance: 25,
        includeExcluded: false,
        startDate,
        endDate,
      },
    })
      .then((data: any) => {
        if (data.error) {
          return;
        }
        setBarredVenues(data || []);
      })
      .catch((error) => {
        console.log('Error fetching Barred Venues', error);
      });
  };
  const exportTableData = () => {
    tableRef.current?.getApi?.()?.exportDataAsExcel?.();
  };
  const onRowSelected = (e: any) => {
    setSelectedVenueIds((prev) => [...prev, e.data.Id]);
  };
  const gridOptions = {
    ...defaultGridOptions,
    rowSelection: 'multiple',
    suppressRowClickSelection: true,
  };
  return (
    <PopupModal show={visible} titleClass="text-xl text-primary-navy text-bold" title="Barring Check">
      {loading && (
        <div className="w-full h-full absolute left-0 top-0 bg-white flex items-center opacity-95 z-[60]">
          <Spinner className="w-full" size="lg" />
        </div>
      )}
      {barredVenues.length === 0 && (
        <Label
          className="py-4 text-responsive-sm text-primary-input-text"
          text="A Barring check has found no issues"
        ></Label>
      )}
      {(barredVenues.length && (
        <div className="flex flex-col">
          <div className="py-4 text-responsive-sm text-primary-input-text">
            A Barring Check has found potential issues
          </div>
          <div className="pb-4 text-responsive-sm text-primary-input-text">
            Check the box of venues you wish to remove from this list.
          </div>
          <div className="w-[634px] flex flex-col overflow-hidden" style={{ maxHeight: 'calc(100vh - 200px)' }}>
            <Table
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
        {(barredVenues.length && (
          <Button
            onClick={exportTableData}
            className="float-right px-4 w-33 font-normal"
            variant="primary"
            text="Export"
            iconProps={{ className: 'h-4 w-3' }}
            sufixIconName={'excel'}
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
