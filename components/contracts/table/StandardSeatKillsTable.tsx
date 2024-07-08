import Table from 'components/core-ui-lib/Table';
import { contractsStyleProps, standardSeatKillsColumnDefs } from 'components/contracts/tableConfig';
import { useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import { contractsFilterState } from 'state/contracts/contractsFilterState';
import { formatRowsForMultipeBookingsAtSameVenue, formatRowsForPencilledBookings } from '../../bookings/utils';
import { StandardSeatRowType } from 'interfaces';
// import { RowDoubleClickedEvent } from 'ag-grid-community';

interface ContractsTableProps {
  rowData?: StandardSeatRowType[];
}

export default function StandardSeatKillsTable({ rowData }: ContractsTableProps) {
  const tableRef = useRef(null);
  const [filter, setFilter] = useRecoilState(contractsFilterState);
  const [rows, setRows] = useState([]);
  const gridOptions = {
    getRowStyle: (params) => {
      return params.data.status === 'U' ? { fontStyle: 'italic' } : '';
    },
  };

  useEffect(() => {
    if (tableRef && tableRef.current && filter?.scrollToDate) {
      const rowIndex = rowData.findIndex(({ date }) => date === filter.scrollToDate);
      if (rowIndex !== -1) {
        tableRef.current?.getApi().ensureIndexVisible(rowIndex, 'middle');
        setFilter({ ...filter, scrollToDate: '' });
      }
    }
  }, [filter, setFilter, rowData]);

  useEffect(() => {
    if (rowData) {
      let formattedRows = formatRowsForPencilledBookings(rowData);
      formattedRows = formatRowsForMultipeBookingsAtSameVenue(formattedRows);

      setRows(formattedRows);
    }
  }, [rowData]);

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
          columnDefs={standardSeatKillsColumnDefs}
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
