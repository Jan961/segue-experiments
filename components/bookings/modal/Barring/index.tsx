import { useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { BarredVenue } from 'pages/api/productions/venue/barringCheck';
import Spinner from 'components/core-ui-lib/Spinner';
import PopupModal from 'components/core-ui-lib/PopupModal';
import Form from './Form';
import Button from 'components/core-ui-lib/Button';
import Table from 'components/core-ui-lib/Table';
import { formatMinutes } from 'utils/booking';
import { gridOptions } from '../GapSuggest';
import { barredVenueColumnDefs, styleProps } from 'components/bookings/table/tableConfig';
import Label from 'components/core-ui-lib/Label';
import { useRecoilValue } from 'recoil';
import { venueState } from 'state/booking/venueState';
import { dateToSimple } from 'services/dateService';
import { exportToExcel } from 'utils/export';
import { ProductionDTO, VenueMinimalDTO } from 'interfaces';
import { productionJumpState } from 'state/booking/productionJumpState';

type BarringProps = {
  visible: boolean;
  onClose: () => void;
};

const barringGridOptions = {
  ...gridOptions,
  rowClassRules: {
    '!bg-primary-orange !bg-opacity-25': (params) => params.data.hasBarringConflict,
  },

  onRowDataUpdated: (params) => {
    params.api.forEachNode((rowNode) => {
      rowNode.id = rowNode.data.name;
    });
  },
  getRowId: (data) => {
    return data.data.name;
  },
  getRowNodeId: (data) => {
    return data.id;
  },
};

export default function Barring({ visible, onClose }: BarringProps) {
  const [rows, setRows] = useState<BarredVenue[] | null>(null);
  const [loading, setIsLoading] = useState<boolean>(false);
  const [selectedVenueIds, setSelectedVenueIds] = useState([]);
  const [selectedVenueName, setSelectedVenueName] = useState<string>('');
  const [venueInfo, setVenuInfo] = useState<VenueMinimalDTO>();
  const [productionInfo, setProductionInfo] = useState<Partial<ProductionDTO>>();
  const venueDict = useRecoilValue(venueState);
  const productionDict = useRecoilValue(productionJumpState);
  const tableRef = useRef(null);
  const filteredRows = useMemo(() => {
    const filteredRows = [];
    for (const row of rows || []) {
      if (!selectedVenueIds.includes(row.id)) {
        filteredRows.push({
          ...row,
          formattedDate: dateToSimple(row.date),
          travelTime: formatMinutes(row.timeMins),
        });
      }
    }
    return filteredRows.sort((a, b) => a.MinsFromStart - b.MinsFromStart);
  }, [rows, selectedVenueIds, selectedVenueName]);
  const fetchBarredVenues = async (formData) => {
    const { productionId, venueId, includeExcluded, seats, barDistance, fromDate, toDate } = formData;
    setIsLoading(true);
    const distance = parseInt(barDistance || 0, 10);
    const minSeats = parseInt(seats || 0, 10);
    axios
      .post('/api/productions/venue/barringCheck', {
        productionId: parseInt(productionId, 10),
        venueId: parseInt(venueId, 10),
        ...(minSeats && { seats: minSeats }),
        ...(distance !== 0 && { barDistance: distance }),
        ...(fromDate && { startDate: fromDate }),
        ...(toDate && { endDate: toDate }),
        includeExcluded,
      })
      .then((response) => {
        setRows(response?.data);
        setSelectedVenueName(venueDict?.[venueId]?.Name);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.log('Error fetching Barred Venues', error);
      });
  };
  const exportTableData = () => {
    const fileName = `Barring Check ${productionInfo?.ShowCode} ${venueInfo.Code} ${venueInfo.Name} ${venueInfo.Town}`;
    exportToExcel(tableRef, { fileName });
  };

  const onSubmit = (formData) => {
    fetchBarredVenues(formData);
    const { venueId } = formData;
    setVenuInfo(venueDict?.[venueId]);
    console.log(productionDict.selected);
    const production = productionDict.productions.find((prod) => prod.Id === productionDict.selected);
    setProductionInfo(production);
  };

  const onRowSelected = (e: any) => {
    setSelectedVenueIds((prev) => [...prev, e.data.id]);
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
        <div className="flex flex-col">
          <div className="mt-6 flex-col">
            <Form onSubmit={onSubmit} />
          </div>
          {Array.isArray(rows) && rows.length === 0 && (
            <Label className="text-md my-2" text="A Barring Check has found no issuess." />
          )}
          {(rows !== null && rows?.length > 0 && (
            <div className="block">
              <Label className="text-md my-2" text="Check the box of venues you wish to remove from this list." />
              <div
                className="w-full overflow-hidden flex flex-col z-[500] min-h-40"
                style={{ maxHeight: 'calc(100vh - 450px)', minHeight: '110px' }}
              >
                <Table
                  testId="barring-table"
                  onRowSelected={onRowSelected}
                  ref={tableRef}
                  columnDefs={barredVenueColumnDefs}
                  rowData={filteredRows?.slice(0, 30)}
                  styleProps={styleProps}
                  gridOptions={barringGridOptions}
                />
              </div>
            </div>
          )) ||
            ''}
          {(rows?.length && (
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
                onClick={onClose}
                className="float-right px-4 font-normal w-33 text-center"
                variant="primary"
                text="OK"
              />
            </div>
          )) ||
            ''}
        </div>
      </PopupModal>
    </>
  );
}
