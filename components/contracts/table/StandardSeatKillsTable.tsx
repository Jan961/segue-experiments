import Table from 'components/core-ui-lib/Table';
import { contractsStyleProps, standardSeatKillsColumnDefs } from 'components/contracts/tableConfig';
import { useEffect, useRef, useState } from 'react';
import { formatRowsForMultipeBookingsAtSameVenue, formatRowsForPencilledBookings } from '../../bookings/utils';
import { StandardSeatRowType } from 'interfaces';

interface ContractsTableProps {
  rowData?: StandardSeatRowType[];
}

export default function StandardSeatKillsTable({ rowData }: ContractsTableProps) {
  const tableRef = useRef(null);
  const [rows, setRows] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const [holdValue, setHoldValue] = useState('');

  const gridOptions = {
    getRowStyle: (params) => {
      return params.data.status === 'U' ? { fontStyle: 'italic' } : '';
    },
  };

  const handleValueData = () => {
    console.log('======>????', 1111111);
    setHoldValue('yyyyy');
  };

  useEffect(() => {
    if (rowData) {
      let formattedRows = formatRowsForPencilledBookings(rowData);
      formattedRows = formatRowsForMultipeBookingsAtSameVenue(formattedRows);

      setRows(formattedRows);
    }
  }, [rowData]);

  useEffect(() => {
    setColumnDefs(standardSeatKillsColumnDefs(handleValueData, holdValue));
  }, [holdValue]);
  //   const handleRowDoubleClicked = (e: RowDoubleClickedEvent) => {
  //     setEditContractData({
  //       visible: true,
  //       contract: e.data,
  //     });
  //   };

  //   const handleClose = () => {
  //     setEditContractData({
  //       visible: false,
  //     });
  //   };

  return (
    <>
      <div className="w-full">
        <Table
          columnDefs={columnDefs}
          rowData={rows}
          styleProps={contractsStyleProps}
          gridOptions={gridOptions}
          ref={tableRef}
          tableHeight={780}
          //   onRowDoubleClicked={handleRowDoubleClicked}
        />
      </div>
    </>
  );
}
