import PopupModal from 'components/core-ui-lib/PopupModal';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { BarredVenue } from 'pages/api/productions/venue/barred';
import { barringIssueColumnDefs, styleProps } from 'components/bookings/table/tableConfig';
import Table from 'components/core-ui-lib/Table';
import Button from 'components/core-ui-lib/Button';
import { Spinner } from 'components/global/Spinner';
import Label from 'components/core-ui-lib/Label';

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
  const [loading, setLoading] = useState<boolean>(false);
  const tableRef = useRef(null);
  useEffect(() => {
    fetchBarredVenues();
  }, []);
  const fetchBarredVenues = () => {
    axios
      .post('/api/productions/venue/barred', {
        productionId,
        venueId,
        seats: 400,
        barDistance: 25,
        includeExcluded: false,
        startDate,
        endDate,
      })
      .then((response) => {
        setBarredVenues(response?.data);
      })
      .catch((error) => {
        console.log('Error fetching Barred Venues', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const exportTableData = () => {
    tableRef.current?.getApi?.()?.exportDataAsExcel?.();
  };
  const gridOptions = {
    autoSizeStrategy: {
      type: 'fitGridWidth',
      defaultMinWidth: 50,
    },
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
      <div className="flex flex-col">
        {(barredVenues.length && (
          <span className="py-4 text-responsive-sm text-primary-input-text">
            A Barring Check has found potential issues
          </span>
        )) ||
          ''}
        <div className="w-[634px] flex flex-col overflow-hidden" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {(barredVenues.length && (
            <Table
              ref={tableRef}
              columnDefs={barringIssueColumnDefs}
              rowData={barredVenues}
              styleProps={styleProps}
              gridOptions={gridOptions}
            />
          )) ||
            ''}
          <div className="pt-3 w-full flex items-center justify-end">
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
        </div>
      </div>
    </PopupModal>
  );
};

export default BarringCheck;
