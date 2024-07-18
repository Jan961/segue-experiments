import Table from 'components/core-ui-lib/Table';
import { contractsStyleProps, standardSeatKillsColumnDefs } from 'components/contracts/tableConfig';
import { useEffect, useRef, useState } from 'react';
import { formatRowsForMultipeBookingsAtSameVenue, formatRowsForPencilledBookings } from '../../bookings/utils';
import { StandardSeatRowType } from 'interfaces';
interface ContractsTableProps {
  rowData?: StandardSeatRowType[];
  tableData?: any;
}

export default function StandardSeatKillsTable({ rowData, tableData }: ContractsTableProps) {
  const tableRef = useRef(null);
  const [rows, setRows] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const [holdValue, setHoldValue] = useState({});

  useEffect(() => {
    if (Object.keys(holdValue).length === 0) {
      const holdValueData = {};
      rows.forEach((value) => {
        holdValueData[value.HoldTypeName] = value;
      });
      setHoldValue({ ...holdValueData });
    }
  }, [holdValue]);

  const gridOptions = {
    getRowStyle: (params) => {
      return params.data.status === 'U' ? { fontStyle: 'italic' } : '';
    },
  };

  const handleValueData = (value, first, second, third) => {
    const tableValue = JSON.parse(JSON.stringify(holdValue));
    tableValue[second][third] = value.target.value;
    setHoldValue(tableValue);
    tableData(tableValue);
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
        />
      </div>
    </>
  );
}
