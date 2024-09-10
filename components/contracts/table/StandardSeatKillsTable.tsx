import Table from 'components/core-ui-lib/Table';
import { contractsStyleProps, standardSeatKillsColumnDefs } from 'components/contracts/tableConfig';
import { useEffect, useRef, useState } from 'react';
import { formatRowsForMultipeBookingsAtSameVenue, formatRowsForPencilledBookings } from '../../bookings/utils';
import { StandardSeatRowType } from 'interfaces';
import { isNullOrEmpty, formatDecimalValue } from 'utils';

interface SeatKillProps {
  rowData?: StandardSeatRowType[];
  tableData?: any;
  currency?: string;
}

export default function StandardSeatKillsTable({ rowData, tableData, currency }: SeatKillProps) {
  const tableRef = useRef(null);
  const [rows, setRows] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const [holdValue, setHoldValue] = useState({});

  useEffect(() => {
    if (isNullOrEmpty(holdValue)) {
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
    getRowNodeId: (data) => {
      return data.data.type;
    },
    onRowDataUpdated: (params) => {
      params.api.forEachNode((rowNode) => {
        rowNode.id = rowNode.data.type;
      });
    },
  };

  const handleValueData = (value, first, second, third) => {
    const tableValue = JSON.parse(JSON.stringify(holdValue));
    tableValue[second][third] = value.target.value;
    setHoldValue(tableValue);
    tableData(tableValue);
  };

  const handleBlur = (event, first, second, third) => {
    const tableValue = JSON.parse(JSON.stringify(holdValue));
    const value = event.target.value;
    const formattedValue = formatDecimalValue(value);
    tableValue[second][third] = formattedValue;
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
    setColumnDefs(standardSeatKillsColumnDefs(handleValueData, handleBlur, currency, holdValue));
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
