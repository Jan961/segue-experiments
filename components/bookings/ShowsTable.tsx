import { Show } from '@prisma/client';
import Table from 'components/core-ui-lib/Table';
import { bookingShowsTableConfig, styleProps } from './table/tableConfig';
import { useRef, useState } from 'react';

const ShowsTable = ({ rowsData }: { rowsData: Show[] }) => {
  const tableRef = useRef(null);
  const [changesMade, setChangesMade] = useState<boolean>(false);
  const gridOptions = {
    getRowId: (params) => {
      return params.data.date;
    },
  };
  const handleCellClick = () => {
    console.log(changesMade);
  };
  return (
    <Table
      columnDefs={bookingShowsTableConfig}
      ref={tableRef}
      rowData={rowsData}
      styleProps={styleProps}
      onCellClicked={handleCellClick}
      gridOptions={gridOptions}
      onCellValueChange={() => {
        setChangesMade(true);
      }}
    />
  );
};

export default ShowsTable;
