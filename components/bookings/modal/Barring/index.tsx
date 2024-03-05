import { useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { BarredVenue } from 'pages/api/productions/venue/barred';
import { Spinner } from 'components/global/Spinner';
import PopupModal from 'components/core-ui-lib/PopupModal';

import Form from './Form';
import Button from 'components/core-ui-lib/Button';
import Table from 'components/core-ui-lib/Table';
import { formatMinutes } from 'utils/booking';
import { gridOptions } from '../GapSuggest';
import { barredVenueColumnDefs, styleProps } from 'components/bookings/table/tableConfig';
import moment from 'moment';

type BarringProps = {
  visible: boolean;
  onClose: () => void;
};

export default function Barring({ visible, onClose }: BarringProps) {
  const [rows, setRows] = useState<BarredVenue[] | null>(null);
  const [loading, setIsLoading] = useState<boolean>(false);
  const [selectedVenueIds, setSelectedVenueIds] = useState([]);
  const tableRef = useRef(null);
  const filteredRows = useMemo(() => {
    const filteredRows = [];
    for (const row of rows || []) {
      if (!selectedVenueIds.includes(row.Id)) {
        filteredRows.push({
          ...row,
          info: `Venue is ${row.Mileage} from ${row.Name}`,
          FormattedDate: moment(row.Date).format('DD/MM/YY'),
          TravelTime: formatMinutes(row.TimeMins),
        });
      }
    }
    return filteredRows.sort((a, b) => a.MinsFromStart - b.MinsFromStart);
  }, [selectedVenueIds, rows]);
  const fetchBarredVenues = async (formData) => {
    const { productionId, venueId, includeExcluded } = formData;
    setIsLoading(true);
    axios
      .post('/api/productions/venue/barred', {
        productionId: parseInt(productionId),
        venueId: parseInt(venueId),
        excludeLondon: includeExcluded,
      })
      .then((response) => {
        setRows(response?.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.log('Error fetching Barred Venues', error);
      });
  };
  const exportTableData = () => {
    tableRef.current?.getApi?.()?.exportDataAsExcel?.();
  };

  const onRowSelected = (e: any) => {
    setSelectedVenueIds((prev) => [...prev, e.data.Id]);
  };
  return (
    <>
      <PopupModal
        titleClass="text-xl text-primary-navy text-bold"
        show={visible}
        onClose={onClose}
        title="Barring Check"
        panelClass="w-[625px]"
      >
        {loading && (
          <div className="w-full h-full absolute left-0 top-0 bg-white flex items-center opacity-95 z-[60]">
            <Spinner className="w-full" size="lg" />
          </div>
        )}
        <div className="flex-col">
          <div className="mt-6 mb-4">
            <Form onSubmit={fetchBarredVenues} />
          </div>
          {rows !== null && (
            <div className="block">
              <div className="text-md my-2">Check the box of venues you wish to remove from this list.</div>
              <div className="w-full overflow-hidden flex flex-col" style={{ maxHeight: 'calc(100vh - 400px)' }}>
                <Table
                  onRowSelected={onRowSelected}
                  ref={tableRef}
                  columnDefs={barredVenueColumnDefs}
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
                onClick={onClose}
                className="float-right px-4 font-normal w-33 text-center"
                variant="primary"
                text="OK"
              />
            </div>
          )}
        </div>
      </PopupModal>
    </>
  );
}
